# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('swos', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='wetland',
            name='geo_scale',
            field=models.CharField(max_length=200, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='wetland',
            name='description',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
