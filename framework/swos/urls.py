from django.conf.urls import patterns, url
from djgeojson.views import GeoJSONLayerView
from . import models, views

# register URLs for each app + media URLs
urlpatterns = patterns('',
    url(r'^wetlands.json$', views.WetlandsList.as_view(), name='wetland_list'),
    url(r'^wetlands.geojson$', GeoJSONLayerView.as_view(model=models.Wetland, properties=('id', 'name', 'country', 'geo_scale', 'size', 'description','ecoregion', 'wetland_type', 'site_type', 'products')), name='wetlands'),
    url(r'^wetland/(?P<pk>[0-9]+)$', views.WetlandDetail.as_view(), name='wetland_detail'),
    url(r'^wetland/(?P<pk>[0-9]+)/panoramio.json$', views.Panoramio.as_view(), name='wetland_panoramio'),
    url(r'^wetland/(?P<pk>[0-9]+)/images.json$', views.WetlandImages.as_view(), name='wetland_images'),
    url(r'^wetland/(?P<pk>[0-9]+)/youtube.json$', views.YouTube.as_view(), name='wetland_youtube'),
    url(r'^wetland/(?P<pk>[0-9]+)/satdata.json$', views.SatelliteData.as_view(), name='wetland_satdata'),
    url(r'^wetland/layer/(?P<pk>[0-9]+)/colors.json$', views.LayerColors.as_view(), name='wetland_layer_colors'),
)