from __future__ import unicode_literals

from django.apps import AppConfig
from geoserver.catalog import Catalog
import xml.etree.ElementTree as ET
import pysftp
from django.conf import settings
import os
from time import asctime
from gs_instance.sld import get_rgb_json
import gs_instance.binding

class LayersConfig(AppConfig):
    name = 'layers'

'''
def create_test():
    from models import Test
    new_obj = Test(title='Titeltest', abstract='Mein Abstract')
    new_obj.save()
'''
def list_test():
    from models import Test
    for obj in Test.objects.all():
        print obj.title

def ingest_layer():
    print 'Test'
    from models import Layer
    layers = Layer.objects.all()
    if len(layers) == 0:
        print 'No Layers'
    else:
        for layer in layers:
            print layers.title
    print 'The end'

def check_sftp():
    sftp_folder = settings.SFTP['FOLDER']
    sftp_user = settings.SFTP['USER']
    sftp_url = settings.SFTP['URL']
    sftp_password = settings.SFTP['PASSWORD']
    loc_folder = settings.DEST_FOLDER
    print sftp_folder
    print sftp_user
    print sftp_url
    print loc_folder
    #print sftp_password
    with pysftp.Connection(sftp_url, username=sftp_user,password=sftp_password) as sftp:
        sftp.chdir(sftp_folder)
        print sftp.pwd
        wetlands_rem = sftp.listdir('SWOS_sites')
        wetlands_loc = os.listdir(loc_folder)
        sftp.chdir('SWOS_sites')
        print wetlands_loc
        wetlands_down = set(wetlands_rem).difference(wetlands_loc)
        print wetlands_down
        print sftp.pwd
        for wetland in wetlands_down:
            print sftp.exists(wetland)
            sftp.get_r(wetland,loc_folder ,preserve_mtime=True)
        for wetland in wetlands_loc:
            print wetland
            products_loc = os.listdir(os.path.join(loc_folder,wetland))
            products_rem = sftp.listdir(wetland)
            products_down = set(products_rem).difference(products_loc)
            with sftp.cd(wetland):
                for product in products_down:
                    sftp.get_r(product,loc_folder+wetland, preserve_mtime=True)
            for product in products_loc:
                print product
                files_loc = os.listdir(os.path.join(loc_folder,wetland,product))
                files_rem = sftp.listdir(u'/'.join([wetland,product]))
                files_down = set(files_rem).difference(files_loc)
                print files_rem
                print files_loc
                print files_down
                for thing in files_down:
                    sftp.get(u'/'.join([wetland,'/',product,'/',thing]), os.path.join(loc_folder,wetland,product,thing),preserve_mtime=True )
def add_layers():
    """
    Add the products in settings.DEST_FOLDER into the default geoserver
    """
    # todo: Add a variable to set which geoserver instance should be used
    url = settings.GEOSERVER['default']['URL']
    geoserver_user = settings.GEOSERVER['default']['USER']
    geoserver_password = settings.GEOSERVER['default']['PASSWORD']
    cat = Catalog(url, username=geoserver_user, password=geoserver_password)
    print 'SEttings done'

    data = gs_instance.binding.main(cat, settings.DEST_FOLDER, settings.SLD_FOLDER, settings.PYCSW_URL)
    for thing in data:
        print thing['title']


def add_data_in_django_xml():
    print 'Start:', asctime()
    namespaces = {'gmd':"http://www.isotc211.org/2005/gmd", 'gco':"http://www.isotc211.org/2005/gco",'gml':"http://www.opengis.net/gml"}
    from layers.models import Layer, Contact
    from swos.models import WetlandLayer, Product, Wetland
    url = settings.GEOSERVER['earthcare']['URL']
    geoserver_user = settings.GEOSERVER['earthcare']['USER']
    geoserver_password = settings.GEOSERVER['earthcare']['PASSWORD']
    cat = Catalog(url, username=geoserver_user, password=geoserver_password)
    loc_folder = settings.DEST_FOLDER
    url = url.replace('geoserver/rest', 'geoserver/')
    gs_resources = cat.get_resources()
    for gs_resource in gs_resources:
        name = gs_resource.name
        if WetlandLayer.objects.filter(identifier=name).count():
            print "The Layer {name} is already integrated into Django.".format(name=name)
            continue
        if 'SWOS' in name:
            print name, asctime()
            shape_data = {}
            shape_data['identifier'] = name
            shape_data['title'] = name.replace('SWOS_-_', '').replace('_', ' ')

            workspace_name = gs_resource.workspace.name
            name = gs_resource.name
            print workspace_name
            for prod in ['LST','LULC','LULCC','SWD','SSM','Water_Quality','Watershed']:
                if prod in name:
                    product_name=prod
            xml = os.path.join(settings.DEST_FOLDER,workspace_name,product_name,name)+'.xml'
            shape_data['epsg'] = '4326'
            bounding_box = gs_resource.latlon_bbox[:4]
            if gs_resource.url_part_types == 'featuretypes':
                type_string = 'wfs'
            else:
                type_string = 'wcs'
            country, wetland_name = workspace_name.split('_')
            testsite_url = ''.join([url, workspace_name, '/'])
            wms_url = ''.join([testsite_url, 'wms?'])
            type_url = ''.join([testsite_url, type_string, '?'])

            shape_data['download_url'] = type_url

            png = 'png/{z}/{x}/{y}.png'
            tms_url = '{url}gwc/service/tms/1.0.0/{testsite}:{layername}@EPSG:900913@{png}'
            tms_url = tms_url.format(testsite=workspace_name, layername=name, png=png, url=url)
            shape_data['ogc_link'] = tms_url
            shape_data['ogc_type'] = 'TMS'
            legend_url = ''.join(
                [wms_url, 'REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=',
                 workspace_name, ':', name, '&LEGEND_OPTIONS=forceLabels:on'])
            shape_data['legend_url'] = legend_url

            try:
                tree = ET.parse(xml)
            except IOError as e:
                print e
                return e
            root =tree.getroot()
            abstract = root.find('.//gmd:abstract',namespaces)
            shape_data['abstract'] = abstract[0].text

            shape_data['west'] = bounding_box[0]
            shape_data['east'] = bounding_box[1]
            shape_data['south'] = bounding_box[2]
            shape_data['north'] = bounding_box[3]

            dataset_contact = root.find('.//gmd:contact',namespaces)
            dataset_email = dataset_contact.find('.//gmd:electronicMailAddress',namespaces)
            dataset_email =  dataset_email[0].text
            try:
                dataset_contact = Contact.objects.get(email=dataset_email)
                shape_data['dataset_contact_new'] =dataset_contact
            except:
                print 'The contact information for', gs_instance,'is missing.'
                continue
            wetland = Wetland.objects.get(short_name=wetland_name)
            shape_data['wetland'] = wetland
            product = Product.objects.get(short_name=product_name)
            product.wetlands.add(wetland)
            shape_data['product'] = product
            layer = WetlandLayer(**shape_data)
            layer.save()
            print shape_data
            print asctime()
            return


def add_data_in_django():
    print 'Start:', asctime()
    from layers.models import Layer, Contact
    from swos.models import WetlandLayer, Product, Wetland
    url = settings.GEOSERVER['earthcare']['URL']
    geoserver_user = settings.GEOSERVER['earthcare']['USER']
    geoserver_password = settings.GEOSERVER['earthcare']['PASSWORD']
    cat = Catalog(url, username=geoserver_user, password=geoserver_password)
    loc_folder = settings.DEST_FOLDER
    url = url.replace('geoserver/rest', 'geoserver/')
    gs_layers = cat.get_layers()
    for gs_layer in gs_layers:

        shape_data = {}
        name =  gs_layer.name
        if WetlandLayer.objects.filter(identifier=name).count():
            print "The Layer {name} is already integrated into Django.".format(name=name)
            continue
        if 'SWOS_' in name:
            print name, asctime()
            product_name = gs_layer.default_style.name
            resource = gs_layer.resource
            #shape_data['epsg'] = resource.projection.replace('EPSG:','')
            shape_data['epsg'] = '4326'
            bounding_box = resource.latlon_bbox[:4]
            if resource.url_part_types == 'featuretypes':
                type_string = 'wfs'
            else:
                type_string = 'wcs'


            workspace_name = resource.workspace.name
            print workspace_name
            country, wetland_name = workspace_name.split('_')

            #shape_data.update(link_data)
            testsite_url = ''.join([url, workspace_name, '/'])
            wms_url = ''.join([testsite_url, 'wms?'])
            type_url = ''.join([testsite_url, type_string, '?'])

            shape_data['download_url'] = type_url

            png = 'png/{z}/{x}/{y}.png'
            tms_url = '{url}gwc/service/tms/1.0.0/{testsite}:{layername}@EPSG:900913@{png}'
            tms_url = tms_url.format(testsite=workspace_name, layername=name, png=png, url=url)
            shape_data['ogc_link'] = tms_url

            legend_url = ''.join([wms_url, 'REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=',
                                  workspace_name,':', name, '&LEGEND_OPTIONS=forceLabels:on'])
            shape_data['legend_url'] = legend_url
            if 'LULC_' in product_name:
                product_name = product_name.split('_')[1]
            elif 'LULCC_L' in product_name:
                product_name = '_'.join(product_name.split('_')[1:3])
            elif 'Water_Quality' in product_name:
                product_name = 'Water_Quality'
            shape_data['geo_description'] = ' '.join([wetland_name, 'in', country])
            shape_data['title'] = name.replace('SWOS_-_', '').replace('_', ' ')
            shape_data['identifier'] = name
            if product_name in ['LULC', 'LULCC_L']:
                sld = os.path.join(loc_folder, workspace_name, product_name,name)+'.sld'
                shape_data['legend_colors'] = get_rgb_json(sld)
            elif product_name =='SWD':
                sld=os.path.join(settings.SLD_FOLDER,'finals','SWD.sld')
                shape_data['legend_colors'] =get_rgb_json(sld)
            #tree = ET.parse(base + '.xml')
            #root = tree.getroot()
            #abstract = root.find('.//{http://www.isotc211.org/2005/gmd}abstract')[0].text
            #shape_data['abstract'] = abstract
            shape_data['west'] = bounding_box[0]
            shape_data['east'] = bounding_box[1]
            shape_data['south'] = bounding_box[2]
            shape_data['north'] = bounding_box[3]
            shape_data['ogc_type'] = 'TMS'
            print shape_data
            wetland = Wetland.objects.get(short_name=wetland_name)
            shape_data['wetland'] = wetland
            # todo: Contact information is missing
            print product_name
            product = Product.objects.get(short_name=product_name)
            product.wetlands.add(wetland)
            shape_data['product'] = product
            layer = WetlandLayer(**shape_data)
            layer.save()

def add_slds(server_name):
    url = settings.GEOSERVER[server_name]['URL']
    geoserver_user = settings.GEOSERVER[server_name]['USER']
    geoserver_password = settings.GEOSERVER[server_name]['PASSWORD']
    cat = Catalog(url, username=geoserver_user, password=geoserver_password)
    gs_instance.binding.add_styles(cat,settings.DEST_FOLDER,settings.SLD_FOLDER,reset=True)