# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('layers', '0005_layer_legend_colors'),
    ]

    operations = [
        migrations.AddField(
            model_name='layer',
            name='dataset_epsg',
            field=models.IntegerField(help_text=b'Just the projection code/number', null=True, verbose_name=b'EPSG code from the dataset', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='layer',
            name='epsg',
            field=models.IntegerField(help_text=b'Just the projection code/number', null=True, verbose_name=b'EPSG code for the coordinates', blank=True),
            preserve_default=True,
        ),
    ]
