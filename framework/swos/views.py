import json
from django.shortcuts import render
from django.http import Http404



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

        #indicator_values = IndicatorValue.objects.filter(wetland_id=wetland.id)

        # Get description for all registered Indicator
        indicator_description = IndicatorSerializer(Indicator.objects.all(), many=True).data


        ind_descr = dict() # Indicator description: key = indicator_id
        ind_list = dict()  # Indicator values foreach Indicator : key = indicator_id

        # Fill ind_descr and ind_list
        for ind in indicator_description:
            ind_descr[ind["id"]] = ind
            ind_list[ind["id"]] = IndicatorValueSerializer(IndicatorValue.objects.filter(wetland_id=wetland.id, indicator=ind["id"]).order_by('time'), many=True).data;

        # Add total reference value and calculate percent for given values and calculated values
        for ind_id in ind_descr:
            # Add total reference value and percent to given values
            if ind_list[ind_id]:
                for index, val in enumerate(ind_list[ind_id]):
                    if (ind_descr[ind_id]["caluculation_reference_100_percent"] != None):
                        ind_list[ind_id][index]["total"] = ind_list[ind_descr[ind_id]["caluculation_reference_100_percent"]][index]["value"]
                        ind_list[ind_id][index]["percent"] = "%.2f" % ((ind_list[ind_id][index]["value"] * 100) / ind_list[ind_id][index]["total"])
            # Add values for aggregated indicators
            elif ind_descr[ind_id]["calculation"] == True:
                new_values = dict()
                for ind in ind_descr[ind_id]["calculation_input"]:
                    for index, val in enumerate(ind_list[ind]):
                        if not index in new_values:
                            new_values[index] = dict()
                        if "value" in new_values[index]:
                            new_values[index]["value"] += val["value"]
                        else:
                            new_values[index]["value"] = val["value"]
                        new_values[index]["time"] = val["time"]
                        new_values[index]["total"] = ind_list[ind_descr[ind_id]["caluculation_reference_100_percent"]][index]["value"]
                        new_values[index]["percent"] = "%.2f" % ((new_values[index]["value"] * 100) / new_values[index]["total"])
                        ind_descr[ind]["sub_cat"] = "True"

                # Add new values in the same format as existing values
                ind_list[ind_id] = dict()
                for i in new_values:
                    if (ind_list[ind_id]):
                        ind_list[ind_id].append(new_values[i])
                    else:
                        ind_list[ind_id] = [new_values[i]]


        finalJSON['indicator_values'] = ind_list
        finalJSON['indicator_descr'] = ind_descr


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
        return Response(photos);

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
    
    
    
