import os
import sys
import site

# set path
#application_path = '/home/sibessc/workspace/swos/valtool'
application_path = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir))

# Add the site-packages of the chosen virtualenv to work with
site.addsitedir(os.path.join(application_path, 'venv/local/lib/python2.7/site-packages'))

# Add the app's directory to the PYTHONPATH
sys.path.append(os.path.join(application_path, 'framework'))
sys.path.append(os.path.join(application_path, 'framework/webgis'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'webgis.settings'

# Activate your virtual env
activate_env=os.path.expanduser(os.path.join(application_path, 'venv/bin/activate_this.py'))
execfile(activate_env, dict(__file__=activate_env))

#import django.core.handlers.wsgi
#application = django.core.handlers.wsgi.WSGIHandler()
import django.core.wsgi
application = django.core.wsgi.get_wsgi_application()
