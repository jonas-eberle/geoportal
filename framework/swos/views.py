import json
from django.shortcuts import render
from django.http import Http404, HttpResponse


from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Wetland

# Create your views here.
class WetlandsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wetland
        fields = ('id', 'name', 'description', 'country', 'geo_scale', 'ecoregion', 'site_type', 'wetland_type', 'products', 'geom')


class WetlandsList(APIView):

    # HTTP GET method
    def get(self, request, format=None):
        wetlands = Wetland.objects.all()
        serializer = WetlandsSerializer(wetlands, many=True)
        return Response(serializer.data)


class WetlandDetail(APIView):
    def get_object(self, pk):
        try:
            return Wetland.objects.get(pk=pk)
        except Wetland.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        wetland = self.get_object(pk)
        
        from .models import Product, Indicator,IndicatorSerializer, IndicatorValue,IndicatorValueSerializer, WetlandLayer, ExternalDatabase, ExternalLayer, Country
        from layers.models import LayerSerializer



        layers = WetlandLayer.objects.filter(wetland_id=wetland.id,publishable=True).order_by('title')
        temp_products_layers = dict()
        temp_indicators_layers = dict()
        temp_external_layers = dict()
        temp_products = dict()
        temp_indicators = dict()


        finalJSON = {'id':wetland.id, 'title':wetland.name, 'image': wetland.image_url, 'image_desc': wetland.image_desc, 'products':[], 'indicators':[], 'externaldb': [], 'externaldb_layer': [], 'indicator_values': [], 'indicator_descr': []}

        # create product and indicator layer
        for layer in layers:
            if layer.product:
                layer_data = LayerSerializer(layer).data
                layer_data['product_name'] = layer.product.name
                layer_data['wetland_id'] = wetland.id
                if layer_data['legend_colors']:
                    layer_data['legend_colors'] = json.loads(layer_data['legend_colors'])
                if layer_data['ogc_times'] != None and layer_data['ogc_times'] != '':
                     layer_data['ogc_times'] = layer_data['ogc_times'].split(',')
                     layer_data['selectedDate'] = layer_data['ogc_times'][-1] 
                if layer.product.id not in temp_products_layers:
                    temp_products[layer.product.id] = layer.product
                    temp_products_layers[layer.product.id] = [layer_data]
                else:
                    temp_products_layers[layer.product.id].append(layer_data)
            if layer.indicator:
                if layer.indicator.id not in temp_indicators_layers:
                    temp_indicators[layer.indicator.id] = layer.indicator
                    temp_indicators_layers[layer.indicator.id] = [LayerSerializer(layer).data]
                else:
                    temp_indicators_layers[layer.indicator.id].append(LayerSerializer(layer).data)

        for product in temp_products:
            product = temp_products[product]
            layers = temp_products_layers[product.id]
            finalJSON['products'].append({'id': product.id, 'name': product.name, 'order': product.order, 'description': product.description, 'layers': layers})
        for indicator in temp_indicators:
            indicator = temp_indicators[indicator]
            layers = temp_indicators_layers[indicator.id]
            finalJSON['indicators'].append({'id': indicator.id, 'name': indicator.name, 'layers': layers})



#get wetland country --> find continent and add to list

        #use first country of country list to find the continent #todo handel country list
        if("-" in wetland.country):
            countries = wetland.country.split('-')
            country_continent = Country.objects.get(name=countries[1])
        else:
            country_continent = Country.objects.get(name=wetland.country)


        extdata = ExternalDatabase.objects.filter(country__name=wetland.country) | ExternalDatabase.objects.filter(continent="Global") | ExternalDatabase.objects.filter(continent=country_continent.continent) | ExternalDatabase.objects.filter(wetland_id=wetland.id)

        extdb_grouped_list = {'local':[], 'national': [], 'continent': [], 'global': []}
        extdb_grouped_name ={'local': wetland.name, 'national': wetland.country, 'continent': country_continent.continent, 'global': "Global"}

        for extdb in extdata:

            country = extdb.country.filter(name=wetland.country)
            if country:
                country_found = True
            else:
                country_found = False

            if extdb.wetland_id == wetland.id:
                extdb_grouped_list['local'].append(extdb)
            elif country_found== True and not extdb.wetland_id:
                extdb_grouped_list['national'].append(extdb)
            elif extdb.continent == country_continent.continent:
                extdb_grouped_list['continent'].append(extdb)
            elif extdb.continent == "Global":
                extdb_grouped_list['global'].append(extdb)

            del(country)


        #add external datasets starting from local and add all linked layer for each dataset
        for index in ['local', 'national', 'continent', 'global']:
            datasets = []
            for extdb in extdb_grouped_list[index]:
                layer_extern = ExternalLayer.objects.filter(datasource_id=extdb.id,publishable=True)
                if layer_extern:
                    for ex_layer in layer_extern:
                        layer_data = LayerSerializer(ex_layer).data
                        if layer_data['legend_colors']:
                            layer_data['legend_colors'] = json.loads(layer_data['legend_colors'])
                        if extdb.id not in temp_external_layers:
                            temp_external_layers[extdb.id] = [layer_data]
                        else:
                            temp_external_layers[extdb.id].append(layer_data)
                    layers = temp_external_layers[extdb.id]
                    datasets.append({'name': extdb.name, 'description': extdb.description,'provided_info': extdb.provided_information,'online_link': extdb.online_link, 'language':extdb.dataset_language,'layers': layers, 'layer_exist': "True"})
                else:
                    datasets.append({'name': extdb.name, 'description': extdb.description,'provided_info': extdb.provided_information,'online_link': extdb.online_link, 'language':extdb.dataset_language, 'layer_exist': "False"})

            if extdb_grouped_list[index]:
                finalJSON['externaldb'].append({'group': extdb_grouped_name[index], 'datasets': datasets })


        # sort the products according to the order attribute
        finalJSON['products'] = sorted(finalJSON['products'], key=lambda x: x['order'], reverse=False)
        finalJSON['indicators'] = sorted(finalJSON['indicators'], key=lambda x: x['order'], reverse=False)
        
        finalJSON['count'] = dict()
        finalJSON['count']['images'] = wetland.count_images
        finalJSON['count']['videos'] = wetland.count_videos
        finalJSON['count']['satdata'] = wetland.count_satdata
        finalJSON['count']['products'] = len(finalJSON['products'])
        finalJSON['count']['products_layers'] = len(temp_products_layers)
        finalJSON['count']['indicators'] = len(finalJSON['indicators'])  # todo add count number of indicator or values?
        finalJSON['count']['indicators_layers'] = len(temp_indicators_layers)
        finalJSON['count']['externaldb'] =len(extdata)


        return Response(finalJSON)


class ValidationLayerList(APIView): 
    # HTTP GET method
    def get(self, request, format=None):
        wetlands = dict()
        
        from .models import WetlandLayer
        from layers.models import LayerSerializer
        layers = WetlandLayer.objects.filter(validation_layer__isnull=False,publishable=True).order_by('title')
        for layer in layers:
            #check permission
            if not request.user.is_authenticated():
                continue
            elif request.user not in layer.auth_users.all() and len(set(list(request.user.groups.all())) & set(list(layer.auth_groups.all()))) == 0 and request.user.is_superuser != True:
                continue
        
            if layer.wetland.id not in wetlands:
                wetlands[layer.wetland.id] = WetlandsSerializer(layer.wetland).data
                wetlands[layer.wetland.id]['validation_layers'] = []
            layerdata = LayerSerializer(layer).data
            layerdata['validation_layer'] = LayerSerializer(layer.validation_layer).data
            layerdata['validation_auxlayer'] = LayerSerializer(layer.validation_auxlayer, many=True).data
            for l in layerdata['validation_auxlayer']:
                if l['legend_colors']:
                    l['legend_colors'] = json.loads(l['legend_colors'])
            wetlands[layer.wetland.id]['validation_layers'].append(layerdata)
        
        data = []
        for key, value in wetlands.iteritems():
            data.append(value)
        
        return Response(data)


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
        if val_code <= 0:
            return HttpResponse("FAILURE: Val code needs to be greather than 0")
        val_id = int(request.query_params.get('val_id', -1))
        
        if feature_id != '' and val_code > 0:
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
  <wfs:Query typeName="Spain_Fuente-de-Piedra:SWOS_SEGM_ES_Fuente-de-Piedra_350_2015">
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
  <wfs:Query typeName="Spain_Fuente-de-Piedra:SWOS_SEGM_ES_Fuente-de-Piedra_350_2015">
<ogc:SortBy>
<ogc:SortProperty>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:SortOrder>ASC</ogc:SortOrder>
</ogc:SortProperty>
</ogc:SortBy>
<ogc:Filter>
<ogc:PropertyIsGreaterThan>
<ogc:PropertyName>ValID</ogc:PropertyName>
<ogc:Literal>0</ogc:Literal>
</ogc:PropertyIsGreaterThan>
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


class Panoramio(APIView):
    def get_object(self, pk):
        try:
            return Wetland.objects.get(pk=pk)
        except Wetland.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        wetland = self.get_object(pk)
        start = int(request.query_params.get('start', 0))
        max = int(request.query_params.get('max', -1))
        photos = wetland.panoramio(start=start, max=max)
        return Response(photos)

class WetlandImages(APIView):

    def get_object(self, wetland_id):
        from .models import WetlandImage

        try:
            return WetlandImage.objects.filter(wetland_id=wetland_id)
        except WetlandImage.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        wetland_images = self.get_object(pk)
        start = int(request.query_params.get('start', 0))
        max = int(request.query_params.get('max', -1))
        finalJSON = {'photos': []}

        for images in wetland_images:
            #detect landscape or portrait format
            if (images.image.width > images.image.height):
                photo_show_url = images.image.url_1300x1000;
            else:
                photo_show_url = images.image.url_1000x1300;

            finalJSON['photos'].append({'photo_title': images.name, 'photo_url_orig': images.image.url, 'photo_url_thumb': images.image.url_52x52, 'photo_show_url': photo_show_url, 'owner_name': images.copyright, 'description': images.description, 'date': images.date})

        images = finalJSON['photos']
        if max > -1 and (start + max) < len(images):
            finalJSON['photos'] = images[start:start + max]
        else:
            finalJSON['photos'] = images[start:]
        return Response(finalJSON);

class YouTube(APIView):
    def get_object(self, pk):
        try:
            return Wetland.objects.get(pk=pk)
        except Wetland.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        wetland = self.get_object(pk)
        start = int(request.query_params.get('start', 0))
        max = int(request.query_params.get('max', -1))
        videos = wetland.youtube(start=start, max=max)
        return Response(videos);

class SatelliteData(APIView):
    def get_object(self, pk):
        try:
            return Wetland.objects.get(pk=pk)
        except Wetland.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        wetland = self.get_object(pk)
        data = wetland.satellitedata()
        return Response(data);

class LayerColors(APIView):
    def hex_to_rgb(self, value):
        value = value.lstrip('#')
        lv = len(value)
        dataTuple = tuple(int(value[i:i + lv // 3], 16) for i in range(0, lv, lv // 3))
        return '-'.join(map(str, dataTuple))
    
    def get_object(self, pk):
        from .models import WetlandLayer
        try:
            return WetlandLayer.objects.get(pk=pk)
        except Wetland.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk):
        layer = self.get_object(pk)
        import json
        data = json.loads(layer.legend_colors)
        return Response(data)
        # old
        #rgbData = dict()
        #for key in data:
        #    rgbData[self.hex_to_rgb(key)] = data[key]
        #return Response(rgbData)
    
    
    
