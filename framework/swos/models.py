from django.db import models
from django.contrib.auth.models import User, Group
from django.http import Http404, HttpResponse
from rest_framework import serializers
from django.contrib.gis.db import models

from layers.models import Layer
from webgis import settings

import os
import json

# Create your models here.
class Wetland(models.Model):
    name = models.CharField(max_length=200)
    geom = models.MultiPolygonField()
    description = models.TextField(blank=True)
    country = models.CharField(max_length=200)
    geo_scale = models.CharField(max_length=200, blank=True)
    size = models.FloatField(blank=True)
    short_name = models.CharField(max_length=200, blank=True, null=True)
    partner = models.CharField(max_length=200, blank=True, null=True)
    
    def __unicode__(self):
        return u"%s" %(self.name)
    
    def satellitedata(self):
        return []
        if os.path.isfile(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.json'):
            with open(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.json', 'r') as f:
                data = json.load(f)
                return data
        else:
            data = []
            
            from . import sentinel_api_search as api
            sentinel = api.SentinelDownloader('jeberle', 'jonas', api_url='https://scihub.copernicus.eu/dhus/')
            sentinel.set_geometries(str(self.geom.wkt))
            sentinel.search('S1A*', min_overlap=0.01, productType='GRD', sensoroperationalmode='IW')
            s1_sum = sentinel.get_summary()
            data.append({'sensor': 'Sentinel-1A (GRD,IW)', 'count': int(s1_sum['count']), 'begindate': int(s1_sum['begindate']), 'enddate': int(s1_sum['enddate'])})
            
            sentinel.clean()
            sentinel.search('S2A*', min_overlap=0.01)
            s2_sum = sentinel.get_summary()
            data.append({'sensor': 'Sentinel-2A', 'count': int(s2_sum['count']), 'begindate': int(s2_sum['begindate']), 'enddate': int(s2_sum['enddate'])})
            
            import psycopg2
            import psycopg2.extras
            conn = psycopg2.connect("dbname=landsat user=sibessc password=bbAh6RRv")
            cur = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)
            sql = "select sensor, count(sceneid), EXTRACT(YEAR from min(acquisitiondate)) as begindate, EXTRACT(YEAR FROM max(acquisitiondate)) as enddate from landsat where ST_Intersects(%s::geometry, the_geom) GROUP by sensor ORDER BY enddate DESC, begindate DESC;"
            wkt = 'SRID=4326;'+self.geom.wkt
            cur.execute(sql, (wkt,))
            for line in cur.fetchall():
                data.append({'sensor': line.sensor.strip(), 'count': int(line.count), 'begindate': int(line.begindate), 'enddate': int(line.enddate)})
            cur.close()
            conn.close()
            
            with open(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.json','w') as f:
                json.dump(data, f)
            return data
    
    def panoramio(self):
        return []
        if os.path.isfile(settings.MEDIA_ROOT+'cache/panoramio_'+str(self.id)+'.json'):
            with open(settings.MEDIA_ROOT+'cache/panoramio_'+str(self.id)+'.json', 'r') as f:
                photos = json.load(f)
                return photos
        else:
            ex = self.geom.extent
            import pynoramio as py
            photos = py.Pynoramio().get_from_area(ex[1], ex[0], ex[3], ex[2], 'square')
            with open(settings.MEDIA_ROOT+'cache/panoramio_'+str(self.id)+'.json','w') as f:
                json.dump(photos, f)
            return photos
    
    def youtube(self):
        return []
        if os.path.isfile(settings.MEDIA_ROOT+'cache/youtube_'+str(self.id)+'.json'):
            with open(settings.MEDIA_ROOT+'cache/youtube_'+str(self.id)+'.json', 'r') as f:
                videos = json.load(f)
                return videos
        else:
            from apiclient.discovery import build
            DEVELOPER_KEY = "AIzaSyA_DlmClJEVqjroE5VWgWmtLR5RaKIfK68"
            PRE_URL = "https://www.youtube.com/watch?v="
            youtube = build('youtube', 'v3', developerKey=DEVELOPER_KEY)
            videos = []
            i=0
            while True:
                if i==0:
                    response = youtube.search().list(q=self.name+' wetland',type="video",part="id,snippet",maxResults=50).execute()
                else:
                    response = youtube.search().list(q=self.name+' wetland',type="video",part="id,snippet",maxResults=50,pageToken=response['nextPageToken']).execute()
                for vid in response['items']:
                    video = {'id': vid['id']['videoId'], 'img': vid['snippet']['thumbnails']['default']['url'], 'title': vid['snippet']['title'], 'url': PRE_URL+vid['id']['videoId']}
                    videos.append(video)
                if 'nextPageToken' not in response:
                    break
                i = i+1
            with open(settings.MEDIA_ROOT+'cache/youtube_'+str(self.id)+'.json','w') as f:
                json.dump(videos, f)
            return videos

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    wetlands = models.ManyToManyField(Wetland, blank=True, related_name='swos_product_wetlands', verbose_name="Wetlands")
    short_name = models.CharField(max_length=100)
    
    def __unicode__(self):
        return u"%s" %(self.name)

class Indicator(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    wetlands = models.ManyToManyField(Wetland, blank=True, related_name='swos_indicator_wetlands', verbose_name="Wetlands")
    products = models.ManyToManyField(Product, blank=True, related_name='swos_indicator_products', verbose_name="Products")
    
    def __unicode__(self):
        return u"%s" %(self.name)

class WetlandLayer(Layer):
    wetland = models.ForeignKey(Wetland, related_name="layer_wetland", verbose_name="Wetland", blank=True, null=True)
    product = models.ForeignKey(Product, related_name="layer_product", verbose_name="Product", blank=True, null=True)
    indicator = models.ForeignKey(Indicator, related_name="layer_indicator", verbose_name="Indicator", blank=True, null=True)

#import layers
#layers.models.Layer = WetlandLayer

#models.ForeignKey(Wetland, related_name="layer_wetland", verbose_name="Wetland", blank=True, null=True).contribute_to_class(Layer, 'layer_wetland')
