# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.apps import AppConfig
from .models import CitizenScienceData, CitizenScienceProject, DWDStation
import requests
import json
import glob
import pandas
import datetime
import os
from shapely.geometry import shape, Point

class PhaenoptConfig(AppConfig):
    name = 'phaenopt'


def ingest_myseasons_data():
    project = CitizenScienceProject.objects.get(pk=1)
    url = 'http://artemis.geogr.uni-jena.de/geoserver/myseasons/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=myseasons:data&outputFormat=application%2Fjson'
    data = requests.get(url)
    data = data.json()
    features = data['features']
    for feature in features:
        fid = feature['id']
        geom = shape(feature['geometry'])
        props = json.dumps(feature['properties'])
        CitizenScienceData(fid=fid, geom=geom.wkt, properties=props, project=project, plant=feature['properties']['baum'], name=fid, pub_date=feature['properties']['pubdate']).save()

def ingest_dwd_stations():
    stations_file = '../data/dwd/PH_Beschreibung_Phaenologie_Stationen_Jahresmelder.txt'
    csv = pandas.read_csv(stations_file, sep=';', encoding='latin1')
    csv.rename(columns=lambda x: x.strip(), inplace=True)
    csv = csv[0:-1]
    csv = csv.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    csv.Stations_id = csv.Stations_id.astype(int)
    csv.Naturraum_Code = csv.Naturraum_Code.astype(int)
    csv.Naturraumgruppe_Code = csv.Naturraumgruppe_Code.astype(int)
    csv['Datum Stationsaufloesung'] = csv['Datum Stationsaufloesung'].apply(lambda x: '01.01.2100' if x == '' else x)
    csv['Datum Stationsaufloesung'] = pandas.to_datetime(csv['Datum Stationsaufloesung'], format='%d.%m.%Y')
    csv['Datum Stationsaufloesung'] = csv['Datum Stationsaufloesung'].apply(
        lambda x: None if x == datetime.datetime(2100, 1, 1) else x)
    csv.rename(columns={'geograph.Breite': 'geograph_Breite'}, inplace=True)
    csv.rename(columns={'geograph.Laenge': 'geograph_Laenge'}, inplace=True)
    csv.rename(columns={'Datum Stationsaufloesung': 'Stationsaufloesung'}, inplace=True)
    #csv = csv.loc[:, ~csv.columns.str.contains('^Unnamed')]

    records = csv.to_dict(orient='records')
    for entry in records:
        if 'eor' in entry:
            del entry['eor']
        if str(entry['Stationsaufloesung']) == 'nan':
            del entry['Stationsaufloesung']
        print(str(entry['Stations_id']))
        entry['geom'] = Point(entry['geograph_Laenge'], entry['geograph_Breite']).wkt
        DWDStation(**entry).save()

def ingest_dwd_phenodata():
    df_list = []

    species_files = glob.glob('../data/dwd/wild/*.txt')
    for species in species_files:
        df_list.append(pandas.read_csv(species, sep=';', encoding='latin1')[0:-1])

    species_files = glob.glob('../data/dwd/crops/*.txt')
    for species in species_files:
        df_list.append(pandas.read_csv(species, sep=';', encoding='latin1')[0:-1])

    species_files = glob.glob('../data/dwd/fruit/*.txt')
    for species in species_files:
        df_list.append(pandas.read_csv(species, sep=';', encoding='latin1')[0:-1])

    species_files = glob.glob('../data/dwd/vine/*.txt')
    for species in species_files:
        df_list.append(pandas.read_csv(species, sep=';', encoding='latin1')[0:-1])

    filename = '../data/dwd/data_all.csv'
    for key, df in enumerate(df_list):
        print(str(key))
        df.rename(columns=lambda x: x.strip(), inplace=True)
        df.Stations_id = df.Stations_id.astype(int)
        df.Referenzjahr = df.Referenzjahr.astype(int)
        df.Qualitaetsniveau = df.Qualitaetsniveau.astype(int)
        df.Objekt_id = df.Objekt_id.astype(int)
        df.Phase_id = df.Phase_id.astype(int)
        df.Eintrittsdatum = pandas.to_datetime(df.Eintrittsdatum, format='%Y%m%d')
        df.Eintrittsdatum_QB = df.Eintrittsdatum_QB.astype(int)
        df.Jultag = df.Jultag.astype(int)
        df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
        if os.path.exists(filename):
            df.to_csv(filename, index=False, mode='a', header=False)
        else:
            df.to_csv(filename, index=False)

def ingest_dwd_definitions():
    files = glob.glob('../data/dwd/PH_B*Phasendefinition*.txt')
    df_list = []
    for definition in files:
        df_list.append(pandas.read_csv(definition, sep=';')[0:-1])
    df = pandas.concat(df_list)
    df.rename(columns=lambda x: x.strip(), inplace=True)
    df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    df.Objekt_id = df.Objekt_id.astype(int)
    df.Phasen_id = df.Phasen_id.astype(int)
    df.BBCH_Code = df.BBCH_Code.apply(lambda x: None if x == '' else int(x))

    definitions = dict()
    for key, i in df.iterrows():
        tmp = i.to_dict()
        if '' in tmp:
            del tmp['']
        definitions['%s_%s' % (i['Objekt_id'], i['Phasen_id'])] = tmp

    data = json.dumps(definitions)
    with open('../data/dwd/definitions.json', 'w') as f:
        f.write(data)