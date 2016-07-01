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
        fields = ('id', 'name', 'description', 'country', 'geo_scale', 'geom')


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
        products = Product.objects.filter(wetlands__id=wetland.id)
        indicators = Indicator.objects.filter(wetlands__id=wetland.id)
        layers = WetlandLayer.objects.filter(wetland_id=wetland.id)
        
        temp_products = dict()
        temp_indicators = dict()
        
        for layer in layers:
            if layer.product:
                if layer.product.id not in temp_products:
                    temp_products[layer.product.id] = [LayerSerializer(layer).data]
                else:
                    temp_products[layer.product.id].append(LayerSerializer(layer).data)
            if layer.indicator:
                if layer.indicator.id not in temp_indicators:
                    temp_indicators[layer.indicator.id] = [LayerSerializer(layer).data]
                else:
                    temp_indicators[layer.indicator.id].append(LayerSerializer(layer).data)
        
        finalJSON = {'id':wetland.id, 'title':wetland.name, 'products':[], 'indicators':[]}
        for product in products:
            layers = []
            if product.id in temp_products:
                layers = temp_products[product.id]
            finalJSON['products'].append({'id': product.id, 'name': product.name, 'description': product.description, 'layers': layers})
        for indicator in indicators:
            layers = []
            if indicator.id in temp_indicators:
                layers = temp_indicators[indicator.id]
            finalJSON['indicators'].append({'id': indicator.id, 'name': indicator.name})
        
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
        photos = wetland.panoramio()
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
        videos = wetland.youtube()
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