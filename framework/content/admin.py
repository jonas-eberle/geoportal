# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.gis import admin
from django import forms
from suit.sortables import SortableTabularInline

from content.models import ExternalDatabase, ExternalLayer, StoryLine, StoryLineFeature, StoryLineInline, StoryLinePart, Image, Video, SatdataLayer, Country
from layers.admin import LayersAdmin
from swos.models import WetlandLayer
from swos.search_es import LayerIndex
from webgis import settings

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

# Register your models here.
class ExternalLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
        'classes': ('suit-tab', 'suit-tab-swos',),
        'fields': ('datasource',)
    }),)
    list_display = ('title', 'publishable', 'datasource')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos', 'SWOS'),)
    search_fields = ('title', 'abstract', 'datasource__name')
    ordering = ['title']
    list_filter = ('publishable', 'datasource')
    suit_list_filter_horizontal = ('datasource',)

    actions = [make_publishable, make_unpublishable]


class ExternalDatabaseAdminForm(forms.ModelForm):
    country = forms.ModelMultipleChoiceField(queryset=Country.objects.order_by('name'), required=False)

    class Meta:
        model = ExternalDatabase
        exclude = []


class ExternalDatabaseAdmin(admin.OSMGeoAdmin):
    list_display = ('name', 'description')
    form = ExternalDatabaseAdminForm


class CountryAdmin(admin.OSMGeoAdmin):
    list_display = ('name', 'continent', 'bbox',)
    search_fields = ('name',)


class ImageAdmin(admin.OSMGeoAdmin):
    list_display = ('name', 'image_tag', 'date', 'description', 'region')
    fields = ('name', 'description', 'date', 'copyright', 'image', 'image_tag', 'image_size', 'region')
    readonly_fields = ('image_tag', 'image_size')
    list_filter = ('region',)


class VideoAdmin(admin.OSMGeoAdmin):
    list_per_page = 100
    list_display = ('name', 'source', 'image_tag', 'date', 'description', 'youtube_cat_name', 'region')
    fields = ('name', 'description', 'date', 'copyright', 'source', 'link', 'thumb_link', 'region')
    list_filter = ('region', 'source')
    search_fields = ('name',)
    suit_list_filter_horizontal = ('region')


class StoryLinePartForm(forms.ModelForm):
    class Meta:
        model = StoryLinePart
        exclude = []

    def __init__(self, *args, **kwargs):
        super(StoryLinePartForm, self).__init__(*args, **kwargs)
        if hasattr(self.instance, 'wetland'):
            self.fields['product_layer'].queryset = WetlandLayer.objects.filter(region_id=self.instance.region.id,
                                                                                product_id__isnull=False)
            self.fields['indicator_layer'].queryset = WetlandLayer.objects.filter(region_id=self.instance.region.id,
                                                                                  indicator_id__isnull=False)


class StoryLineInlines(SortableTabularInline):
    model = StoryLineInline
    fields = ('story_line_part',)
    extra = 1
    verbose_name_plural = 'Layers'
    sortable = 'order'


class StoryLineFeatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


class StoryLineAdmin(admin.ModelAdmin):
    inlines = (StoryLineInlines,)
    list_display = ('title', 'region', 'active')


class StoryLinePartAdmin(admin.ModelAdmin):
    form = StoryLinePartForm
    list_display = ('headline', 'region')


class SatdataLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
        'classes': ('suit-tab', 'suit-tab-swos',),
        'fields': ('region','thema',)
    }),)
    list_display = ('title', 'publishable', 'downloadable', 'region', 'thema')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('swos', 'SWOS'),)
    search_fields = ('title', 'abstract', 'region__name',)
    ordering = ['title']
    list_filter = ('publishable', 'downloadable', 'region')
    suit_list_filter_horizontal = ('region', 'publishable', 'downloadable')

    actions = [make_publishable, make_unpublishable, make_downloadable, make_non_downloadable]

    def suit_row_attributes(self, obj, request):
        class_map = {
            True: 'table-success',
            False: 'table-danger',
        }

        css_class = class_map.get(obj.publishable)
        if css_class:
            return {'class': css_class}


admin.site.register(ExternalDatabase, ExternalDatabaseAdmin)
admin.site.register(ExternalLayer, ExternalLayerAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Video, VideoAdmin)
admin.site.register(StoryLine, StoryLineAdmin)
admin.site.register(StoryLinePart, StoryLinePartAdmin)
admin.site.register(StoryLineFeature, StoryLineFeatureAdmin)
admin.site.register(SatdataLayer, SatdataLayerAdmin)
