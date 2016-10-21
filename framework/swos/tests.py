from django.test import TestCase
import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','webgis.settings')
from apps import add_layers, check_sftp, add_data_in_django_xml,add_slds
import logging
logging.basicConfig(level=logging.DEBUG)
# Create your tests here.

django.setup()
#check_sftp()
add_data_in_django_xml()
#add_slds('default')

#add_layers()
#check_sftp()

