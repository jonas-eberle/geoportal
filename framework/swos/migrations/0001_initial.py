# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Indicator',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Wetland',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('geom', django.contrib.gis.db.models.fields.PolygonField(srid=4326)),
                ('description', models.TextField()),
                ('country', models.CharField(max_length=200)),
                ('size', models.FloatField(blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='product',
            name='wetlands',
            field=models.ManyToManyField(related_name='swos_product_wetlands', verbose_name=b'Wetlands', to='swos.Wetland', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicator',
            name='products',
            field=models.ManyToManyField(related_name='swos_indicator_products', verbose_name=b'Products', to='swos.Product', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='indicator',
            name='wetlands',
            field=models.ManyToManyField(related_name='swos_indicator_wetlands', verbose_name=b'Wetlands', to='swos.Wetland', blank=True),
            preserve_default=True,
        ),
    ]
