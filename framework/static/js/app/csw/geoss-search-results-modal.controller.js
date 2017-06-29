(function () {
    'use strict';

    angular.module('webgisApp.csw')
        .controller('GEOSSSearchResultsModalCtrl', GEOSSSearchResultsModalCtrl);

    GEOSSSearchResultsModalCtrl.$inject = ['$modalInstance', 'searchData'];
    function GEOSSSearchResultsModalCtrl($modalInstance, searchData) {
        var gsrm = this;
        // var search_display_target = '#geoss-search-widget .search';
        Geoss.resultsContainer = '#geoss-search-widget .results';

        gsrm.clearAll = clearAll;
        gsrm.close = $modalInstance.close;
        gsrm.failureCallback = failureCallback;
        gsrm.searchData = searchData;
        gsrm.searchKeyUp = searchKeyUp;
        gsrm.submitQuery = submitQuery;
        gsrm.successCallback = successCallback;

        gsrm.submitQuery();

        //--------------------------------------------------------------------------------------------------------------

        /**
         * Clears search bar and results.
         */
        function clearAll() {
            $(gsw_query_search).val('');
            $(Geoss.resultsContainer).html('');
        }

        /**
         * Called on error.
         * @param error
         */
        function failureCallback(error) {
            $('#loading-div').hide();
            switch (error) {
                case 'ajax':
                    alert('AJAX request failed.');
                    break;
                case 'xhr':
                    alert('Wrong response code.');
                    break;
                case 'noresults':
                    alert('No results to show.');
                    break;
            }

            // other instructions here ...
        }

        /**
         *
         * @param e
         */
        function searchKeyUp(e) {
            if (e.which == 13) {
                gsrm.submitQuery();
            }
        }

        /**
         * Sets basic parameters and sends request.
         */
        function submitQuery() {
            var params = new Object();
            params.query = $('#gsw_query_search').val();
            params.bbox = ",,,";
            params.rel = "CONTAINS";
            params.si = 1;
            //params.sources = "geodabgbifid"; //GBIF catalog
            /* Geoss Search Widget [Search] */
            $('#loading-div').show();
            Geoss.search(params, gsrm.successCallback, gsrm.failureCallback);
        }

        /**
         * Called on successful response.
         * @param dataXml
         */
        function successCallback(dataXml) {
            $('#loading-div').hide();
            console.log("Success!");
            // console.log(dataXml.html());

            // other instructions here ...
        }
    }
})();