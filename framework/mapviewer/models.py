from django.db import models
from django.contrib.auth.models import User, Group

from csw.models import CSW
from layers.models import Layer
from webgis import settings


# Component model (not used at the moment)
#class Component(models.Model):
#    title = models.CharField(max_length=200)
#    slug = models.SlugField(default='')
#    description = models.TextField()
#
#    def __str__(self):
#        return self.title

# Template model (not used at the moment)
#class Template(models.Model):
#    title = models.CharField(max_length=200)
#    description = models.TextField()
#    #file = models.FilePathField(path='/Users/jonas/Workspaces/webgisDjango/templates', match=".*\.html")

#    def __str__(self):
#        return self.title


# BaseLayer model to provide baselayers for OpenLayers v3
class BaseLayer(models.Model):
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=[('BingMaps', 'BingMaps'), ('WMS', 'WMS'), ('WMTS', 'WMTS'), ('XYZ', 'XYZ'), ('MapQuest', 'MapQuest'), ('OSM', 'OSM')])
    url = models.CharField("URL", max_length=200, blank=True, null=True)
    layername = models.CharField(max_length=200, blank=True, null=True)
    imageformat = models.CharField(max_length=100, blank=True, null=True)

    # WMTS settings
    wmts_matrixset = models.CharField("WMTS matrix set", max_length=100, null=True, blank=True)
    wmts_resolutions = models.TextField("WMTS resolutions", blank=True, null=True, help_text="separated by space/blank character")
    wmts_projection = models.IntegerField("WMTS projection", blank=True, null=True, help_text="EPSG code (only number)")
    wmts_tilesize = models.IntegerField("WMTS tilesize", blank=True, null=True, help_text="e.g., 256, 512")

    def __unicode__(self):
        return self.title


# Mapviewer model to provide several viewers in the Django installation
class MapViewer(models.Model):
    # general
    title = models.CharField(max_length=200)
    template_file = models.FilePathField("Template file", path=settings.TEMPLATES_DIR+'/mapviewer', match=".*\.html")
    auth_registration = models.BooleanField("Allow user registration", default=False)
    search_url = models.ForeignKey(CSW, blank=True, null=True, verbose_name="Server for search field")
    addexternallayer = models.BooleanField("Allow external layers", default=False, help_text="(Hint: If activated, the button for add external layers to map by users is not hidden.)")

    # map
    center_lat = models.FloatField("Center latitude", default=90.0, help_text="Center coordinate (latitude)")
    center_lon = models.FloatField("Center longitude", default=25.0, help_text="Center coordinate (longitude)")
    center_proj = models.CharField("Center projection", max_length=15, default="EPSG:4326", help_text="EPSG projection code of center coordinate")
    map_proj = models.CharField("Map projection", max_length=15, default="EPSG:4326", help_text="EPSG projection code (e.g. EPSG:3857 - WGS84 Web Mercator, used in many popular web mapping applications (GoogleMaps/OpenStreetMap/etc))")
    map_resolutions = models.TextField("Map zoom resolutions", blank=True, null=True, help_text="Map resolutions (seperated by space/blank character)")
    zoom_min = models.IntegerField("Minimum zoom for map", default=0, help_text="Default: 0")
    zoom_max = models.IntegerField("Maximum zoom for map", default=28, help_text="(Hint: Please check the max supported zoom level of your used base layer.)")
    zoom_init = models.IntegerField("Initial zoom for map", default=4, help_text="Default: 4")

    # permissions
    auth_perm = models.BooleanField("Access permission", default=True, help_text="Restrict viewer access")
    auth_users = models.ManyToManyField(User, blank=True, verbose_name="Access users")
    auth_groups = models.ManyToManyField(Group, blank=True, verbose_name="Access groups")
    download_perm = models.BooleanField("Download permission", default=True)
    download_users = models.ManyToManyField(User, blank=True, related_name="download_users")
    download_groups = models.ManyToManyField(Group, blank=True, related_name="download_groups")

    # time slider
    time_slider = models.BooleanField("Time slider", default=False, help_text="Activate time slider")
    time_slider_start = models.DateTimeField("Starting date", blank=True, null=True)
    time_slider_end = models.DateTimeField("Ending date", blank=True, null=True)
    time_slider_interval = models.CharField("Step interval", max_length=100, choices=[('year', 'year'), ('month', 'month'), ('week', 'week'), ('day', 'day')], blank=True, null=True)
    time_slider_dates = models.TextField("Individual dates", blank=True, null=True, help_text="Dates separated by comma")
    
    #texts
    html_info = models.TextField("Info text (HTML)", blank=True, null=True, help_text="Please note: Line breaks will be converted to &lt;br&gt; tags")
    html_footer = models.TextField("Footer text (HTML)", blank=True, null=True)
    
    def __str__(self):
        return self.title


# Sortable BaseLayerInline model to reference baselayers and mapviewers
class BaseLayerInline(models.Model):
    order = models.PositiveIntegerField(default=0)
    baselayer = models.ForeignKey(BaseLayer)
    mapviewer = models.ForeignKey(MapViewer)

    def __unicode__(self):
        return self.baselayer.title

# Sortable BaseLayerInline model to reference baselayers and mapviewers
class LayerBaseInline(models.Model):
    order = models.PositiveIntegerField(default=0)
    title = models.CharField(max_length=200, blank=True, null=True)
    baselayer = models.ForeignKey(Layer, related_name='layerbase')
    mapviewer = models.ForeignKey(MapViewer)

    def __unicode__(self):
        return self.baselayer.title
