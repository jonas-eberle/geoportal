from __future__ import unicode_literals

from django.apps import AppConfig
from django.contrib.gis.geos import MultiPolygon, GEOSGeometry
from geoserver.catalog import Catalog
from django.forms.models import model_to_dict
from django.core.exceptions import ObjectDoesNotExist
import xml.etree.ElementTree as ET
import pysftp
from django.conf import settings
import os
from time import asctime
from gs_instance.sld import get_rgb_json
import gs_instance.binding
from gs_instance.metadata import generate_metadata_template
from osgeo import ogr


def check_sftp():
    """
    Check the sftp server for new products which could be uploaded.
    The login credentials and the local folder in which the data is saved are defined in the webgis/settings.
    This function assumes a SWOS_sites/wetland/product/some_data.shp structure.
    :return: None
    """
    #Get the parameters from the django.settings
    sftp_folder = settings.SFTP['FOLDER']
    sftp_user = settings.SFTP['USER']
    sftp_url = settings.SFTP['URL']
    sftp_password = settings.SFTP['PASSWORD']
    loc_folder = settings.DEST_FOLDER
    #Open a connection to the sftp
    with pysftp.Connection(sftp_url, username=sftp_user,password=sftp_password) as sftp:
        sftp.chdir(sftp_folder)
        # get a list of the available wetlands
        #todo: Define the folder in the settings file
        wetlands_rem = sftp.listdir('SWOS_sites')
        wetlands_loc = os.listdir(loc_folder)
        # Enter the SWOS_Sites folder on the remote server.
        sftp.chdir('SWOS_sites')
        #Check for additional wetlands, and download them
        wetlands_down = set(wetlands_rem).difference(wetlands_loc)
        for wetland in wetlands_down:
            sftp.get_r(wetland,loc_folder ,preserve_mtime=True)
        for wetland in wetlands_loc:
            # Check every wetland folder for additional products
            products_loc = os.listdir(os.path.join(loc_folder,wetland))
            products_rem = sftp.listdir(wetland)
            products_down = set(products_rem).difference(products_loc)
            with sftp.cd(wetland):
                for product in products_down:
                    sftp.get_r(product,loc_folder+wetland, preserve_mtime=True)
            for product in products_loc:
                # Check every product folder for additional layers
                files_loc = os.listdir(os.path.join(loc_folder,wetland,product))
                files_rem = sftp.listdir(u'/'.join([wetland,product]))
                files_down = set(files_rem).difference(files_loc)
                for thing in files_down:
                    sftp.get(u'/'.join([wetland,'/',product,'/',thing]), os.path.join(loc_folder,wetland,product,thing),preserve_mtime=True )


def add_layers(server_name='default'):
    """
        Add the products in settings.DEST_FOLDER into the given geoserver instance.
    :param server_name: Name of the geoserver instance, the credentials are defined in webgis/settings.py
    :return: None
    """
    url = settings.GEOSERVER[server_name]['URL']
    geoserver_user = settings.GEOSERVER[server_name]['USER']
    geoserver_password = settings.GEOSERVER[server_name]['PASSWORD']
    cat = Catalog(url, username=geoserver_user, password=geoserver_password)
    print 'SEttings done'

    data = gs_instance.binding.upload_data(cat, settings.DEST_FOLDER)


def add_data_in_django():
    """
    Add the layer in the earthcare geoserver into the Django instance.
    This function assumes, that the data is also on the local machine in the DEST_FOLDER
     and uses the .xml file of every layer to get the needed data.
    :return: None
    """
    print 'Start:', asctime()
    namespaces = {'gmd':"http://www.isotc211.org/2005/gmd", 'gco':"http://www.isotc211.org/2005/gco",'gml':"http://www.opengis.net/gml"}
    from layers.models import Layer, Contact
    from swos.models import WetlandLayer, Product, Wetland
    url = settings.GEOSERVER['earthcare']['URL']
    geoserver_user = settings.GEOSERVER['earthcare']['USER']
    geoserver_password = settings.GEOSERVER['earthcare']['PASSWORD']
    cat = Catalog(url, username=geoserver_user, password=geoserver_password)
    loc_folder = settings.DEST_FOLDER
    url = settings.METADATA_URL
    gs_resources = cat.get_resources()
    missing_meta = []
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
            for (k,v) in {'LST':'LSTT','LULC':'LULC','LULCC':'LULCC','SWD':'SWD','SSM':'SSM','Water_Quality':'WQ','Watershed':'Watershed'}.items():
                if v in name:
                    product_name = k
            xml = os.path.join(settings.DEST_FOLDER,workspace_name,product_name,name)+'.xml'
            try:
                tree = ET.parse(xml)
            except IOError as e:
                print e
                missing_meta.append([name, xml, e])
                continue

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
            if product_name in ['LULC', 'LULCC_L']:
                sld = os.path.join(loc_folder, workspace_name, product_name,name)+'.sld'
                shape_data['legend_colors'] = get_rgb_json(sld)
            elif product_name =='SWD':
                sld=os.path.join(settings.SLD_FOLDER,'finals','SWD.sld')
                shape_data['legend_colors'] =get_rgb_json(sld)
            shape_data['legend_url'] = legend_url


            root =tree.getroot()
            abstract = root.find('.//gmd:abstract',namespaces)
            shape_data['abstract'] = abstract[0].text

            shape_data['west'] = bounding_box[0]
            shape_data['east'] = bounding_box[1]
            shape_data['south'] = bounding_box[2]
            shape_data['north'] = bounding_box[3]

            shape_data['date_begin'] = root.find('.//gmd:EX_TemporalExtent.//gml:beginPosition')

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
    print missing_meta
    return

def add_slds(server_name):
    """
    Add the slds in the SLD_FOLDER into the geoserver instance at server_name
    The geoserver credentials are defined in the webgis/settings.py
    :param server_name: The name of the server in which the styles are uploaded.
    :return: None
    """
    url = settings.GEOSERVER[server_name]['URL']
    geoserver_user = settings.GEOSERVER[server_name]['USER']
    geoserver_password = settings.GEOSERVER[server_name]['PASSWORD']
    cat = Catalog(url, username=geoserver_user, password=geoserver_password)
    gs_instance.binding.add_styles(cat,settings.DEST_FOLDER,settings.SLD_FOLDER,reset=True)


def generate_metadata():
    """
    Generate Inspire conform metadata for every WetlandLayer from the data in the django database.

    :return: None
    """
    from swos.models import WetlandLayer

    layers = WetlandLayer.objects.all()
    for layer in layers:
        meta = model_to_dict(layer)
        product = layer.product
        meta['product'] = product.name
        print layer.title

        data_contact = layer.dataset_contact_new
        meta['data_contact_org'] = data_contact.organisation
        meta['data_contact_email'] = data_contact.email
        meta_contact = layer.meta_contact
        meta['meta_contact_org'] = 'Friedrich-Schiller University Jena'
        meta['meta_contact_email'] = 'felix.cremer@uni-jena.de'
        wetland = layer.wetland
        meta['wetland_name'] = wetland.name
        print wetland.short_name
        if not meta['equi_scale']:
            meta['equi_scale']="20"
        template = ''.join([settings.METADATA_TEMPLATES,'template_',product.short_name,'.xml'])
        outpath = ''.join([settings.METADATA_FOLDER,layer.identifier,'.xml'])
        generate_metadata_template(meta, outpath, template)

def update_wetland_geom(shapefile):

    from swos.models import Wetland
    from django.contrib.gis.gdal import DataSource
    datasource = DataSource(shapefile)
    print datasource
    layer = datasource[0]
    print layer.srs.srid
    print layer.fields
    new_wetlands = []
    for feature in layer:
        feature_dict = {}
        feature_dict['name'] = feature.get('Site_Name'.encode('utf-8'))
        feature_dict['geom'] = feature.geom.geos
        feature_dict['description'] = feature.get('Wet_Hab'.encode('utf-8'))
        feature_dict['country'] =  feature.get('Country'.encode('utf-8'))
        feature_dict['geo_scale'] = feature.get('geo_scale'.encode('utf-8'))
        feature_dict['size'] = feature.get('Area_Ha'.encode('utf-8'))
        #short_name = models.CharField(max_length=200, blank=True, null=True)
        feature_dict['partner'] = feature.get('link_part'.encode('utf-8'))
        #print feature_dict['geom']

        feature_dict['geom'] = GEOSGeometry(feature_dict['geom'],srid=3975)
        print feature_dict['geom'].geom_type,feature_dict['name']
        if not feature_dict['geom'].geom_type=='MultiPolygon':
            feature_dict['geom'] = MultiPolygon([feature_dict['geom']])
        print feature_dict['geom']
        try:
            print 'try'
            Wetland.objects.get(name=feature_dict['name'])
            Wetland.objects.filter(name=feature_dict['name']).update(**feature_dict)
        except ObjectDoesNotExist:
            print 'except'
            new_wetlands.append(feature_dict['name'])
            wetland = Wetland(**feature_dict)
            wetland.save()
    print new_wetlands