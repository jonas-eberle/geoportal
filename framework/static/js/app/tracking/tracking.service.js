(function() {
    'use strict';

    angular
        .module('webgisApp.tracking')
        .service('TrackingService', TrackingService);

    TrackingService.$inject = [];
    function TrackingService() {
        var service = {
            trackEvent: function(category, action, name) {
                try {
                    _paq.push(['trackEvent', category, action, name]);
                } catch (err) {
                }
            },
            trackPageView: function(url, title) {
                try {
                    _paq.push(['setCustomUrl', url]);
                    _paq.push(['setDocumentTitle', title]);
                    _paq.push(['trackPageView']);
                } catch (err) {
                }
            }
        };
        return service;
    }
})();
