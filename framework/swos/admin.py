#from django.contrib import admin
from django.contrib.gis import admin
from .models import Wetland, Product, Indicator, WetlandLayer

from layers.admin import LayersAdmin

class WetlandLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
            'classes': ('suit-tab', 'suit-tab-swos',),
            'fields': ('wetland', 'product', 'indicator')
        }),)
    
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos','SWOS'),)

# Register your models here.
admin.site.register(Wetland, admin.OSMGeoAdmin)
admin.site.register(Product)
admin.site.register(Indicator)
admin.site.register(WetlandLayer, WetlandLayerAdmin)