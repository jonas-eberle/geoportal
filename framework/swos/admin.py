from django.contrib.gis import admin
from suit.sortables import SortableModelAdmin

from layers.admin import LayersAdmin
from .models import Wetland, Product, Indicator,  WetlandLayer
from content.admin import make_downloadable, make_non_downloadable, make_publishable, make_unpublishable


class Wetlands(admin.OSMGeoAdmin):
    list_display = (
    'name', 'country', 'identifier', 'geo_scale', 'partner', 'ecoregion', 'site_type', 'wetland_type', 'service_case')
    ordering = ['name']
    search_fields = ('name', 'country', 'geo_scale', 'partner', 'ecoregion', 'site_type', 'wetland_type')
    list_filter = ('country', 'geo_scale', 'partner', 'ecoregion', 'site_type', 'wetland_type')
    suit_list_filter_horizontal = ('country', 'ecoregion', 'partner')


class ProductAdmin(SortableModelAdmin):
    sortable = 'order'
    filter_horizontal = ('wetlands',)


class IndicatorAdmin(SortableModelAdmin):
    sortable = 'order'
    list_display = ('name', 'short_name', 'order')


class WetlandLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
            'classes': ('suit-tab', 'suit-tab-swos',),
            'fields': ('wetland', 'country', 'product', 'indicator')
        }),)
    list_display=('title','publishable', 'downloadable', 'wetland', 'product', 'indicator')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos','SWOS'),)
    search_fields=('title','abstract','wetland__name', 'product__name')
    ordering =['title']
    list_filter=('publishable', 'downloadable', 'wetland','product', 'indicator')
    suit_list_filter_horizontal = ('wetland','product','indicator', 'publishable', 'downloadable')

    actions=[make_publishable,make_unpublishable, make_downloadable, make_non_downloadable]

    def suit_row_attributes(self, obj, request):
        class_map = {
            True: 'table-success',
            False: 'table-danger',
        }

        css_class = class_map.get(obj.publishable)
        if css_class:
            return {'class': css_class}




# Register your models here.
admin.site.register(Wetland, Wetlands)
admin.site.register(Product, ProductAdmin)
admin.site.register(Indicator,IndicatorAdmin)
admin.site.register(WetlandLayer, WetlandLayerAdmin)