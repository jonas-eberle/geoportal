# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-07-18 15:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('phaenopt', '0007_dwdstation_geom'),
    ]

    operations = [
        migrations.CreateModel(
            name='DWDInSituData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Stations_id', models.IntegerField()),
                ('Referenzjahr', models.IntegerField()),
                ('Qualitaetsniveau', models.IntegerField()),
                ('Objekt_id', models.IntegerField()),
                ('Phase_id', models.IntegerField()),
                ('Eintrittsdatum', models.DateField(blank=True, null=True)),
                ('Eintrittsdatum_QB', models.IntegerField()),
                ('Jultag', models.IntegerField()),
            ],
        ),
    ]
