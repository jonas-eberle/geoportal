# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os

from django.shortcuts import render
from django.http import Http404, HttpResponse
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response

from webgis import settings
from geospatial.models import Region
from .models import PhenoLayer, Product, Pheno, CitizenScienceProject, CitizenScienceData, CitizenScienceProjectSerializer, DWDInSituData, DWDStation, DWDStationSerializer, DWDStationSingleSerializer, dwd_id_to_name
from layers.models import LayerSerializer, MetadataSerializer
from djgeojson.serializers import Serializer as GeoJSONSerializer

# Create your views here.
class RegionDetail(APIView):
    def get_object(self, pk):
        try:
            return Region.objects.get(pk=pk)
        except Region.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        region = self.get_object(pk)
        layers = PhenoLayer.objects.filter(region=region)
        data = dict(phenolayers={}, climatelayers={}, layers=[])
        for layer in layers:
            layer_data = LayerSerializer(layer).data
            if layer_data['ogc_times'] != None and layer_data['ogc_times'] != '':
                layer_data['ogc_times'] = layer_data['ogc_times'].split(',')
                layer_data['selectedDate'] = layer_data['ogc_times'][-1]
            if layer.phenophase:
                if layer.phenophase.name not in data['phenolayers']:
                    data['phenolayers'][layer.phenophase.name] = dict(name=layer.phenophase.name, description=layer.phenophase.description, layers=[])
                data['phenolayers'][layer.phenophase.name]['layers'].append(layer_data)
            elif layer.product:
                if layer.product.name not in data['climatelayers']:
                    data['climatelayers'][layer.product.name] = dict(name=layer.product.name, description=layer.product.description, layers=[])
                data['climatelayers'][layer.product.name]['layers'].append(layer_data)
            else:
                data['layers'].append(layer_data)

        climatelayers = []
        for key, value in data['climatelayers'].iteritems():
            climatelayers.append(value)
        data['climatelayers']= climatelayers

        phenolayers = []
        for key, value in data['phenolayers'].iteritems():
            phenolayers.append(value)
        data['phenolayers'] = phenolayers

        data['citizenscience'] = CitizenScienceProjectSerializer(CitizenScienceProject.objects.all(), many=True).data
        return Response(data)


class RegionCitizenScienceData(APIView):
    def get_region(self, pk):
        try:
            return Region.objects.get(pk=pk)
        except Region.DoesNotExist:
            raise Http404

    def get_project(self, pk):
        try:
            return CitizenScienceProject.objects.get(pk=pk)
        except Region.DoesNotExist:
            raise Http404

    def get(self, request, region_id, project_id):
        region = self.get_region(region_id)
        project = self.get_project(project_id)
        start = int(request.query_params.get('start', 0))
        max = int(request.query_params.get('maxFeatures', 10))

        features = project.get_data(geom=region.geom, start=start, limit=max)
        features = [i.to_json() for i in features]
        data = dict(type="FeatureCollection", totalFeatures=len(features), features=features, crs=dict(type="name", properties=dict(name="urn:ogc:def:crs:EPSG::4326")))
        return Response(data)


class RegionCitizenScienceDataInitial(APIView):
    def get_region(self, pk):
        try:
            return Region.objects.get(pk=pk)
        except Region.DoesNotExist:
            raise Http404

    def get(self, request, region_id):
        region = self.get_region(region_id)
        start = int(request.query_params.get('start', 0))

        result = dict()
        for project in CitizenScienceProject.objects.all():
            features = project.get_data(geom=region.geom, start=start, limit=10)
            features = [i.to_json() for i in features]
            data = dict(type="FeatureCollection", totalFeatures=len(features), features=features, crs=dict(type="name", properties=dict(name="urn:ogc:def:crs:EPSG::4326")))
            result[project.id] = data
        return Response(result)


class DWDStations(APIView):
    def get(self, request, region_id):
        region = Region.objects.get(pk=region_id)
        stations = DWDStation.objects.filter(geom__intersects=region.geom).order_by('Stationsname')
        result = []
        for data in DWDStationSerializer(stations, many=True).data:
            if data['dataCount'] > 0:
                result.append(data)
        return Response(result)


class DWDStationsGeometry(APIView):

    def get(self, request, region_id):
        region = Region.objects.get(pk=region_id)
        if os.path.isfile(os.path.join(settings.MEDIA_ROOT + 'dwd_stations.geojson')):
            geojson = self.file_get_contents(settings.MEDIA_ROOT + 'dwd_stations.geojson')
        else:
            # create file/folder if it does not exist
            geojson = GeoJSONSerializer().serialize(DWDStation.objects.filter(geom__intersects=region.geom), geometry_field='geom', properties=tuple([f.name for f in DWDStation._meta.get_fields()]), precision=4)
            f = open(settings.MEDIA_ROOT + 'dwd_stations.geojson', 'w')
            f.write(geojson)
            f.close()
        return HttpResponse(geojson)

    def file_get_contents(self, filename):
        with open(filename) as f:
            return f.read()

class DWDStationView(APIView):
    def get_object(self, pk):
        try:
            return DWDStation.objects.get(pk=pk)
        except DWDStation.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        station = self.get_object(pk)
        return Response(DWDStationSingleSerializer(station).data)

class DWDInSituData_Phase(APIView):
    def get(self, request):
        Stations_id = int(request.query_params.get('Stations_id', 198))
        Objekt_id = int(request.query_params.get('Objekt_id', 310))
        Phase_id = int(request.query_params.get('Phase_id', 5))

        data = DWDInSituData.objects.filter(Stations_id=Stations_id, Objekt_id=Objekt_id, Phase_id=Phase_id)
        data = data.to_timeseries(fieldnames=['Referenzjahr', 'Jultag'], index='Referenzjahr', values='Jultag')

        station = DWDStation.objects.filter(Stations_id=Stations_id)[0]
        title = station.Stationsname + ' - ' + dwd_id_to_name['%s_%s' % (Objekt_id, Phase_id)]

        from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
        from matplotlib.figure import Figure

        fig = Figure()
        ax = fig.add_subplot(111)
        data.plot(ax=ax, title=title)
        canvas = FigureCanvas(fig)
        response = HttpResponse(content_type='image/png')
        canvas.print_png(response)
        return response

