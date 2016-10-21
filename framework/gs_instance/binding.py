# -*- coding: utf-8 -*-
"""
Geoserver Handling for SWOS. It defines a few functions for the integration of products into the SWOS-geoserver.

@author Felix Cremer
felix.cremer@uni-jena.de
"""
from geoserver.catalog import Catalog, ConflictingDataError
import os.path
import requests
import argparse
from metadata import add_linkage, upload_cswt
import xml.etree.ElementTree as ET
from sld import crop_sld, get_rgb_json, make_sld
import getpass
from ancillary import finder
import logging

log = logging.getLogger(__name__)

def integrate_shape(shape, cat, ws, style):
    """
    Integrate the shapefile at shape into the geoserver with the connection cat. This works via linking. So the .shp
    is not copied.
    :param shape: path to a shapefile
    :param cat: Catalog instance of a geoserver
    :param ws: workspace in which the layer should be integrated as a string
    :return: None
    """
    url = cat.service_url
    auth = (cat.username, cat.password)
    headers = {"Content-type": 'text/plain'}
    name = os.path.splitext(os.path.basename(shape))[0]
    url = ''.join([url,'/workspaces/', ws, '/datastores/', name, '/external.shp'])

    file_name = os.path.abspath(shape)
    data = ''.join(['file://',file_name])
    r = requests.put(url, headers=headers, data=data, auth=auth )
    log.debug(r)
    layer = cat.get_layer(name)
    layer._set_default_style(style)
    cat.save(layer)

def upload_data(cat, folder):

    try:
        print cat.gsversion()
    except Exception:
        log.error('The connection to the geoserver fails')
        return None


    missing_slds = []
    raster_exts = ['*.tif', '*.tiff', '*.geotiff', '*.geotif']
    files = finder(folder, raster_exts + ['*.shp'])
    log.debug(files)
    log.info(len(files))
    for shape in files:
        base, type = os.path.splitext(shape)
        name = os.path.basename(base)
        log.debug(name)
        if cat.get_layer(name):
            log.info('The layer {name} is already integrated'.format(name=base))
            continue
        elif cat.get_resource(name):
            log.info('The layer {name} is already integrated'.format(name=base))
            continue
        else:
            log.info(name)
            #Split the filepath into product and country needs the defined folder structure
            dirs = os.path.dirname(base).split('/')
            product = dirs[-1]
            country_wetland = dirs[-2]
            country, wetland = country_wetland.split('_')

            if product in ['LULC','LULCC','LST']:
                style = name
            elif product == 'Water_Quality':
                style = '_'.join([product,wetland])
            else:
                style = product

            if not cat.get_workspace(country_wetland):
                cat.create_workspace(country_wetland, 'http://swos-service.eu/' + country_wetland)
            if type == '.shp':
                integrate_shape(shape, cat, country_wetland, style)
            elif '*'+type in raster_exts:
                ws = cat.get_workspace(country_wetland)
                cat.create_coveragestore(name, shape, ws)
                layer = cat.get_layer(name)
                log.debug(layer)
                layer._set_default_style(style)
                cat.save(layer)


def main(cat, folder, sld_folder, pycsw_url):
    """
    Search for .shp files in the folders and checks if they are already in the geoserver.
    Then makes a cropped .sld file for every layer, for which the product is in the sld_templates folder and
     changes the default style to this sld.
     It adds the linkage to the geoserver into the metadata of the file.
    :param cat: Catalog connection into a geoserver
    :param folder: folder where the shapefiles are located.
    :param sld_folder: folder where the sld_templates are located
    :param config: path to the config-file of pycsw, should not be needed, if the upload is changed to CSW-T
    :return: A list of dictionaries, one for every layer with the data for the Django framework.
    """

    try:
        print cat.gsversion()
    except Exception:
        log.error('The connection to the geoserver fails')
        return None


    data=[]
    fieldnames = ['title', 'abstract', 'legend_url', 'west', 'east', 'south', 'north','wetland','product','geo_description']
    shape_data = {field:'' for field in fieldnames}
    missing_meta = []
    missing_slds = []
    raster_exts = ['*.tif', '*.tiff', '*.geotiff', '*.geotif']

    files =  finder(folder, raster_exts+['*.shp'])
    log.debug(files)
    log.info(len(files))

    for shape in files:
        shape_data = {}
        base, type = os.path.splitext(shape)
        name = os.path.basename(base)
        log.debug(name)
        # Check if the layer is already integrated
        if cat.get_layer(name):
            log.info('The layer {name} is already integrated'.format(name=base))
            continue
        elif cat.get_resource(name):
            log.info('The layer {name} is already integrated'.format(name=base))
            continue
        else:
            log.info(name)
            #Split the filepath into product and country needs the defined folder structure
            dirs = os.path.dirname(base).split('/')
            product = dirs[-1]
            country_wetland = dirs[-2]
            country, wetland = country_wetland.split('_')

            if product == 'LULC':
                name_list = name.split('_')
                product_style = '_'.join([name_list[1],name_list[2]])
            elif product == 'Water_Quality':
                product_style = '_'.join([product,wetland])
            else:
                product_style = product


            # Check the sld_templates folder for products
            templates = map(os.path.basename,finder(os.path.join(sld_folder, 'templates/'), ['*.sld']))
            templates = [os.path.splitext(temp)[0] for temp in templates]

            # Check the sld_folder/finals for slds.
            finals = map(os.path.basename,finder(os.path.join(sld_folder, 'finals/'), ['*.sld']))
            finals = [os.path.splitext(temp)[0] for temp in finals]

            # Make a specific .sld file from the template and integrate it into the geoserver
            if product_style in templates:
                if not cat.get_style(name):
                    print cat.get_style(name)
                    if not os.path.isfile(base + '.sld'):
                        crop_sld(shape, os.path.join(sld_folder, 'templates', product_style) + '.sld')
                    sld = ''.join([base, '.sld'])
                    try:
                        with open(sld) as f:
                            cat.create_style(name, f.read(), overwrite=False, style_format="sld11")
                    except ConflictingDataError:
                        pass
                style=name
            # Integrate the style in the geoserver
            elif product_style in finals:
                if not cat.get_style(product_style):
                    print cat.get_style(product_style)
                    sld = ''.join([os.path.join(sld_folder,'finals/',product_style),'.sld'])
                    try:
                        with open(sld) as f:
                            cat.create_style(product_style, f.read(), overwrite=False, style_format="sld11")
                    except ConflictingDataError:
                        pass

                style=product_style
            else:
                log.warning('The SLD for {product} is missing'.format(product=product_style))
                missing_slds.append(product_style)
                continue
            log.debug(style)

            # Create the geoserver workspace if needed
            if not cat.get_workspace(country_wetland):
                cat.create_workspace(country_wetland, 'http://swos-service.eu/' + country_wetland)

            #Integrate the layer into geoserver, method depends on the type
            if type == '.shp':
                integrate_shape(shape, cat, country_wetland, style)
            elif '*'+type in raster_exts:
                ws = cat.get_workspace(country_wetland)
                cat.create_coveragestore(name, shape, ws)
                layer = cat.get_layer(name)
                log.debug(layer)
                layer._set_default_style(style)
                cat.save(layer)
            # Add the geoserver links into the metadata
            try:
                link_data = add_linkage(base + '.xml', type,url=cat.service_url+'/')
                upload_cswt(base+'.xml',pycsw_url)
            except IOError as e:
                log.warning('The metadata for the layer {name} can not be integrated'.format(name=base))
                missing_meta.append(name)
                continue


            # Format the metadata of the file into a dictionary, so that we could integrate it into Django.
            shape_data.update(link_data)
            shape_data['product'] = product
            shape_data['wetland'] = wetland
            shape_data['geo_description'] = ' '.join([wetland, 'in', country])
            shape_data['title'] = name.replace('SWOS_-_','').replace('_', ' ')
            shape_data['identifier'] = name
            shape_data['legend_colors'] = get_rgb_json(sld)

            tree = ET.parse(base+'.xml')
            root = tree.getroot()
            abstract = root.find('.//{http://www.isotc211.org/2005/gmd}abstract')[0].text
            shape_data['abstract'] = abstract
            ref_sys = root.find('.//{http://www.isotc211.org/2005/gmd}MD_ReferenceSystem')
            try:
                ref_code = ref_sys.find('.//{http://www.isotc211.org/2005/gmd}code')[0].text
                ref_code = ref_code.split('/')[-1]
            except AttributeError:
                ref_code = str(4326)
            shape_data['epsg'] = ref_code
            bounding_box = root.find('.//{http://www.isotc211.org/2005/gmd}EX_GeographicBoundingBox')
            shape_data['west'] = bounding_box[0][0].text
            shape_data['east'] = bounding_box[1][0].text
            shape_data['south'] = bounding_box[2][0].text
            shape_data['north'] = bounding_box[3][0].text
            shape_data['ogc_type'] = 'TMS'
            contact_info = root.find('.//{http://www.isotc211.org/2005/gmd}contact/{http://www.isotc211.org/2005/gmd}CI_ResponsibleParty')
            contact = {}
            contact['organisation'] = contact_info.find('.//{http://www.isotc211.org/2005/gmd}organisationName')[0].text
            contact['email'] = contact_info.find('.//{http://www.isotc211.org/2005/gmd}electronicMailAddress')[0].text
            shape_data['dataset_contact_new'] = contact
            data.append(shape_data)
        log.debug('End of for')
    log.info(missing_slds)
    return data

def add_styles(cat, folder, sld_folder,reset=False,individual=True):
    missing_slds = []
    raster_exts = ['*.tif', '*.tiff', '*.geotiff', '*.geotif']
    files =  finder(folder, raster_exts+['*.shp'])
    print cat.service_url
    for shape in files:
        shape_data = {}
        sld_version = 'sld11'
        base, type = os.path.splitext(shape)
        name = os.path.basename(base)
        dirs = os.path.dirname(base).split('/')
        product = dirs[-1]
        if product == 'LULC':
            name_list = name.split('_')
            product_style = '_'.join([name_list[1], name_list[2]])
        else:
            product_style = product
        country_wetland = dirs[-2]

        # Check the sld_templates folder for products
        templates = map(os.path.basename, finder(os.path.join(sld_folder, 'templates/'), ['*.sld']))
        templates = [os.path.splitext(temp)[0] for temp in templates]

        # Check the sld_folder/finals for slds.
        finals = map(os.path.basename, finder(os.path.join(sld_folder, 'finals/'), ['*.sld']))
        finals = [os.path.splitext(temp)[0] for temp in finals]
        print product_style
        # Make a specific .sld file from the template and integrate it into the geoserver
        if product_style in templates:
            log.debug('template')
            log.debug(not os.path.isfile(base + '.sld') or reset)
            if not os.path.isfile(base + '.sld') or reset:
                log.debug('Start Making the sld')
                log.debug(str(shape))
                if product in ['LULC','LULCC']:
                   sld_version =  crop_sld(shape, os.path.join(sld_folder, 'templates', product_style) + '.sld')
                elif product == 'LST':
                    sld_version = make_sld(shape,os.path.join(sld_folder, 'templates',product_style)+'.sld')
            sld = ''.join([base, '.sld'])
            root = ET.parse(sld).getroot()
            if root.attrib['version'] == '1.0.0':
                sld_version = 'sld10'
            elif root.attrib['version'] == '1.1.0':
                sld_version = 'sld11'
            try:
                with open(sld) as f:
                    cat.create_style(name, f.read(), overwrite=False, style_format=sld_version)
            except ConflictingDataError:
                pass
            finally:
                style = name

        # Integrate the style in the geoserver
        #todo: Der upload von templates und finals sieht sehr ähnlich aus. Da kann man noch code rausschmeißen.
        elif product_style in finals:
            if individual:
                log.debug('continue')
                continue
            sld = ''.join([os.path.join(sld_folder, 'finals/', product_style), '.sld'])
            root = ET.parse(sld).getroot()
            if root.attrib['version'] == '1.0.0':
                sld_version = 'sld10'
            elif root.attrib['version'] == '1.1.0':
                sld_version = 'sld11'

            try:
                with open(sld) as f:
                    cat.create_style(product_style, f.read(), overwrite=False, style_format=sld_version)
            except ConflictingDataError:
                pass
            finally:
                style = product_style
        else:
            log.warning('The SLD for {product} is missing'.format(product=product_style))
            missing_slds.append([product_style,name])
            continue
        try:
            layer = cat.get_layer(name)
            log.debug(layer)
            layer._set_default_style(style)
            cat.save(layer)
        except AttributeError:
            print
        log.debug(style)
    print missing_slds



if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', help='The url to the geoserver', default='http://localhost:8080/geoserver/rest/')
    parser.add_argument('folder', help ='The folders  with the data, It takes a list of folders')
    parser.add_argument('--sld_templates', help='The folder with the full sld files for all products', default = '/home/qe89hep/geoserver/SLDs')
    parser.add_argument('--pycsw', help='The url to the pycsw instance', default='http://localhost:8000/')
    parser.add_argument('user', help='The user of the geoserver')
    parser.add_argument('--logging', '-l', help='Set the logging level', choices=['ERROR','INFO','WARNING','DEBUG','CRITICAL'])

    args = vars(parser.parse_args())
    if args['logging']:
        logging.basicConfig(level=args['logging'])
    if args['user'] == 'admin':
        password = 'geoserver'
    else:
        password = getpass.getpass('The password for geoserver:')
    cat = Catalog(args['url'], username=args['user'], password= password)
    data = main(cat,args['folder'], args['sld_templates'],args['pycsw'])
    log.info(data)
