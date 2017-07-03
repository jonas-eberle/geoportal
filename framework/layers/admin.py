from django import forms
from django.contrib import admin

import django
if django.VERSION < (1, 10): #todo remove
    from suit.admin import SortableTabularInline
else:
    from suit.sortables import SortableTabularInline

from .models import Layergroup, LayerInline, Layer, Contact


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


# Provide layers admin with tab-based view
# Fieldsets has to be extended if layer model is extended
class LayersAdmin(admin.ModelAdmin):
    form = LayersForm
    fieldsets = (
        (None, {
            'classes': ('suit-tab', 'suit-tab-general',),
            'fields': ('identifier', 'title', 'abstract', 'topicCategory', 'meta_contact', 'meta_language', 'meta_characterset', 'meta_date', 'publishable')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-ogc',),
            'fields': ('ogc_link', 'ogc_layer', 'ogc_type', 'ogc_imageformat', 'ogc_attribution', 'ogc_getfeatureinfo', 'ogc_time', 'ogc_times', 'legend_graphic', 'legend_url', 'legend_colors', 'wmts_matrixset', 'wmts_resolutions', 'wmts_multiply', 'wmts_tilesize', 'wmts_projection', 'wmts_prefix_matrix_ids', 'sos_default_field')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-dataset',),
            'fields': ('dataset_contact_new', 'date_create', 'language', 'characterset', 'dataset_epsg', 'format', 'equi_scale', 'representation_type', 'meta_lineage')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-location',),
            'fields': ('west', 'east', 'north', 'south', 'epsg', 'geo_description')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-temporalextent',),
            'fields': ('date_begin', 'date_end')
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
    save_as = True
    suit_form_tabs = (('general', 'General'), ('ogc', 'Data'), ('dataset', 'Dataset'), ('location', 'Location'), ('temporalextent','Temporal Extent'),('download', 'Download'), ('permissions', 'Permissions'))


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

# Register all models with their changed admins
admin.site.register(Layergroup, LayergroupAdmin)
admin.site.register(Layer, LayersAdmin)
admin.site.register(Contact, ContactsAdmin)
