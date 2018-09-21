from django.conf.urls import url
from . import models, views

# register URLs for each app + media URLs
urlpatterns = [
    url(r'^regions.json$', views.RegionsList.as_view(), name='region_list'),
    url(r'^regions.geojson$', views.RegionsGeometry.as_view(), name="region_geometry"), # replace dynamic create wetlands.geojson by static file
    url(r'^region/(?P<pk>[0-9]+)$', views.RegionDetail.as_view(), name='region_detail'),
    url(r'^region/(?P<pk>[0-9]+)/satdata.json$', views.SatelliteData.as_view(), name='region_detail'),
    url(r'^region/(?P<pk>[0-9]+)/satdata/metadata$', views.SatelliteMetadata.as_view(), name='wetland_satmetadata'),
    url(r'^region/(?P<pk>[0-9]+)/satdata/results', views.SatelliteMetadataExport.as_view(), name="download_satdata_results"),
]