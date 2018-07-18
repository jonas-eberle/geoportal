from django.db import models
from django.contrib.auth.models import User, Group
from django.http import Http404, HttpResponse
from rest_framework import serializers
from django.contrib.gis.db import models
from swos.search_es import LayerIndex, WetlandIndex

from layers.models import Layer, ISOcodelist, KeywordInline, Contact
from content.models import Country, Image, Video
from geospatial.models import Region

import json
import matplotlib
matplotlib.use('Agg')


# Create your models here.
class Wetland(Region):
    country = models.CharField(max_length=200)
    geo_scale = models.CharField(max_length=200, blank=True)
    size = models.FloatField(blank=True)
    short_name = models.CharField(max_length=200, blank=True, null=True)
    partner = models.CharField(max_length=200, blank=True, null=True)
    site_type = models.CharField(max_length=200, blank=True, null=True)
    ecoregion = models.CharField(max_length=200, blank=True, null=True)
    wetland_type = models.CharField(max_length=200, blank=True, null=True)
    service_case = models.CharField(max_length=200, blank=True, null=True)

    @property
    def identifier(self):
        return "%s_%s" % (self.country.replace(' ', '-'), self.short_name)

    @property
    def products(self):
        layers = WetlandLayer.objects.filter(wetland_id=self.id, publishable=True).exclude(product__isnull=True)
        products = set()
        for l in layers:
            products.add(l.product.short_name)
        return list(products)

    @property
    def indicators(self):
        layers = WetlandLayer.objects.filter(wetland_id=self.id, publishable=True).exclude(indicator__isnull=True)
        indicators = set()
        for l in layers:
            indicators.add(l.indicator.short_name)
        return list(indicators)

    def indexing(self):

        from django.core.serializers import serialize
        geom = json.loads(
            serialize('geojson', Wetland.objects.filter(id=self.id), geometry_field='geom', fields=('name',)))
        geometry = geom["features"][0]["geometry"]

        keywords = ['Wetland', ]
        for keyword in self.description.split(','):
            keywords.append(keyword.strip())

        ecoregions = []
        for ecoregion in self.ecoregion.split(','):
            ecoregions.append(ecoregion.strip())

        obj = WetlandIndex(
            meta={'id': self.id},
            title=self.name,
            category='wetland',
            keywords=keywords,
            wetland=self.name,
            country=self.country,
            partner=self.partner,
            ecoregion=ecoregion,
            geom=geometry
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
    short_name = models.CharField(max_length = 20)
    number = models.IntegerField
    description_meaning = models.TextField(blank=True)
    description_usage = models.TextField(blank=True)
    description_creation = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    type = models.CharField(max_length=20, choices=(('change','change'),('state','state')), blank=True, help_text="Type of indicator")

    def __unicode__(self):
        return u"%s" %(self.name)

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ('name', 'description', 'short_name', 'number', 'short_description', 'type')

class WetlandLayer(Layer):
    wetland = models.ForeignKey(Wetland, related_name="layer_wetland", verbose_name="Wetland", blank=True, null=True)
    product = models.ForeignKey(Product, related_name="layer_product", verbose_name="Product", blank=True, null=True)
    indicator = models.ForeignKey(Indicator, related_name="layer_indicator", verbose_name="Indicator", blank=True, null=True)

    @property
    def alternate_title(self):
        wq_type = ''
        date_string = ''

        if hasattr(self.product, 'short_name'):
            product = self.product.short_name

            if self.product.short_name in ['WQ']:
                wq_type = ' '.join(self.identifier.split('_')[2:5])
            elif self.product.short_name in ['LULC', 'SSM']:
                wq_type = self.identifier.split('_')[2]+ ' ' + self.identifier.split('_')[3]
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
            elif self.product.short_name in ['SATDATA_OP']:
                wq_type = self.identifier.split('_')[2].replace('S2', 'Sentinel-2').replace('L', 'Landsat-') + ' ' + self.identifier.split('_')[3].replace('-', ' ')
                date_string = self.date_begin.strftime('%Y-%m-%d')
                product = ''
            elif self.product.short_name in ['SATDATA_SAR']:
                wq_type = self.identifier.split('_')[2].replace('S1', 'Sentinel-1') + ' ' + self.identifier.split('_')[3].replace('XX', 'VH/HV').replace('-', ' ')
                date_string = str(self.date_begin.year)
                product = ''
            elif self.product.short_name in ['SATDATA_OP']:
                product = self.identifier.split('_')[2].replace('L', 'Landsat-').replace('S', 'Sentinel-')
                wq_type = self.identifier.split('_')[3]
                date_string = self.date_begin.strftime('%Y-%m-%d')
            elif self.product.short_name in ['SEGM']:
                product = 'Segmentation'
                wq_type = self.identifier.split('_')[2].replace('L', 'Landsat-').replace('S', 'Sentinel-') + ' (%s)' % self.identifier.split('_')[3]
                date_string = str(self.date_begin.year)

            return ' '.join([product,wq_type, date_string])

        if hasattr(self.indicator, 'short_name'): #todo Add alternate_title for Indicator

            product = self.indicator.short_name
            wq_type = self.identifier

            if 'IND' in self.indicator.short_name:
                wq_type = self.identifier.split('_')[2] + ' ' + self.identifier.split('_')[3]

                if self.date_begin.year == self.date_end.year:
                    date_string = str(self.date_begin.year)
                else:
                    date_string = ' '.join([str(self.date_begin.year), '/', str(self.date_end.year)])

            if 'IND-' in self.indicator.short_name:
                product = product[4:]
            if 'IND-ALL' in self.indicator.short_name:
                wq_type = self.identifier.split('_')[2]
                product = "CHG"
            if 'WET-CHANGE' in self.indicator.short_name:
                product = "WET-CHG"
            if self.indicator.type == "change":
                try:
                    source = json.loads(self.meta_file_info)
                    length = len(source["source"])
                    date_string = ' '.join([str(self.date_begin.year), "("+ source["source"][0]["id"].split("_")[3] + ")", '-', str(self.date_end.year), "("+ source["source"][length-1]["id"].split("_")[3] + ")"])
                except:
                    pass
            return ' '.join([product, wq_type, date_string])

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
        
        if self.wetland is not None:
            wetland_name = self.wetland.name
        else:
            wetland_name = None

        obj = LayerIndex(
            meta={'id': self.id},
            title=self.title,
            category=cat,
            description=self.abstract,
            topiccat=topic_cats,
            keywords=keywords,
            wetland = wetland_name,
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

