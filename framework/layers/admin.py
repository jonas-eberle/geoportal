from django import forms
from django.contrib import admin

import django

from suit.sortables import SortableTabularInline

from .models import Layergroup, LayerInline, Layer, Contact, ISOcodelist, OnlineResourceInline, ConstraintLimitInline, ConstraintConditionsInline, ConformityInline, KeywordInline


# Model form verification for BaseLayer model
# Here we can specify own error messages based on the inputs of a form
# Is being executed before object is saved
class LayersForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(LayersForm, self).clean()

        #downloads
        if cleaned_data.get('downloadable') == True and not (cleaned_data.get('download_url') != '' or cleaned_data.get('download_file') != None):
            self.add_error('downloadable', 'Please specify either download url or upload a download file')

        ogc_type = cleaned_data.get('ogc_type')
        if ogc_type == 'WMTS':
            if cleaned_data.get('wmts_matrixset') == '':
                self.add_error('wmts_matrixset', 'Matrixset has to be specified for WMTS layer')
            if cleaned_data.get('wmts_resolutions') == '':
                self.add_error('wmts_resolutions', 'Resolutions have to be specified for WMTS layer')
            if cleaned_data.get('ogc_layer') == '':
                self.add_error('ogc_layer', 'Layer name has to be specified for this type of layer')

        if cleaned_data.get('ogc_layer') == '' and (ogc_type == 'WMS' or ogc_type == 'WFS' or ogc_type == 'Tiled-WFS' or ogc_type == 'SOS'):
            self.add_error('ogc_layer', 'Layer name has to be specified for this type of layer')
        
        if cleaned_data.get('ogc_link') == '' and (ogc_type == 'WMS' or ogc_type == 'WFS' or ogc_type == 'Tiled-WFS' or ogc_type == 'SOS' or ogc_type == 'XYZ'):
            self.add_error('ogc_link', 'OGC Service url has to be specified for this type of layer')

        if cleaned_data.get('north') > 90 or cleaned_data.get('north') < -90:
            self.add_error('north', 'The coordinates must be given as geographical coordinates (EPSG:4326)')
        if cleaned_data.get('south') > 90 or cleaned_data.get('south') < -90:
            self.add_error('south', 'The coordinates must be given as geographical coordinates (EPSG:4326)')
        if cleaned_data.get('west') > 180 or cleaned_data.get('west') < -180:
            self.add_error('west', 'The coordinates must be given as geographical coordinates (EPSG:4326)')
        if cleaned_data.get('east') > 180 or cleaned_data.get('north') < -180:
            self.add_error('east', 'The coordinates must be given as geographical coordinates (EPSG:4326)')

# Sortable LayersgroupsInline to MapViewerAdmin
class OnlineResourceInline(SortableTabularInline):
    model = OnlineResourceInline
    extra = 1
    verbose_name_plural = 'Online Resources'
    suit_classes = 'suit-tab suit-tab-onlineresources'

class ConstraintLimitInline(SortableTabularInline):
    model = ConstraintLimitInline
    extra = 1
    verbose_name_plural = "Constraint Limits"
    suit_classes = 'suit-tab suit-tab-conformity_constraints'

class ConstraintConditionsInline(SortableTabularInline):
    model = ConstraintConditionsInline
    extra = 1
    verbose_name_plural = "Constraint Conditions"
    suit_classes = 'suit-tab suit-tab-conformity_constraints'


class ConformityInlineForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(ConformityInlineForm, self).clean()

        if cleaned_data.get('date_type') == None:
            self.add_error('date_type', 'Please specify a date type')
        if cleaned_data.get('date') == None:
            self.add_error('date', 'Please specify a date')

class ConformityInline(SortableTabularInline):
    form = ConformityInlineForm
    model = ConformityInline
    extra = 1
    verbose_name_plural = "Conformity"
    suit_classes = 'suit-tab suit-tab-conformity_constraints'

class KeywordInline(SortableTabularInline):
    model = KeywordInline
    extra = 1
    verbose_name_plural = "Keywords"
    suit_classes = 'suit-tab suit-tab-keyword'

# Provide layers admin with tab-based view
# Fieldsets has to be extended if layer model is extended
class LayersAdmin(admin.ModelAdmin):
    form = LayersForm
    inlines = (OnlineResourceInline,ConstraintConditionsInline, ConstraintLimitInline, ConformityInline, KeywordInline)
    fieldsets = (
        (None, {
            'classes': ('suit-tab', 'suit-tab-general',),
            'fields': ('identifier', 'title', 'abstract', 'topicCategory', 'scope','meta_contact', 'meta_contacts', 'meta_language', 'meta_characterset', 'meta_date', 'publishable')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-ogc',),
            'fields': ('ogc_link', 'ogc_layer', 'ogc_type', 'ogc_imageformat', 'ogc_attribution', 'statistic','ogc_getfeatureinfo', 'ogc_time', 'ogc_times', 'legend_graphic', 'legend_url', 'legend_colors', 'min_zoom', 'max_zoom', 'sos_default_field')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-wmts',),
            'fields': ('wmts_matrixset', 'wmts_resolutions', 'wmts_multiply', 'wmts_tilesize', 'wmts_projection', 'wmts_prefix_matrix_ids')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-dataset',),
            'fields': ('dataset_contact_new', 'point_of_contacts', 'date_creation','date_publication', 'date_revision', 'language', 'characterset', 'dataset_epsg', 'format',  'meta_lineage')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-location',),
            'fields': ('west', 'east', 'north', 'south', 'geo_description')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-temporalextent',),
            'fields': ('date_begin', 'date_end')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-spatialresolution',),
            'fields': ('spat_representation_type', 'equi_scale','resolution_distance','resolution_unit')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-download',),
            'fields': ('downloadable', 'download_url', 'download_layer', 'download_type','download_file', 'map_layout_image')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-permissions',),
            'fields': ('auth_perm', 'auth_users', 'auth_groups','download_perm', 'download_users', 'download_groups')
        }),
    )
    list_display = ('title','ogc_attribution', 'publishable')
    save_as = True
    suit_form_tabs = (('general', 'General'), ('ogc', 'Data'),('wmts', 'WMTS'), ('dataset', 'Dataset'), ('location', 'Location'), ('temporalextent','Temporal Extent'),('spatialresolution', 'Spatial Resolution'),('onlineresources', 'Online Resources'),('keyword', 'Keyword'),('conformity_constraints', 'Conformity / Constraints'), ('download', 'Download'), ('permissions', 'Permissions'))
    search_fields=('title','abstract')
    list_filter = ('publishable', )
    suit_list_filter_horizontal = ('publishable', )

# For Layergroup we need to specify the layers inline and make them sortable
class LayersInline(SortableTabularInline):
    model = LayerInline
    fields = ('title', 'layer',)
    extra = 1
    verbose_name_plural = 'Layers'
    sortable = 'order'


class LayergroupAdmin(admin.ModelAdmin):
    inlines = (LayersInline,)


# ContactsAdmin for save_as option
class ContactsAdmin(admin.ModelAdmin):
    save_as = True

class ISOcodelistAdmin(admin.ModelAdmin):
    list_display = ('identifier', 'description', 'code_list')

    def has_add_permission(self, request):
        return False


# Register all models with their changed admins
admin.site.register(Layergroup, LayergroupAdmin)
admin.site.register(Layer, LayersAdmin)
admin.site.register(Contact, ContactsAdmin)
admin.site.register(ISOcodelist, ISOcodelistAdmin)
