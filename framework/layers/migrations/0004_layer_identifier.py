# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('layers', '0003_auto_20160628_1147'),
    ]

    operations = [
        migrations.AddField(
            model_name='layer',
            name='identifier',
            field=models.CharField(default='-', max_length=200),
            preserve_default=False,
        ),
    ]
