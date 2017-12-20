from django.db import models
from django.contrib.auth.models import User, Group
from django.http import Http404, HttpResponse
from rest_framework import serializers
from django.contrib.gis.db import models
from django.utils.html import format_html
from django_thumbs.db.models import ImageWithThumbsField
from swos.search_es import LayerIndex, ExternalDatabaseIndex, WetlandIndex

from layers.models import Layer, ISOcodelist, KeywordInline, Contact
from webgis import settings


import os
import json
import requests

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt


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
    site_type = models.CharField(max_length=200, blank=True, null=True)
    ecoregion = models.CharField(max_length=200, blank=True, null=True)
    wetland_type = models.CharField(max_length=200, blank=True, null=True)
    service_case = models.CharField(max_length=200, blank=True, null=True)
    image_url = models.CharField(max_length=200, blank=True, null=True)
    image_desc = models.TextField(blank=True, null=True)
    video_keywords = models.CharField(max_length=200, blank=True, null=True)
    
    def __unicode__(self):
        return u"%s" %(self.name)

    @property
    def identifier(self):
        return "%s_%s" % (self.country.replace(' ', '-'), self.short_name)
    
    @property
    def products(self):
        layers = WetlandLayer.objects.filter(wetland_id=self.id,publishable=True)
        products = set()
        for l in layers:
            products.add(l.product.short_name)
        return list(products)
    
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
        if os.path.isfile(settings.MEDIA_ROOT+'cache/satdata/satdata_all_'+str(self.id)+'.table.json') and forceUpdate == False:
            with open(settings.MEDIA_ROOT+'cache/satdata/satdata_all_'+str(self.id)+'.table.json', 'r') as f:
                import json
                data = json.load(f)
                return data
        else:
            data = []
            return data
    
    def generateSatelliteDataStatistics(self, forceUpdate=True):        
        stats = {}
        stats_table = []
        
        import pandas as pd
        import requests, json
        import datetime as dt
        login_url = 'https://earthexplorer.usgs.gov/inventory/json/v/1.4.0/login'
        search_params = {
            "username":settings.EARTH_EXPLORER_USER,
            "password":settings.EARTH_EXPLORER_PASSWORD,
            "catalogId":"EE"
        }
        
        login = requests.post(url=login_url, data={'jsonRequest':json.dumps(search_params)}).json()
        api_key = login['data']
        
        max_results = 100        
        search_url = 'https://earthexplorer.usgs.gov/inventory/json/v/1.4.0/search'
        search_params = {
             'apiKey': api_key,
             'includeUnknownCloudCover': True,
             'minCloudCover': 0,
             'maxCloudCover': 100,
             'maxResults': max_results,
             'startingNumber': 1,
             'sortOrder':'ASC'
        }
        search_params['spatialFilter'] = {
             "filterType":"mbr",
             "lowerLeft":{'latitude': self.geom.extent[1],'longitude': self.geom.extent[0]},
             "upperRight":{'latitude': self.geom.extent[3], 'longitude': self.geom.extent[2]}
        }
        
        from shapely.wkt import loads
        geom = loads(self.geom.wkt)
        
        from shapely.geometry import Polygon, shape
        collections = ['LANDSAT_8', 'LSR_LANDSAT_ETM_C1', 'LSR_LANDSAT_TM_C1', 'LANDSAT_MSS']
        collections = ['LANDSAT_8_C1', 'LANDSAT_ETM_C1', 'LANDSAT_TM_C1', 'LANDSAT_MSS']
        landsat_results_all = []
        print 'Search for Landsat data'
        for col in collections:
            print col
            landsat_results_col = []
            search_params['datasetName'] = col
            print search_params
            startingNumber = 1
            while startingNumber > 0:
                search_params['startingNumber'] = startingNumber
                print 'startingNumber: '+str(startingNumber)
                search = requests.post(url=search_url, data={'jsonRequest':json.dumps(search_params)}).json()
                if search['data'] != None:
                    print 'totalHits: '+str(search['data']['totalHits'])
                    print 'nextRecord: '+str(search['data']['nextRecord'])
                    print 'lastRecord: '+str(search['data']['lastRecord'])
                    for item in search['data']['results']:
                        item['collection'] = col
                    landsat_results_all.extend(search['data']['results'])
                    landsat_results_col.extend(search['data']['results'])
                    if search['data']['nextRecord'] > search['data']['lastRecord']:
                        startingNumber = search['data']['nextRecord']
                    else:
                        startingNumber = -1
                        break
                else:
                    print search
                    return False
                        
            data = {}
            landsat_dates = []
            for scene in landsat_results_col:
                landsat_dates.append(dt.datetime.strptime(scene['acquisitionDate'], '%Y-%m-%d'))
                polygon = shape(scene['spatialFootprint'])
                if polygon.intersects(geom):
                    year = int(scene['acquisitionDate'].split('-')[0])
                    if year not in data:
                        data[year] = []
                    data[year].append(scene)
            
            stats_table.append({'sensor': col, 'count': len(landsat_results_col), 'begindate': min(landsat_dates).strftime('%Y'), 'enddate': max(landsat_dates).strftime('%Y')})
            
            for year in data:
                if year not in stats:
                    stats[year] = {'LANDSAT_MSS': 0,'LANDSAT_TM_C1': 0,'LANDSAT_ETM_C1': 0, 'LANDSAT_8_C1': 0,'SENTINEL_1': 0, 'SENTINEL_2': 0}
                stats[year][col] = len(data[year])
                
        
        with open(settings.MEDIA_ROOT+'cache/satdata_landsat_'+str(self.id)+'.json','w') as f:
            json.dump(landsat_results_all, f)
        
        df_landsat = pd.DataFrame(landsat_results_all, columns=['acquisitionDate','collection'])
        df_landsat['acquisitionDate'] =  pd.to_datetime(df_landsat['acquisitionDate'], format='%Y-%m-%d')
        df_landsat.columns = ['date', 'collection']
        
        print 'Search for Sentinel data'
        sentinel_results_all = []
        from . import sentinel_api_search as api
        sentinel = None
        sentinel = api.SentinelDownloader(settings.ESA_DATAHUB_USER, settings.ESA_DATAHUB_PASSWORD, api_url='https://scihub.copernicus.eu/dhus/')
        sentinel.set_geometries(str(self.geom.wkt))
        sentinel.search('S1A*', min_overlap=0.01, productType='GRD', sensoroperationalmode='IW')
        sentinel.search('S1B*', min_overlap=0.01, productType='GRD', sensoroperationalmode='IW')
        s1_sum = sentinel.get_summary()
        stats_table.append({'sensor': 'Sentinel-1 (GRD,IW)', 'count': int(s1_sum['count']), 'begindate': int(s1_sum['begindate']), 'enddate': int(s1_sum['enddate'])})
        s1_sum = sentinel.get_summary_by_year()
        scenes = sentinel.get_scenes()
        for item in scenes:
            item['collection'] = 'SENTINEL_1'
        sentinel_results_all.extend(scenes)
        sentinel.clean()
        
        for i in s1_sum:
            if i not in stats:
                stats[i] = {'LANDSAT_MSS': 0,'LANDSAT_TM_C1': 0,'LANDSAT_ETM_C1': 0, 'LANDSAT_8_C1': 0,'SENTINEL_1': 0, 'SENTINEL_2': 0}
            stats[i]['SENTINEL_1'] = s1_sum[i]
        
        sentinel.search('S2A*', min_overlap=0.01, productType='S2MSI1C')
        sentinel.search('S2B*', min_overlap=0.01, productType='S2MSI1C')
        s2_sum = sentinel.get_summary()
        stats_table.append({'sensor': 'Sentinel-2', 'count': int(s2_sum['count']), 'begindate': int(s2_sum['begindate']), 'enddate': int(s2_sum['enddate'])})
        s2_sum = sentinel.get_summary_by_year()
        scenes = sentinel.get_scenes()
        for item in scenes:
            item['collection'] = 'SENTINEL_2'
        sentinel_results_all.extend(scenes)
        sentinel.clean() 
        
        for i in s2_sum:
            if i not in stats:
                stats[i] = {'LANDSAT_MSS': 0,'LANDSAT_TM_C1': 0,'LANDSAT_ETM_C1': 0, 'LANDSAT_8_C1': 0,'SENTINEL_1': 0, 'SENTINEL_2': 0}
            stats[i]['SENTINEL_2'] = s2_sum[i]
        
        with open(settings.MEDIA_ROOT+'cache/satdata_'+str(self.id)+'.json','w') as f:
            json.dump(stats_table, f)
        
        with open(settings.MEDIA_ROOT+'cache/satdata_sentinel_'+str(self.id)+'.json','w') as f:
            json.dump(sentinel_results_all, f)
        
        df_sentinel = pd.DataFrame(sentinel_results_all, columns=['beginposition','collection'])
        df_sentinel['beginposition'] =  pd.to_datetime(df_sentinel['beginposition'], format='%Y-%m-%dT%H:%M:%S.%f')
        df_sentinel.columns = ['date', 'collection']
        
        jsonOutput = dict()
        df = pd.concat([df_landsat,df_sentinel])
        gb = df.groupby('collection')
        for g in gb.groups:
            sat = gb.get_group(g)
            sat = list(set(sat['date'].dt.strftime('%Y-%m-%d')))
            sat.sort()
            jsonOutput[g] = sat
            
        with open(settings.MEDIA_ROOT+'cache/satdata_dates_'+str(self.id)+'.json','w') as f:
            json.dump(jsonOutput, f)        
                
        data = []
        for i in xrange(min(stats), max(stats)+1):
            if i in stats:
                item = stats[i]
                data.append([i, item['LANDSAT_MSS'], item['LANDSAT_TM_C1'], item['LANDSAT_ETM_C1'], item['LANDSAT_8_C1'], item['SENTINEL_1'], item['SENTINEL_2']])
            else:
                data.append([i, 0, 0, 0, 0, 0, 0])
        
        df2 = pd.DataFrame(data, columns=['year', 'LANDSAT_MSS', 'LANDSAT_TM_C1', 'LANDSAT_ETM_C1', 'LANDSAT_8_C1', 'SENTINEL_1', 'SENTINEL_2'])
        df2.set_index('year',inplace=True)
        
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
        plt.figtext(0.90, -0.0025, 'Created by EU H2020 SWOS project on %s' % dt.date.today().strftime("%Y-%m-%d"), fontsize=6, horizontalalignment='right')
        
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

    def clean_panoramio(self):
        pano_file = settings.MEDIA_ROOT + 'cache/panoramio_' + str(self.id) + '.json'
        if os.path.exists(pano_file):
            data = json.loads(open(pano_file).read())
            import copy
            data_new = copy.deepcopy(data)
            data_new['photos'] = []

            import urllib
            for image in data['photos']:
                code = urllib.urlopen(image['photo_url']).getcode()
                print image['photo_url'] + ': ' + str(code)
                if code == 200:
                    data_new['photos'].append(image)

            data_new['count'] = len(data_new['photos'])
            f = open(pano_file, 'w')
            f.write(json.dumps(data_new))
            f.close()

    def youtube(self, start=0, max=-1, forceUpdate=False, writeResults=True):
        videos = []
        if forceUpdate == False:
            videos_obj = WetlandVideo.objects.filter(wetland=self)
            for vid in videos_obj:
                videos.append({'id': vid.youtube_id, 'img': vid.thumb_link, 'title': vid.name, 'url': vid.link})
        else:
            if self.video_keywords != None and self.video_keywords != '':
                keyword = self.video_keywords
            else:
                keyword = self.name+' wetland'
            
            keyword += ' '+self.country+' -Sale -Business -Sex'
            
            from apiclient.discovery import build
            DEVELOPER_KEY = "AIzaSyA_DlmClJEVqjroE5VWgWmtLR5RaKIfK68"
            PRE_URL = "https://www.youtube.com/watch?v="
            youtube = build('youtube', 'v3', developerKey=DEVELOPER_KEY)
            
            #1 - Film & Animation (e.g., motion picture)
            #15 - Pets & Animals
            #19 - Travel & Events
            #22 - People & Blogs
            #25 - News & Politics
            #27 - Education
            #28 - Science & Technology
            #29 - Non-profits & Activism
            categories = [15,19,22,25,27,28,29]
            for cat in categories:
                cat = str(cat)
                i=0
                while True:
                    if i==0:
                        response = youtube.search().list(q=keyword,type="video",videoCategoryId=cat,part="id,snippet",maxResults=50).execute()
                        #if len(response['items']) == 0:
                        #    keyword = self.name.replace(' ', '+')
                        #    response = youtube.search().list(q=keyword,type="video",videoCategoryId=cat,part="id,snippet",maxResults=50).execute()
                    else:
                        response = youtube.search().list(q=keyword,type="video",videoCategoryId=cat,part="id,snippet",maxResults=50,pageToken=response['nextPageToken']).execute()
                    for vid in response['items']:
                        video = {'id': vid['id']['videoId'], 'date': vid['snippet']['publishedAt'], 'cat': cat, 'img': vid['snippet']['thumbnails']['default']['url'], 'title': vid['snippet']['title'], 'url': PRE_URL+vid['id']['videoId']}
                        videos.append(video)
                        video_obj = WetlandVideo(name=video['title'], description=vid['snippet']['description'], date=video['date'], source='YouTube', link=video['url'], thumb_link=video['img'], youtube_id=video['id'], youtube_cat=int(cat), wetland=self)
                        if 'channelTitle' in vid['snippet']:
                            video_obj.copyright = vid['snippet']['channelTitle']
                        video_obj.save()
                    if 'nextPageToken' not in response:
                        break
                    i = i+1
                    
            if writeResults:
                with open(settings.MEDIA_ROOT+'cache/youtube_'+str(self.id)+'.json','w') as f:
                    json.dump(videos, f)
        
        if max > -1 and (start+max) < len(videos):
            return videos[start:start+max]
        else:
            return videos[start:]

    def indexing(self):

        from django.core.serializers import serialize
        geom = json.loads(serialize('geojson', Wetland.objects.filter(id=self.id), geometry_field='geom', fields=('name',)))
        geometry = geom["features"][0]["geometry"]

        keywords = ['Wetland', ]
        for keyword in self.description.split(','):
            keywords.append(keyword.strip())

        ecoregions = []
        for ecoregion in self.ecoregion.split(','):
            ecoregions.append(ecoregion.strip())

        obj = WetlandIndex(
            meta={'id': self.id},
            title = self.name,
            category = 'wetland',
            keywords = keywords,
            wetland = self.name,
            country = self.country,
            partner = self.partner,
            ecoregion = ecoregion,
            geom = geometry
        )

        print obj
        obj.save()
        return obj.to_dict(include_meta=True)

    class Meta:
        ordering = ['name']


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
    short_name = models.CharField(max_length = 10)
    description = models.TextField(blank=True,)
    parent_indicator = models.ForeignKey("self",blank=True, null=True, verbose_name="Parent indicator")
    order = models.PositiveIntegerField(default=0)

    def __unicode__(self):
        return u"%s" %(self.name)

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ('name', 'description', 'short_name', 'parent_indicator')

class IndicatorValue(models.Model):
    time = models.DateField (blank=True, null=True, verbose_name="Time Begin")
    time_end  = models.DateField (blank=True, null=True, verbose_name="Time End (only for time intervals)")
    time_ref_parts = models.CharField("Date type (referring date parts)", max_length=30, default="Day", choices=(('Day','Day'),('Month','Month'), ('Year', 'Year')))
    value_absolut = models.FloatField(verbose_name="Absolut value")
    unit = models.CharField(max_length=10)
    value_percent = models.FloatField(verbose_name="Relative value (%)")
    nomenclature = models.CharField(max_length=10, blank=True, null=True)
    indicator = models.ForeignKey(Indicator, related_name="value_indicator", verbose_name="Indicator")
    wetland = models.ForeignKey(Wetland, blank=True, related_name='value_wetland', verbose_name="Wetland")

class IndicatorValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndicatorValue
        fields = ('name', 'value_absolut', 'unit', 'value_percent', 'time', 'time_end',  'time_ref_parts', 'nomenclature', 'indicator', 'wetland')

class WetlandLayer(Layer):
    wetland = models.ForeignKey(Wetland, related_name="layer_wetland", verbose_name="Wetland", blank=True, null=True)
    product = models.ForeignKey(Product, related_name="layer_product", verbose_name="Product", blank=True, null=True)
    indicator = models.ForeignKey(Indicator, related_name="layer_indicator", verbose_name="Indicator", blank=True, null=True)

    @property
    def alternate_title(self):
        wq_type = ''
        date_string = ''
        product = self.product.short_name
        if self.product.short_name in ['WQ']:
            wq_type = ' '.join(self.identifier.split('_')[2:5])
        elif self.product.short_name in ['LULC']:
            wq_type = self.identifier.split('_')[2]
            if self.date_begin.year == self.date_end.year:
                date_string = str(self.date_begin.year)
            else:
                date_string = ' '.join([str(self.date_begin.year), '/', str(self.date_end.year)])
        elif self.product.short_name in ['SWD']:
            wq_type = self.identifier.split('_')[2] + ' ' + self.identifier.split('_')[3]
            if self.date_begin.year == self.date_end.year:
                date_string = str(self.date_begin.year)
            else:
                date_string = ' '.join([str(self.date_begin.year), '/', str(self.date_end.year)])
        elif self.product.short_name in ['LULCC_S']:
            wq_type = self.identifier.split('_')[3] + ' ' + self.identifier.split('_')[4]
            if self.date_begin.year == self.date_end.year:
                date_string = str(self.date_begin.year)
            else:
                date_string = ' '.join([str(self.date_begin.year), '/', str(self.date_end.year)])
        elif self.product.short_name in ['FloodReg', 'InvDel']:
            wq_type = self.identifier.split('_')[2]
            if self.date_begin.year == self.date_end.year:
                date_string = str(self.date_begin.year)
            else:
                date_string = ' '.join([str(self.date_begin.year), '/', str(self.date_end.year)])
        elif self.product.short_name in ['LULCC_L']:
            wq_type = self.identifier.split('_')[3]
            date_string = ' '.join([str(self.date_begin.year), 'to', str(self.date_end.year)])
        elif self.product.short_name in ['LSTT']:
            date_string = ' '.join([str(self.date_begin.year), 'to', str(self.date_end.year)])
        elif self.product.short_name in ['SATDATA']:
            wq_type = self.identifier.split('_')[2].replace('S1', 'Sentinel-1').replace('S2', 'Sentinel-2') + ' ' + self.identifier.split('_')[3].replace('XX', 'VV VH').replace('-', ' ')
            date_string = str(self.date_begin.year)
            product = ''
        return ' '.join([product,wq_type, date_string])

    def indexing(self):

        indicator_name = []
        product_name = []
        if self.indicator:
            cat = "indicator"
            indicator_name = self.indicator.name

        elif self.product:
            cat = "product"
            product_name = self.product.name

        topic_cats = []
        for topic_cat in self.topicCategory.all():
            res = ISOcodelist.objects.get(pk=topic_cat.id)
            topic_cats.append(res.identifier)

        keywords = []
        for keyword in KeywordInline.objects.filter(layer=self.id):
            keywords.append(keyword.keyword)

        contact_name = []
        contact_org = []
        for contact in self.point_of_contacts.all():
            res = Contact.objects.get(pk=contact.id)
            contact_name.append(contact.first_name + " " + contact.last_name)
            contact_org.append(contact.organisation)
        for meta_contact in self.meta_contacts.all():
            res = Contact.objects.get(pk=contact.id)
            contact_name.append(contact.first_name + " " + contact.last_name)
            contact_org.append(contact.organisation)

        extent = {
            "type": "Polygon",
            "coordinates": [[[self.west,self.north],[self.east,self.north],[self.east,self.south],[self.west,self.south],[self.west,self.north]]]
        }

        obj = LayerIndex(
            meta={'id': self.id},
            title=self.title,
            category=cat,
            description=self.abstract,
            topiccat=topic_cats,
            keywords=keywords,
            wetland = self.wetland.name,
            product_name = product_name,
            indicator_name = indicator_name,
            contact_name = contact_name,
            contact_org = contact_org,
            date_begin=self.date_begin,
            date_end=self.date_end,
            lineage = self.meta_lineage,
            geom = extent
        )
        print obj
        obj.save()
        return obj.to_dict(include_meta=True)

class Category(models.Model):

    category = models.CharField(max_length=60)

class Country(models.Model):
    name = models.CharField(max_length=200)
    continent = models.CharField(max_length=200, blank=True)

    def __unicode__(self):
        return u"%s" % (self.name)

class ExternalDatabase(models.Model):
    LANG_CODES = (
        ('ab', 'Abkhazian'),
        ('aa', 'Afar'),
        ('af', 'Afrikaans'),
        ('ak', 'Akan'),
        ('sq', 'Albanian'),
        ('am', 'Amharic'),
        ('ar', 'Arabic'),
        ('an', 'Aragonese'),
        ('hy', 'Armenian'),
        ('as', 'Assamese'),
        ('av', 'Avaric'),
        ('ae', 'Avestan'),
        ('ay', 'Aymara'),
        ('az', 'Azerbaijani'),
        ('bm', 'Bambara'),
        ('ba', 'Bashkir'),
        ('eu', 'Basque'),
        ('be', 'Belarusian'),
        ('bn', 'Bengali'),
        ('bh', 'Bihari languages'),
        ('bi', 'Bislama'),
 #       ('nb', 'Bokmal, Norwegian; Norwegian Bokmal'),
        ('bs', 'Bosnian'),
        ('br', 'Breton'),
        ('bg', 'Bulgarian'),
        ('my', 'Burmese'),
        ('ca', 'Catalan; Valencian'),
        ('km', 'Central Khmer'),
        ('ch', 'Chamorro'),
        ('ce', 'Chechen'),
        ('ny', 'Chichewa; Chewa; Nyanja'),
        ('zh', 'Chinese'),
 #       ('cu', 'Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic'),
        ('cv', 'Chuvash'),
        ('kw', 'Cornish'),
        ('co', 'Corsican'),
        ('cr', 'Cree'),
        ('hr', 'Croatian'),
        ('cs', 'Czech'),
        ('da', 'Danish'),
 #       ('dv', 'Divehi; Dhivehi; Maldivian'),
        ('nl', 'Dutch; Flemish'),
        ('dz', 'Dzongkha'),
        ('en', 'English'),
        ('eo', 'Esperanto'),
        ('et', 'Estonian'),
        ('ee', 'Ewe'),
        ('fo', 'Faroese'),
        ('fj', 'Fijian'),
        ('fi', 'Finnish'),
        ('fr', 'French'),
        ('ff', 'Fulah'),
 #       ('gd', 'Gaelic; Scottish Gaelic'),
        ('gl', 'Galician'),
        ('lg', 'Ganda'),
        ('ka', 'Georgian'),
        ('de', 'German'),
        ('el', 'Greek, Modern (1453-)'),
        ('gn', 'Guarani'),
        ('gu', 'Gujarati'),
        ('ht', 'Haitian; Haitian Creole'),
        ('ha', 'Hausa'),
        ('he', 'Hebrew'),
        ('hz', 'Herero'),
        ('hi', 'Hindi'),
        ('ho', 'Hiri Motu'),
        ('hu', 'Hungarian'),
        ('is', 'Icelandic'),
        ('io', 'Ido'),
        ('ig', 'Igbo'),
        ('id', 'Indonesian'),
        ('ia', 'Interlingua (International Auxiliary Language Association)'),
        ('ie', 'Interlingue; Occidental'),
        ('iu', 'Inuktitut'),
        ('ik', 'Inupiaq'),
        ('ga', 'Irish'),
        ('it', 'Italian'),
        ('ja', 'Japanese'),
        ('jv', 'Javanese'),
        ('kl', 'Kalaallisut; Greenlandic'),
        ('kn', 'Kannada'),
        ('kr', 'Kanuri'),
        ('ks', 'Kashmiri'),
        ('kk', 'Kazakh'),
        ('ki', 'Kikuyu; Gikuyu'),
        ('rw', 'Kinyarwanda'),
        ('ky', 'Kirghiz; Kyrgyz'),
        ('kv', 'Komi'),
        ('kg', 'Kongo'),
        ('ko', 'Korean'),
        ('kj', 'Kuanyama; Kwanyama'),
        ('ku', 'Kurdish'),
        ('lo', 'Lao'),
        ('la', 'Latin'),
        ('lv', 'Latvian'),
        ('li', 'Limburgan; Limburger; Limburgish'),
        ('ln', 'Lingala'),
        ('lt', 'Lithuanian'),
        ('lu', 'Luba-Katanga'),
        ('lb', 'Luxembourgish; Letzeburgesch'),
        ('mk', 'Macedonian'),
        ('mg', 'Malagasy'),
        ('ms', 'Malay'),
        ('ms', 'Malay'),
        ('ml', 'Malayalam'),
        ('mt', 'Maltese'),
        ('gv', 'Manx'),
        ('mi', 'Maori'),
        ('mr', 'Marathi'),
        ('mh', 'Marshallese'),
        ('mn', 'Mongolian'),
        ('na', 'Nauru'),
        ('nv', 'Navajo; Navaho'),
        ('nd', 'Ndebele, North; North Ndebele'),
        ('nr', 'Ndebele, South; South Ndebele'),
        ('ng', 'Ndonga'),
        ('ne', 'Nepali'),
        ('se', 'Northern Sami'),
        ('no', 'Norwegian'),
#        ('nn', 'Norwegian Nynorsk; Nynorsk, Norwegian'),
        ('oc', 'Occitan (post 1500)'),
        ('oj', 'Ojibwa'),
        ('or', 'Oriya'),
        ('om', 'Oromo'),
        ('os', 'Ossetian; Ossetic'),
        ('pi', 'Pali'),
        ('pa', 'Panjabi; Punjabi'),
        ('fa', 'Persian'),
        ('pl', 'Polish'),
        ('pt', 'Portuguese'),
        ('ps', 'Pushto; Pashto'),
        ('qu', 'Quechua'),
        ('ro', 'Romanian; Moldavian; Moldovan'),
        ('rm', 'Romansh'),
        ('rn', 'Rundi'),
        ('ru', 'Russian'),
        ('sm', 'Samoan'),
        ('sg', 'Sango'),
        ('sa', 'Sanskrit'),
        ('sc', 'Sardinian'),
        ('sr', 'Serbian'),
        ('sn', 'Shona'),
        ('ii', 'Sichuan Yi; Nuosu'),
        ('sd', 'Sindhi'),
        ('si', 'Sinhala; Sinhalese'),
        ('sk', 'Slovak'),
        ('sl', 'Slovenian'),
        ('so', 'Somali'),
        ('st', 'Sotho, Southern'),
        ('es', 'Spanish; Castilian'),
        ('su', 'Sundanese'),
        ('sw', 'Swahili'),
        ('ss', 'Swati'),
        ('sv', 'Swedish'),
        ('tl', 'Tagalog'),
        ('ty', 'Tahitian'),
        ('tg', 'Tajik'),
        ('ta', 'Tamil'),
        ('tt', 'Tatar'),
        ('te', 'Telugu'),
        ('th', 'Thai'),
        ('bo', 'Tibetan'),
        ('ti', 'Tigrinya'),
        ('to', 'Tonga (Tonga Islands)'),
        ('ts', 'Tsonga'),
        ('tn', 'Tswana'),
        ('tr', 'Turkish'),
        ('tk', 'Turkmen'),
        ('tw', 'Twi'),
        ('ug', 'Uighur; Uyghur'),
        ('uk', 'Ukrainian'),
        ('ur', 'Urdu'),
        ('uz', 'Uzbek'),
        ('ve', 'Venda'),
        ('vi', 'Vietnamese'),
        ('vo', 'Volapuk'),
        ('wa', 'Walloon'),
        ('cy', 'Welsh'),
        ('fy', 'Western Frisian'),
        ('wo', 'Wolof'),
        ('xh', 'Xhosa'),
        ('yi', 'Yiddish'),
        ('yo', 'Yoruba'),
        ('za', 'Zhuang; Chuang'),
        ('zu', 'Zulu')
    )
    CONTINENT = (
        ('Global', 'Global'),
        ('Africa', 'Africa'),
        ('Antarctica', 'Antarctica'),
        ('Asia', 'Asia'),
        ('Australasia', 'Australasia'),
        ('Europe', 'Europe'),
        ('North America', 'North America'),
        ('South America', 'South America')
    )

    name = models.CharField(max_length=200)
    shortname = models.CharField(max_length=200)
    online_link = models.TextField(null=True)
    description = models.TextField(null=True)
    provided_information = models.TextField(blank=True)
    category = models.ManyToManyField(Category, blank=True)
    dataset_language = models.CharField(max_length=20, choices=LANG_CODES, default="en", blank=True, help_text="Language of the provided data")
    geoss_datasource_id = models.CharField(max_length=100, blank=True, null=True)
    continent = models.CharField(max_length=30, choices=CONTINENT, blank=True)
    country = models.ManyToManyField(Country, blank=True)
    wetland = models.ForeignKey(Wetland, related_name="external_wetland", verbose_name="Wetland", blank=True, null=True)

    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return u"%s" %(self.name)

    def indexing(self):

        countries = []
        for country in Country.objects.filter(id=self.id):
            countries.append(country.name)

        wetland = ""
        wetland_id = ""
        if self.wetland:
            wetland = self.wetland.name
            wetland_id = self.wetland.id

        obj = ExternalDatabaseIndex(
            meta={'id': self.id},
            name = self.name,
            category="external",
            provided_information = self.provided_information,
            description = self.description,
            link = self.online_link,
            continent = self.continent,
            country = countries,
            wetland = wetland,
            wetland_id = wetland_id
        )
        print obj
        obj.save()
        return obj.to_dict(include_meta=True)

class ExternalLayer(Layer):
    datasource = models.ForeignKey(ExternalDatabase, related_name="layer_datasource", verbose_name="External Datasbase", blank=True, null=True)

    def __unicode__(self):
        return u"%s" %(self.title)

    def indexing(self):

        topic_cats = []
        for topic_cat in self.topicCategory.all():
            res = ISOcodelist.objects.get(pk=topic_cat.id)
            topic_cats.append(res.identifier)

        keywords = []
        for keyword in KeywordInline.objects.filter(layer=self.id):
            keywords.append(keyword.keyword)

        contact_name = []
        contact_org = []
        for contact in self.point_of_contacts.all():
            res = Contact.objects.get(pk=contact.id)
            contact_name.append(contact.first_name + " " + contact.last_name)
            contact_org.append(contact.organisation)
        for meta_contact in self.meta_contacts.all():
            res = Contact.objects.get(pk=meta_contact.id)
            contact_name.append(meta_contact.first_name + " " + meta_contact.last_name)
            contact_org.append(meta_contact.organisation)

        extent = {
            "type": "Polygon",
            "coordinates": [[[self.west,self.north],[self.east,self.north],[self.east,self.south],[self.west,self.south],[self.west,self.north]]]
        }

        obj = LayerIndex(
            meta={'id': self.id},
            title=self.title,
            category="external",
            description=self.abstract,
            topiccat=topic_cats,
            keywords=keywords,
            contact_name=contact_name,
            contact_org=contact_org,
            date_begin = self.date_begin,
            date_end = self.date_end,
            lineage=self.meta_lineage,
            geom = extent
        )
        print obj
        obj.save()
        return obj.to_dict(include_meta=True)


class WetlandImage(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    copyright = models.CharField("Copyright / Owner", max_length=200, blank=True)
    date = models.DateField (blank=True, null=True)
    image = ImageWithThumbsField(upload_to='images/',  sizes=((125,125), (52, 52), (1300,1000), (1000, 1300)))
    wetland = models.ForeignKey(Wetland, related_name="image_wetland", verbose_name="Wetland", blank=True, null=True)

    def __unicode__(self):
        return u"%s" %(self.name)

    @property
    def image_tag(self):
        return format_html('<img src="{}" />'.format(self.image.url_125x125))

    @property
    def image_size(self):
        suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
        size = int(self.image.size)
        if size == 0: return '0 B'
        i = 0
        while size >= 1024 and i < len(str(size)) - 1:
            size /= 1024.
            i += 1
        f = ('%.2f' % size).rstrip('0').rstrip('.')
        return '%s %s' % (f, suffixes[i])

class WetlandVideo(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    copyright = models.CharField("Copyright / Owner", max_length=200, blank=True)
    date = models.DateTimeField(blank=True, null=True)
    source = models.CharField("Source", max_length=30, choices=(('YouTube','YouTube'),('Upload','Upload')))
    link = models.CharField("Link to external video", max_length=200, blank=True, null=True)
    thumb_link = models.CharField("Link to external thumbnail", max_length=200, blank=True, null=True)
    youtube_id = models.CharField("YouTube ID", max_length=20, blank=True, null=True)
    youtube_cat = models.IntegerField(blank=True, null=True)
    wetland = models.ForeignKey(Wetland, related_name="video_wetland", verbose_name="Wetland")
    
    categories = dict()
    categories[2] ='Cars & Vehicles'
    categories[23] ='Comedy'
    categories[27] ='Education'
    categories[24] ='Entertainment'
    categories[1] ='Film & Animation'
    categories[20] ='Gaming'
    categories[26] ='How-to & Style'
    categories[10] ='Music'
    categories[25] ='News & Politics'
    categories[29] ='Non-profits & Activism'
    categories[22] ='People & Blogs'
    categories[15] ='Pets & Animals'
    categories[28] ='Science & Technology'
    categories[17] ='Sport'
    categories[19] ='Travel & Events'
    
    @property
    def youtube_cat_name(self):
        return self.categories[self.youtube_cat]

    @property
    def image_tag(self):
        return format_html('<a href="{}" target="_blank"><img src="{}" width="200" border="0" /></a>'.format(self.link, self.thumb_link))
    
    def __unicode__(self):
        return self.name

class StoryLine(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)
    authors = models.TextField(null=True, blank=True)
    wetland = models.ForeignKey(Wetland, null=True)
    link_to_product = models.BooleanField(default="False", help_text="Storyline will be linked to a product instead of a wetland")
    story_line_file_name = models.CharField(max_length=50, blank=True, null=True, help_text="File name for download")
    story_line_file = models.FileField("Storyline file", upload_to='downloads', null=True, blank=True, help_text="Upload storyline as pdf file")
    active = models.BooleanField(default=False)

    def __unicode__(self):
        return u"%s" % (self.title)


class StoryLinePart(models.Model):
    headline = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image_name = models.CharField(max_length=200, null=True, blank=True)
    image_description = models.TextField(null=True, blank=True)
    image_copyright = models.CharField("Copyright / Owner", max_length=200, blank=True)
    image_date = models.DateField(blank=True, null=True)
    image = ImageWithThumbsField(upload_to='images/', sizes=((125, 125), (200, 300), (300, 200), (600, 400), (400, 600)), null=True, blank=True, help_text="To avoid cutting off parts of ou image please resize it in advance. Right position: max. 300px width; Bottom max. 600px.")
    image_position = models.CharField(max_length=20, choices=(("right", "right"), ("bottom","bottom")), default="right")
    wetland = models.ForeignKey(Wetland, help_text="Plaese click - Save and continue editing - to update the layer lists below")
    product_layer = models.ManyToManyField(WetlandLayer, blank=True)
    indicator_layer = models.ManyToManyField(WetlandLayer, blank=True, related_name="indicator_layer")
    external_layer = models.ManyToManyField(ExternalLayer, blank=True, related_name="indicator_layer")
    remove_layer = models.BooleanField(default="False", help_text="Remove added layer on the next step")
    west = models.FloatField("BBOX west coordinate", blank=True, null=True, help_text="e.g. -5,3")
    east = models.FloatField("BBOX east coordinate", blank=True, null=True, help_text="e.g. 10,5")
    north = models.FloatField("BBOX north coordinate", blank=True, null=True, help_text="e.g. 8,2")
    south = models.FloatField("BBOX south coordinate", blank=True, null=True, help_text="e.g. -3,9")

    def __unicode__(self):
        return u"%s" % (self.wetland.name + "_" + self.headline)

    @property
    def image_tag(self):
        if not self.image:
            return ""
        return format_html('<img src="{}" />'.format(self.image.url_125x125))

    @property
    def image_url_125(self):
        if not self.image:
            return ""

        return (self.image.url_125x125)

    def image_url_300(self):
            if not self.image:
                return ""
            
            # use original image if width is or smaller than 300
            if self.image.width <= 300:
                return self.image.url

            # use original image if size is samller than 200kb and width <= 600
            if self.image.width <= 300:
                return self.image.url

            # detect landscape or portrait format
            if self.image.width > self.image.height:
                return self.image.url_300x200
            else:
                return self.image.url_200x300

    def image_url_600(self):
            if not self.image:
                return ""
            
            # use original image if width is or smaller than 600
            if self.image.width <= 600:
                return self.image.url

            # detect landscape or portrait format
            if self.image.width > self.image.height:
                return self.image.url_600x400
            else:
                return self.image.url_400x600



class StoryLineInline(models.Model):
    order = models.PositiveIntegerField(default=0)
    story_line_part = models.ForeignKey(StoryLinePart, related_name='story_line_parts')
    story_line = models.ForeignKey(StoryLine, related_name='story_line')

    def __unicode__(self):
        return self.story_line_part.headline

    class Meta:
        ordering = ['order']
