## Database setup
```
$ createdb -U swos swos
$ psql swos < swos3_20160907.db
```

## Backend setup
```
# install python2 versions of pip and virtualenv

$ cd path/to/cloned-repo
# create a virtualenv
$ virtualenv --python=python2 venv
# activate the virtualenv
$ source venv/bin/activate
# install all packages listed in requirements.txt
$ pip install -r framework/requirements.txt
```

## Frontend setup
```
# install npm (preferrably via distro package manager)

$ cd path/to/cloned-repo
# install all packages listed in packages.json
$ npm install
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

## Frontend maintenance
For a list of required, external JavaScript libraries, see `packages.json`.

Required JavaScript and CSS files are bundled and minified via the Django app "django-assets". The configuration of these bundles is done in `framework/mapviewer/assets.py`, Django is configured to search in `framework/static` and in `node_modules` for the given files. Bundles are stored in `static/build`, which is ignored by git. Most libraries only have JavaScript or CSS code, but some also come with fonts or images. These additional files have been copied from the libraries' `node_modules` to our `static` directory, while keeping the directory structure intact. At the moment, this applies to the following libraries:

* Bootstrap
* Font Awesome
* Fancybox

### Debugging
During development, bundling and minification might be undesired. It can be easily disabled by setting `ASSETS_DEBUG=True` in `settings.py`. In production mode, this should be changed to `FALSE`.

### Library installation/updates

```
# installing a library + saving in packages.json
npm install --save "jquery@1.12.4"

# updating a library to the latest minor + saving in packages.json
npm update --save "jquery"
```

When updating a library, it is necessary to check, if the library has font files, images etc. that have to be copied into our `static` directory.


## Anchors to wetlands and products
#/wetland/4/ --> open wetland with id 4  
#/wetland/4/product/ --> open wetland with id 4 and select products  
#/wetland/4/product/1932 --> open wetland with id 4, select product, add layer with id 1932 and open menu  
#/wetland/4/product/2551_1932 --> open wetland with id 4, select products, add layer with id 2551 and 1932 and open menu (type (e.g. "product") should fit to last layer id --> #/wetland/4/externaldb/1932_2551 )
