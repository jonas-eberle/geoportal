from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^list/$', views.LayerList.as_view(), name='layer_list'),
    url(r'^detail/(?P<pk>[0-9]+)$', views.LayerDetail.as_view(), name='layer_detail'),
    url(r'^detail/(?P<pk>[0-9]+)/download$', views.LayerDownload.as_view(), name='layer_download'),
    url(r'^info$', views.LayerInfo.as_view(), name='layer_feature_info'),
    url(r'^data$', views.DataRequest.as_view(), name='external_proxy'),
    url(r'^capabilities/time$', views.GetTimeValues.as_view(), name='layer_time_values'),
    url(r'^capabilities/WMS$', views.GetWMSCapabilities.as_view(), name='layer_capabilities_wms'),
    url(r'^capabilities/WMTS$', views.GetWMTSCapabilities.as_view(), name='layer_capabilities_wmts'),
    url(r'^sos/(?P<pk>[0-9]+)/stations$', views.GetSOSStations.as_view(), name='sos_stations'),
    url(r'^sos/data$', views.GetSOSObservation.as_view(), name='sos_data'),
]

# Used for detail/<pk>.json
from rest_framework.urlpatterns import format_suffix_patterns
urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json'])