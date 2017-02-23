"""
This Script exports the information of a SWOS-product which are specified in the fieldnames list into an csv file.
Should not be used, because this will be integrated into the Django structure.
"""

import csv
import os.path
from ancillary import finder
import xml.etree.ElementTree as ET


folder = '/home/qe89hep/data/SWOS/wetlands/'
#print os.path.isdir(folder)
shapes = finder(folder, ['*.xml'])
fieldnames = ['title', 'abstract', 'TMS', 'legend', 'xmin', 'xmax','ymin', 'ymax', 'wetland', 'product', 'contact_email', 'contact_organisation', 'country', 'WFS']
data = []
#shapes = ['/home/qe89hep/data/SWOS/wetlands/Egypt_Burullus/Watershed/SWOS_-_Watershed_Egypt_Burullus_2016.xml']

for shape in shapes:
    print shape
    tree = ET.parse(shape)
    root = tree.getroot()
    abstract = root.find('.//{http://www.isotc211.org/2005/gmd}abstract')[0].text
    shape_data = {field:'' for field in fieldnames}
    directory, base = os.path.split(shape)
    props = directory.split('/')
    country_wetland = props[-2]
    product = props[-1]
    title = os.path.splitext(base)[0]
    shape_data[fieldnames[0]] = title
    shape_data[fieldnames[1]] = abstract
    print abstract
    for resource in root.findall('.//{http://www.isotc211.org/2005/gmd}CI_OnlineResource'):
        url = resource.find('.//{http://www.isotc211.org/2005/gmd}URL').text
        print url
        if azraq: print resource
        if 'gwc' in url:
            shape_data['TMS'] = url
        if 'wms' in url:
            wms = url
            print wms
        if 'wfs' in url:
            shape_data['WFS'] = url
    shape_data['legend'] = ''.join([wms, 'REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=', country_wetland,':', title, '&LEGEND_OPTIONS=forceLabels:on'])
    bounding_box = root.find('.//{http://www.isotc211.org/2005/gmd}EX_GeographicBoundingBox')
    shape_data['xmin'] = bounding_box[0][0].text
    shape_data['xmax'] = bounding_box[1][0].text
    shape_data['ymin'] = bounding_box[2][0].text
    shape_data['ymax'] = bounding_box[3][0].text

    country, wetland = country_wetland.split('_')
    shape_data['wetland'] = wetland
    shape_data['country'] = country
    shape_data['product'] = product

    contact = root.find('.//{http://www.isotc211.org/2005/gmd}contact/{http://www.isotc211.org/2005/gmd}CI_ResponsibleParty')
    #print contact
    shape_data['contact_organisation'] = contact.find('.//{http://www.isotc211.org/2005/gmd}organisationName')[0].text
    shape_data['contact_email'] = contact.find('.//{http://www.isotc211.org/2005/gmd}electronicMailAddress')[0].text
    if azraq: print shape_data
    data.append(shape_data)

#print data

with open('layer_data_wfs.csv','wb') as out:
    writer = csv.DictWriter(out, delimiter=',', fieldnames=fieldnames)
    writer.writeheader()
    for thing in data:
        #print thing
        writer.writerow(thing)