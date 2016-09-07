import os
import sys
import site

# Add the site-packages of the chosen virtualenv to work with
site.addsitedir('/home/sibessc/workspace/swos/venv/local/lib/python2.7/site-packages')

# Add the app's directory to the PYTHONPATH
sys.path.append('/home/sibessc/workspace/swos/framework')
sys.path.append('/home/sibessc/workspace/swos/framework/webgis')

os.environ['DJANGO_SETTINGS_MODULE'] = 'webgis.settings'

# Activate your virtual env
activate_env=os.path.expanduser("/home/sibessc/workspace/swos/venv/bin/activate_this.py")
execfile(activate_env, dict(__file__=activate_env))

#import django.core.handlers.wsgi
#application = django.core.handlers.wsgi.WSGIHandler()
import django.core.wsgi
application = django.core.wsgi.get_wsgi_application()
