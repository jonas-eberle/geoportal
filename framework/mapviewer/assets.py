from django_assets import Bundle, register


def make_bundle(bundle_name, file_list, filters, output):
    bundle = Bundle(*file_list, filters=filters, output=output)
    register(bundle_name, bundle)


appJs = [
    'js/app.js',
    'js/auth/auth.js',
    'js/map/map.js',
    'js/csw/csw.js',
    'js/swos/wetlands.js',
    'js/swos/diagram.js',
    'js/swos/legends.js',
    'js/dashboard.js'
]

make_bundle('appJsContentBundle', appJs, filters='rjsmin', output='build/app.bundle.js')

vendorJsHead = [
    '@turf/turf/turf.min.js',
    'openlayers/dist/ol.js',
    # 'lib/dygraph-combined.js',
    'dygraphs/dist/dygraph.min.js'
]

make_bundle('vendorJsHeadBundle', vendorJsHead, filters=None, output='build/vendor.head.bundle.js')

vendorJsContent = [
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
    'lib/jquery.fancybox.pack_adjusted.js'
]

make_bundle('vendorJsContentBundle', vendorJsContent, filters='rjsmin', output='build/vendor.content.bundle.js')

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
