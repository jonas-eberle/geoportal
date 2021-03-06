from django.test import TestCase
import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','webgis.settings')
from apps import add_layers, check_sftp, add_data_in_django,add_slds, generate_metadata
from apps import update_wetland_geom,slds_wq, month_publicable,set_default_style
import logging
from gs_instance.sld import get_rgb_json
from gs_instance.ancillary import finder
from django.conf import settings
from swos.models import Wetland,WetlandLayer,Product
from jsonschema import validate
logging.basicConfig(level=logging.DEBUG)
# Create your tests here.
django.setup()

update_wetland_geom('/media/sf_Shared_Folder/test_site_shp/Test_Sites_Delimitation_v41.shp')
#slds_wq()
#month_publicable('08','Water_Quality')
#check_sftp()
#add_slds('default')
#add_data_in_django('Spain_Fuente-de-Piedra')
#add_slds('default')
#add_layers('default')
#generate_metadata()



