# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0001_initial'),
        ('mapviewer', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
                ('position', models.CharField(max_length=200, blank=True)),
                ('address', models.CharField(max_length=200, blank=True)),
                ('postcode', models.CharField(max_length=200, blank=True)),
                ('city', models.CharField(max_length=200, blank=True)),
                ('country', models.CharField(max_length=200, blank=True)),
                ('state', models.CharField(max_length=200, blank=True)),
                ('email', models.CharField(max_length=200, blank=True)),
                ('organisation', models.CharField(max_length=200, blank=True)),
                ('telephone', models.CharField(max_length=200, blank=True)),
                ('fax', models.CharField(max_length=200, blank=True)),
                ('mobile', models.CharField(max_length=200, blank=True)),
                ('website', models.CharField(max_length=200, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Layer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200)),
                ('abstract', models.TextField()),
                ('topicCategory', models.CharField(max_length=200, null=True, blank=True)),
                ('ogc_link', models.CharField(max_length=200, null=True, verbose_name=b'OGC service URL', blank=True)),
                ('ogc_layer', models.CharField(max_length=200, null=True, verbose_name=b'Layer name', blank=True)),
                ('ogc_type', models.CharField(default=b'WMS', max_length=200, verbose_name=b'OGC service type', choices=[(b'WMS', b'WMS'), (b'WMTS', b'WMTS'), (b'XYZ', b'XYZ'), (b'TMS', b'TMS'), (b'WFS', b'WFS'), (b'Tiled-WFS', b'Tiled-WFS'), (b'GeoJSON', b'GeoJSON'), (b'SOS', b'SOS'), (b'MapServer', b'MapServer'), (b'BingMaps', b'BingMaps'), (b'MapQuest', b'MapQuest'), (b'OSM', b'OSM'), (b'GoogleMaps', b'GoogleMaps')])),
                ('ogc_time', models.BooleanField(default=False, help_text=b'Time enabled?', verbose_name=b'WMS/WMTS Time')),
                ('ogc_imageformat', models.CharField(help_text=b'For WMS/WMTS, e.g., image/png, image/jpeg', max_length=100, null=True, verbose_name=b'Image format', blank=True)),
                ('downloadable', models.BooleanField(default=False, help_text=b'Define whether layer can be downloaded')),
                ('download_url', models.CharField(help_text=b'URL for layer download', max_length=200, null=True, verbose_name=b'Download URL', blank=True)),
                ('download_file', models.FileField(help_text=b'Upload file for layer download', upload_to=b'downloads', null=True, verbose_name=b'Download file', blank=True)),
                ('wmts_matrixset', models.CharField(max_length=100, null=True, verbose_name=b'WMTS matrix set', blank=True)),
                ('wmts_resolutions', models.TextField(help_text=b'Separated by space/blank character', null=True, verbose_name=b'WMTS resolutions', blank=True)),
                ('wmts_tilesize', models.IntegerField(help_text=b'e.g., 256 or 512', null=True, verbose_name=b'WMTS tile size', blank=True)),
                ('wmts_projection', models.CharField(max_length=200, null=True, verbose_name=b'WMTS projection', blank=True)),
                ('sos_default_field', models.CharField(help_text=b'If blank, the first field from SOS service will be used as default field', max_length=100, null=True, verbose_name=b'SOS default field', blank=True)),
                ('date_create', models.DateField(null=True, verbose_name=b'Dataset creation date', blank=True)),
                ('language', models.CharField(default=b'English', max_length=200, blank=True)),
                ('characterset', models.CharField(max_length=200, null=True, blank=True)),
                ('format', models.CharField(max_length=200, null=True, blank=True)),
                ('west', models.FloatField(verbose_name=b'BBOX west coordinate')),
                ('east', models.FloatField(verbose_name=b'BBOX east coordinate')),
                ('north', models.FloatField(verbose_name=b'BBOX north coordinate')),
                ('south', models.FloatField(verbose_name=b'BBOX south coordinate')),
                ('geo_description', models.CharField(max_length=200, null=True, verbose_name=b'Location description', blank=True)),
                ('representation_type', models.CharField(help_text=b'e.g., raster or vector', max_length=200, null=True, verbose_name=b'Type of dataset', blank=True)),
                ('equi_scale', models.FloatField(help_text=b'Just for metadata', null=True, verbose_name=b'Spatial resolution', blank=True)),
                ('epsg', models.IntegerField(help_text=b'Just the projection code/number', null=True, verbose_name=b'EPSG code', blank=True)),
                ('meta_language', models.CharField(default=b'English', max_length=200, verbose_name=b'Metadata language', blank=True)),
                ('meta_characterset', models.CharField(max_length=200, null=True, verbose_name=b'Metadata character set', blank=True)),
                ('meta_date', models.DateField(null=True, verbose_name=b'Metadata date', blank=True)),
                ('legend_graphic', models.FileField(upload_to=b'legend', null=True, verbose_name=b'Legend graphic file', blank=True)),
                ('legend_url', models.URLField(null=True, verbose_name=b'Legend graphic URL', blank=True)),
                ('auth_perm', models.BooleanField(default=False, help_text=b'Activate access permission for layer', verbose_name=b'Access permission')),
                ('download_perm', models.BooleanField(default=False, help_text=b'Activate download permission for layer', verbose_name=b'Download permission')),
                ('auth_groups', models.ManyToManyField(related_name='layer_auth_groups', verbose_name=b'Access groups', to='auth.Group', blank=True)),
                ('auth_users', models.ManyToManyField(related_name='layer_auth_users', verbose_name=b'Access users', to=settings.AUTH_USER_MODEL, blank=True)),
                ('dataset_contact_new', models.ForeignKey(related_name='dataset_contact', verbose_name=b'Dataset contact', blank=True, to='layers.Contact', null=True)),
                ('download_groups', models.ManyToManyField(related_name='layer_download_groups', to='auth.Group', blank=True)),
                ('download_users', models.ManyToManyField(related_name='layer_download_users', to=settings.AUTH_USER_MODEL, blank=True)),
                ('meta_contact', models.ForeignKey(related_name='meta_contact', verbose_name=b'Metadata contact', blank=True, to='layers.Contact', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Layergroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='LayergroupInline',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('layergroup', models.ForeignKey(to='layers.Layergroup')),
                ('mapviewer', models.ForeignKey(to='mapviewer.MapViewer')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='LayerInline',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200, null=True, blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('layer', models.ForeignKey(to='layers.Layer')),
                ('layergroup', models.ForeignKey(to='layers.Layergroup')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
