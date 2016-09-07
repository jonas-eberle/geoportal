# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('swos', '0004_auto_20160628_0958'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='short_name',
            field=models.CharField(default='-', max_length=100),
            preserve_default=False,
        ),
    ]
