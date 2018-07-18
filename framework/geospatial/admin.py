# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.gis import admin

from .models import Region

# Register your models here.
class RegionsAdmin(admin.OSMGeoAdmin):
    list_display = ('name', )
    ordering = ['name']
    search_fields = ('name', )


admin.site.register(Region, RegionsAdmin)