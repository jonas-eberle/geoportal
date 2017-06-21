(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('SearchBoxCtrl', SearchBoxCtrl);

    SearchBoxCtrl.$inject = ['csw'];
    function SearchBoxCtrl(csw){
        var sb = this;

        sb.search = search;
        sb.text = '';

        //--------------------------------------------------------------------------------------------------------------

        function search() {
            csw.setMapViewer(mapId);
            csw.search(sb.text);
        }
    }
})();