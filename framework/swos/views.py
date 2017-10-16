import json
import pycurl
import urllib2
import httplib
import StringIO
import os
import requests
import sqlite3 as sdb
import uuid
import glob

from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.template.response import TemplateResponse
from django.http import StreamingHttpResponse
from django.db.models import Q
from django.db import connection

from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response

from webgis import settings
from .models import Wetland, StoryLine, StoryLinePart, StoryLineInline
from .models import Product, Indicator, IndicatorSerializer, IndicatorValue, IndicatorValueSerializer, WetlandLayer, \
    ExternalDatabase, ExternalLayer, Country
from layers.models import LayerSerializer
from swos.search_es import WetlandSearch

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

    def get_story_line(self, layer_id):

        story_line_parts = []
        story_line_list = []

        story_line = StoryLineInline.objects.filter(Q(story_line__active=True), Q(story_line_part__product_layer=layer_id) | Q(story_line_part__indicator_layer=layer_id) | Q(story_line_part__external_layer=layer_id)).order_by("order")

        if not story_line:
            return False

        for story_line_part in story_line:
            if story_line_part.story_line_id not in story_line_list:
                story_line_parts.append({'story_line': story_line_part.story_line_id, 'order': story_line_part.order, 'title': story_line_part.story_line.title, 'authors':story_line_part.story_line.authors, 'description': story_line_part.story_line.description})
                story_line_list.append(story_line_part.story_line_id)

        return story_line_parts

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        wetland = self.get_object(pk)
        
        layers = WetlandLayer.objects.filter(wetland_id=wetland.id, publishable=True).order_by('title')
        indicator_values = IndicatorValue.objects.filter(wetland_id=wetland.id).order_by('indicator', 'time')
        temp_products_layers = dict()
        temp_indicators_layers = dict()
        temp_external_layers = dict()
        temp_external_story_lines = dict()
        temp_products = dict()
        temp_product_story_lines = dict()
        temp_indicators = dict()
        temp_indicator_values = dict()
        temp_indicators_story_lines = dict()
        
        finalJSON = {'id': wetland.id, 'title': wetland.name, 'image': wetland.image_url,
                     'image_desc': wetland.image_desc, 'products': [], 'indicators': [], 'externaldb': [],
                     'externaldb_layer': [], 'indicator_values': [], 'indicator_descr': []}

        # create product and indicator layer
        for layer in layers:
            layer_data = LayerSerializer(layer).data
            layer_data['wetland_id'] = wetland.id
            story_line = self.get_story_line(layer.id)
            if story_line:
                layer_data['story_line'] = story_line
            else:
                layer_data['story_line'] = ""

            if layer_data['legend_colors']:
                layer_data['legend_colors'] = json.loads(layer_data['legend_colors'])
            if layer_data['ogc_times'] != None and layer_data['ogc_times'] != '':
                layer_data['ogc_times'] = layer_data['ogc_times'].split(',')
                layer_data['selectedDate'] = layer_data['ogc_times'][-1]
            if layer.product:
                layer_data['product_name'] = layer.product.name
                if layer.product.id not in temp_products_layers:
                    temp_products[layer.product.id] = layer.product
                    temp_products_layers[layer.product.id] = [layer_data]
                else:
                    temp_products_layers[layer.product.id].append(layer_data)

                if story_line and layer.product.id not in temp_product_story_lines:
                    temp_product_story_lines[layer.product.id] = layer_data['story_line']
                elif story_line:
                    temp_product_story_lines[layer.product.id].append(layer_data['story_line'])

            if layer.indicator:
                layer_data['indicator_name'] = layer.indicator.name
                if layer.indicator.id not in temp_indicators_layers:
                    temp_indicators[layer.indicator.id] = layer.indicator
                    temp_indicators_layers[layer.indicator.id] = [layer_data]
                else:
                    temp_indicators_layers[layer.indicator.id].append(layer_data)

                if story_line and layer.indicator.id not in temp_indicators_story_lines:
                    temp_indicators_story_lines[layer.indicator.id] = layer_data['story_line']
                elif story_line:
                    temp_indicators_story_lines[layer.indicator.id].append(layer_data['story_line'])

        for product in temp_products:
            product = temp_products[product]
            layers = temp_products_layers[product.id]
            if product.id in temp_product_story_lines:
                story_line_data = temp_product_story_lines[product.id]
            else:
                story_line_data = ""

            finalJSON['products'].append(
                {'id': product.id, 'name': product.name, 'order': product.order, 'description': product.description,
                 'layers': layers, 'story_line': story_line_data})
        for indicator in temp_indicators:
            indicator = temp_indicators[indicator]
            layers = temp_indicators_layers[indicator.id]
            finalJSON['indicators'].append(
                {'id': indicator.id, 'name': indicator.name, 'short_name': indicator.short_name,
                 'order': indicator.order, 'description': indicator.description, 'layers': layers})
        for indicator_value in indicator_values:
            print indicator_value.__dict__
            if indicator_value.indicator_id not in temp_indicator_values:

                temp_indicator_values[indicator_value.indicator_id] = [
                    {'time': indicator_value.time, 'time_end': indicator_value.time_end}]
            else:
                temp_indicator_values[indicator_value.indicator_id].append(
                    {'time': indicator_value.time, 'time_end': indicator_value.time_end})

        print temp_indicator_values

        # finalJSON['indicator_values'].append({'id': indicator_value.id, 'values': indicator_value.value})


        # get wetland country --> find continent and add to list

        # use first country of country list to find the continent #todo handel country list
        if ("-" in wetland.country):
            countries = wetland.country.split('-')
            country_continent = Country.objects.get(name=countries[1])
        else:
            country_continent = Country.objects.get(name=wetland.country)

        extdata = ExternalDatabase.objects.filter(country__name=wetland.country) | ExternalDatabase.objects.filter(continent="Global") | ExternalDatabase.objects.filter(continent=country_continent.continent) | ExternalDatabase.objects.filter(wetland_id=wetland.id)

        extdb_grouped_list = {'local': [], 'national': [], 'continent': [], 'global': []}
        extdb_grouped_name = {'local': wetland.name, 'national': wetland.country,'continent': country_continent.continent, 'global': "Global"}

        for extdb in extdata:

            country = extdb.country.filter(name=wetland.country)
            if country:
                country_found = True
            else:
                country_found = False

            if extdb.wetland_id == wetland.id:
                extdb_grouped_list['local'].append(extdb)
            elif country_found == True and not extdb.wetland_id:
                extdb_grouped_list['national'].append(extdb)
            elif extdb.continent == country_continent.continent:
                extdb_grouped_list['continent'].append(extdb)
            elif extdb.continent == "Global":
                extdb_grouped_list['global'].append(extdb)

            del (country)

        # add external datasets starting from local and add all linked layer for each dataset
        for index in ['local', 'national', 'continent', 'global']:
            datasets = []
            for extdb in extdb_grouped_list[index]:
                layer_extern = ExternalLayer.objects.filter(datasource_id=extdb.id, publishable=True)


                if layer_extern:
                    for ex_layer in layer_extern:
                        layer_data = LayerSerializer(ex_layer).data
                        story_line = self.get_story_line(ex_layer.id)
                        if story_line:
                            layer_data['story_line'] = story_line
                        else:
                            layer_data['story_line'] = ""

                        if layer_data['ogc_times'] != None and layer_data['ogc_times'] != '':
                            layer_data['ogc_times'] = layer_data['ogc_times'].split(',')
                            layer_data['selectedDate'] = layer_data['ogc_times'][-1]
                        if layer_data['legend_colors']:
                            layer_data['legend_colors'] = json.loads(layer_data['legend_colors'])
                        if extdb.id not in temp_external_layers:
                            temp_external_layers[extdb.id] = [layer_data]
                        else:
                            temp_external_layers[extdb.id].append(layer_data)

                        if story_line and ex_layer.id not in temp_external_story_lines:
                            temp_external_story_lines[ex_layer.id] = layer_data['story_line']
                        elif story_line:
                            temp_external_story_lines[ex_layer.id].append(layer_data['story_line'])

                    layers = temp_external_layers[extdb.id]

                    if ex_layer.id in temp_external_story_lines:
                        story_line_data = temp_external_story_lines[ex_layer.id]
                    else:
                        story_line_data = ""

                    datasets.append({'name': extdb.name, 'description': extdb.description,
                                     'provided_info': extdb.provided_information, 'online_link': extdb.online_link,
                                     'language': extdb.dataset_language,
                                     'geoss_datasource_id': extdb.geoss_datasource_id, 'layers': layers,
                                     'layer_exist': "True", 'story_line': story_line_data})
                else:
                    if extdb.id in temp_external_story_lines:
                        story_line_data = temp_product_story_lines[product.id]
                    else:
                        story_line_data = ""

                    datasets.append({'ext_db_id': extdb.id, 'name': extdb.name, 'description': extdb.description,
                                     'provided_info': extdb.provided_information, 'online_link': extdb.online_link,
                                     'language': extdb.dataset_language,
                                     'geoss_datasource_id': extdb.geoss_datasource_id, 'layer_exist': "False" ,'story_line': story_line_data})

            if extdb_grouped_list[index]:
                finalJSON['externaldb'].append({'group': extdb_grouped_name[index], 'datasets': datasets})

        #adds story_line(s)
        story_lines = StoryLine.objects.filter(wetland_id=wetland.id, active=True)

        story_line_list = []

        for story_line in story_lines:
            story_line_list.append({'story_line': story_line.id, 'title' : story_line.title})

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
        finalJSON['count']['externaldb'] = len(extdata)

        finalJSON['story_lines'] = story_line_list

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
            # detect landscape or portrait format
            if (images.image.width > images.image.height):
                photo_show_url = images.image.url_1300x1000;
            else:
                photo_show_url = images.image.url_1000x1300;

            finalJSON['photos'].append({'photo_title': images.name, 'photo_url_orig': images.image.url,
                                        'photo_url_thumb': images.image.url_52x52, 'photo_show_url': photo_show_url,
                                        'owner_name': images.copyright, 'description': images.description,
                                        'date': images.date})

        images = finalJSON['photos']
        if max > -1 and (start + max) < len(images):
            finalJSON['photos'] = images[start:start + max]
        else:
            finalJSON['photos'] = images[start:]
        return Response(finalJSON)


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
        return Response(videos)


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
        return Response(data)


class SatelliteMetadataExport(APIView):
    def get_object(self, pk):
        try:
            return Wetland.objects.get(pk=pk)
        except Wetland.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        wetland = self.get_object(pk)
        
        # construct sql query
        sql_additions = []
        sql_additions.append('ST_Intersects(wkb_geometry, (SELECT geom from swos_wetland WHERE id=%s))' % wetland.id)
        
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
        sql_additions.append('(sun_elevation IS NULL OR (sun_elevation >= %s AND sun_elevation <= %s))' % (float(sun_elevation[0]), float(sun_elevation[1])))
        
        sun_zenith_angle_mean = request.query_params.get('sun_zenith_angle_mean')
        sun_zenith_angle_mean = sun_zenith_angle_mean.split(',')
        sql_additions.append('(sun_zenith_angle_mean IS NULL OR (sun_zenith_angle_mean >= %s AND sun_zenith_angle_mean <= %s))' % (float(sun_zenith_angle_mean[0]), float(sun_zenith_angle_mean[1])))
        
        sun_azimuth_angle_mean = request.query_params.get('sun_azimuth_angle_mean')
        sun_azimuth_angle_mean = sun_azimuth_angle_mean.split(',')
        sql_additions.append('(sun_azimuth_angle_mean IS NULL OR (sun_azimuth_angle_mean >= %s AND sun_azimuth_angle_mean <= %s))' % (float(sun_azimuth_angle_mean[0]), float(sun_azimuth_angle_mean[1])))
        
        time_start_begin = request.query_params.get('time_start_begin')
        time_start_end = request.query_params.get('time_start_end')
        sql_additions.append('(time_start >= \'%s\'::DATE AND time_start <= \'%s\'::DATE)' % (time_start_begin, time_start_end))
        
        months = request.query_params.get('months', None)
        if months is not None:
            months = months.split(',')
            sql_additions.append('extract(MONTH from time_start) IN (%s)' % ','.join(tiles))
        
        # construct sql query
        sql_query = 'SELECT * FROM satdata '
        if len(sql_additions) > 0:
            sql_query += 'WHERE '
            sql_query += ' AND '.join(sql_additions)
        sql_query += 'ORDER BY time_start ASC;'
        
        filename = os.path.join(settings.MEDIA_ROOT, 'tmp', str(uuid.uuid4()))
        db_conn = settings.DATABASES['default']
        os.system('ogr2ogr -f "CSV" -sql "%s" %s.csv PG:"host=localhost dbname=%s user=%s password=%s"' % (sql_query, filename, db_conn['NAME'], db_conn['USER'], db_conn['PASSWORD']))
        os.system('ogr2ogr -f "ESRI Shapefile" -sql "%s" %s.shp PG:"host=localhost dbname=%s user=%s password=%s"' % (sql_query, filename, db_conn['NAME'], db_conn['USER'], db_conn['PASSWORD']))
        os.system('ogr2ogr -f "GeoJSON" -sql "%s" %s.json PG:"host=localhost dbname=%s user=%s password=%s"' % (sql_query, filename, db_conn['NAME'], db_conn['USER'], db_conn['PASSWORD']))
        
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
            return Wetland.objects.get(pk=pk)
        except Wetland.DoesNotExist:
            raise Http404

    # provide HTTP GET method
    def get(self, request, pk, format=None):
        wetland = self.get_object(pk)
        
        scene_id = request.query_params.get('scene')
        dataset = request.query_params.get('dataset')
        
        # sql query
        sql = "SELECT * FROM satdata WHERE scene_id='%s'" % scene_id
        
        # sqlite database
        conn = sdb.connect(settings.MEDIA_ROOT + 'cache/satdata/satdata_all_' + str(wetland.id) + '.sqlite')
        conn.row_factory = sdb.Row
        my_cursor = conn.cursor()
        my_cursor.execute(sql)
        scene = dict(my_cursor.fetchone())
        
        # alternative with postgis database
        #cursor = connection.cursor() 
        #cursor.execute(sql)
        #columns = (x.name for x in cursor.description)
        #scene = cursor.fetchone()
        #scene = dict(zip(columns, scene))
             
        if scene:
            scene['id'] = scene['scene_id']
            
            if scene_id.startswith('S1'):
                if "Products('')" in scene['download_url']:
                    scene['download_urls'] = []
                else:
                    scene['download_urls'] = [dict(url=scene['download_url'], filename=scene['id']+'.zip')]
            elif scene_id.startswith('S2') or scene_id.startswith('L1C'):
                # download url from ESA-Datenhub anfragen
                scene_id = scene['vendor_product_id']
                
                scene['download_urls'] = []
                tile = scene['tile']
                date = scene['time_start'].split('T')[0].split('-')
                amazon_url = 'http://sentinel-s2-l1c.s3-website.eu-central-1.amazonaws.com/#tiles/%s/%s/%s/%s/%s/%s/0/' % (tile[1:3], tile[3:4], tile[4:6], date[0], int(date[1]), int(date[2]))
                scene['download_urls'].append(dict(url=amazon_url, filename='Files overview'))
                
                if 'metadata_url' in scene:
                    metaparts = scene['metadata_url'].split('/')
                    scene['usgs_id'] = metaparts[-2]
                
                req = requests.get('https://scihub.copernicus.eu/dhus/search?q=%s&format=json' % scene_id, verify=False, auth=(settings.ESA_DATAHUB_USER, settings.ESA_DATAHUB_PASSWORD))
                if req.status_code == 200:
                    data = req.json()
                    if 'entry' in data['feed']:
                        id = data['feed']['entry']['id']
                        download_url = "https://scihub.copernicus.eu/dhus/odata/v1/Products('%s')/$value" % id
                        scene['download_urls'].append(dict(url=download_url, filename=scene_id+'.zip'))
            elif 'ESA' in scene_id and scene['source'] == 'ESA-Archive via Sentinel-Hub':
                scene['download_urls'] = [dict(url=scene['metadata_url'].replace('.MTR.XML', '.ZIP'), filename=scene['title']+'.ZIP')]
                scene['spacecraft_identifier'] = 'LANDSAT_' + scene_id[2]
                scene['wrs_path'] = scene_id[3:6]
                scene['wrs_row'] = scene_id[6:9] 
                dataset = dataset + '_ESA'
            elif scene_id.startswith('LC8'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LC08/01/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene['landsat_product_id'])
                files = ['ANG.txt', 'B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'B8.TIF', 'B9.TIF', 'B10.TIF', 'B11.TIF', 'BQA.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
            elif scene_id.startswith('LE7'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LE07/01/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene['landsat_product_id'])
                files = ['ANG.txt', 'B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'B5.TIF', 'B6_VCID_1.TIF', 'B6_VCID_2.TIF', 'B7.TIF', 'B8.TIF', 'BQA.TIF', 'GCP.txt', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
            elif scene_id.startswith('LT5'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LT05/01/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene['landsat_product_id'])
                files = ['ANG.txt', 'B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'BQA.TIF', 'GCP.txt', 'MTL.txt', 'VER.jpg', 'VER.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
            elif scene_id.startswith('LT4'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LT04/01/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene['landsat_product_id'])
                files = ['ANG.txt', 'B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'BQA.TIF', 'GCP.txt', 'MTL.txt', 'VER.jpg', 'VER.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
            elif scene_id.startswith('LM1'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM01/PRE/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
            elif scene_id.startswith('LM2'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM02/PRE/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
            elif scene_id.startswith('LM3'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM03/PRE/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B4.TIF', 'B5.TIF', 'B6.TIF', 'B7.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
            elif scene_id.startswith('LM4'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM04/PRE/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
            elif scene_id.startswith('LM5'):
                base_url = 'https://storage.googleapis.com/gcp-public-data-landsat/LM05/PRE/{path}/{row}/{id}/{id}_'.format(row=scene['wrs_row'], path=scene['wrs_path'], id=scene_id)
                files = ['B1.TIF', 'B2.TIF', 'B3.TIF', 'B4.TIF', 'MTL.txt']
                scene['download_urls'] = [dict(url=base_url+ext, filename=scene_id+'_'+ext) for ext in files]
                    
            return TemplateResponse(request, 'metadata/' + dataset + '.html', scene)
            
        raise Http404


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
        # rgbData = dict()
        # for key in data:
        #    rgbData[self.hex_to_rgb(key)] = data[key]
        # return Response(rgbData)


class StoryLinePartSerializer(serializers.ModelSerializer):
    image_url_300 = serializers.ReadOnlyField()
    image_url_600 = serializers.ReadOnlyField()

    class Meta:
        model = StoryLinePart
        fields = ('__all__')


class StoryLineInlineSerializer(serializers.ModelSerializer):
    story_line_part = StoryLinePartSerializer(read_only=True)

    class Meta:
        model = StoryLineInline
        fields = ('order', 'story_line_part')


class StoryLineSerializer(serializers.ModelSerializer):
    story_line = StoryLineInlineSerializer(many=True, read_only=True)

    class Meta:
        model = StoryLine
        fields = ('title', 'description', 'authors', 'story_line', 'story_line_file_name', 'story_line_file')


class StoryLineData(APIView):
    def get_object(self, pk):
        try:
            return StoryLine.objects.get(pk=pk)
        except StoryLine.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        story_line = self.get_object(pk)
        story_line_parts = StoryLineSerializer(story_line)

        return Response(story_line_parts.data)


class Layer(APIView):
    def get(self, request):
        if request.query_params.get("type") == "product" or request.query_params.get("type") == "indicator":
            result = WetlandLayer.objects.get(pk=request.query_params.get("layer_id"))
            return Response({'wetland_id': result.wetland.id, 'data': LayerSerializer(result).data})
        if request.query_params.get("type") == "external":
            result = ExternalLayer.objects.get(pk=request.query_params.get("layer_id"))
            print result.datasource.id
            result2 = ExternalDatabase.objects.get(pk=result.datasource.id)
        wetland_id = None
        if  hasattr(result2.wetland, 'id'):
            wetland_id = result2.wetland.id

        return Response({'wetland_id': wetland_id, 'data': LayerSerializer(result).data})


class Elasticsearch(APIView):
    def get (self, request):

        search = dict()
        search["east"] = False
        search["west"] = False
        search["north"] = False
        search["south"] = False
        search["category"] = False
        search["keywords"] = False
        search["wetland"] = False
        search["product_name"] = False
        search["indicator_name"] = False
        search["contact_person"] = False
        search["contact_org"] = False
        search["ecoregion"] = False

        search["text"] = request.query_params.get("search_text")
        search["category"] = request.query_params.get("category")
        search["keywords"] = request.query_params.get("keywords")
        search["topiccat"] = request.query_params.get("topiccat")
        search["wetland"] = request.query_params.get("wetland")
        search["product_name"] = request.query_params.get("product_name")
        search["indicator_name"] = request.query_params.get("indicator_name")
        search["contact_person"] = request.query_params.get("contact_person")
        search["contact_org"] = request.query_params.get("contact_org")
        search["ecoregion"] = request.query_params.get("ecoregion")

        #search["east"] = 5.0
        #search["west"] = 4.0
        #search["north"] = 60.0
        #search["south"] = 20.0
        ws = WetlandSearch(search)
        count = ws.count()  # Total count of result)
        response = ws[0:count].execute()  # default size is 10 -> set size to total count

       # print response.__dict__

        finalJSON = { 'hits': [], 'facets': []}

        hits = []
        facets = dict()
        list_order = dict()

        # for facet in response.facets:
        #     print facet
        #     for (facet, count, selected) in response.facets[facet]:
        #         print(facet, ' (SELECTED):' if selected else ':', count)

        for hit in response:

            # topics = []
            # if hasattr(hit, 'topiccat'):
            #     if hit.topiccat:
            #         for topic in hit.topiccat:
            #             topics.append({'val': topic})

            # keywords = []
            # if hasattr(hit, 'keywords'):
            #     print hit.keywords
            #     print hit.meta.id
            #     if hit.keywords:
            #         for keyword in hit.keywords:
            #             keywords.append({'val': keyword})

            if hit.meta.index == "layer_index":
                hits.append({'score': round( hit.meta.score, 3) , 'title':hit.title, 'category':hit.category,  'django_id': hit.meta.id , 'description': hit.description})
            if hit.meta.index == "external_database_index":
                hits.append({'score': round( hit.meta.score, 3), 'title':hit.name, 'category': 'external_db', 'ext_db_id': hit.meta.id, 'wetland_id': hit.wetland_id, 'description': '%s <br> <strong>Provided data</strong>: %s <br><strong>Link</strong>: <a href="%s" target="_blank">%s</a>' % (hit.description, hit.provided_information, hit.link, hit.link)})
            if hit.meta.index == "wetland_index":
                hits.append({'score': round( hit.meta.score, 3), 'title': hit.title, 'category': 'wetland', 'wetland_id': hit.meta.id})

        list_order['category'] = 1
        list_order["topiccat"] = 2
        list_order["product_name"] = 3
        list_order["indicator_name"] = 4
        list_order["external"] = 5
        list_order["wetland"] = 6
        list_order["ecoregion"] = 7
        list_order["contact_person"] = 8
        list_order["contact_org"] = 9
        list_order["keywords"] = 10

        facets_ordered = []

        for facet in response.facets:
            for (facet_, count, selected) in response.facets[facet]:
                if len(facet_) > 0:
                    if facet not in facets:
                        facets[facet] = []
                        facets[facet] = [{'name': facet_, 'count': count}]
                        facets_ordered.append({'name': facet, 'order': list_order[facet]})
                    else:
                        facets[facet].append({'name': facet_, 'count': count})


        finalJSON['hits'] = hits
        finalJSON['facets'] = facets
        finalJSON['facets_ordered'] = facets_ordered

        return Response(finalJSON)


class CurlHTTPStream(object):
    def __init__(self, url, login=False):
        self.url = url
        self.received_buffer = StringIO.StringIO()

        self.curl = pycurl.Curl()
        self.curl.setopt(pycurl.URL, url)
        self.curl.setopt(pycurl.HTTPHEADER, ['Cache-Control: no-cache'])
        self.curl.setopt(pycurl.COOKIEFILE, "/tmp/cookiefile")
        self.curl.setopt(pycurl.COOKIEJAR, "/tmp/cookiefile")
        self.curl.setopt(pycurl.FAILONERROR, 1L)
        self.curl.setopt(pycurl.FOLLOWLOCATION, 1L)
        self.curl.setopt(pycurl.NOPROGRESS, 1L)
        self.curl.setopt(pycurl.SSL_VERIFYHOST, 0L)
        self.curl.setopt(pycurl.SSL_VERIFYPEER, 0L)
        self.curl.setopt(pycurl.WRITEFUNCTION, self.received_buffer.write)
        if login:
            self.curl.setopt(pycurl.POSTFIELDS, "cn=" + settings.ESA_SSO_USER + "&password=" + settings.ESA_SSO_PASSWORD + "&loginFields=cn@password&loginMethod=umsso&sessionTime=untilbrowserclose&idleTime=oneday")

        self.curlmulti = pycurl.CurlMulti()
        self.curlmulti.add_handle(self.curl)

        self.status_code = 0

    SELECT_TIMEOUT = 10

    def _any_data_received(self):
        return self.received_buffer.tell() != 0

    def _get_received_data(self):
        result = self.received_buffer.getvalue()
        self.received_buffer.truncate(0)
        self.received_buffer.seek(0)
        return result

    def _check_status_code(self):
        if self.status_code == 0:
            self.status_code = self.curl.getinfo(pycurl.HTTP_CODE)
        if self.status_code != 0 and self.status_code != httplib.OK:
            raise urllib2.HTTPError(self.url, self.status_code, None, None, None)

    def _perform_on_curl(self):
        while True:
            ret, num_handles = self.curlmulti.perform()
            if ret != pycurl.E_CALL_MULTI_PERFORM:
                break
        return num_handles

    def _iter_chunks(self):
        while True:
            remaining = self._perform_on_curl()
            if self._any_data_received():
                self._check_status_code()
                yield self._get_received_data()
            if remaining == 0:
                break
            self.curlmulti.select(self.SELECT_TIMEOUT)

        self._check_status_code()
        self._check_curl_errors()

    def _check_curl_errors(self):
        for f in self.curlmulti.info_read()[2]:
            raise pycurl.error(*f[1:])

    def iter_lines(self):
        chunks = self._iter_chunks()
        return self._split_lines_from_chunks(chunks)

    @staticmethod
    def _split_lines_from_chunks(chunks):
        #same behaviour as requests' Response.iter_lines(...)

        pending = None
        for chunk in chunks:

            if pending is not None:
                chunk = pending + chunk
            lines = chunk.splitlines(True)

            if lines and lines[-1] and chunk and lines[-1][-1] == chunk[-1]:
                pending = lines.pop()
            else:
                pending = None

            for line in lines:
                yield line

        if pending is not None:
            yield pending


class DownloadData(APIView):
    def get(self, request):
        
        def write(req):
            for i in req.iter_lines():
                yield i
        
        if os.path.exists('/tmp/cookiefile'):
            os.remove('/tmp/cookiefile')
            
        req = CurlHTTPStream('https://landsat-ds.eo.esa.int/download/LANDSAT/WRS/0020/0246//LS05_RKSE_TM__GEO_1P_20060726T173517_20060726T173545_119154_0020_0246_409B.ZIP')
        for i in req.iter_lines():
            pass
        
        req = CurlHTTPStream('https://eo-sso-idp.eo.esa.int:443/idp/umsso20/login?null', login=True)
        response = StreamingHttpResponse(write(req))
        response['Content-Disposition'] = 'attachment; filename=LS05_RKSE_TM__GEO_1P_20060726T173517_20060726T173545_119154_0020_0246_409B.ZIP'
        return response


class DownloadDataSentinel(APIView):
    def get_download_url(self, pk, scene_id):
        with open(settings.MEDIA_ROOT + 'cache/satdata/satdata_all_' + str(pk) + '.json', 'r') as f:
            data = json.load(f)
            for scene in data['features']:
                if scene_id == scene['properties']['id']:
                    return scene['properties']['download_url']

    def get_vendor_id(self, pk, scene_id):
        with open(settings.MEDIA_ROOT + 'cache/satdata/satdata_all_' + str(pk) + '.json', 'r') as f:
            data = json.load(f)
            for scene in data['features']:
                if scene_id == scene['properties']['id']:
                    return scene['properties']['vendor_product_id']
                    
    def get(self, request, pk):
        
        def write(req):
            for i in req.iter_content(chunk_size=1024*8):
                yield i
        
        scene_id = request.query_params.get('scene')        
        
        if scene_id.startswith('S1'):
            download_url = self.get_download_url(pk, scene_id)
            
        if scene_id.startswith('S2'):
            scene_id = self.get_vendor_id(pk, scene_id)
            req = requests.get('https://scihub.copernicus.eu/dhus/search?q=%s&format=json' % scene_id, verify=False, auth=(settings.ESA_DATAHUB_USER, settings.ESA_DATAHUB_PASSWORD))
            if req.status_code == 200:
                data = req.json()
                if 'entry' in data['feed']:
                    id = data['feed']['entry']['id']
                    download_url = "https://scihub.copernicus.eu/dhus/odata/v1/Products('%s')/$value" % id
                else:
                    raise Exception('Could not find data')
            else:
                raise Exception('broken')
        
        filename = scene_id + '.zip'
        req = requests.get(download_url, stream=True, verify=False, auth=(settings.ESA_DATAHUB_USER, settings.ESA_DATAHUB_PASSWORD))
        response = StreamingHttpResponse(write(req))
        response['Content-Disposition'] = 'attachment; filename=%s' % filename
        return response
