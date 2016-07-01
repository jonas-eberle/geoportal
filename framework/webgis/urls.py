from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
from webgis import views

# register URLs for each app + media URLs
urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^session$', views.sessions, name='sessions'),
    url(r'^authapi/', include('authapi.urls')),
    url(r'^mapviewer/', include('mapviewer.urls')),
    url(r'^layers/', include('layers.urls')),
    url(r'^csw/', include('csw.urls')),
    url(r'^swos/', include('swos.urls')),
    url(r'^admin/', include(admin.site.urls)),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
