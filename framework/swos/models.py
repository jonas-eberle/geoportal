from django.db import models
from django.contrib.auth.models import User, Group
from django.http import Http404, HttpResponse
from rest_framework import serializers
from django.contrib.gis.db import models

from layers.models import Layer
from webgis import settings

import os
import json
import requests

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
    image_url = models.CharField(max_length=200, blank=True, null=True)
    image_desc = models.TextField(blank=True, null=True)
    
    def __unicode__(self):
        return u"%s" %(self.name)

    @property
    def identifier(self):
        return "%s_%s" % (self.country.replace(' ', '-'), self.short_name)
    
    @property
    def count_images(self):
        return len(self.panoramio()['photos'])
    
    @property
    def count_videos(self):
        return len(self.youtube())
    
    @property
    def count_satdata(self):
        data = self.satellitedata()
        count = 0
        for sat in data:
            count += sat['count']
        return count    
    
    def satellitedata(self, forceUpdate=False):
        if os.path.isfile(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.json') and forceUpdate == False:
            with open(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.json', 'r') as f:
                data = json.load(f)
                return data
        else:
            data = []
            
            from . import sentinel_api_search as api
            sentinel = None
            sentinel = api.SentinelDownloader('USER_ANPASSEN', 'PASSWD_ANPASSEN', api_url='https://scihub.copernicus.eu/dhus/')
            sentinel.set_geometries(str(self.geom.wkt))
            sentinel.search('S1A*', min_overlap=0.01, productType='GRD', sensoroperationalmode='IW')
            s1_sum = sentinel.get_summary()
            data.append({'sensor': 'Sentinel-1A (GRD,IW)', 'count': int(s1_sum['count']), 'begindate': int(s1_sum['begindate']), 'enddate': int(s1_sum['enddate'])})
            sentinel.clean()
            
            sentinel.search('S2A*', min_overlap=0.01)
            s2_sum = sentinel.get_summary()
            data.append({'sensor': 'Sentinel-2A', 'count': int(s2_sum['count']), 'begindate': int(s2_sum['begindate']), 'enddate': int(s2_sum['enddate'])})
            sentinel.clean()
            
            import psycopg2
            import psycopg2.extras
            conn = psycopg2.connect("dbname=landsat user=ANPASSEN password=ANPASSEN")
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
    
    def generateSatelliteDataStatistics(self, forceUpdate=True):        
        import psycopg2
        import psycopg2.extras
        conn = psycopg2.connect("dbname=landsat user=ANPASSEN password=ANPASSEN")
        cur = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)
        sql = "select count(sceneid) as counter, satellitenumber, year from landsat where ST_Intersects(%s::geometry, the_geom) GROUP BY satellitenumber, year ORDER BY year ASC;"
        wkt = 'SRID=4326;'+self.geom.wkt
        cur.execute(sql, (wkt,))
        #print cur.query
        stats = {}
        for line in cur.fetchall():
            if line.satellitenumber == None:
                continue
            if int(line.year) not in stats:
                stats[int(line.year)] = {'LANDSAT_1': 0,'LANDSAT_2': 0,'LANDSAT_3': 0,'LANDSAT_4': 0,'LANDSAT_5': 0,'LANDSAT_7': 0,'LANDSAT_8': 0, 'SENTINEL_1A': 0, 'SENTINEL_2A': 0}
            stats[int(line.year)][line.satellitenumber.strip()] = int(line.counter)
        
        cur.close()
        conn.close()
        
        from . import sentinel_api_search as api
        sentinel = None
        sentinel = api.SentinelDownloader('USER_ANPASSEN', 'PASSWD_ANPASSEN', api_url='https://scihub.copernicus.eu/dhus/')
        sentinel.set_geometries(str(self.geom.wkt))
        sentinel.search('S1A*', min_overlap=0.01, productType='GRD', sensoroperationalmode='IW')
        s1_sum = sentinel.get_summary_by_year()
        sentinel.clean()
        for i in s1_sum:
            if i not in stats:
                stats[i] = {'LANDSAT_1': 0,'LANDSAT_2': 0,'LANDSAT_3': 0,'LANDSAT_4': 0,'LANDSAT_5': 0,'LANDSAT_7': 0,'LANDSAT_8': 0, 'SENTINEL_1A': 0, 'SENTINEL_2A': 0}
            stats[i]['SENTINEL_1A'] = s1_sum[i]
        
        sentinel.search('S2A*', min_overlap=0.01)
        s2_sum = sentinel.get_summary_by_year()
        sentinel.clean()
        for i in s2_sum:
            if i not in stats:
                stats[i] = {'LANDSAT_1': 0,'LANDSAT_2': 0,'LANDSAT_3': 0,'LANDSAT_4': 0,'LANDSAT_5': 0,'LANDSAT_7': 0,'LANDSAT_8': 0, 'SENTINEL_1A': 0, 'SENTINEL_2A': 0}
            stats[i]['SENTINEL_2A'] = s2_sum[i]
            
        data = []
        for i in xrange(min(stats), max(stats)+1):
            if i in stats:
                item = stats[i]
                data.append([i, item['LANDSAT_1'], item['LANDSAT_2'], item['LANDSAT_3'], item['LANDSAT_4'], item['LANDSAT_5'], item['LANDSAT_7'], item['LANDSAT_8'], item['SENTINEL_1A'], item['SENTINEL_2A']])
            else:
                data.append([i, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        
        import pandas as pd
        df2 = pd.DataFrame(data, columns=['year', 'LANDSAT_1', 'LANDSAT_2', 'LANDSAT_3', 'LANDSAT_4', 'LANDSAT_5', 'LANDSAT_7', 'LANDSAT_8', 'SENTINEL_1A', 'SENTINEL_2A'])
        df2.set_index('year',inplace=True)
        
        import matplotlib.pyplot as plt
        plt.clf()
        fig = plt.figure(dpi=150)
        ax = df2.plot(kind='bar', stacked=True, colormap='nipy_spectral')
        ax.set_title('Satellite data availability for '+self.name, y=1.04)
        ax.set_xlabel('Years', fontsize=9)
        ax.set_ylabel('Number of satellite scenes', fontsize=9)
        ax.legend(loc=2,prop={'size':8})
        plt.xticks(fontsize=8)  
        plt.yticks(fontsize=8)
        plt.figtext(0.5, 0.915, 'Please note: Scenes are not filtered by cloud coverage!', fontsize=8, horizontalalignment='center')
        plt.figtext(0.90, -0.0025, 'Created by EU H2020 SWOS project on 2016-09-08', fontsize=6, horizontalalignment='right')
        
        fig = plt.gcf()
        fig.set_size_inches(12, 6, forward=True)
        if os.path.exists(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.png'):
            os.remove(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.png')
        plt.savefig(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.png', dpi=150, bbox_inches='tight')
        plt.clf()
        #plt.close(fig)
        return True
    
    def getLandsatData(self, sensor='OLI_TIRS', utmZone=30, watershed=False):
        geom = self.geom.wkt
        ex = self.geom.extent
        if watershed == True:
            watershedItem = Product.objects.get(name='Watershed')
            layer = WetlandLayer.objects.filter(wetland=self, product=watershedItem)
            if len(layer) > 0:
                layer = layer[0]
                ex = [layer.west, layer.south, layer.east, layer.north]
                geom = 'POLYGON((%s %s, %s %s, %s %s, %s %s, %s %s))' % (layer.west, layer.south, layer.west, layer.north, layer.east, layer.north, layer.east, layer.south, layer.west, layer.south)
                print str(ex)
                print geom
        
        import psycopg2
        import psycopg2.extras
        conn = psycopg2.connect("dbname=landsat user=ANPASSEN password=ANPASSEN")
        cur = conn.cursor(cursor_factory=psycopg2.extras.NamedTupleCursor)
        sql = "select sceneid, acquisitiondate, satellitenumber, utm_zone from landsat where ST_Intersects(%s::geometry, the_geom) AND sensor = %s ORDER BY acquisitiondate ASC;"
        wkt = 'SRID=4326;'+geom
        cur.execute(sql, (wkt,sensor,))
        scenes = dict()
        for line in cur.fetchall():
            name = line.sceneid.strip()
            identifier = name[0:3]
            if identifier not in scenes:
                scenes[identifier] = []
            scenes[identifier].append(name)
            #scenes.append({'sceneid': line.sceneid.strip(), 'acquisitiondate': line.acquisitiondate})
        cur.close()
        conn.close()
        
        mapSensors = dict(LC8="olitirs8", LE7="etm7", LT4="tm4", LT5="tm5")
        
        orderRequest = {}
        orderRequest['projection'] = {"utm": { "zone": utmZone, "zone_ns": "north"}}
        orderRequest['image_extents'] = {"north": ex[3], "south": ex[1], "east": ex[2], "west": ex[0], "units": "dd"}
        orderRequest['format'] = "gtiff"
        
        for satellite in scenes:
            inputs = scenes[satellite]
            orderRequest[mapSensors[satellite]] = { "inputs": inputs, "products": ["toa", "cloud"] }
        
        print json.dumps(orderRequest)
        
        espa_user = 'ANPASSEN'
        espa_passwd = 'ANPASSEN'
        r = requests.post('https://espa.cr.usgs.gov/api/v0/order', data=json.dumps(orderRequest), auth=(espa_user, espa_passwd), verify=False)
        result = r.json()
        print result
        if result['status'] == 400:
            print result['message']
            if 'Inputs Not Available' in result['message']:
                print 'Need to delete some scenes from order list'
                for satellite in scenes:
                    orderRequest[mapSensors[satellite]]['inputs'] = [j for j in orderRequest[mapSensors[satellite]]['inputs'] if j not in result['message']['Inputs Not Available']]
                r = requests.post('https://espa.cr.usgs.gov/api/v0/order', data=json.dumps(orderRequest), auth=(espa_user, espa_passwd), verify=False)
                result = r.json()
                
        return result
    
    def checkESPAOrder(self, orderid, type='order-status'):
        types = ['order-status', 'order', 'item-status']
        if type not in types:
            raise Exception('Please use one of "order-status", "order", or "item-status" as type attribute!')
        
        espa_user = 'ANPASSEN'
        espa_passwd = 'ANPASSEN'
        r = requests.get('https://espa.cr.usgs.gov/api/v0/'+type+'/'+orderid, auth=(espa_user, espa_passwd), verify=False)
        return r.json()
    
    def downloadESPAOrder(self, orderid, downloadPath):
        espa_user = 'ANPASSEN'
        espa_passwd = 'ANPASSEN'
        
        from urlparse import urlparse
        from os.path import basename
        
        order = self.checkESPAOrder(orderid, type='item-status')
        datasets = order['orderid'][orderid]
        downloaded = []
        for data in datasets:
            if data['status'] == 'complete':
                url = data['product_dload_url']
                url_parsed = urlparse(url)
                filename = basename(url_parsed.path)
                filepath = os.path.join(downloadPath, filename)
                if not os.path.exists(filepath) and not os.path.exists(os.path.join(downloadPath, 'temp', filename)):
                    print 'Downloading '+filepath
                    r = requests.get(url, auth=(espa_user, espa_passwd), verify=False)
                    if r.status_code == 200:
                        f = open(filepath, 'wb')
                        f.write(r.content)
                        f.close()
                        downloaded.append(data['name'])
        
        return downloaded
    
    def extractESPAOrder(self, downloadPath, outputPath):
        if not os.path.exists(outputPath):
            os.mkdirs(outputPath)
        
        tempPath = os.path.join(downloadPath, 'temp')
        if not os.path.exists(tempPath):
            os.mkdirs(tempPath)        
        
        import glob
        os.chdir(downloadPath)
        files = glob.glob('*.tar.gz')
        
        import tarfile
        import subprocess
        import shutil
        for file in files:
            print 'Extracting '+file
            tar = tarfile.open(file, "r:gz")
            folder = os.path.join(downloadPath, file[0:-7])
            tar.extractall(folder)
            tar.close()
            os.chdir(folder)
            toaFiles = glob.glob('*_toa_b*.tif')
            identifier, type, band = toaFiles[0].split('_')
            subprocess.call('gdalbuildvrt -vrtnodata -9999 -o %s_toa.vrt -separate *_toa_b*.tif' % identifier, shell=True)
            subprocess.call('gdal_translate -of GTiff %s_toa.vrt %s_toa.tif' % (identifier, identifier), shell=True)
            shutil.copy2(identifier+'.xml', outputPath)
            shutil.copy2(identifier+'_toa.tif', outputPath)
            shutil.copy2(identifier+'_cfmask.tif', outputPath)
            shutil.copy2(identifier+'_cfmask_conf.tif', outputPath)
            os.chdir(downloadPath)
            shutil.rmtree(folder)
            shutil.copy2(file, tempPath)
            os.remove(file)
    
    def generateImages(self, inputPath):
        import glob
        os.chdir(inputPath)
        files = glob.glob("*_toa.tif")
        from datetime import datetime
        from osgeo import gdal
        import numpy as np
        f = open('files.csv','wb')
        f_filtered = open('files_filtered.csv','wb')
        for file in files:
            identifier = file[0:-4]
            date = datetime.strptime(file[9:16], '%Y%j').strftime('%Y-%m-%d')
            ds = gdal.Open(file.replace('_toa', '_cfmask'))
            array = np.array(ds.GetRasterBand(1).ReadAsArray())
            ds = None
            cloudcoverage = len(array[array==4])/float(array.size)
            if cloudcoverage < 0.33:
                f_filtered.write(identifier+'|'+date+'|'+str(cloudcoverage)+'\n')
            f.write(identifier+'|'+date+'|'+str(cloudcoverage)+'\n')
        f.close()
        f_filtered.close()
        
        #import subprocess
        # Create grass mapset and location
        #subprocess.call('grass70 -e -c %s /home/ANPASSEN/grassdata/wetland_%s' % (files[0], self.id), shell=True)
        #subprocess.call('grass70 -e -c /home/ANPASSEN/grassdata/wetland_%s/landsat' % (self.id), shell=True) 

    def geoss(self, start=1, max=10):
        if os.path.isfile(settings.MEDIA_ROOT+'cache/geoss_'+str(self.id)+'.json') and forceUpdate == False:
            with open(settings.MEDIA_ROOT+'cache/geoss_'+str(self.id)+'.json', 'r') as f:
                layers = json.load(f)
        else:
            ex = self.geom.extent
            query = {"where":{"south":ex[1],"west":ex[0],"north":ex[3],"east":ex[2]},"when":{"from":"1990-01-01","to":"2016-12-31"},"what":"","who":[],"sources":[],"searchId":"","start":start,"pageSize":max,"timeout":10000,"searchFields":"title,keyword","spatialRelation":"CONTAINS","termFrequency":"keyword,format,protocol,source","extensionRelation":""}

            headers = {'Content-type': 'application/json', 'Accept': 'application/json'}
            layers = requests.post('http://api.eurogeoss-broker.eu/dab/services/api-rest/datasets', data=json.dumps(query), headers=headers)
            with open(settings.MEDIA_ROOT+'cache/geoss_'+str(self.id)+'.json','w') as f:
                json.dump(layers, f)
        return layers
    
    def panoramio(self, start=0, max=-1, forceUpdate=False):
        if os.path.isfile(settings.MEDIA_ROOT+'cache/panoramio_'+str(self.id)+'.json') and forceUpdate == False:
            with open(settings.MEDIA_ROOT+'cache/panoramio_'+str(self.id)+'.json', 'r') as f:
                photos = json.load(f)
        else:
            return {'photos':[]}
            ex = self.geom.extent
            import pynoramio as py
            photos = py.Pynoramio().get_from_area(ex[1], ex[0], ex[3], ex[2], 'square')
            with open(settings.MEDIA_ROOT+'cache/panoramio_'+str(self.id)+'.json','w') as f:
                json.dump(photos, f)
        
        images = photos['photos']
        if max > -1 and (start+max) < len(images):
            photos['photos'] = images[start:start+max] 
        else:
            photos['photos'] = images[start:]
        return photos
    
    def youtube(self, start=0, max=-1, forceUpdate=False):
        if os.path.isfile(settings.MEDIA_ROOT+'cache/youtube_'+str(self.id)+'.json') and forceUpdate == False:
            with open(settings.MEDIA_ROOT+'cache/youtube_'+str(self.id)+'.json', 'r') as f:
                videos = json.load(f)
        else:
            from apiclient.discovery import build
            DEVELOPER_KEY = "ANPASSEN"
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
        
        if max > -1 and (start+max) < len(videos):
            return videos[start:start+max]
        else:
            return videos[start:]
            

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    wetlands = models.ManyToManyField(Wetland, blank=True, related_name='swos_product_wetlands', verbose_name="Wetlands")
    short_name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    
    def __unicode__(self):
        return u"%s" %(self.name)

class Indicator(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    wetlands = models.ManyToManyField(Wetland, blank=True, related_name='swos_indicator_wetlands', verbose_name="Wetlands")
    products = models.ManyToManyField(Product, blank=True, related_name='swos_indicator_products', verbose_name="Products")
    order = models.PositiveIntegerField(default=0)
    
    def __unicode__(self):
        return u"%s" %(self.name)

class WetlandLayer(Layer):
    wetland = models.ForeignKey(Wetland, related_name="layer_wetland", verbose_name="Wetland", blank=True, null=True)
    product = models.ForeignKey(Product, related_name="layer_product", verbose_name="Product", blank=True, null=True)
    indicator = models.ForeignKey(Indicator, related_name="layer_indicator", verbose_name="Indicator", blank=True, null=True)

#import layers
#layers.models.Layer = WetlandLayer

#models.ForeignKey(Wetland, related_name="layer_wetland", verbose_name="Wetland", blank=True, null=True).contribute_to_class(Layer, 'layer_wetland')
