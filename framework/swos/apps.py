from __future__ import unicode_literals

from django.apps import AppConfig
from geoserver.catalog import Catalog
import gs_instance.binding
import getpass
from gs_instance.ancillary import finder
import pysftp
from django.conf import settings
import os

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
    url = settings.GEOSERVER['default']['URL']
    geoserver_user = settings.GEOSERVER['default']['USER']
    geoserver_password = settings.GEOSERVER['default']['PASSWORD']
    cat = Catalog(url, username=geoserver_user, password=geoserver_password)
    # folder in which the 'SWOS_sites' folder is located
    sftp_folder = settings.SFTP['FOLDER']
    sftp_user = settings.SFTP['USER']
    sftp_url = settings.SFTP['URL']
    sftp_password = settings.SFTP['PASSWORD']
    #Get data from the SFTP Server of Jena-Optronik.
    print 'SEttings done'

    '''
    with pysftp.Connection(sftp_url, username=sftp_user, password=sftp_password) as sftp:
        sftp.chdir(sftp_folder)
        wetlands = sftp.listdir('SWOS_sites')
        sftp.chdir('SWOS_sites')
        print wetlands
        for site in wetlands:
            with sftp.cd(site):
            #todo: Check which folders changed.
                for product in sftp.listdir():
                    with sftp.cd(product):
                        files = sftp.listdir()
                        try:
                            local_files = os.listdir(os.path.join(settings.DEST_FOLDER,site, product))
                        except OSError:
                            local_files = []
                            print os.path.join(sftp_folder,site,product)
                            sftp.get_d('.', os.path.join(settings.DEST_FOLDER,site, product) )
                        print local_files
                        print site
                        print product
                        for thing in files:
                            if thing not in local_files:
                                print thing
                                sftp.get(thing,os.path.join(settings.DEST_FOLDER,site,product))
            #sftp.get_r(site, settings.DEST_FOLDER, preserve_mtime=True)
    exit()
    '''
    data = gs_instance.binding.main(cat, settings.DEST_FOLDER, settings.SLD_FOLDER, settings.PYCSW_URL)
    for thing in data:
        print thing['title']

    for layer_data in data:
        print layer_data
        print type(layer_data['wetland'])
        from layers.models import Layer, Contact
        from swos.models import WetlandLayer, Product, Wetland
        print 'initial_new'
        print layer_data['product']
        product = Product.objects.get(short_name=layer_data['product'])
        layer_data['product']=product

        wetland_name = layer_data['wetland']
        print wetland_name

        wetland = Wetland.objects.get(short_name=wetland_name)
        product.wetlands.add(wetland)
        layer_data['wetland']=wetland
        contact = Contact(**layer_data['dataset_contact_new'])
        layer_data['dataset_contact_new'] = contact
        layer = WetlandLayer(**layer_data)
        layer.save()