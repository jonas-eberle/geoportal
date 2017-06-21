(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('TrackingCtrl', TrackingCtrl);

    TrackingCtrl.$inject = ['TrackingService', 'WetlandsService', '$location'];
    function TrackingCtrl(TrackingService, WetlandsService, $location) {
        var tracking = this;

        tracking.trackProduct = trackProduct;
        tracking.trackShowImage = trackShowImage;
        tracking.trackShowSatdataImage = trackShowSatdataImage;
        tracking.trackShowVideo = trackShowVideo;
        tracking.trackWetlandTab = trackWetlandTab;

        function trackProduct(product, open) {
            if (open) {
                TrackingService.trackPageView('/wetland/' + WetlandsService.value.name + '/products/' + product, WetlandsService.value.name + '/products/' + product);
            }
        }

        function trackShowImage(url) {
            TrackingService.trackEvent('Show Photo', WetlandsService.value.name, url);
        }

        function trackShowSatdataImage(image) {
            TrackingService.trackEvent('Show Satdata Image', WetlandsService.value.name, image);
        }

        function trackShowVideo(url) {
            TrackingService.trackEvent('Show Video', WetlandsService.value.name, url);
        }

        function trackWetlandTab(type) {
            $location.path('/wetland/' + WetlandsService.value.id + '/' + type);
            TrackingService.trackPageView('/wetland/' + WetlandsService.value.name + '/' + type, WetlandsService.value.name + '/' + type);
        }
    }
})();
