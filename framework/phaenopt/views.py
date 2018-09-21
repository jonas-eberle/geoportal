# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import json

from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.db.models import Count, Min, Max
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response

from webgis import settings
from geospatial.models import Region
from content.models import SatdataLayer
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
        layers = PhenoLayer.objects.filter(region=region, publishable=True)
        data = dict(phenolayers={}, climatelayers={}, layers={}, satdatalayers=[])
        for layer in layers:
            layer_data = LayerSerializer(layer).data
            if layer_data['ogc_times'] != None and layer_data['ogc_times'] != '':
                layer_data['ogc_times'] = layer_data['ogc_times'].split(',')
                layer_data['selectedDate'] = layer_data['ogc_times'][-1]
            if layer_data['legend_colors']:
                try:
                    layer_data['legend_colors'] = json.loads(layer_data['legend_colors'])
                except:
                    pass
            if layer.phenophase:
                if layer.phenophase.name not in data['phenolayers']:
                    image = None
                    if layer.phenophase.image:
                        image = layer.phenophase.image.url
                    data['phenolayers'][layer.phenophase.name] = dict(name=layer.phenophase.name, description=layer.phenophase.description, image=image, layers=dict(insitu=[], modelliert=[], differenz=[]))
                data['phenolayers'][layer.phenophase.name]['layers'][layer.type].append(layer_data)
            elif layer.product:
                if layer.product.name not in data['climatelayers']:
                    data['climatelayers'][layer.product.name] = dict(name=layer.product.name, description=layer.product.description, layers=[])
                data['climatelayers'][layer.product.name]['layers'].append(layer_data)
            else:
                if layer.type not in data['layers']:
                    data['layers'][layer.type] = []
                data['layers'][layer.type].append(layer_data)

        climatelayers = []
        for key, value in data['climatelayers'].iteritems():
            climatelayers.append(value)
        data['climatelayers']= climatelayers

        phenolayers = []
        for key, value in data['phenolayers'].iteritems():
            phenolayers.append(value)
        data['phenolayers'] = phenolayers

        data['citizenscience'] = CitizenScienceProjectSerializer(CitizenScienceProject.objects.all(), many=True).data

        layers = SatdataLayer.objects.filter(region=region)
        for layer in layers:
            layer_data = LayerSerializer(layer).data
            data['satdatalayers'].append(layer_data)

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
        max = int(request.query_params.get('maxFeatures', -1))

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
        limit = int(request.query_params.get('limit', -1))

        result = dict()
        for project in CitizenScienceProject.objects.all():
            features = project.get_data(geom=region.geom, start=start, limit=limit)
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
            if data['dataCount'] > -1:
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
            geojson = json.loads(geojson)
            del geojson['crs']
            geojson = json.dumps(geojson)
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
        ax.set_ylabel('Tag des Jahres')
        ax.locator_params(integer=True)
        
        if len(data) == 1:
            data.plot(ax=ax, title=title, legend=False, style='o')
        else:
            data.plot(ax=ax, title=title, legend=False)

        canvas = FigureCanvas(fig)
        response = HttpResponse(content_type='image/png')
        canvas.print_png(response)
        return response


class DWDInSituDataPhases(APIView):
    def get(self, request):
        result = []
        definitions = open(os.path.join(settings.MEDIA_ROOT, 'definitions.json')).read().replace('NaN', 'null')
        definitions = json.loads(definitions)
        for key in definitions:
            definitions[key]['name'] = '%s (%s)' % (definitions[key]['Objekt'], definitions[key]['Phase'])
            data =  DWDInSituData.objects.filter(Phase_id=definitions[key]['Phasen_id'], Objekt_id=definitions[key]['Objekt_id'])
            definitions[key]['stationsCount'] = data.values('Stations_id').distinct().count()
            definitions[key].update(data.values('Referenzjahr').distinct().aggregate(Min('Referenzjahr'), Max('Referenzjahr')))
            if definitions[key]['stationsCount'] > 0:
                result.append(definitions[key])

        newlist = sorted(result, key=lambda k: k['name'])
        return Response(newlist)

class DWDInSituData_PhaseHistogram(APIView):
    def get(self, request):
        Objekt_id = int(request.query_params.get('Objekt_id', 310))
        Phase_id = int(request.query_params.get('Phase_id', 5))
        start = int(request.query_params.get('start', -1))
        end = int(request.query_params.get('end', -1))

        if start > -1 and end > -1:
            data = DWDInSituData.objects.filter(Objekt_id=Objekt_id, Phase_id=Phase_id, Referenzjahr__gte=start, Referenzjahr__lte=end).to_dataframe()
            jahr_min = start
            jahr_max = end
        elif start > -1:
            data = DWDInSituData.objects.filter(Objekt_id=Objekt_id, Phase_id=Phase_id, Referenzjahr__gte=start).to_dataframe()
            jahr_min = start
            jahr_max = data['Referenzjahr'].max()
        elif end > -1:
            data = DWDInSituData.objects.filter(Objekt_id=Objekt_id, Phase_id=Phase_id, Referenzjahr__lte=end).to_dataframe()
            jahr_min = data['Referenzjahr'].min()
            jahr_max = end
        else:
            data = DWDInSituData.objects.filter(Objekt_id=Objekt_id, Phase_id=Phase_id).to_dataframe()
            jahr_min = data['Referenzjahr'].min()
            jahr_max = data['Referenzjahr'].max()

        observations = data['Referenzjahr'].count()
        title = dwd_id_to_name['%s_%s' % (Objekt_id, Phase_id)] + '\n%s Daten zwischen %s - %s' % (observations, jahr_min, jahr_max)

        from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
        from matplotlib.figure import Figure

        fig = Figure()
        ax = fig.add_subplot(111)
        #data['Jultag'].plot(ax=ax, title=title)
        data['Jultag'].plot.hist(bins=25, ax=ax, title=title)
        ax.set_xlabel('Tag des Jahres')
        canvas = FigureCanvas(fig)
        response = HttpResponse(content_type='image/png')
        canvas.print_png(response)
        return response
