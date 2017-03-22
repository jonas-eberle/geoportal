## Database setup
```
$ createdb -U swos swos
$ psql swos < swos3_20160907.db
```

## Django setup
```
$ vi webgis/settings.py
Adjust DATABASES dictionary
Adjust SUBDIR according to your Apache configuration

$ python manage.py collectstatic
Yes, files can be overwritten
```

## Apache WSGI
```
$ vi index.wsgi
Adjust your local virtual environment directory
Adjust PYTHONPATH to framework and webgis directory

$ vi /etc/apache2/sites-available/default
WSGIScriptAlias /swos2 /home/sibessc/workspace/swos/master/framework/index.wsgi
Alias /swos2/static/ /home/sibessc/workspace/swos/master/framework/static/

$ sudo apache2ctl -k graceful
Restart apache "gracefully"
```

## Django Configuration
Prior to any mapviewer request you need to edit the mapviewer and adjust the template selection, because complete path is stored in the database!

## Main frontend libraries

* Bootstrap v3.3.1
* OpenLayers v3.4.0
* jQuery v1.11.1
* AngularJS v1.3.10
* bootbox.js v4.3.0
