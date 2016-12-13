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
        fields = ('id', 'name', 'description', 'country', 'geo_scale', 'geom', 'image_url', 'image_desc')


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
        
        from .models import Product, Indicator, WetlandLayer
        from layers.models import LayerSerializer
        layers = WetlandLayer.objects.filter(wetland_id=wetland.id,publishable=True).order_by('title')

        temp_products_layers = dict()
        temp_indicators_layers = dict()
        temp_products = dict()
        temp_indicators = dict()
        
        finalJSON = {'id':wetland.id, 'title':wetland.name, 'image': wetland.image_url, 'image_desc': wetland.image_desc, 'products':[], 'indicators':[]}
        
        for layer in layers:
            if layer.product:
                layer_data = LayerSerializer(layer).data
                layer_data['product_name'] = layer.product.name
                if layer_data['legend_colors']:
                    layer_data['legend_colors'] = json.loads(layer_data['legend_colors'])
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
        
        # sort the products according to the order attribute
        finalJSON['products'] = sorted(finalJSON['products'], key=lambda x: x['order'], reverse=False)
        finalJSON['indicators'] = sorted(finalJSON['indicators'], key=lambda x: x['order'], reverse=False)
        
        finalJSON['count'] = dict()
        finalJSON['count']['images'] = wetland.count_images
        finalJSON['count']['videos'] = wetland.count_videos
        finalJSON['count']['satdata'] = wetland.count_satdata
        finalJSON['count']['products'] = len(finalJSON['products'])
        finalJSON['count']['products_layers'] = len(temp_products_layers)
        finalJSON['count']['indicators'] = len(finalJSON['indicators'])
        finalJSON['count']['indicators_layers'] = len(temp_indicators_layers)
        finalJSON['count']['externaldb'] = 0
        
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
    
    
    
