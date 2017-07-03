from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^search/(?P<pk>[0-9]+)$', views.CSWRequest.as_view(), name='search'),
]