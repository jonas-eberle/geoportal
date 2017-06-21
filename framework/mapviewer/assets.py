from django_assets import Bundle, register
from os import path
from glob import glob
from django.conf import settings


def glob_files(path_str):
    globbed_files = glob(path.join(settings.STATICFILES_DIRS[0], path_str))
    return [path.relpath(x, settings.STATICFILES_DIRS[0]) for x in globbed_files]


def make_bundle(bundle_name, file_list, filters, output):
    bundle = Bundle(*file_list, filters=filters, output=output)
    register(bundle_name, bundle)

# TODO: find a better way to allow globbing in bundles (for ASSETS_DEBUG=True)
# resolve globs here to not have to mess around with django-assets/webassets
# see: https://github.com/miracle2k/django-assets/issues/5
appJs = []
[appJs.extend(x) for x in [
    ['js/polyfills.js'],
    glob_files('js/app/*.js'),
    glob_files('js/app/core/*.js'),
    glob_files('js/app/auth/*.js'),
    glob_files('js/app/csw/*.js'),
    glob_files('js/app/map/*.js'),
    glob_files('js/app/swos/*.js'),
    ['js/dashboard.js']
]]

make_bundle('appJsBundle', appJs, filters='uglifyjs', output='build/app.bundle.js')

vendorJs = [
    '@turf/turf/turf.min.js',
    'openlayers/dist/ol.js',
    'dygraphs/dist/dygraph.min.js',  # previously: 'lib/dygraph-combined.js', 'lib/dygraph-interaction-api.js'
    'jquery/dist/jquery.min.js',
    'bootstrap/dist/js/bootstrap.min.js',
    # 'js/popover.js',
    # 'lib/docs.min.js',
    'angular/angular.min.js',
    'angular-resource/angular-resource.min.js',
    'angular-cookies/angular-cookies.min.js',
    'angular-route/angular-route.min.js',
    'angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
    'angular-filter/dist/angular-filter.min.js',
    'angular-ui-bootstrap/ui-bootstrap-tpls.min.js',
    'nx-popover/dist/nsPopover.js',
    'bootbox/bootbox.min.js',
    'bootstrap-slider/dist/bootstrap-slider.min.js',
    'angular-bootstrap-slider/slider.js',
    'lib/jquery-drags.js',      # not on npmjs.com
    'chart.js/dist/Chart.min.js',
    'angular-chart.js/dist/angular-chart.min.js',
    'd3/d3.min.js',
    'lib/nv.d3_adjusted_swos.js',   # not on npmjs.com
    'angular-nvd3/dist/angular-nvd3.min.js',
    'anno.js/dist/anno.js',
    'lib/jquery.fancybox.pack_adjusted.js'  # not on npmjs.com
]

# NOTE: we include some unminified libs, so apply basic minification to the whole bundle
make_bundle('vendorJsBundle', vendorJs, filters='rjsmin', output='build/vendor.bundle.js')

vendorCss = [
    'bootstrap/dist/css/bootstrap.min.css',
    'css/bootstrap.diff.css',   # changes from modified less files
    'bootstrap-slider/dist/css/bootstrap-slider.min.css',
    'font-awesome/css/font-awesome.min.css',
    'nvd3/build/nv.d3.min.css',
    'nx-popover/dist/nsPopover.css',
    'fancybox/dist/css/jquery.fancybox.css',
    'openlayers/dist/ol.css',
    'anno.js/dist/anno.css',
    'dygraphs/dist/dygraph.min.css'
]

make_bundle('vendorCssBundle', vendorCss, filters='cssmin', output='build/vendor.bundle.css')

appCss = [
    'css/dashboard.css',
    'css/jonas.css',
    'css/swos.css'
]

make_bundle('appCssBundle', appCss, filters='cssmin', output='build/app.bundle.css')
