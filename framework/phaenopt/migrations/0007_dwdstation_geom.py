# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-07-18 15:14
from __future__ import unicode_literals

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('phaenopt', '0006_dwdstation'),
    ]

    operations = [
        migrations.AddField(
            model_name='dwdstation',
            name='geom',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, null=True, srid=4326),
        ),
    ]
