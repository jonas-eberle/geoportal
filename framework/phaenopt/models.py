# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json

#from django.db import models
from django.contrib.gis.db import models
from rest_framework import serializers
from django.db.models import Count, Min, Max, Avg

from layers.models import Layer
from geospatial.models import Region
from content.models import ExternalDatabase

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


class CitizenScienceProject(ExternalDatabase):
    order = models.PositiveIntegerField(default=0)
    data_url = models.CharField(max_length=255, blank=True, null=True)

    def get_data(self, start=0, limit=10, geom=None):
        if geom:
            all_data = CitizenScienceData.objects.filter(project=self, geom__intersects=geom).order_by('-pub_date')
        else:
            all_data = CitizenScienceData.objects.filter(project=self).order_by('-pub_date')
        end = start+limit
        if end > len(all_data):
            end = len(all_data)

        data = all_data[start:end]
        return data

class CitizenScienceProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitizenScienceProject
        fields = ('id', 'name', 'shortname', 'online_link', 'description', 'provided_information', 'geoss_datasource_id')

class CitizenScienceData(models.Model):
    project = models.ForeignKey(CitizenScienceProject, related_name="data_project", verbose_name="Project", blank=True, null=True)
    fid = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    plant = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    pub_date = models.DateTimeField(blank=True, null=True)
    geom = models.PointField()
    properties = models.TextField()

    def __unicode__(self):
        return "%s: %s" % (self.project.name, self.fid)

    def to_json(self):
        data = dict(type="Feature", id=self.id, geometry=json.loads(self.geom.geojson))
        if self.properties is not None:
            data['properties'] = json.loads(self.properties)
        else:
            data['properties'] = dict()
        return data


class DWDStation(models.Model):
    Stations_id = models.IntegerField(db_index=True)
    Stationsname = models.CharField(max_length=200)
    geograph_Breite = models.FloatField()
    geograph_Laenge = models.FloatField()
    Stationshoehe = models.FloatField()
    Naturraumgruppe_Code = models.IntegerField()
    Naturraumgruppe = models.CharField(max_length=200)
    Naturraum_Code = models.IntegerField()
    Naturraum = models.CharField(max_length=200)
    Stationsaufloesung = models.DateField(blank=True, null=True, db_index=True)
    Bundesland = models.CharField(max_length=200)

    geom = models.PointField(blank=True, null=True, spatial_index=True)

    def __unicode__(self):
        return self.Stationsname + ' (%s)' % self.Stations_id

    @property
    def dataCount(self):
        return DWDInSituData.objects.filter(Stations_id=self.Stations_id).count()

    @property
    def phases(self):
        data = DWDInSituData.objects.filter(Stations_id=self.Stations_id).values('Objekt_id', 'Phase_id').annotate(
            jahr_min=Min('Referenzjahr'),
            jahr_max=Max('Referenzjahr'),
            count=Count('Referenzjahr')
        )
        for d in data:
            d['percent'] = float(d['count']) / float(d['jahr_max']-d['jahr_min'] + 1) * 100.0
            d['name'] = dwd_id_to_name['%s_%s' % (d['Objekt_id'], d['Phase_id'])]

        data = sorted(data, key=lambda k: k['name'])
        return data


class DWDStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DWDStation
        fields = ('id', 'Stations_id', 'Stationsname', 'Stationsaufloesung', 'dataCount')


class DWDStationSingleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DWDStation
        fields = ('id', 'Stations_id', 'Stationsname', 'geograph_Breite', 'geograph_Laenge', 'Stationshoehe', 'Naturraumgruppe', 'Naturraum', 'Stationsaufloesung', 'geom', 'dataCount', 'phases')


from django_pandas.managers import DataFrameManager
class DWDInSituData(models.Model):
    Stations_id = models.IntegerField(db_index=True)
    Referenzjahr = models.IntegerField()
    Qualitaetsniveau = models.IntegerField()
    Objekt_id = models.IntegerField(db_index=True)
    Phase_id = models.IntegerField(db_index=True)
    Eintrittsdatum = models.DateField(blank=True, null=True)
    Eintrittsdatum_QB = models.IntegerField()
    Jultag = models.IntegerField()

    objects = DataFrameManager()

    def __unicode__(self):
        return '%s - %s - %s - %s' % (self.Stations_id, self.Objekt_id, self.Phase_id, self.Referenzjahr)

dwd_id_to_name = {"332_5": "S\u00fc\u00dfkirsche, sp\u00e4te Reife (Bl\u00fcte Beginn)", "332_6": "S\u00fc\u00dfkirsche, sp\u00e4te Reife (Vollbl\u00fcte)", "332_7": "S\u00fc\u00dfkirsche, sp\u00e4te Reife (Bl\u00fcte Ende)", "103_3": "Eberesche (Austrieb Beginn)", "340_7": "Sauerkirsche (Bl\u00fcte Ende)", "313_7": "Apfel, sp\u00e4te Reife (Bl\u00fcte Ende)", "313_6": "Apfel, sp\u00e4te Reife (Vollbl\u00fcte)", "313_5": "Apfel, sp\u00e4te Reife (Bl\u00fcte Beginn)", "234_24": "Sp\u00e4tkartoffel (Ernte)", "313_3": "Apfel, sp\u00e4te Reife (Austrieb Beginn)", "103_4": "Eberesche (Blattentfaltung Beginn)", "350_29": "Stachelbeere (Pfl\u00fcckreife Beginn)", "250_10": "Sorte unbekannt (R\u00fcbe) (Bestellung Beginn)", "250_13": "Sorte unbekannt (R\u00fcbe) (Bestand geschlossen)", "250_12": "Sorte unbekannt (R\u00fcbe) (Auflaufen Beginn)", "320_5": "Birne (Bl\u00fcte Beginn)", "320_7": "Birne (Bl\u00fcte Ende)", "320_6": "Birne (Vollbl\u00fcte)", "242_5": "Gr\u00fcnpfl\u00fcck-Erbse (Bl\u00fcte Beginn)", "128_5": "Schwarz-Erle (Bl\u00fcte Beginn)", "128_4": "Schwarz-Erle (Blattentfaltung Beginn)", "201_26": "Dauergr\u00fcnland (1. Silageschnitt)", "201_27": "Dauergr\u00fcnland (2. Heuschnitt)", "322_5": "Birne, sp\u00e4te Reife (Bl\u00fcte Beginn)", "201_25": "Dauergr\u00fcnland (1. Heuschnitt)", "136_6": "Wiesen-Kn\u00e4uelgras (Vollbl\u00fcte)", "253_24": "Zucker-R\u00fcbe (Ernte)", "118_5": "Kiefer (Bl\u00fcte Beginn)", "330_6": "S\u00fc\u00dfkirsche (Vollbl\u00fcte)", "330_7": "S\u00fc\u00dfkirsche (Bl\u00fcte Ende)", "201_28": "Dauergr\u00fcnland (2. Silageschnitt)", "208_66": "Hafer (Rispenschieben Beginn)", "105_63": "Europ\u00e4ische L\u00e4rche (herbstliche Nadelverf\u00e4rbung)", "204_15": "Wintergerste (Schossen Beginn)", "105_61": "Europ\u00e4ische L\u00e4rche (Nadelentfaltung Beginn)", "204_10": "Wintergerste (Bestellung Beginn)", "138_5": "Zweigriffliger Wei\u00dfdorn (Bl\u00fcte Beginn)", "204_12": "Wintergerste (Auflaufen Beginn)", "105_64": "Europ\u00e4ische L\u00e4rche (herbstlicher Nadelfall)", "132_4": "Stiel-Eiche (Blattentfaltung Beginn)", "322_29": "Birne, sp\u00e4te Reife (Pfl\u00fcckreife Beginn)", "204_18": "Wintergerste (\u00c4hrenschieben Beginn)", "122_32": "Rosskastanie (herbstlicher Blattfall)", "107_5": "Fichte (Bl\u00fcte Beginn)", "370_6": "Pflaume (Vollbl\u00fcte)", "381_5": "Pfirsich (Bl\u00fcte Beginn)", "106_5": "Falscher Jasmin (Bl\u00fcte Beginn)", "246_27": "Rotklee (2. Heuschnitt)", "103_5": "Eberesche (Bl\u00fcte Beginn)", "132_32": "Stiel-Eiche (herbstlicher Blattfall)", "201_36": "Dauergr\u00fcnland (2. Heu- oder (!) Silageschnitt)", "413_7": "Weinrebe, sp\u00e4te Reife (Bl\u00fcte Ende)", "250_24": "Sorte unbekannt (R\u00fcbe) (Ernte)", "331_29": "S\u00fc\u00dfkirsche, fr\u00fche Reife (Pfl\u00fcckreife Beginn)", "215_21": "Mais (Gelbreife Beginn)", "234_12": "Sp\u00e4tkartoffel (Auflaufen Beginn)", "201_35": "Dauergr\u00fcnland (1. Heu- oder (!) Silageschnitt)", "360_29": "Rote Johannisbeere (Pfl\u00fcckreife Beginn)", "202_19": "Winterweizen (Milchreife Beginn)", "361_29": "Johannisbeere, alle Sorten (Pfl\u00fcckreife Beginn)", "206_18": "Sommerweizen (\u00c4hrenschieben Beginn)", "209_16": "Sonnenblume (Blattbildung Beginn)", "330_5": "S\u00fc\u00dfkirsche (Bl\u00fcte Beginn)", "244_24": "Wei\u00dfkohl (Ernte)", "209_24": "Sonnenblume (Ernte)", "206_15": "Sommerweizen (Schossen Beginn)", "206_12": "Sommerweizen (Auflaufen Beginn)", "122_31": "Rosskastanie (herbstliche Blattverf\u00e4rbung)", "206_10": "Sommerweizen (Bestellung Beginn)", "313_32": "Apfel, sp\u00e4te Reife (herbstlicher Blattfall)", "205_22": "Winterraps (Vollreife Beginn)", "205_23": "Winterraps (Ernte von Hand)", "118_8": "Kiefer (Maitrieb)", "101_5": "Beifu\u00df (Bl\u00fcte Beginn)", "205_24": "Winterraps (Ernte)", "350_4": "Stachelbeere (Blattentfaltung Beginn)", "350_5": "Stachelbeere (Bl\u00fcte Beginn)", "137_4": "Winter-Linde (Blattentfaltung Beginn)", "242_12": "Gr\u00fcnpfl\u00fcck-Erbse (Auflaufen Beginn)", "383_5": "Brombeere (Bl\u00fcte Beginn)", "242_10": "Gr\u00fcnpfl\u00fcck-Erbse (Bestellung Beginn)", "209_12": "Sonnenblume (Auflaufen Beginn)", "340_29": "Sauerkirsche (Pfl\u00fcckreife Beginn)", "311_29": "Apfel, fr\u00fche Reife (Pfl\u00fcckreife Beginn)", "411_7": "Weinrebe, fr\u00fche Reife (Bl\u00fcte Ende)", "112_32": "H\u00e4nge-Birke (herbstlicher Blattfall)", "241_12": "Gr\u00fcnpfl\u00fcck-Bohne (Auflaufen Beginn)", "233_24": "Fr\u00fchkartoffel, nicht vorgekeimt (Ernte)", "205_5": "Winterraps (Bl\u00fcte Beginn)", "130_4": "Sommer-Linde (Blattentfaltung Beginn)", "102_5": "Busch-Windr\u00f6schen (Bl\u00fcte Beginn)", "132_31": "Stiel-Eiche (herbstliche Blattverf\u00e4rbung)", "321_29": "Birne, fr\u00fche Reife (Pfl\u00fcckreife Beginn)", "203_5": "Winterroggen (Bl\u00fcte Beginn)", "241_24": "Gr\u00fcnpfl\u00fcck-Bohne (Ernte)", "331_5": "S\u00fc\u00dfkirsche, fr\u00fche Reife (Bl\u00fcte Beginn)", "203_6": "Winterroggen (Vollbl\u00fcte)", "104_5": "Esche (Bl\u00fcte Beginn)", "244_11": "Wei\u00dfkohl (Pflanzen Beginn)", "132_9": "Stiel-Eiche (Johannistrieb)", "122_3": "Rosskastanie (Austrieb Beginn)", "202_12": "Winterweizen (Auflaufen Beginn)", "245_27": "Luzerne (2. Heuschnitt)", "202_10": "Winterweizen (Bestellung Beginn)", "245_25": "Luzerne (1. Heuschnitt)", "201_1": "Dauergr\u00fcnland (Ergr\u00fcnen Beginn)", "202_15": "Winterweizen (Schossen Beginn)", "112_31": "H\u00e4nge-Birke (herbstliche Blattverf\u00e4rbung)", "202_18": "Winterweizen (\u00c4hrenschieben Beginn)", "215_20": "Mais (Teigreife Beginn)", "411_42": "Weinrebe, fr\u00fche Reife (Reife Beginn Weinrebe)", "215_24": "Mais (Ernte)", "322_7": "Birne, sp\u00e4te Reife (Bl\u00fcte Ende)", "243_11": "Tomate (Pflanzen Beginn)", "310_32": "Apfel (herbstlicher Blattfall)", "322_6": "Birne, sp\u00e4te Reife (Vollbl\u00fcte)", "311_32": "Apfel, fr\u00fche Reife (herbstlicher Blattfall)", "209_5": "Sonnenblume (Bl\u00fcte Beginn)", "132_5": "Stiel-Eiche (Bl\u00fcte Beginn)", "232_10": "Fr\u00fchkartoffel, vorgekeimt (Bestellung Beginn)", "232_13": "Fr\u00fchkartoffel, vorgekeimt (Bestand geschlossen)", "232_12": "Fr\u00fchkartoffel, vorgekeimt (Auflaufen Beginn)", "310_3": "Apfel (Austrieb Beginn)", "371_29": "Pflaume, fr\u00fche Reife (Pfl\u00fcckreife Beginn)", "410_3": "Weinrebe (Austrieb Beginn)", "134_5": "Traubenkirsche (Bl\u00fcte Beginn)", "234_5": "Sp\u00e4tkartoffel (Bl\u00fcte Beginn)", "410_7": "Weinrebe (Bl\u00fcte Ende)", "410_6": "Weinrebe (Vollbl\u00fcte)", "410_5": "Weinrebe (Bl\u00fcte Beginn)", "413_42": "Weinrebe, sp\u00e4te Reife (Reife Beginn Weinrebe)", "122_62": "Rosskastanie (erste reife Fr\u00fcchte)", "137_5": "Winter-Linde (Bl\u00fcte Beginn)", "310_6": "Apfel (Vollbl\u00fcte)", "232_5": "Fr\u00fchkartoffel, vorgekeimt (Bl\u00fcte Beginn)", "120_5": "L\u00f6wenzahn (Bl\u00fcte Beginn)", "310_7": "Apfel (Bl\u00fcte Ende)", "119_62": "Kornelkirsche (erste reife Fr\u00fcchte)", "215_5": "Mais (Bl\u00fcte Beginn)", "215_6": "Mais (Vollbl\u00fcte)", "109_5": "Forsythie (Bl\u00fcte Beginn)", "253_10": "Zucker-R\u00fcbe (Bestellung Beginn)", "253_12": "Zucker-R\u00fcbe (Auflaufen Beginn)", "253_13": "Zucker-R\u00fcbe (Bestand geschlossen)", "105_5": "Europ\u00e4ische L\u00e4rche (Bl\u00fcte Beginn)", "124_5": "Sal-Weide (Bl\u00fcte Beginn)", "332_29": "S\u00fc\u00dfkirsche, sp\u00e4te Reife (Pfl\u00fcckreife Beginn)", "411_32": "Weinrebe, fr\u00fche Reife (herbstlicher Blattfall)", "412_30": "Weinrebe, mittelsp\u00e4te Reife (bevorzugt Silvaner/Wei\u00dfburgunder) (Lese)", "411_30": "Weinrebe, fr\u00fche Reife (Lese)", "350_3": "Stachelbeere (Austrieb Beginn)", "413_2": "Weinrebe, sp\u00e4te Reife (Erstes Bluten)", "241_5": "Gr\u00fcnpfl\u00fcck-Bohne (Bl\u00fcte Beginn)", "413_3": "Weinrebe, sp\u00e4te Reife (Austrieb Beginn)", "383_29": "Brombeere (Pfl\u00fcckreife Beginn)", "243_24": "Tomate (Ernte)", "205_67": "Winterraps (L\u00e4ngenwachstum Beginn)", "310_29": "Apfel (Pfl\u00fcckreife Beginn)", "232_24": "Fr\u00fchkartoffel, vorgekeimt (Ernte)", "246_25": "Rotklee (1. Heuschnitt)", "412_32": "Weinrebe, mittelsp\u00e4te Reife (bevorzugt Silvaner/Wei\u00dfburgunder) (herbstlicher Blattfall)", "209_17": "Sonnenblume (Knospenbildung Beginn)", "203_18": "Winterroggen (\u00c4hrenschieben Beginn)", "206_24": "Sommerweizen (Ernte)", "206_23": "Sommerweizen (Ernte von Hand)", "206_22": "Sommerweizen (Vollreife Beginn)", "206_21": "Sommerweizen (Gelbreife Beginn)", "209_10": "Sonnenblume (Bestellung Beginn)", "331_31": "S\u00fc\u00dfkirsche, fr\u00fche Reife (herbstliche Blattverf\u00e4rbung)", "203_10": "Winterroggen (Bestellung Beginn)", "203_12": "Winterroggen (Auflaufen Beginn)", "203_15": "Winterroggen (Schossen Beginn)", "340_6": "Sauerkirsche (Vollbl\u00fcte)", "340_5": "Sauerkirsche (Bl\u00fcte Beginn)", "123_62": "Rotbuche (erste reife Fr\u00fcchte)", "112_4": "H\u00e4nge-Birke (Blattentfaltung Beginn)", "208_24": "Hafer (Ernte)", "117_62": "Hunds-Rose (erste reife Fr\u00fcchte)", "242_24": "Gr\u00fcnpfl\u00fcck-Erbse (Ernte)", "208_21": "Hafer (Gelbreife Beginn)", "310_5": "Apfel (Bl\u00fcte Beginn)", "208_23": "Hafer (Ernte von Hand)", "208_22": "Hafer (Vollreife Beginn)", "107_8": "Fichte (Maitrieb)", "207_15": "Sommergerste (Schossen Beginn)", "361_5": "Johannisbeere, alle Sorten (Bl\u00fcte Beginn)", "207_10": "Sommergerste (Bestellung Beginn)", "207_12": "Sommergerste (Auflaufen Beginn)", "205_12": "Winterraps (Auflaufen Beginn)", "252_24": "Futter-R\u00fcbe (Ernte)", "205_10": "Winterraps (Bestellung Beginn)", "205_17": "Winterraps (Knospenbildung Beginn)", "207_18": "Sommergerste (\u00c4hrenschieben Beginn)", "112_5": "H\u00e4nge-Birke (Bl\u00fcte Beginn)", "205_14": "Winterraps (Rosettenbildung Beginn)", "203_24": "Winterroggen (Ernte)", "411_3": "Weinrebe, fr\u00fche Reife (Austrieb Beginn)", "133_5": "Tanne (Bl\u00fcte Beginn)", "241_10": "Gr\u00fcnpfl\u00fcck-Bohne (Bestellung Beginn)", "411_6": "Weinrebe, fr\u00fche Reife (Vollbl\u00fcte)", "203_21": "Winterroggen (Gelbreife Beginn)", "203_22": "Winterroggen (Vollreife Beginn)", "203_23": "Winterroggen (Ernte von Hand)", "360_5": "Rote Johannisbeere (Bl\u00fcte Beginn)", "122_5": "Rosskastanie (Bl\u00fcte Beginn)", "114_5": "Heidekraut (Bl\u00fcte Beginn)", "123_31": "Rotbuche (herbstliche Blattverf\u00e4rbung)", "121_4": "Robinie (Blattentfaltung Beginn)", "133_8": "Tanne (Maitrieb)", "135_5": "Wiesen-Fuchsschwanz (Bl\u00fcte Beginn)", "233_5": "Fr\u00fchkartoffel, nicht vorgekeimt (Bl\u00fcte Beginn)", "135_6": "Wiesen-Fuchsschwanz (Vollbl\u00fcte)", "414_30": "Weinrebe, blaue Trauben (bevorzugt Portugieser/Sp\u00e4tburgunder) (Lese)", "414_32": "Weinrebe, blaue Trauben (bevorzugt Portugieser/Sp\u00e4tburgunder) (herbstlicher Blattfall)", "413_30": "Weinrebe, sp\u00e4te Reife (Lese)", "413_31": "Weinrebe, sp\u00e4te Reife (herbstliche Blattverf\u00e4rbung)", "413_32": "Weinrebe, sp\u00e4te Reife (herbstlicher Blattfall)", "382_29": "Himbeere (Pfl\u00fcckreife Beginn)", "112_3": "H\u00e4nge-Birke (Austrieb Beginn)", "208_10": "Hafer (Bestellung Beginn)", "370_7": "Pflaume (Bl\u00fcte Ende)", "208_12": "Hafer (Auflaufen Beginn)", "370_5": "Pflaume (Bl\u00fcte Beginn)", "234_13": "Sp\u00e4tkartoffel (Bestand geschlossen)", "208_15": "Hafer (Schossen Beginn)", "234_10": "Sp\u00e4tkartoffel (Bestellung Beginn)", "208_19": "Hafer (Milchreife Beginn)", "125_5": "Schlehe (Bl\u00fcte Beginn)", "121_5": "Robinie (Bl\u00fcte Beginn)", "138_62": "Zweigriffliger Wei\u00dfdorn (erste reife Fr\u00fcchte)", "130_5": "Sommer-Linde (Bl\u00fcte Beginn)", "207_21": "Sommergerste (Gelbreife Beginn)", "207_22": "Sommergerste (Vollreife Beginn)", "207_23": "Sommergerste (Ernte von Hand)", "207_24": "Sommergerste (Ernte)", "122_4": "Rosskastanie (Blattentfaltung Beginn)", "129_62": "Schwarzer Holunder (erste reife Fr\u00fcchte)", "411_31": "Weinrebe, fr\u00fche Reife (herbstliche Blattverf\u00e4rbung)", "202_23": "Winterweizen (Ernte von Hand)", "202_22": "Winterweizen (Vollreife Beginn)", "202_21": "Winterweizen (Gelbreife Beginn)", "103_62": "Eberesche (erste reife Fr\u00fcchte)", "202_24": "Winterweizen (Ernte)", "411_2": "Weinrebe, fr\u00fche Reife (Erstes Bluten)", "380_5": "Aprikose (Bl\u00fcte Beginn)", "129_5": "Schwarzer Holunder (Bl\u00fcte Beginn)", "204_21": "Wintergerste (Gelbreife Beginn)", "204_23": "Wintergerste (Ernte von Hand)", "204_22": "Wintergerste (Vollreife Beginn)", "204_24": "Wintergerste (Ernte)", "126_5": "Schneebeere (Bl\u00fcte Beginn)", "243_5": "Tomate (Bl\u00fcte Beginn)", "132_62": "Stiel-Eiche (erste reife Fr\u00fcchte)", "127_5": "Schneegl\u00f6ckchen (Bl\u00fcte Beginn)", "123_5": "Rotbuche (Bl\u00fcte Beginn)", "313_29": "Apfel, sp\u00e4te Reife (Pfl\u00fcckreife Beginn)", "321_5": "Birne, fr\u00fche Reife (Bl\u00fcte Beginn)", "321_6": "Birne, fr\u00fche Reife (Vollbl\u00fcte)", "321_7": "Birne, fr\u00fche Reife (Bl\u00fcte Ende)", "411_4": "Weinrebe, fr\u00fche Reife (Blattentfaltung Beginn)", "332_31": "S\u00fc\u00dfkirsche, sp\u00e4te Reife (herbstliche Blattverf\u00e4rbung)", "411_5": "Weinrebe, fr\u00fche Reife (Bl\u00fcte Beginn)", "215_67": "Mais (L\u00e4ngenwachstum Beginn)", "215_65": "Mais (Fahnenschieben Beginn)", "330_31": "S\u00fc\u00dfkirsche (herbstliche Blattverf\u00e4rbung)", "131_5": "Spitz-Ahorn (Bl\u00fcte Beginn)", "108_5": "Flieder (Bl\u00fcte Beginn)", "311_3": "Apfel, fr\u00fche Reife (Austrieb Beginn)", "311_5": "Apfel, fr\u00fche Reife (Bl\u00fcte Beginn)", "116_5": "Huflattich (Bl\u00fcte Beginn)", "311_7": "Apfel, fr\u00fche Reife (Bl\u00fcte Ende)", "311_6": "Apfel, fr\u00fche Reife (Vollbl\u00fcte)", "115_5": "Herbstzeitlose (Bl\u00fcte Beginn)", "233_12": "Fr\u00fchkartoffel, nicht vorgekeimt (Auflaufen Beginn)", "233_13": "Fr\u00fchkartoffel, nicht vorgekeimt (Bestand geschlossen)", "233_10": "Fr\u00fchkartoffel, nicht vorgekeimt (Bestellung Beginn)", "384_29": "Erdbeere (Pfl\u00fcckreife Beginn)", "113_5": "Hasel (Bl\u00fcte Beginn)", "413_4": "Weinrebe, sp\u00e4te Reife (Blattentfaltung Beginn)", "123_32": "Rotbuche (herbstlicher Blattfall)", "413_5": "Weinrebe, sp\u00e4te Reife (Bl\u00fcte Beginn)", "331_7": "S\u00fc\u00dfkirsche, fr\u00fche Reife (Bl\u00fcte Ende)", "413_6": "Weinrebe, sp\u00e4te Reife (Vollbl\u00fcte)", "331_6": "S\u00fc\u00dfkirsche, fr\u00fche Reife (Vollbl\u00fcte)", "410_31": "Weinrebe (herbstliche Blattverf\u00e4rbung)", "410_30": "Weinrebe (Lese)", "410_32": "Weinrebe (herbstlicher Blattfall)", "252_13": "Futter-R\u00fcbe (Bestand geschlossen)", "252_12": "Futter-R\u00fcbe (Auflaufen Beginn)", "252_10": "Futter-R\u00fcbe (Bestellung Beginn)", "117_5": "Hunds-Rose (Bl\u00fcte Beginn)", "110_5": "Goldregen (Bl\u00fcte Beginn)", "312_29": "Apfel, mittlere Reife (Pfl\u00fcckreife Beginn)", "103_32": "Eberesche (herbstlicher Blattfall)", "215_12": "Mais (Auflaufen Beginn)", "410_42": "Weinrebe (Reife Beginn Weinrebe)", "215_10": "Mais (Bestellung Beginn)", "382_5": "Himbeere (Bl\u00fcte Beginn)", "384_5": "Erdbeere (Bl\u00fcte Beginn)", "119_5": "Kornelkirsche (Bl\u00fcte Beginn)", "104_4": "Esche (Blattentfaltung Beginn)", "330_29": "S\u00fc\u00dfkirsche (Pfl\u00fcckreife Beginn)", "372_29": "Pflaume, sp\u00e4te Reife (Pfl\u00fcckreife Beginn)", "215_19": "Mais (Milchreife Beginn)", "123_4": "Rotbuche (Blattentfaltung Beginn)", "320_29": "Birne (Pfl\u00fcckreife Beginn)"}