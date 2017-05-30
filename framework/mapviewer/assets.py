from django_assets import Bundle, register
from django.conf import settings


def make_bundle(bundle_name, file_list, filters, output):
    staticdir = settings.STATICFILES_DIRS[0]

    if not settings.ASSETS_DEBUG:
        file_list = map((staticdir + "/{0}").format, file_list)

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
    'lib/turf.min.js',
    'lib/ol.js',
    'lib/dygraph-combined.js',
    'lib/dygraph-interaction-api.js'
]

make_bundle('vendorJsHeadBundle', vendorJsHead, filters=None, output='build/vendor.head.bundle.js')

vendorJsContent = [
    'lib/jquery.min.js',
    'lib/bootstrap.min.js',
    # 'js/popover.js',
    # 'assets/js/docs.min.js',
    'lib/angular.min.js',
    'lib/angular-resource.min.js',
    'lib/angular-cookies.min.js',
    'lib/angular-route.min.js',
    'lib/angular-drag-and-drop-lists.min.js',
    'lib/angular-filter.min.js',
    'lib/ui-bootstrap-tpls-0.12.0.min.js',
    'lib/nsPopover.js',
    'lib/bootbox.min.js',
    'lib/bootstrap-slider.min.js',
    'lib/angular-bootstrap-slider.js',
    'lib/jquery-drags.js',
    'lib/Chart.min.js',
    'lib/angular-chart.min.js',
    'lib/d3.min.js',
    'lib/nv.d3_adjusted_swos.js',
    'lib/angular-nvd3.min.js',
    'lib/anno.js',
    'lib/fancybox/source/jquery.fancybox.pack.js'
]

make_bundle('vendorJsContentBundle', vendorJsContent, filters='rjsmin', output='build/vendor.content.bundle.js')

vendorCss = [
    'css/bootstrap.min.css',
    'css/bootstrap.diff.css',
    'css/bootstrap-slider.min.css',
    'css/font-awesome.min.css',
    'css/nv.d3.min.css',
    'css/nsPopover.css',
    'lib/fancybox/source/jquery.fancybox.css',
    'css/ol.css',
    'css/anno.css'
]

make_bundle('vendorCssBundle', vendorCss, filters='cssmin', output='build/vendor.bundle.css')

appCss = [
    'css/dashboard.css',
    'css/jonas.css',
    'css/swos.css'
]

make_bundle('appCssBundle', appCss, filters='cssmin', output='build/app.bundle.css')
