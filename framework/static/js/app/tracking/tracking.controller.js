(function() {
    'use strict';

    angular
        .module('webgisApp.tracking')
        .controller('TrackingCtrl', TrackingCtrl);

    TrackingCtrl.$inject = ['TrackingService', 'RegionsService', '$location'];
    function TrackingCtrl(TrackingService, RegionsService, $location) {
        var tracking = this;

        tracking.trackProduct = trackProduct;
        tracking.trackShowImage = trackShowImage;
        tracking.trackShowSatdataImage = trackShowSatdataImage;
        tracking.trackShowVideo = trackShowVideo;
        tracking.trackWetlandTab = trackWetlandTab;

        function trackProduct(product, open) {
            if (open) {
                TrackingService.trackPageView('/region/' + RegionsService.value.name + '/products/' + product, RegionsService.value.name + '/products/' + product);
            }
        }

        function trackShowImage(url) {
            TrackingService.trackEvent('Show Photo', RegionsService.value.name, url);
        }

        function trackShowSatdataImage(image) {
            TrackingService.trackEvent('Show Satdata Image', RegionsService.value.name, image);
        }

        function trackShowVideo(url) {
            TrackingService.trackEvent('Show Video', RegionsService.value.name, url);
        }

        function trackWetlandTab(type) {
            $location.path('/region/' + RegionsService.value.id + '/' + type);
            TrackingService.trackPageView('/region/' + RegionsService.value.name + '/' + type, RegionsService.value.name + '/' + type);
        }
    }
})();
