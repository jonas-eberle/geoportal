# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-07-14 11:25
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('swos', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wetlandlayer',
            name='updated_at',
        ),
    ]
