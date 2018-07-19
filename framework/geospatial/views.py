# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import StringIO
import requests
import sqlite3 as sdb
import uuid
import glob
import zipfile
from datetime import datetime

from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.template.response import TemplateResponse
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


class SatelliteData(APIView):
    def get_object(self, pk):
        try:
            return Region.objects.get(pk=pk)
        except Region.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        region = self.get_object(pk)
        data = region.satellitedata()
        results = dict(table=data, layers=[], layers_count=0)

        # layers = SatdataLayer.objects.filter(region=region, publishable=True).order_by('title', 'id')
        # layers = LayerSerializer(layers, many=True).data
        # results['layers'] = OrderedDict()
        # for layer_data in layers:
        #     if layer_data['ogc_times'] != None and layer_data['ogc_times'] != '':
        #         layer_data['ogc_times'] = layer_data['ogc_times'].split(',')
        #         layer_data['selectedDate'] = layer_data['ogc_times'][-1]
        #
        #     dataset = layer_data['identifier'].split('_')[-2].replace('LANDSAT-ETM', 'LANDSAT-7')
        #     if dataset not in results['layers']:
        #         results['layers'][dataset] = []
        #     results['layers_count'] += 1
        #     results['layers'][dataset].append(layer_data)
        return Response(results)


class SatelliteMetadataExport(APIView):
    def get_object(self, pk):
        try:
            return Region.objects.get(pk=pk)
        except Region.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        region = self.get_object(pk)

        # construct sql query
        sql_additions = []
        # sql_additions.append('ST_Intersects(wkb_geometry, (SELECT geom from swos_wetland WHERE id=%s))' % wetland.id)

        datasets = request.query_params.get('datasets', None)
        if datasets is not None:
            datasets = datasets.split(',')
            sql_additions.append('dataset IN (%s)' % ','.join(["'" + dataset + "'" for dataset in datasets]))

        tiles = request.query_params.get('tiles', None)
        if tiles is not None:
            tiles = tiles.split(',')
            sql_additions.append('tile IN (%s)' % ','.join(["'" + tile + "'" for tile in tiles]))

        cloud_cover_min = request.query_params.get('cloud_cover_min', 100)
        sql_additions.append('cloud_cover <= %s' % float(cloud_cover_min))

        sun_elevation = request.query_params.get('sun_elevation')
        sun_elevation = sun_elevation.split(',')
        # sql_additions.append('(sun_elevation IS NULL OR (sun_elevation >= %s AND sun_elevation <= %s))' % (float(sun_elevation[0]), float(sun_elevation[1])))
        sql_additions.append('(sun_elevation == \'\' OR (sun_elevation >= %s AND sun_elevation <= %s))' % (
        float(sun_elevation[0]), float(sun_elevation[1])))

        sun_zenith_angle_mean = request.query_params.get('sun_zenith_angle_mean')
        sun_zenith_angle_mean = sun_zenith_angle_mean.split(',')
        # sql_additions.append('(sun_zenith_angle_mean IS NULL OR (sun_zenith_angle_mean >= %s AND sun_zenith_angle_mean <= %s))' % (float(sun_zenith_angle_mean[0]), float(sun_zenith_angle_mean[1])))
        sql_additions.append(
            '(sun_zenith_angle_mean == \'\' OR (sun_zenith_angle_mean >= %s AND sun_zenith_angle_mean <= %s))' % (
            float(sun_zenith_angle_mean[0]), float(sun_zenith_angle_mean[1])))

        sun_azimuth_angle_mean = request.query_params.get('sun_azimuth_angle_mean')
        sun_azimuth_angle_mean = sun_azimuth_angle_mean.split(',')
        # sql_additions.append('(sun_azimuth_angle_mean IS NULL OR (sun_azimuth_angle_mean >= %s AND sun_azimuth_angle_mean <= %s))' % (float(sun_azimuth_angle_mean[0]), float(sun_azimuth_angle_mean[1])))
        sql_additions.append(
            '(sun_azimuth_angle_mean == \'\' OR (sun_azimuth_angle_mean >= %s AND sun_azimuth_angle_mean <= %s))' % (
            float(sun_azimuth_angle_mean[0]), float(sun_azimuth_angle_mean[1])))

        time_start_begin = request.query_params.get('time_start_begin')
        time_start_end = request.query_params.get('time_start_end')
        # sql_additions.append('(time_start >= \'%s\'::DATE AND time_start <= \'%s\'::DATE)' % (time_start_begin, time_start_end))
        sql_additions.append('(time_start >= \'%s\' AND time_start <= \'%s\')' % (time_start_begin, time_start_end))

        months = request.query_params.get('months', None)
        if months is not None:
            months = months.split(',')
            # sql_additions.append('extract(MONTH from time_start) IN (%s)' % ','.join(months))
            sql_additions.append('strftime(\'%%m\', time_start) IN (%s)' % ','.join(
                ["'" + "%02d" % int(month) + "'" for month in months]))

        # construct sql query
        sql_query = 'SELECT * FROM satdata '
        if len(sql_additions) > 0:
            sql_query += 'WHERE '
            sql_query += ' AND '.join(sql_additions)
        sql_query += ' ORDER BY time_start ASC;'

        filename = os.path.join(settings.MEDIA_ROOT, 'tmp', str(uuid.uuid4()))
        db_conn = settings.DATABASES['default']
        # return Response(sql_query)
        # os.system('ogr2ogr -f "CSV" -sql "%s" %s.csv PG:"host=localhost dbname=%s user=%s password=%s"' % (sql_query, filename, db_conn['NAME'], db_conn['USER'], db_conn['PASSWORD']))
        # os.system('ogr2ogr -f "ESRI Shapefile" -sql "%s" %s.shp PG:"host=localhost dbname=%s user=%s password=%s"' % (sql_query, filename, db_conn['NAME'], db_conn['USER'], db_conn['PASSWORD']))
        # os.system('ogr2ogr -f "GeoJSON" -sql "%s" %s.json PG:"host=localhost dbname=%s user=%s password=%s"' % (sql_query, filename, db_conn['NAME'], db_conn['USER'], db_conn['PASSWORD']))

        # SQLite
        os.system('ogr2ogr -f "CSV" -sql "%s" %s.csv %s' % (
        sql_query, filename, settings.MEDIA_ROOT + 'cache/satdata/satdata_all_' + str(wetland.id) + '.sqlite'))
        os.system('ogr2ogr -f "ESRI Shapefile" -sql "%s" %s.shp %s' % (
        sql_query, filename, settings.MEDIA_ROOT + 'cache/satdata/satdata_all_' + str(wetland.id) + '.sqlite'))
        os.system('ogr2ogr -f "GeoJSON" -sql "%s" %s.json %s' % (
        sql_query, filename, settings.MEDIA_ROOT + 'cache/satdata/satdata_all_' + str(wetland.id) + '.sqlite'))

        import zipfile
        s = StringIO.StringIO()
        z = zipfile.ZipFile(s, 'w')
        for f in glob.glob(filename + '.*'):
            z.write(f, os.path.basename(f))
        z.close()

        for f in glob.glob(filename + '.*'):
            os.remove(f)

        resp = HttpResponse(s.getvalue(), content_type="application/x-zip-compressed")
        resp['Content-Disposition'] = 'attachment; filename=SWOS_Export_Results_Satellitedata.zip'
        return resp


class SatelliteMetadata(APIView):
    def get_object(self, pk):
        try:
            return Region.objects.get(pk=pk)
        except Region.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        region = self.get_object(pk)

        scene_id = request.query_params.get('scene')
        dataset = request.query_params.get('dataset')

        # sql query
        sql = "SELECT * FROM satdata WHERE id='%s'" % scene_id

        # sqlite database
        conn = sdb.connect(settings.MEDIA_ROOT + 'cache/satdata/satdata_all_' + str(region.id) + '.sqlite')
        conn.row_factory = sdb.Row
        my_cursor = conn.cursor()
        my_cursor.execute(sql)
        scene = dict(my_cursor.fetchone())

        # alternative with postgis database
        # cursor = connection.cursor()
        # cursor.execute(sql)
        # columns = (x.name for x in cursor.description)
        # scene = cursor.fetchone()
        # scene = dict(zip(columns, scene))

        if scene:
            # scene['id'] = scene['scene_id']

            if scene_id.startswith('S1'):
                if "Products('')" in scene['download_url']:
                    scene['download_urls'] = []
                else:
                    scene['download_urls'] = [dict(url=scene['download_url'], filename=scene['id'] + '.zip')]
                date = scene['time_start'].split('T')[0]
                b_date = datetime.strptime(date, '%Y-%m-%d')
                today = datetime.today()
                if ((today.year - b_date.year) * 12 + today.month - b_date.month) <= 4:
                    scene['code_de_filename'] = scene_id + '.SAFE.zip'
            elif scene_id.startswith('S2') or scene_id.startswith('L1C'):
                # download url from ESA-Datenhub anfragen
                scene_id = scene['vendor_product_id']
                scene['code_de_filename'] = scene_id + '.SAFE.zip'

                scene['download_urls'] = []
                tile = scene['tile']
                date = scene['time_start'].split('T')[0].split('-')
                amazon_url = 'http://sentinel-s2-l1c.s3-website.eu-central-1.amazonaws.com/#tiles/%s/%s/%s/%s/%s/%s/0/' % (
                tile[1:3], tile[3:4], tile[4:6], date[0], int(date[1]), int(date[2]))
                scene['download_urls'].append(dict(url=amazon_url, filename='Files overview'))

                if 'metadata_url' in scene:
                    metaparts = scene['metadata_url'].split('/')
                    scene['usgs_id'] = metaparts[-2]

                try:
                    req = requests.get('https://scihub.copernicus.eu/dhus/search?q=%s&format=json' % scene_id,
                                       verify=False, auth=(settings.ESA_DATAHUB_USER, settings.ESA_DATAHUB_PASSWORD))
                    if req.status_code == 200:
                        data = req.json()
                        if 'entry' in data['feed']:
                            id = data['feed']['entry']['id']
                            download_url = "https://scihub.copernicus.eu/dhus/odata/v1/Products('%s')/$value" % id
                            scene['download_urls'].append(dict(url=download_url, filename=scene_id + '.zip'))
                except Exception as e:
                    pass
            elif 'ESA' in scene_id and scene['source'] == 'ESA-Archive via Sentinel-Hub':
                scene['download_urls'] = [
                    dict(url=scene['metadata_url'].replace('.MTR.XML', '.ZIP'), filename=scene['title'] + '.ZIP')]
                scene['spacecraft_identifier'] = 'LANDSAT_' + scene_id[2]
                scene['wrs_path'] = scene_id[3:6]
                scene['wrs_row'] = scene_id[6:9]
                dataset = dataset + '_ESA'
            elif scene_id.startswith('LC8'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LC08/01/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene['landsat_product_id'])
                files = ['ANG.txt', 'B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'B8.TIF',
                         'B9.TIF', 'B10.TIF', 'B11.TIF', 'BQA.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]
            elif scene_id.startswith('LE7'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LE07/01/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene['landsat_product_id'])
                files = ['ANG.txt', 'B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'B5.TIF', 'B6_VCID_1.TIF', 'B6_VCID_2.TIF',
                         'B7.TIF', 'B8.TIF', 'BQA.TIF', 'GCP.txt', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]
            elif scene_id.startswith('LT5'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LT05/01/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene['landsat_product_id'])
                files = ['ANG.txt', 'B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'BQA.TIF',
                         'GCP.txt', 'MTL.txt', 'VER.jpg', 'VER.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]
            elif scene_id.startswith('LT4'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LT04/01/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene['landsat_product_id'])
                files = ['ANG.txt', 'B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'BQA.TIF',
                         'GCP.txt', 'MTL.txt', 'VER.jpg', 'VER.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]
            elif scene_id.startswith('LM1'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM01/PRE/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]
            elif scene_id.startswith('LM2'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM02/PRE/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]
            elif scene_id.startswith('LM3'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM03/PRE/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]
            elif scene_id.startswith('LM4'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM04/PRE/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]
            elif scene_id.startswith('LM5'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM05/PRE/{path}/{row}/{id}/{id}_'.format(
                    row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url + ext, filename=scene_id + '_' + ext) for ext in files]

            return TemplateResponse(request, 'metadata/' + dataset + '.html', scene)

        raise Http404

