(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .controller('MapCurrentLayersTabCtrl', MapCurrentLayersTabCtrl);

    MapCurrentLayersTabCtrl.$inject = ['mapviewer'];
    function MapCurrentLayersTabCtrl(mapviewer) {
        var mclt = this;

        mclt.data = mapviewer.data;
    }
})();
