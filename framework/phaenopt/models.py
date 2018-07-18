# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from layers.models import Layer
from geospatial.models import Region

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    def __unicode__(self):
        return u"%s" % (self.name)


class Pheno(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    def __unicode__(self):
        return u"%s" % (self.name)


class PhenoLayer(Layer):
    region = models.ForeignKey(Region, related_name="layer_region", verbose_name="Region", blank=True, null=True)
    product = models.ForeignKey(Product, related_name="layer_product", verbose_name="Product", blank=True, null=True)
    phenophase = models.ForeignKey(Pheno, related_name="layer_phenophase", verbose_name="Phenophase", blank=True, null=True)
    type = models.CharField(max_length=20, choices=(('time-series', 'time-series'), ('multi-annual state', 'multi-annual state'), ('overview', 'overview')),help_text="Type of layer", blank=True, null=True)
