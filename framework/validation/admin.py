from django.contrib import admin
from layers.admin import LayersAdmin
from .models import ValidationLayer


class ValidationLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
            'classes': ('suit-tab', 'suit-tab-validation',),
            'fields': ('layer_basemap', 'layer_auxiliary', 'legend')
        }),)
    list_display=('title',)
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('validation','Validation'),)
    search_fields=('title','abstract')
    ordering =['title']


# Register your models here.
admin.site.register(ValidationLayer, ValidationLayerAdmin)
