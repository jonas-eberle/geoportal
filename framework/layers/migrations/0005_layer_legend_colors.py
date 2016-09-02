# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('layers', '0004_layer_identifier'),
    ]

    operations = [
        migrations.AddField(
            model_name='layer',
            name='legend_colors',
            field=models.TextField(null=True, verbose_name=b'Legend rgb colors', blank=True),
            preserve_default=True,
        ),
    ]
