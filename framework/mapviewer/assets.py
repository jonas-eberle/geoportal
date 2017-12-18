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

########################################################################################################################
# Vendor JS
baseVendorJs = [
    '@turf/turf/turf.min.js',
    'openlayers/dist/ol.js',
    'dygraphs/dist/dygraph.min.js',  # previously: 'lib/dygraph-combined.js', 'lib/dygraph-interaction-api.js'
    'jquery/dist/jquery.min.js',
    'bootstrap/dist/js/bootstrap.min.js',
    # 'js/popover.js',
    # 'lib/docs.min.js',
    'angular/angular.min.js',
    'angular-animate/angular-animate.min.js',
    'angular-resource/angular-resource.min.js',
    'angular-cookies/angular-cookies.min.js',
    'angular-route/angular-route.min.js',
    'angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js',
    'angular-filter/dist/angular-filter.min.js',
    'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'ng-infinite-scroll/build/ng-infinite-scroll.min.js',
    'nx-popover/dist/nsPopover.js',
    'bootbox/bootbox.min.js',
    'bootstrap-slider/dist/bootstrap-slider.min.js',
    'bootstrap-select/dist/js/bootstrap-select.min.js',
    'angular-bootstrap-slider/slider.js',
    'lib/jquery-drags.js',      # not on npmjs.com
    'anno.js/dist/anno.js',
    'lib/jquery.fancybox.pack_adjusted.js'  # not on npmjs.com
]
make_bundle('baseVendorJsBundle', baseVendorJs, filters='rjsmin', output='build/base.vendor.bundle.js')

# NOTE: we include some unminified libs, so apply basic minification to the whole bundle
arbisVendorJs = baseVendorJs[:]
make_bundle('arbisVendorJsBundle', arbisVendorJs, filters='rjsmin', output='build/arbis.vendor.bundle.js')

swosVendorJs = baseVendorJs[:]
swosVendorJs.extend([
    'd3/d3.min.js',
    'lib/nv.d3_adjusted_swos.js',  # not on npmjs.com
    'angular-nvd3/dist/angular-nvd3.min.js',
    'save-svg-as-png/saveSvgAsPng.js',
])
make_bundle('swosVendorJsBundle', swosVendorJs, filters='rjsmin', output='build/swos.vendor.bundle.js')

# NOTE: as Geoss viewer is based on SWOS, include SWOS related bundles beforehand
geossVendorJs = []
# NOTE: do not use globbing for this bundle, to prevent including OpenLayers, jQuery and Bootstrap twice
geossVendorJs.extend([
    'lib/geoss/js/jquery-ui.min.js',
    'lib/geoss/js/jquery.dotdotdot.min.js',
    'lib/geoss/js/jquery.datetimepicker.full.min.js',
    'lib/geoss/js/jquery.rateyo.min.js',
    'lib/geoss/js/bootstrap-multiselect.js',
    'lib/geoss/js/elasticsearch.jquery.min.js',
    'lib/geoss/js/geossSearchWidget.min.js'
])
make_bundle('geossVendorJsBundle', geossVendorJs, filters='rjsmin', output='lib/geoss/js/geoss.vendor.bundle.js')

validationVendorJs = baseVendorJs[:]
validationVendorJs.extend([
    'proj4/dist/proj4.js'
])
make_bundle('validationVendorJsBundle', validationVendorJs, filters='rjsmin', output='build/validation.vendor.bundle.js')


########################################################################################################################
# App JS

# TODO: find a better way to allow globbing in bundles (for ASSETS_DEBUG=True)
# resolve globs here to not have to mess around with django-assets/webassets
# see: https://github.com/miracle2k/django-assets/issues/5
baseAppJs = []
[baseAppJs.extend(x) for x in [
    ['js/polyfills.js'],
    ['js/app/app.module.js'],
    glob_files('js/app/*.js'),
    ['js/app/core/core.module.js'],
    glob_files('js/app/core/*.js'),
    ['js/app/auth/auth.module.js'],
    glob_files('js/app/auth/*.js'),
    ['js/app/csw/csw.module.js'],
    glob_files('js/app/csw/*.js'),
    ['js/app/map/map.module.js'],
    glob_files('js/app/map/*.js'),
    ['js/app/truncation/truncation.module.js'],
    glob_files('js/app/truncation/*.js'),
    ['js/dashboard.js']
]]

arbisAppJs = []
[arbisAppJs.extend(x) for x in [
    baseAppJs
]]
make_bundle('arbisAppJsBundle', arbisAppJs, filters='uglifyjs', output='build/arbis.app.bundle.js')

swosAppJs = []
[swosAppJs.extend(x) for x in [
    baseAppJs,
    ['js/app/tracking/tracking.module.js'],
    glob_files('js/app/tracking/*.js'),
    ['js/app/swos/swos.module.js'],
    glob_files('js/app/swos/*.js')
]]
make_bundle('swosAppJsBundle', swosAppJs, filters='uglifyjs', output='build/swos.app.bundle.js')

validationAppJs = []
[validationAppJs.extend(x) for x in [
    baseAppJs,
    ['js/app/tracking/tracking.module.js'],
    glob_files('js/app/tracking/*.js'),
    ['js/app/swos/swos-layer-controls.directive.js'],
    ['js/app/validation/validation.module.js'],
    glob_files('js/app/validation/*.js')
]]
make_bundle('validationAppJsBundle', validationAppJs, filters='uglifyjs', output='build/validation.app.bundle.js')

########################################################################################################################
# Vendor CSS
vendorCss = [
    'bootstrap/dist/css/bootstrap.min.css',
    'css/bootstrap.diff.css',   # changes from modified less files
    'bootstrap-slider/dist/css/bootstrap-slider.min.css',
    'bootstrap-select/dist/css/bootstrap-select.min.css',
    'font-awesome/css/font-awesome.min.css',
    'nx-popover/dist/nsPopover.css',
    'fancybox/dist/css/jquery.fancybox.css',
    'openlayers/dist/ol.css',
    'anno.js/dist/anno.css',
    'dygraphs/dist/dygraph.min.css'
]
make_bundle('baseVendorCssBundle', vendorCss, filters='cssmin', output='build/base.vendor.bundle.css')

arbisVendorCss = vendorCss[:]
# arbisVendorCss.extend([])
make_bundle('arbisVendorCssBundle', arbisVendorCss, filters='cssmin', output='build/arbis.vendor.bundle.css')


swosVendorCss = vendorCss[:]
swosVendorCss.extend([
    'nvd3/build/nv.d3.min.css'
])
make_bundle('swosVendorCssBundle', swosVendorCss, filters='cssmin', output='build/swos.vendor.bundle.css')

# NOTE: as Geoss viewer is based on SWOS, include SWOS related bundles beforehand
geossVendorCss = []
geossVendorCss.extend([
    'lib/geoss/css/jquery-ui.css',
    'lib/geoss/css/jquery-ui-2.css',
    'lib/geoss/css/jquery.datetimepicker.min.css',
    'lib/geoss/css/jquery.rateyo.min.css',
    'lib/geoss/css/bootstrap-multiselect.css',
    'lib/geoss/css/custom.min.css',
    'lib/geoss/css/sitecustom.css'
])
make_bundle('geossVendorCssBundle', geossVendorCss, filters='cssmin', output='lib/geoss/css/geoss.vendor.bundle.css')


########################################################################################################################
# App CSS
baseAppCss = [
    'css/dashboard.css',
    'css/jonas.css'
]

arbisAppCss = baseAppCss[:]
# arbisAppCss.extend([])
make_bundle('arbisAppCssBundle', arbisAppCss, filters='cssmin', output='build/arbis.app.bundle.css')

swosAppCss = baseAppCss[:]
swosAppCss.extend([
    'css/swos.css'
])
make_bundle('swosAppCssBundle', swosAppCss, filters='cssmin', output='build/swos.app.bundle.css')

validationAppCss = swosAppCss[:]
validationAppCss.extend([
    'css/validation.css'
])
make_bundle('validationAppCssBundle', validationAppCss, filters='cssmin', output='build/validation.app.bundle.css')
