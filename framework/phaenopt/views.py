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
from .models import PhenoLayer, Product, Pheno
from layers.models import LayerSerializer, MetadataSerializer

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

        return Response(data)