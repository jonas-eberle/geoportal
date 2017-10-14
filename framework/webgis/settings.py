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


# WARNING: disable ASSETS_DEBUG in production!
# True: deliver JavaScript and CSS files as usual (e.g. for development)
# False: deliver bundled/minified files (e.g. for live system)
ASSETS_DEBUG = True
# WARNING: disable ASSETS_AUTO_BUILD in production!
# True: automatically rebuild bundles if source files have changed
ASSETS_AUTO_BUILD = True

ALLOWED_HOSTS = ['localhost', 'artemis.geogr.uni-jena.de', 'swos.ssv-hosting.de', 'swos2.ssv-hosting.de']

##################################################
# Application definition
INSTALLED_APPS = (
    'webgis.apps.SuitConfig',
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
    'validation',
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
        'NAME': 'swos_valtool',
        'USER': 'USER',
        'PASSWORD': 'PASSWORD',
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
SUBDIR = ''
#STATIC_URL = SUBDIR+'/static/'
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
    os.path.join(os.path.dirname(BASE_DIR), 'node_modules'),
)

ASSETS_LOAD_PATH = [
    os.path.join(os.path.dirname(BASE_DIR), 'node_modules'),
    STATICFILES_DIRS[0]
]
ASSETS_ROOT = STATICFILES_DIRS[0]

STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
    "npm.finders.NpmFinder",
    "django_assets.finders.AssetsFinder"
)

NPM_ROOT_PATH = os.path.join(os.path.dirname(BASE_DIR))

UGLIFYJS_BIN = os.path.join(os.path.dirname(BASE_DIR), 'node_modules/.bin/uglifyjs')
UGLIFYJS_EXTRA_ARGS = (
    '--mangle "reserved=[$,angular]"',
    '--compress',
)

MEDIA_ROOT = os.path.join(BASE_DIR,  'media/')
MEDIA_URL = SUBDIR + '/media/'


##################################################
# django rest framework
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    )
}

##################################################
# django-suit adjustments
import django

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',  # Make sure you have this line
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

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
LOGIN_REDIRECT_URL = '/'

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

# for testing mails we can use the filebackend, emails are stored as files in the foleder specified
EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
if not os.path.exists(os.path.join(BASE_DIR, "media", "email")):
    os.mkdir(os.path.join(BASE_DIR, "media", "email"))
EMAIL_FILE_PATH = os.path.join(BASE_DIR, "media", "email") # change this to a proper location

##################################################
# ie csrf cookie
CSRF_COOKIE_DOMAIN='localhost'
SESSION_COOKIE_DOMAIN=CSRF_COOKIE_DOMAIN
USE_X_FORWARDED_HOST=True
#SESSION_COOKIE_SECURE=True
#CSRF_COOKIE_SECURE=True

##################################################
# satellite data discovery

EARTH_EXPLORER_USER = 'USERNAME'
EARTH_EXPLORER_PASSWORD = 'PASSWORD'

ESA_DATAHUB_USER = 'USERNAME'
ESA_DATAHUB_PASSWORD = 'PASSWORD'

ESA_SSO_USER = 'USERNAME'
ESA_SSO_PASSWORD = 'PASSWORD'

##################################################
# Publish (Insert/Delete) metadata with CSW-Transactional

CSW_T = False #true: active , empty/false: deactivated
CSW_T_PATH = 'ANPASSEN' #path to pycsw/csw.py; pycsw.cfg: transactions=true, allowed_ips=xxx

##################################################
# Elasticsearch

ELASTICSEARCH = False #true: active , empty/false: deactivated
ELASTICSEARCH_HOSTS = ['ANPASSEN'] 

##################################################
# END
##################################################
