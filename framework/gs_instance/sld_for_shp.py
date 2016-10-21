# -*- coding: utf-8 -*-
"""
@author: Felix Cremer
Style handling for the SWOS product.
Making of .sld files for certain products, and integration into the geoserver.
"""

import xml.etree.ElementTree as ET
from osgeo import ogr
import os.path
from ancillary import finder

def get_distinct(shape, column):
    """
    Get the distinct entries in the column of the shape.
    :param shape: path to the shapefile
    :param column: Name of the column
    :return: Set of distinct entries.
    """
    driver = ogr.GetDriverByName("ESRI Shapefile")
    distincts = set()
    datasource = driver.Open(shape, 0)
    layer = datasource.GetLayer()

    for feature in layer:
        #print feature.GetField(column)
        distincts.add(feature.GetField(column))
    return distincts

# todo: change path to frame, integrated it into git or directly into the code.
def make_sld(shape, full_sld, frame='/home/qe89hep/geoserver/SLDs/template.sld'):
    """
    Make a new SLD file for a shape file from a given template
    It checks, which column is used in the full_sld and includes only the rules which are used for the shape into
    the new sld, which is named shape.sld
    :param shape: path to the shapefile
    :param full_sld: path to the .sld in which all rules which might be appliable are.
    :param frame: Frame of an sld file, in which the rules are integrated
    :return: None
    """

    temp_tree = ET.parse(full_sld)
    root = temp_tree.getroot()
    namespaces = {'se': 'http://www.opengis.net/se', 'xsi': 'http://www.w3.org/2001/XMLSchema-instance', \
                  'xlink': 'http://www.w3.org/1999/xlink', 'ogc': 'http://www.opengis.net/ogc', 'sld': 'http://www.opengis.net/sld'}
    rules =[]

    column = root.find('.//ogc:PropertyIsEqualTo', namespaces)[0].text
    print column

    distincts = get_distinct(shape, column)
    print distincts

    for rule in root.findall('.//se:Rule', namespaces):
        #print rule.text
        prop = rule.find('.//ogc:PropertyIsEqualTo', namespaces)
        if prop[0].text == column:
            if int(prop[1].text) in distincts:
                rules.append(rule)
    print rules

    shape_name = os.path.basename(shape)
    shape_name = os.path.splitext(shape_name)[0]

    new_sld = ET.parse(frame)
    new_root = new_sld.getroot()
    layer_name = new_root.find('.//sld:NamedLayer/se:Name', namespaces)
    user_name = new_root.find('.//sld:UserStyle/se:Name', namespaces)

    user_name.text = shape_name
    layer_name.text = shape_name
    featureStyle = new_root.find('.//se:FeatureTypeStyle', namespaces)
    for rule in rules:
        featureStyle.append(rule)
    new_path = os.path.splitext(shape)[0] + '.sld'
    print new_path
    new_sld.write(new_path)

def add_sld(sld, cat):
    """
    Add the sld, in the geoserver Catalog instance
    :param sld: path to the sld
    :param cat: Geoserver catalog instance
    :return: None
    """
    name = os.path.basename(os.path.splitext(sld)[0])

    with open(sld) as f:
        cat.create_style(name, f.read(), overwrite=False, style_format="sld11")
    layer = cat.get_layer(name)
    layer._set_default_style(name)
    cat.save(layer)

if __name__ == '__main__':
    folder='/home/qe89hep/geoserver/France_Camargue/'
    #folder='/home/qe89hep/geoserver/Jordan_Azraq/04_Classification/'
    shapes = finder(folder, ['*.shp'])
    print shapes
    full_sld = '/home/qe89hep/geoserver/SLDs/LULC.sld'
    for shape in shapes:
        make_sld(shape, full_sld)
