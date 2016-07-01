from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = patterns('',
    url(r'^detail/(?P<pk>[0-9]+)$', views.MapViewerDetail.as_view(), name='mapviewer_detail')
)

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])