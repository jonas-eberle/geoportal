# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('layers', '__first__'),
        ('swos', '0002_auto_20160421_1120'),
    ]

    operations = [
        migrations.CreateModel(
            name='WetlandLayer',
            fields=[
                ('layer_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='layers.Layer')),
                ('indicator', models.ForeignKey(related_name='layer_indicator', verbose_name=b'Indicator', blank=True, to='swos.Indicator', null=True)),
                ('product', models.ForeignKey(related_name='layer_product', verbose_name=b'Product', blank=True, to='swos.Product', null=True)),
                ('wetland', models.ForeignKey(related_name='layer_wetland', verbose_name=b'Wetland', blank=True, to='swos.Wetland', null=True)),
            ],
            options={
            },
            bases=('layers.layer',),
        ),
    ]
