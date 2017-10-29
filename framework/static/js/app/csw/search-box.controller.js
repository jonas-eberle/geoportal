(function() {
    'use strict';

    angular
        .module('webgisApp.csw')
        .controller('SearchBoxCtrl', SearchBoxCtrl);

    SearchBoxCtrl.$inject = ['csw', '$scope'];
    function SearchBoxCtrl(csw, $scope){
        var sb = this;

        sb.search_csw = search_csw;
        sb.search_es = search_es;
        sb.search_geoss = search_geoss;
        sb.text = '';
        sb.wetland = '';

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('wetland_loaded', function ($broadCast, wetland) {
            sb.wetland = wetland;
        });

        function search_csw() {
            csw.setMapViewer(mapId);
            csw.search(sb.text);
        }

         function search_es() {
            csw.setMapViewer(mapId);
            csw.search_es(sb.text, sb.wetland);
        }

        function search_geoss() {
            csw.setMapViewer(mapId);
            csw.search_geoss(sb.text);
        }
    }
})();