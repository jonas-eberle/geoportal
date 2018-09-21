# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from suit.sortables import SortableModelAdmin
from .models import Product, Pheno, PhenoLayer, CitizenScienceProject
from layers.admin import LayersAdmin
from content.admin import make_downloadable, make_non_downloadable, make_publishable, make_unpublishable

class ProductAdmin(SortableModelAdmin):
    sortable = 'order'
    list_display = ('name', 'order')


class PhenoAdmin(SortableModelAdmin):
    sortable = 'order'
    list_display = ('name', 'order')

class PhenoLayerAdmin(LayersAdmin):
    fieldsets = LayersAdmin.fieldsets + ((None, {
            'classes': ('suit-tab', 'suit-tab-phaenopt',),
            'fields': ('region', 'product', 'phenophase', 'type')
        }),)
    list_display=('title','publishable', 'downloadable', 'region', 'product', 'phenophase', 'type')
    suit_form_tabs = LayersAdmin.suit_form_tabs + (('phaenopt','PhaenOPT'),)
    ordering =['title']
    list_filter=('publishable', 'downloadable', 'region','product', 'phenophase')
    suit_list_filter_horizontal = ('region','product','phenophase', 'publishable', 'downloadable')

    actions=[make_publishable,make_unpublishable, make_downloadable, make_non_downloadable]

    def suit_row_attributes(self, obj, request):
        class_map = {
            True: 'table-success',
            False: 'table-danger',
        }

        css_class = class_map.get(obj.publishable)
        if css_class:
            return {'class': css_class}


class CitizenScienceAdmin(SortableModelAdmin):
    sortable = 'order'
    list_display = ('name', 'order')

# Register your models here.
admin.site.register(Product, ProductAdmin)
admin.site.register(Pheno, PhenoAdmin)
admin.site.register(PhenoLayer, PhenoLayerAdmin)
admin.site.register(CitizenScienceProject, CitizenScienceAdmin)