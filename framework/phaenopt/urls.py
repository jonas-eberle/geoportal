from django.conf.urls import url
from . import models, views

# register URLs for each app + media URLs
urlpatterns = [
    url(r'^region/(?P<pk>[0-9]+)$', views.RegionDetail.as_view(), name='region_detail'),
    #url(r'^region/(?P<pk>[0-9]+)/satdata.json$', views.SatelliteData.as_view(), name='wetland_satdata'),
]

