#from django.contrib import admin
from django.contrib.gis import admin
from .models import Wetland, Product, Indicator, WetlandLayer

from layers.admin import LayersAdmin

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
    list_display=('title','publishable')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos','SWOS'),)

    actions=[make_publishable,make_unpublishable]

class Wetlands(admin.OSMGeoAdmin):
    list_display = ('name', 'country', 'identifier', 'geo_scale', 'partner')


from suit.admin import SortableModelAdmin
class ProductAdmin(SortableModelAdmin):
    sortable = 'order'
    
class IndicatorAdmin(SortableModelAdmin):
    sortable = 'order'



# Register your models here.
admin.site.register(Wetland, Wetlands)
admin.site.register(Product, ProductAdmin)
admin.site.register(Indicator, IndicatorAdmin)
admin.site.register(WetlandLayer, WetlandLayerAdmin)
