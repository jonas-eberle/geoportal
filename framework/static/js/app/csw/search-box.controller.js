(function() {
    'use strict';

    angular
        .module('webgisApp.csw')
        .controller('SearchBoxCtrl', SearchBoxCtrl);

    SearchBoxCtrl.$inject = ['csw'];
    function SearchBoxCtrl(csw){
        var sb = this;

        sb.search_csw = search_csw;
        sb.search_es = search_es;
        sb.search_geoss = search_geoss;
        sb.text = '';

        //--------------------------------------------------------------------------------------------------------------

        function search_csw() {
            csw.setMapViewer(mapId);
            csw.search(sb.text);
        }

         function search_es() {
            csw.setMapViewer(mapId);
            csw.search_es(sb.text);
        }

        function search_geoss() {
            csw.setMapViewer(mapId);
            csw.search_geoss(sb.text);
        }
    }
})();