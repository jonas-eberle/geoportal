from django.conf.urls import patterns, url
from . import views

urlpatterns = patterns('',
    url(r'^search/(?P<pk>[0-9]+)$', views.CSWRequest.as_view(), name='search'),
)