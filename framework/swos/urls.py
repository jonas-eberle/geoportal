from django.conf.urls import url
#from djgeojson.views import GeoJSONLayerView
from . import models, views

#class MapLayer(GeoJSONLayerView):
    # Options
    #precision = 4   # float


# register URLs for each app + media URLs
urlpatterns = [
    url(r'^wetlands.json$', views.WetlandsList.as_view(), name='wetland_list'),
    url(r'^wetlands.geojson$', views.WetlandGeometry.as_view(), name="wetland_geometry"), # replace dynamic create wetlands.geojson by static file
    url(r'^wetland/(?P<pk>[0-9]+)$', views.WetlandDetail.as_view(), name='wetland_detail'),
    url(r'^wetland/(?P<pk>[0-9]+)/panoramio.json$', views.Panoramio.as_view(), name='wetland_panoramio'),
    url(r'^wetland/(?P<pk>[0-9]+)/images.json$', views.WetlandImages.as_view(), name='wetland_images'),
    url(r'^wetland/(?P<pk>[0-9]+)/youtube.json$', views.YouTube.as_view(), name='wetland_youtube'),
    url(r'^wetland/(?P<pk>[0-9]+)/satdata.json$', views.SatelliteData.as_view(), name='wetland_satdata'),
    url(r'^wetland/(?P<pk>[0-9]+)/satdata/metadata$', views.SatelliteMetadata.as_view(), name='wetland_satmetadata'),
    url(r'^wetland/layer/(?P<pk>[0-9]+)/colors.json$', views.LayerColors.as_view(), name='wetland_layer_colors'),
    url(r'^(?P<pk>[0-9]+)/storyline.json$', views.StoryLineData.as_view(), name='wetland_story_line'),
    url(r'^searchresult.json$', views.Elasticsearch.as_view(), name="search"),
    url(r'^layer.json$', views.Layer.as_view(), name="layer"),
    url(r'^download$', views.DownloadData.as_view(), name="download_test"),
    url(r'^download_as_archive$', views.DownloadFiles.as_view(), name="download_archive"),
    url(r'^list_files$', views.ListFilesForDownload.as_view(), name="list_files"),
    url(r'^wetland/(?P<pk>[0-9]+)/satdata/download$', views.DownloadDataSentinel.as_view(), name="download_test2"),
    url(r'^wetland/(?P<pk>[0-9]+)/satdata/results', views.SatelliteMetadataExport.as_view(), name="download_satdata_results"),
    url(r'^externaldb.json', views.GetExternalDatabases.as_view(), name="global_data"),
    url(r'^countries.json', views.GetCountries.as_view(), name="national_data_countries"),
    url(r'^(?P<pk>[0-9]+)/nationaldata.json', views.GetNationalData.as_view(), name="national_data"),
    url(r'^nationaldata/statistics.json', views.NationalWetlandStatistics.as_view(), name="national_data_statistics"),
]

