import json
from django.shortcuts import render
from django.http import Http404, HttpResponse

from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response


class ValidationLayerList(APIView): 
    # HTTP GET method
    def get(self, request, format=None):
        validation_layers = []
        
        from .models import ValidationLayer
        from layers.models import LayerSerializer
        from swos.models import ExternalLayer
        
        layers = ValidationLayer.objects.all().order_by('title')
        externallayers = ExternalLayer.objects.all()
        externallayers = {l.id: l for l in externallayers}
        for layer in layers:
            #check permission
            if not request.user.is_authenticated():
                continue
            elif request.user not in layer.auth_users.all() and len(set(list(request.user.groups.all())) & set(list(layer.auth_groups.all()))) == 0 and request.user.is_superuser != True:
                continue
        
            layerdata = LayerSerializer(layer).data
            if layer.legend:
                layerdata['legend'] = layer.legend
            layerdata['background_layer'] = LayerSerializer(layer.layer_basemap).data
            layerdata['validation_auxlayer'] = LayerSerializer(layer.layer_auxiliary, many=True).data
            for l in layerdata['validation_auxlayer']:
                if l['id'] in externallayers:
                    datasource = externallayers[l['id']].datasource.shortname
                    l['title'] = '[%s] %s' % (datasource, l['title'].replace(datasource, ''))
                    l['alternate_title'] = l['title']
                if l['legend_colors']:
                    l['legend_colors'] = json.loads(l['legend_colors'])
                if l['ogc_times'] != None and l['ogc_times'] != '':
                     l['ogc_times'] = l['ogc_times'].split(',')
                     l['selectedDate'] = l['ogc_times'][-1] 
            validation_layers.append(layerdata)
        
        return Response(validation_layers)


class ValidationUpdateSegment(APIView):
    # HTTP GET method
    def get(self, request, format=None):
        feature_id = str(request.query_params.get('feature_id', None))    #SWOS_SEGM_ES_Fuente-de-Piedra_350_2015.41674
        if feature_id == None:
            return HttpResponse("FAILURE: No feature id given")
            
        layer = str(request.query_params.get('layer', None))  #Spain_Fuente-de-Piedra:SWOS_SEGM_ES_Fuente-de-Piedra_350_2015
        if layer == None:
            return HttpResponse("FAILURE: No layer name given")
        val_code = int(request.query_params.get('val_code', -1))
        val_id = int(request.query_params.get('val_id', -1))
        
        if feature_id != '':
            import requests
            data = """<wfs:Transaction service="WFS" version="1.0.0"
  xmlns:topp="http://www.openplans.org/topp"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:wfs="http://www.opengis.net/wfs">
  <wfs:Update typeName="{}">
    <wfs:Property>
      <wfs:Name>ValCode</wfs:Name>
      <wfs:Value>{}</wfs:Value>
    </wfs:Property>
    <ogc:Filter>
      <ogc:FeatureId fid="{}"/>
    </ogc:Filter>
  </wfs:Update>
</wfs:Transaction>"""
            data = data.format(layer, val_code, feature_id)
            
            response = requests.post('http://earthcare.ads.uni-jena.de:8090/geoserver/wfs', data=data, auth=('validation', 'valtool'))
            if 'wfs:SUCCESS' in response.text:
                if val_id > 0:
                    val_id = val_id+1
                    data = """<wfs:GetFeature service="WFS" version="1.1.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
  outputFormat="application/json">
  <wfs:Query typeName="{}">
<ogc:Filter>
<ogc:PropertyIsEqualTo>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:Literal>{}</ogc:Literal>
</ogc:PropertyIsEqualTo>
</ogc:Filter>
  </wfs:Query>
</wfs:GetFeature>"""
                    data = data.format(layer, val_id)
                    data = """<wfs:GetFeature service="WFS" version="1.1.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
  outputFormat="application/json" maxFeatures="1" startIndex="0">
  <wfs:Query typeName="{}">
<ogc:SortBy>
<ogc:SortProperty>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:SortOrder>ASC</ogc:SortOrder>
</ogc:SortProperty>
</ogc:SortBy>
<ogc:Filter>
  <ogc:And>
<ogc:PropertyIsLessThan>
<ogc:PropertyName>ValCode</ogc:PropertyName>
<ogc:Literal>1</ogc:Literal>
</ogc:PropertyIsLessThan>
    <ogc:PropertyIsGreaterThan>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:Literal>0</ogc:Literal>
</ogc:PropertyIsGreaterThan>
    </ogc:And>
</ogc:Filter>
  </wfs:Query>
</wfs:GetFeature>"""
                    data = data.format(layer)
                    response = requests.post('http://earthcare.ads.uni-jena.de:8090/geoserver/wfs', data=data, auth=('validation', 'valtool'))
                    return HttpResponse(response.text)
                return HttpResponse('SUCCESS')
            else:
                return HttpResponse(response.text, status=500)
        

class ValidationListSegments(APIView):
    # provide HTTP GET method
    def get(self, request):
        import requests
        type = request.query_params.get('type', None)
        layer = request.query_params.get('layer', None)
        startIndex = int(request.query_params.get('start', 0))
        maxFeatures = int(request.query_params.get('max', 5))
        
        if type == 'todo':
            query = """<wfs:GetFeature service="WFS" version="1.1.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
  outputFormat="application/json" maxFeatures="{}" startIndex="{}">
  <wfs:Query typeName="{}">
<ogc:SortBy>
<ogc:SortProperty>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:SortOrder>ASC</ogc:SortOrder>
</ogc:SortProperty>
</ogc:SortBy>
<ogc:Filter>
  <ogc:And>
<ogc:PropertyIsLessThan>
<ogc:PropertyName>ValCode</ogc:PropertyName>
<ogc:Literal>1</ogc:Literal>
</ogc:PropertyIsLessThan>
    <ogc:PropertyIsGreaterThan>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:Literal>0</ogc:Literal>
</ogc:PropertyIsGreaterThan>
    </ogc:And>
</ogc:Filter>
  </wfs:Query>
</wfs:GetFeature>"""
            query = query.format(maxFeatures, startIndex, layer)
        elif type == 'done':
            query = """<wfs:GetFeature service="WFS" version="1.1.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
  outputFormat="application/json" maxFeatures="{}" startIndex="{}">
  <wfs:Query typeName="{}">
<ogc:SortBy>
<ogc:SortProperty>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:SortOrder>ASC</ogc:SortOrder>
</ogc:SortProperty>
</ogc:SortBy>
<ogc:Filter>
<ogc:PropertyIsGreaterThan>
<ogc:PropertyName>ValCode</ogc:PropertyName>
<ogc:Literal>0</ogc:Literal>
</ogc:PropertyIsGreaterThan>
</ogc:Filter>
  </wfs:Query>
</wfs:GetFeature>"""
            query = query.format(maxFeatures, startIndex, layer)
        else:
            query = """<wfs:GetFeature service="WFS" version="1.1.0"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
  outputFormat="application/json" maxFeatures="{}" startIndex="{}">
  <wfs:Query typeName="{}">
<ogc:SortBy>
<ogc:SortProperty>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:SortOrder>ASC</ogc:SortOrder>
</ogc:SortProperty>
</ogc:SortBy>
<ogc:Filter>
  <ogc:Or>
<ogc:PropertyIsGreaterThan>
<ogc:PropertyName>ValCode</ogc:PropertyName>
<ogc:Literal>0</ogc:Literal>
</ogc:PropertyIsGreaterThan>
    <ogc:PropertyIsGreaterThan>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:Literal>0</ogc:Literal>
</ogc:PropertyIsGreaterThan>
    </ogc:Or>
</ogc:Filter>
  </wfs:Query>
</wfs:GetFeature>"""
            query = query.format(maxFeatures, startIndex, layer)
        response = requests.post('http://earthcare.ads.uni-jena.de:8090/geoserver/wfs', data=query, auth=('validation', 'valtool'))
        return HttpResponse(response.text, content_type="text/json")


class ValidationSegmentsExport(APIView):
    # provide HTTP GET method
    def get(self, request):
        import requests
        layer = request.query_params.get('layer', None)
        if layer == None:
            return HttpResponse('FAILURE', status_code=500)
        url = "http://artemis.geogr.uni-jena.de/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName={}&outputFormat=SHAPE-ZIP"
        url = url.format(layer)
        
        import requests
        data = requests.get(url, auth=('validation', 'valtool'))
        content_type = data.headers['CONTENT-TYPE']
                
        response = HttpResponse(str(data.content), content_type=content_type)
        response['Content-Disposition'] = data.headers['content-disposition']
        return response

