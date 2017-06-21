(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('MapCurrentLayersTabCtrl', MapCurrentLayersTabCtrl);

    MapCurrentLayersTabCtrl.$inject = ['mapviewer'];
    function MapCurrentLayersTabCtrl(mapviewer) {
        var mclt = this;

        mclt.data = mapviewer.data;
    }
})();
