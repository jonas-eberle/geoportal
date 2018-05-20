#from django.contrib import admin
from django.contrib.gis import admin
from django import forms
from .models import Wetland, Product, Indicator, SubIndicator, IndicatorValue, WetlandLayer, ExternalDatabase, ExternalLayer, Country, WetlandImage, WetlandVideo, StoryLine, StoryLineInline, StoryLinePart, StoryLineFeature

from layers.admin import LayersAdmin

import django

from suit.sortables import SortableModelAdmin
from suit.sortables import SortableTabularInline

from webgis import settings

from swos.search_es import LayerIndex, ExternalDatabaseIndex, WetlandIndex
from swos.csw import create_update_csw, delete_csw


def make_publishable(modeladmin, request, queryset):
    queryset.update(publishable=True)
    for item in queryset:
        item.save()
make_publishable.short_description = "Mark selected layers as fit for publication"

def make_unpublishable(modeladmin, request, queryset):
    queryset.update(publishable=False)
    for item in queryset:
        if settings.CSW_T == True:
            delete_csw(item)
        if settings.ELASTICSEARCH == True:
            LayerIndex.get(id=item.id).delete()

make_unpublishable.short_description = "Mark selected layers as unfit for publication"

def make_downloadable(modeladmin, request, queryset):
    queryset.update(downloadable=True)
make_downloadable.short_description = "Mark as donwloadable"

def make_non_downloadable(modeladmin, request, queryset):
    queryset.update(downloadable=False)

make_non_downloadable.short_description = "Mark as not downloadable"


class WetlandLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
            'classes': ('suit-tab', 'suit-tab-swos',),
            'fields': ('wetland', 'product', 'indicator')
        }),)
    list_display=('title','publishable', 'downloadable', 'wetland', 'product')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos','SWOS'),)
    search_fields=('title','abstract','wetland__name', 'product__name')
    ordering =['title']
    list_filter=('publishable', 'downloadable', 'wetland','product')
    suit_list_filter_horizontal = ('wetland','product','publishable', 'downloadable')

    actions=[make_publishable,make_unpublishable, make_downloadable, make_non_downloadable]

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
    search_fields=('title','abstract','datasource__name')
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
    list_display = ('name', 'continent', 'bbox',)
    search_fields= ('name',)

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

class SubIndicatorAdmin(admin.ModelAdmin):
    list_display = ('name', 'sub_number')

class IndicatorValueAdmin(admin.ModelAdmin):
    list_display = ('wetland', 'input_1_time' )
    save_as = True

class StoryLinePartForm(forms.ModelForm):
    class Meta:
        model = StoryLinePart
        exclude = []

    def __init__(self, *args, **kwargs):
        super(StoryLinePartForm, self).__init__(*args, **kwargs)
        if hasattr(self.instance, 'wetland'):
           self.fields['product_layer'].queryset = WetlandLayer.objects.filter(wetland_id=self.instance.wetland.id, product_id__isnull = False)
           self.fields['indicator_layer'].queryset = WetlandLayer.objects.filter(wetland_id=self.instance.wetland.id, indicator_id__isnull = False)

class StoryLineInlines(SortableTabularInline):
    model = StoryLineInline
    fields = ('story_line_part', )
    extra = 1
    verbose_name_plural = 'Layers'
    sortable = 'order'

class StoryLineAdmin(admin.ModelAdmin):
    inlines = (StoryLineInlines,)
    list_display = ('title', 'wetland', 'active')

class StoryLinePartAdmin(admin.ModelAdmin):
    form = StoryLinePartForm
    list_display = ('headline', 'wetland')

class StoryLineFeatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

# Register your models here.
admin.site.register(Wetland, Wetlands)
admin.site.register(Product, ProductAdmin)
admin.site.register(Indicator,IndicatorAdmin)
admin.site.register(SubIndicator, SubIndicatorAdmin)
admin.site.register(IndicatorValue,IndicatorValueAdmin)
admin.site.register(WetlandLayer, WetlandLayerAdmin)
admin.site.register(ExternalDatabase, ExternalDatabaseAdmin)
admin.site.register(ExternalLayer, ExternalLayerAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(WetlandImage, WetlandImageAdmin)
admin.site.register(WetlandVideo, WetlandVideoAdmin)
admin.site.register(StoryLine, StoryLineAdmin)
admin.site.register(StoryLinePart, StoryLinePartAdmin)
admin.site.register(StoryLineFeature, StoryLineFeatureAdmin)