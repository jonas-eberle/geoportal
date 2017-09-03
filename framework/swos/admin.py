#from django.contrib import admin
from django.contrib.gis import admin
from .models import Wetland, Product, Indicator, IndicatorValue, WetlandLayer, ExternalDatabase, ExternalLayer, Country, WetlandImage, WetlandVideo

from layers.admin import LayersAdmin

import django

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
            'fields': ('wetland', 'product', 'indicator')
        }),)
    list_display=('title','publishable', 'wetland', 'product')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos','SWOS'),)
    search_fields=('title','abstract','wetland__name', 'product__name')
    ordering =['title']
    list_filter=('publishable','wetland','product')
    suit_list_filter_horizontal = ('wetland','product','publishable')

    actions=[make_publishable,make_unpublishable]

    def suit_row_attributes(self, obj, request):
        class_map = {
            True: 'table-success',
            False: 'table-danger',
        }

        css_class = class_map.get(obj.publishable)
        if css_class:
            return {'class': css_class}


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
    suit_list_filter_horizontal = ('datasource', )

    actions=[make_publishable,make_unpublishable]

class Wetlands(admin.OSMGeoAdmin):
    list_display = ('name', 'country', 'identifier', 'geo_scale', 'partner', 'ecoregion', 'site_type', 'wetland_type' , 'service_case')
    ordering = ['name']
    search_fields = ('name', 'country', 'geo_scale', 'partner', 'ecoregion', 'site_type','wetland_type')
    list_filter = ('country', 'geo_scale', 'partner', 'ecoregion', 'site_type','wetland_type')
    suit_list_filter_horizontal = ('country','ecoregion', 'partner')

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
    suit_list_filter_horizontal = ('wetland')

class ProductAdmin(SortableModelAdmin):
    sortable = 'order'
    filter_horizontal = ('wetlands',)

class IndicatorAdmin(SortableModelAdmin):
    sortable = 'order'
    list_display = ('name', 'description', 'short_name', 'parent_indicator')

class IndicatorValuesAdmin(admin.ModelAdmin):
    list_display = ('value_absolut', 'unit', 'value_percent', 'time', 'time_end', 'time_ref_parts', 'indicator', 'wetland')

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