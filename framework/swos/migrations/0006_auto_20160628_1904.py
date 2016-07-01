# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('swos', '0005_product_short_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wetland',
            name='geom',
            field=django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326),
            preserve_default=True,
        ),
    ]
