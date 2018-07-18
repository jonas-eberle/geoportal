# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os

from django.shortcuts import render
from django.http import Http404, HttpResponse
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from djgeojson.serializers import Serializer as GeoJSONSerializer

from webgis import settings
from .models import Region
from layers.models import Layer

# Create your views here.
class RegionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ('id', 'name', 'description')

class RegionsGeometry(APIView):

    def get(self, request):

        if os.path.isfile(os.path.join(settings.MEDIA_ROOT + 'regions.geojson')) and int(self.get_last_modification_time()) < self.get_file_time():
            geojson = self.file_get_contents(settings.MEDIA_ROOT + 'regions.geojson')
        else:
            # create file/folder if it does not exist
            geojson = GeoJSONSerializer().serialize(Region.objects.all(), geometry_field='geom', properties=('id', 'name'), precision=4)
            f = open(settings.MEDIA_ROOT + 'regions.geojson', 'w')
            f.write(geojson)
            f.close()
        return HttpResponse(geojson)

    def file_get_contents(self, filename):
        with open(filename) as f:
            return f.read()

    def get_file_time(self):
        return os.path.getmtime(os.path.join(settings.MEDIA_ROOT + 'regions.geojson'))

    def get_last_modification_time(self):
       result = Layer.objects.latest('updated_at')
       timestamp_string = format(result.updated_at, u'U')
       #return timestamp_string
       return 0


class RegionsList(APIView):
    # HTTP GET method
    def get(self, request, format=None):
        regions = Region.objects.all()
        serializer = RegionsSerializer(regions, many=True)
        return Response(serializer.data)


class RegionDetail(APIView):
    def get_object(self, pk):
        try:
            return Region.objects.get(pk=pk)
        except Region.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        region = self.get_object(pk)
