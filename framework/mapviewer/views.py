import json
from django.http import Http404
from django.shortcuts import redirect

from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

from .models import MapViewer, BaseLayerInline, LayerBaseInline
from layers import models as layers
from webgis import settings


# MapViewer serializer with only relevant fields (may be adjusted one time)
class MapViewerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapViewer
        fields = ('id', 'title', 'center_lat', 'center_lon', 'center_proj', 'map_proj', 'map_resolutions', 'zoom_min', 'zoom_max', 'zoom_init', 'auth_registration', 'addexternallayer', 'time_slider', 'time_slider_start', 'time_slider_end', 'time_slider_interval', 'time_slider_dates', 'search_url', 'html_info', 'html_footer')
        

# REST view to output mapviewer as HTML or JSON
class MapViewerDetail(APIView):
    renderer_classes = (TemplateHTMLRenderer, JSONRenderer)

    def get_object(self, pk):
        try:
            return MapViewer.objects.get(pk=pk)
        except MapViewer.DoesNotExist:
            raise Http404

    # HTTP GET method
    def get(self, request, pk, format=None):
        mapviewer = self.get_object(pk)
        auth_view = True
        error_msg = None

        # Is user allowed to see this mapviewer?
        if mapviewer.auth_perm == True:
            if not request.user.is_authenticated():
                auth_view = False
                error_msg = 'Please log in to use this viewer!'
            elif request.user not in mapviewer.auth_users.all() and len(set(list(request.user.groups.all())) & set(list(mapviewer.auth_groups.all()))) == 0 and request.user.is_superuser != True:
                auth_view = False
                error_msg = 'You do not have rights to use this viewer!'

        download_perm = True
        if mapviewer.download_perm == True:
            if not request.user.is_authenticated():
                download_perm = False
            elif request.user not in mapviewer.auth_users.all() and len(set(list(request.user.groups.all())) & set(list(mapviewer.auth_groups.all()))) == 0 and request.user.is_superuser != True:
                download_perm = False

        # If not, output is an error
        if auth_view == False:
            mydata = {'id': mapviewer.id, 'title': mapviewer.title, 'error': error_msg}
            return redirect('/login/?next='+request.get_full_path())
            return Response(mydata, template_name="registration/login.html")

        # If yes, data from Mapviewer object is being serialized for JSON output
        serializer = MapViewerSerializer(mapviewer)

        # Should a time slider be shown on the mapviewer? If yes, generate time slider dates for a given start date, end date and interval
        if serializer.data['time_slider'] is True and (serializer.data['time_slider_dates'] is None or serializer.data['time_slider_dates'] == ''):
            from dateutil import parser
            slider_start = parser.parse(serializer.data['time_slider_start'])
            if serializer.data['time_slider_end'] == None:
                from datetime import datetime
                slider_end = datetime.now()
            else:
                slider_end = parser.parse(serializer.data['time_slider_end'])

            slider_interval = serializer.data['time_slider_interval']

            from dateutil import rrule
            timerange = rrule.MONTHLY
            if slider_interval == 'month':
                timerange = rrule.MONTHLY
            elif slider_interval == 'day':
                timerange = rrule.DAILY
            elif slider_interval == 'year':
                timerange = rrule.YEARLY

            dates = []
            for dt in rrule.rrule(timerange, dtstart=slider_start, until=slider_end):
                dates.append(dt.strftime('%Y-%m-%d'))
        # end of time slider: variable dates will be added at the end

        # In addition to the mapviewer data we will integrate layergroups (and their layers) and baselayers in the response, see the following loops

        # Loop through layergroups referenced in the mapviewer object
        jsonLayerGroups = []
        layergroups = layers.LayergroupInline.objects.filter(mapviewer_id=pk).order_by('order')
        layerauth = False
        for group in layergroups:
            layergroup = {'groupid': group.layergroup.id,'title':str(group), 'layers':[]}

            # Add layers to layergroup
            layerObjects = layers.LayerInline.objects.filter(layergroup_id=group.layergroup.id).order_by('order')
            for inline in layerObjects:

                #check permission
                if inline.layer.auth_perm == True:
                    if not request.user.is_authenticated():
                        layerauth = True
                        continue
                    elif request.user not in inline.layer.auth_users.all() and len(set(list(request.user.groups.all())) & set(list(inline.layer.auth_groups.all()))) == 0 and request.user.is_superuser != True:
                        continue

                if inline.title != '':
                    inline.layer.title = inline.title
                layer = layers.LayerSerializer(inline.layer)
                layerdata = layer.data
                if layerdata['legend_colors']:
                    layerdata['legend_colors'] = json.loads(layerdata['legend_colors'])
                if download_perm == False:
                    layerdata['downloadable'] = False
                layergroup['layers'].append(layerdata)
            
            jsonLayerGroups.append(layergroup)

        # Loop through baselayers referenced in the mapviewer object
        jsonBaseLayers = []
        
        #for inlineBase in BaseLayerInline.objects.filter(mapviewer_id=pk).order_by('order'):
        for inlineBase in LayerBaseInline.objects.filter(mapviewer_id=pk).order_by('order'):
            baselayer = inlineBase.baselayer
            if inlineBase.title != '':
                inlineBase.baselayer.title = inlineBase.title
            layer = layers.LayerSerializer(inlineBase.baselayer)
            layerdata = layer.data
            if baselayer.wmts_projection != None:
                layerdata['projection'] = 'EPSG:'+str(baselayer.wmts_projection)
            jsonBaseLayers.append(layerdata)

        # extent data from mapviewer serializer with layergroup and baselayer information
        mydata = serializer.data
        mydata['layergroups'] = jsonLayerGroups
        mydata['layerauth'] = layerauth
        mydata['baselayers'] = jsonBaseLayers
        mydata['error'] = ''
        mydata['subdir'] = settings.SUBDIR

        # add date from time slider if applicable
        if serializer.data['time_slider'] is True and (serializer.data['time_slider_dates'] is None or serializer.data['time_slider_dates'] == ''):
            mydata['time_slider_dates'] = ','.join(dates)

        # return object as JSON or HTML with viewer.html template (automatically related to the request)
        return Response(mydata, template_name=mapviewer.template_file)

