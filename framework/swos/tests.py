from django.test import TestCase
import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','webgis.settings')
from apps import add_layers, check_sftp, add_data_in_django,add_slds
import logging
logging.basicConfig(level=logging.INFO)
# Create your tests here.

django.setup()
#check_sftp()
add_data_in_django()
#add_slds()

#add_layers()
#check_sftp()

