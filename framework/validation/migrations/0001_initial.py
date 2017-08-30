# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-25 18:21
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('layers', '0003_auto_20170722_1442'),
    ]

    operations = [
        migrations.CreateModel(
            name='ValidationLayer',
            fields=[
                ('layer_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='layers.Layer')),
                ('layer_auxiliary', models.ManyToManyField(blank=True, null=True, related_name='validation_layer_auxiliary', to='layers.Layer', verbose_name=b'Validation auxiliary layers')),
                ('layer_basemap', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='validation_layer_basemap', to='layers.Layer', verbose_name=b'Background layer')),
            ],
            bases=('layers.layer',),
        ),
    ]