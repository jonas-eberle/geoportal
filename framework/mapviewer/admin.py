from django import forms
from django.contrib import admin

import django
if django.VERSION < (1, 10): #todo remove
    from suit.admin import SortableTabularInline
else:
    from suit.sortables import SortableTabularInline

from .models import MapViewer, BaseLayer, BaseLayerInline, LayerBaseInline
from layers.models import LayergroupInline

# Sortable LayersgroupsInline to MapViewerAdmin
class LayergroupsInline(SortableTabularInline):
    model = LayergroupInline
    fields = ('layergroup',)
    extra = 1
    verbose_name_plural = 'Layer groups'
    sortable = 'order'
    suit_classes = 'suit-tab suit-tab-layergroups'

# Sortable BaseLayersInline for MapViewerAdmin
class LayersBaseInline(SortableTabularInline):
    model = LayerBaseInline
    fields = ('title','baselayer',)
    extra = 1
    verbose_name_plural = 'Base layers'
    sortable = 'order'
    suit_classes = 'suit-tab suit-tab-baselayer'


# Model form verification for MapViewer model
# Here we can specify own error messages based on the inputs of a form
# Is being executed before object is saved
class MapViewerForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(MapViewerForm, self).clean()

        if cleaned_data.get('time_slider') == True and cleaned_data.get('time_slider_dates') == '':
            if cleaned_data.get('time_slider_start') == None:
                self.add_error('time_slider_start', 'Either starting date or individual dates has to be specified')
            if cleaned_data.get('time_slider_interval') == None:
                self.add_error('time_slider_interval', 'Either starting date with step interval or individual dates has to be specified')


# MapViewerAdmin with two inlines
class MapViewerAdmin(admin.ModelAdmin):
    form = MapViewerForm
    inlines = (LayersBaseInline,LayergroupsInline,)
    fieldsets = (
        (None, {
            'classes': ('suit-tab', 'suit-tab-general',),
            'fields': (
            'title', 'template_file','search_url', 'auth_registration', 'addexternallayer', 'html_info', 'html_footer')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-map',),
            'fields': (
                'center_lat', 'center_lon', 'center_proj', 'map_proj',  'zoom_min', 'zoom_max', 'zoom_init','map_resolutions')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-permissions',),
            'fields': (
                'auth_perm', 'auth_users', 'auth_groups', 'download_perm', 'download_users', 'download_groups')
        }),
        (None, {
            'classes': ('suit-tab', 'suit-tab-timeslider',),
            'fields': (
                'time_slider', 'time_slider_start', 'time_slider_end', 'time_slider_interval', 'time_slider_dates')
        }),
    )
    suit_form_tabs = (('general', 'General'), ('map', 'Map'), ('timeslider', 'Time slider'), ('baselayer', 'Base layer'), ('layergroups','Layer groups'), ('permissions', 'Permissions'))
    save_as = True



# Model form verification for BaseLayer model
# Here we can specify own error messages based on the inputs of a form
# Is being executed before object is saved
class BaseLayerForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(BaseLayerForm, self).clean()
        type = cleaned_data.get('type')

        if (type == 'WMS' or type == 'WMTS') and (cleaned_data.get('url') == '' or cleaned_data.get('layername') == ''):
            self.add_error('url', 'URL has to be specified')
            self.add_error('layername', 'Layername has to be specified')
        if type == 'WMTS':
            if cleaned_data.get('wmts_matrixset') == '':
                self.add_error('wmts_matrixset', 'Matrixset has to be specified for WMTS layers')
            if cleaned_data.get('wmts_resolutions') == '':
                self.add_error('wmts_resolutions', 'Resolutions have to be specified for WMTS layers')
            if cleaned_data.get('wmts_projection') == None:
                self.add_error('wmts_projection', 'Projection has to be specified for WMTS layers')
            if cleaned_data.get('wmts_tilesize') == None:
                self.add_error('wmts_tilesize', 'Tilesize has to be specified for WMTS layers')
        if type == 'XYZ' and cleaned_data.get('url') == '':
            self.add_error('url', 'URL has to be specified')

# Register BaseLayerForm in BaseLayerAdmin
class BaseLayerAdmin(admin.ModelAdmin):
    form = BaseLayerForm
    save_as = True

# Specify admin backend registrations
admin.site.register(MapViewer, MapViewerAdmin)
#admin.site.register(BaseLayer, BaseLayerAdmin)
#admin.site.register(Template)
#admin.site.register(Component)
