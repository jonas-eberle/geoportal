# -*- coding: utf-8 -*-
"""
@author: Felix Cremer
Style handling for the SWOS product.
Making of .sld files for certain products, and integration into the geoserver.
"""

import xml.etree.ElementTree as ET
from osgeo import ogr
import os.path
import json
import logging
import csv


log = logging.getLogger(__name__)
# todo: Add this function into Vector?
def get_distinct(shape, column):
    """
    Get the distinct entries in the column of the shape.
    :param shape: path to the shapefile
    :param column: Name of the column
    :return: Set of distinct entries.
    """
    # Open the shapefile
    driver = ogr.GetDriverByName("ESRI Shapefile")
    datasource = driver.Open(shape, 0)
    # todo: What happens with multiple layers?
    layer = datasource.GetLayer()

    distincts = set()

    # Add every field value for the features, the set takes care, that the values are distinct.
    for feature in layer:
        distincts.add(str(feature.GetField(column)))
    return distincts

def make_sld(shape, full_sld):
    """
    Make a new SLD file for a shape file from a given template
    It checks, which column is used in the full_sld and includes only the rules which are used for the shape into
    the new sld, which is named shape.sld
    :param shape: path to the shapefile
    :param full_sld: path to the .sld in which all rules which might be appliable are.
    :return: None
    """

    # An empty sld file
    frame = '''<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:se="http://www.opengis.net/se"
                xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
                  <sld:NamedLayer>
                    <se:Name>NAME</se:Name>
                    <sld:UserStyle>
                      <se:Name>NAME</se:Name>
                      <se:FeatureTypeStyle>
                      </se:FeatureTypeStyle>
                    </sld:UserStyle>
                  </sld:NamedLayer>
                </sld:StyledLayerDescriptor>'''

    # Open the full_sld, which should be cropped
    temp_tree = ET.parse(full_sld)
    root = temp_tree.getroot()
    # namespaces of an sld file
    namespaces = {'se': 'http://www.opengis.net/se', 'xsi': 'http://www.w3.org/2001/XMLSchema-instance', \
                  'xlink': 'http://www.w3.org/1999/xlink', 'ogc': 'http://www.opengis.net/ogc', 'sld': 'http://www.opengis.net/sld'}
    # Initiate empty list for the rules which are applicable on the shapefile.
    rules =[]

    # Get the column name, which is used in the full_sld and get the distinct values in the shapefile
    columns = sorted(set(thing[0].text for thing in root.findall('.//ogc:PropertyIsEqualTo', namespaces)))
    log.debug(columns)
    log.debug(full_sld)
    for column in columns:
        log.debug("Column: "+str(column))
        distincts = get_distinct(shape, column)
        log.debug('Distincts '+str(distincts))

        # Find the rules which are applicable on the shapefile
        for rule in root.findall('.//se:Rule', namespaces):
            #print rule.text
            prop = rule.find('.//ogc:PropertyIsEqualTo', namespaces)
            log.debug(prop[0].text)
            if prop[0].text == column:
                log.debug("in if")
                log.debug("Rule"+prop[1].text)
                if prop[1].text in distincts:
                    log.debug("add rule")
                    rules.append(rule)
    # Get the shape name to name UserStyle and NamedLayer in the sld file
    shape_name = os.path.basename(shape)
    shape_name = os.path.splitext(shape_name)[0]

    # Make a new sld from the frame
    new_sld = ET.ElementTree(ET.fromstring(frame))
    new_root = new_sld.getroot()

    # Set the shape_name
    layer_name = new_root.find('.//sld:NamedLayer/se:Name', namespaces)
    userstyle_name = new_root.find('.//sld:UserStyle/se:Name', namespaces)
    userstyle_name.text = shape_name
    layer_name.text = shape_name
    # Add the rules into the new SLD file
    featureStyle = new_root.find('.//se:FeatureTypeStyle', namespaces)
    for rule in rules:
        featureStyle.append(rule)
    # Save the sld file at shapefile.sld
    new_path = os.path.splitext(shape)[0] + '.sld'
    log.debug(new_path)
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

def get_rgb_json(sld):
    namespaces = {'se': 'http://www.opengis.net/se', 'xsi': 'http://www.w3.org/2001/XMLSchema-instance', \
                  'xlink': 'http://www.w3.org/1999/xlink', 'ogc': 'http://www.opengis.net/ogc', 'sld': 'http://www.opengis.net/sld'}
    tree = ET.parse(sld)
    root = tree.getroot()
    rgbs={}
    print sld
    for rule in root.findall('.//se:Rule', namespaces):
        print rule[0].tag
        if 'RasterSymbolizer' in rule[0].tag:
            print 'r'
            color_map = rule.find('.//se:ColorMap',namespaces)
            if color_map.attrib['type'] == 'values':
                for entry in color_map:
                    rgbs[entry.attrib['label']] = entry.attrib['color']
        else:
            title = rule.find('.//se:Title', namespaces).text
            print title
            rgbs[title] = rule.find('.//se:Fill/se:SvgParameter', namespaces).text
    print rgbs
    return json.dumps(rgbs)

def sld_from_csv(csvpath, column_name, outfile):

    frame = '''<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:se="http://www.opengis.net/se"
                xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
                  <sld:NamedLayer>
                    <se:Name>NAME</se:Name>
                    <sld:UserStyle>
                      <se:Name>NAME</se:Name>
                      <se:FeatureTypeStyle>
                      </se:FeatureTypeStyle>
                    </sld:UserStyle>
                  </sld:NamedLayer>
                </sld:StyledLayerDescriptor>'''

    namespaces = {'se': 'http://www.opengis.net/se', 'xsi': 'http://www.w3.org/2001/XMLSchema-instance', \
                  'xlink': 'http://www.w3.org/1999/xlink', 'ogc': 'http://www.opengis.net/ogc',
                  'sld': 'http://www.opengis.net/sld'}
    ruletext="""
    <se:Rule xmlns:se="http://www.opengis.net/se"
                xmlns:ogc="http://www.opengis.net/ogc">
          <se:Name>{class_name}</se:Name>
          <se:Description>
            <se:Title>{class_name}</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>{column}</ogc:PropertyName>
              <ogc:Literal>{column_value}</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">{rgb_code}</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">{rgb_code}</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>"""

    new_sld = ET.ElementTree(ET.fromstring(frame))
    new_root = new_sld.getroot()

    featureStyle = new_root.find('.//se:FeatureTypeStyle', namespaces)

    with open(csvpath) as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            print row
            red = hex(int(row['Red']))[2:]
            green = hex(int(row['Green']))[2:]
            blue = hex(int(row['Blue']))[2:]

            rgb_code = ''.join(['#',red,green,blue])
            ruletext_row = ruletext.format(class_name=row['Class Name'],column_value=row['Class ID'],rgb_code=rgb_code,column=column_name)
            print ruletext_row
            rule = ET.fromstring(ruletext_row)
            featureStyle.append(rule)

    new_sld.write(outfile)

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    path = "/home/user/swos/MAES_legend_fix.csv"
    sld_vec = "/home/user/swos/SLDs/templates/LULC_MAES.sld"
    out_ras = '/home/user/swos/SLDs/finals/SWD.sld'
    out = '/home/user/swos/LULC_MAES.sld'
    #print get_rgb_json(out_ras)
    #print get_rgb_json(sld_vec)
    column = "MAES_L2"
    sld_from_csv(path, column, out)
    exit()
    sld = '/home/user/swos/data/Spain_Fuente-de-Piedra/LULCC_L/SWOS_LULCC_L_Fuente-de-Piedra_1975-1989.shp'
    full_sld ='/home/user/swos/SLDs/templates/LULCC_L.sld'
    make_sld(sld, full_sld)
