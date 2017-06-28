(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('SearchBoxCtrl', SearchBoxCtrl);

    SearchBoxCtrl.$inject = ['csw'];
    function SearchBoxCtrl(csw){
        var sb = this;

        sb.search = search;
        sb.search_geoss = search_geoss;
        sb.text = '';

        //--------------------------------------------------------------------------------------------------------------

        function search() {
            csw.setMapViewer(mapId);
            csw.search(sb.text);
        }

        function search_geoss() {
            csw.setMapViewer(mapId);
            csw.search_geoss(sb.text);
        }
    }
})();