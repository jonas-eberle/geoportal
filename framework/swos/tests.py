from django.test import TestCase
import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','webgis.settings')
from apps import add_layers, check_sftp, add_data_in_django,add_slds, generate_metadata
import logging
logging.basicConfig(level=logging.DEBUG)
# Create your tests here.

django.setup()

#check_sftp()
#add_slds('earthcare')
#add_data_in_django()
add_slds('default')
#generate_metadata()


