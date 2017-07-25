from django.conf.urls import url
from . import views

# register URLs for each app + media URLs
urlpatterns = [
    url(r'^layers.json$', views.ValidationLayerList.as_view(), name='validation_list'),
    url(r'^update$', views.ValidationUpdateSegment.as_view(), name='validation_update'),
    url(r'^segments$', views.ValidationListSegments.as_view(), name='validation_segments'),
    url(r'^segments/export$', views.ValidationSegmentsExport.as_view(), name='validation_segments_export'),
]