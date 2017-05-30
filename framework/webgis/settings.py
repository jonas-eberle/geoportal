"""
Django settings for webgisDjango project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '9c=-i7dqc1_=31hk8qt8i$2zyi40w!p!!8&d*8d9on1#jsd^7%'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

# True: deliver JavaScript and CSS files as usual (e.g. for development)
# False: deliver bundled/minified files (e.g. for live system)
ASSETS_DEBUG = True

ALLOWED_HOSTS = ['localhost', 'artemis.geogr.uni-jena.de']

##################################################
# Application definition
INSTALLED_APPS = (
    'suit',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.gis',
    'rest_framework',
    'rest_framework.authtoken',
    'allauth',
    'allauth.account',
    'rest_auth',
    'rest_auth.registration',
    'cronjobs',
    'djgeojson',
    'authapi',
    'mapviewer',
    'layers',
    'csw',
    'swos',
    'django_assets'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    #'authapi.disable.disableCSRF',
)

ROOT_URLCONF = 'webgis.urls'

WSGI_APPLICATION = 'webgis.wsgi.application'

##################################################
# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        #'ENGINE': 'django.db.backends.sqlite3', 
        #'ENGINE': 'django.contrib.gis.db.backends.spatialite',
        #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        #'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'swos3',
        'USER': 'ANPASSEN',
        'PASSWORD': 'ANPASSEN',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

##################################################
# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

##################################################
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

#STATIC_ROOT = os.path.join(BASE_DIR, "static")
#STATIC_ROOT = '/Users/jonas/Workspaces/webgisDjango/static/'
SUBDIR = ''
#STATIC_URL = SUBDIR+'/static/'
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

ASSETS_ROOT = STATICFILES_DIRS[0]

#MEDIA_ROOT = 'D:/Workspaces/webgis/project/media/'
#MEDIA_ROOT = '/var/www/webgis.essi-services.net/media/'
MEDIA_ROOT = os.path.join(BASE_DIR,  'media/')
MEDIA_URL = SUBDIR + '/media/'

TEMPLATES_DIR = os.path.join(BASE_DIR,  'templates')

TEMPLATE_DIRS = (
    TEMPLATES_DIR,
)

##################################################
# django rest framework
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    )
}

##################################################
# django-suit adjustments
from django.conf.global_settings import TEMPLATE_CONTEXT_PROCESSORS as TCP
TEMPLATE_CONTEXT_PROCESSORS = TCP + (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.request',
    "allauth.account.context_processors.account",
)

SUIT_CONFIG = {
    'MENU': (
        {'app': 'sites', 'label': 'Site', 'models': ('site')},
        {'app': 'auth', 'label': 'Authorization', 'icon':'icon-user', 'models': ('user', 'group')},
        {'app': 'mapviewer', 'label': 'Mapviewer', 'models': ('mapviewer', 'baselayer')},
        {'app': 'layers', 'label': 'Layers', 'models': ('layergroup', 'layer', 'contact')},
        {'app': 'csw', 'label': 'Search', 'models': ('csw')},
        {'app': 'swos', 'label': 'SWOS', 'models': ('wetland', 'wetlandimage', 'wetlandvideo', 'product', 'indicator', 'wetlandlayer', 'externaldatabase', 'externallayer')},
    )
}

##################################################
# django-allauth
SITE_ID = 1
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = SUBDIR+'/'
ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL = ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
LOGIN_ON_EMAIL_CONFIRMATION = False
CONFIRM_EMAIL_ON_GET = True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"  # problems with "mandatory" when logging in...

#EMAIL_HOST = 'smtprelaypool.ispgateway.de'
#EMAIL_PORT = 465
#EMAIL_USE_TLS = True
#EMAIL_USE_SSL = False

EMAIL_HOST = 'smtp.essi-blog.org'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'dev@essi-blog.org'
EMAIL_HOST_PASSWORD = 'ANPASSEN'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# for testing mails we can use the console where the testserver was started
#EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

##################################################

# ie csrf cookie

CSRF_COOKIE_DOMAIN='localhost'
SESSION_COOKIE_DOMAIN='localhost'
USE_X_FORWARDED_HOST=True
#SESSION_COOKIE_SECURE=True
#CSRF_COOKIE_SECURE=True

#####################################################
#Settings for the geoserver integration functionality
# Geoserver Connection

#todo: Save the password somewhere safe.
GEOSERVER = {'default':{
        'URL': 'http://localhost:8082/geoserver/rest/',
        'USER': 'admin',
        'PASSWORD': 'geoserver'
    },
    'earthcare':{
        'URL': 'http://earthcare.ads.uni-jena.de:8080/geoserver/rest',
        'USER': 'ANPASSEN',
        'PASSWORD': 'ANPASSEN'
    },
    'artemis':{
        'URL':'http://artemis.geogr.uni-jena.de/geoserver/rest',
        'USER': 'ANPASSEN',
        'PASSWORD': 'ANPASSEN'
    }

}

#todo: Save the password somewhere safe.
SFTP = {
    'FOLDER':'products/',
    'URL':'swos-data.jena-optronik.de',
    'USER': 'ANPASSEN',
    'PASSWORD': 'ANPASSEN'
}

DEST_FOLDER = '/home/user/swos_data/'

SLD_FOLDER = '/home/user/swos/SLDs/'

METADATA_TEMPLATES = '/home/user/swos/meta_templates/'

METADATA_FOLDER = '/home/user/swos_data/meta/'

PYCSW_URL = 'http://localhost:8000'

METADATA_URL = 'http://artemis.geogr.uni-jena.de/geoserver/'
