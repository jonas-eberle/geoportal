# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('layers', '0002_layer_ogc_getfeatureinfo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='layer',
            name='legend_url',
            field=models.URLField(max_length=400, null=True, verbose_name=b'Legend graphic URL', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='layer',
            name='ogc_link',
            field=models.CharField(max_length=400, null=True, verbose_name=b'OGC service URL', blank=True),
            preserve_default=True,
        ),
    ]
