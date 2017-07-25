#from django.contrib import admin
from django.contrib.gis import admin
from .models import Wetland, Product, Indicator, IndicatorValue, WetlandLayer, ExternalDatabase, ExternalLayer, Country, WetlandImage, WetlandVideo

from layers.admin import LayersAdmin

import django
if django.VERSION < (1, 10): #todo remove
    from suit.admin import SortableModelAdmin
else:
    from suit.sortables import SortableModelAdmin

def make_publishable(modeladmin, request, queryset):
    queryset.update(publishable=True)
make_publishable.short_description = "Mark selected layers as fit for publication"

def make_unpublishable(modeladmin, request, queryset):
    queryset.update(publishable=False)
make_unpublishable.short_description = "Mark selected layers as unfit for publication"

class WetlandLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
            'classes': ('suit-tab', 'suit-tab-swos',),
            'fields': ('wetland', 'product', 'validation_layer', 'background_layer', 'validation_auxlayer')
        }),)
    list_display=('title','publishable', 'wetland', 'product')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos','SWOS'),)
    search_fields=('title','abstract','wetland__name', 'product__name')
    ordering =['title']
    list_filter=('publishable', 'wetland','product')

    actions=[make_publishable,make_unpublishable]

class ExternalLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
            'classes': ('suit-tab', 'suit-tab-swos',),
            'fields': ('datasource',)
        }),)
    list_display=('title','publishable', 'datasource')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos','SWOS'),)
    search_fields=('title','abstract','datasource__name', 'product__name')
    ordering =['title']
    list_filter=('publishable', 'datasource')

    actions=[make_publishable,make_unpublishable]


class Wetlands(admin.OSMGeoAdmin):
    list_display = ('name', 'country', 'identifier', 'geo_scale', 'partner', 'ecoregion', 'site_type', 'wetland_type' , 'service_case')
    ordering = ['name']
    list_filter = ('country', 'geo_scale', 'partner', 'ecoregion', 'site_type','wetland_type')

class ExternalDatabaseAdmin(admin.OSMGeoAdmin):
    list_display = ('name', 'description')

class CountryAdmin(admin.OSMGeoAdmin):
    list_display = ('name', 'continent')

class WetlandImageAdmin(admin.OSMGeoAdmin):
    list_display = ('name', 'image_tag', 'date', 'description', 'wetland' )
    fields = ('name', 'description', 'date', 'copyright', 'image', 'image_tag', 'image_size', 'wetland')
    readonly_fields = ('image_tag','image_size' )
    list_filter = ('wetland', )

class WetlandVideoAdmin(admin.OSMGeoAdmin):
    list_per_page = 100
    list_display = ('name', 'source', 'image_tag', 'date', 'description', 'youtube_cat_name', 'wetland' )
    fields = ('name', 'description', 'date', 'copyright', 'source', 'link', 'thumb_link', 'wetland')
    list_filter = ('wetland', 'source')
    search_fields=('name',)

class ProductAdmin(SortableModelAdmin):
    sortable = 'order'
    filter_horizontal = ('wetlands',)

class IndicatorAdmin(SortableModelAdmin):
    sortable = 'order'
    list_display = ('name', 'calculation', 'caluculation_reference_100_percent')

class IndicatorValuesAdmin(admin.ModelAdmin):
    list_display = ('name', 'value', 'time', 'time_2', 'indicator', 'wetland')

# Register your models here.
admin.site.register(Wetland, Wetlands)
admin.site.register(Product, ProductAdmin)
admin.site.register(Indicator, IndicatorAdmin)
admin.site.register(IndicatorValue, IndicatorValuesAdmin)
admin.site.register(WetlandLayer, WetlandLayerAdmin)
admin.site.register(ExternalDatabase, ExternalDatabaseAdmin)
admin.site.register(ExternalLayer, ExternalLayerAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(WetlandImage, WetlandImageAdmin)
admin.site.register(WetlandVideo, WetlandVideoAdmin)