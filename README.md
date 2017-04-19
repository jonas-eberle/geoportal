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
* OpenLayers v4.1.0
* jQuery v1.11.1
* AngularJS v1.3.10
* bootbox.js v4.3.0

## Anchors to wetlands and products
#/wetland/4/ --> open wetland with id 4  
#/wetland/4/product/ --> open wetland with id 4 and select products  
#/wetland/4/product/1932 --> open wetland with id 4, select product, add layer with id 1932 and open menu  
#/wetland/4/product/2551_1932 --> open wetland with id 4, select products, add layer with id 2551 and 1932 and open menu (type (e.g. "product") should fit to last layer id --> #/wetland/4/externaldb/1932_2551 )
