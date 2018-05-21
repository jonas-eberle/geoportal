(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('ContinentalDataCtrl', ContinentalDataCtrl);

    ContinentalDataCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function ContinentalDataCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, TrackingService, $location, Attribution, $modal, $rootScope) {
        var continentalData = this;
        
        continentalData.open_maps = true;
        continentalData.layers = [];
        continentalData.databases = [];
        continentalData.maps_open = true;
        continentalData.databases_open = false;
        continentalData.geoss_open = true;
        continentalData.selectedContinent = "";
        continentalData.continents = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
        continentalData.bbox = {
            "Africa": "-25.383911,-47.1313489,63.8085939,37.5359", 
            "Asia": "25.5886467,-12.2118513,-168.97788,81.9661865", 
            "Europe": "-31.4647999,34.5428,74.3555001,82.1673907", 
            "North America": "-170.7554894746,5.4961,-8.2617199,83.9702561", 
            "South America": "-110.0281,-56.1455,-28.650543,17.6606999", 
            "Oceania": "110.9510339,-54.8337658,-124.5410156,20.6584862"
         }
        continentalData.selectContinent = selectContinent; 
        continentalData.externalDBSearchGeoss = externalDBSearchGeoss;
        continentalData.selected_bbox = null;
        
        $scope.$on('mapviewer.catalog_loaded', function () {
            
        });
        
        function selectContinent(continent) {
            continentalData.selectedContinent = continent;
            continentalData.selected_bbox = continentalData.bbox[continent].split(',');
            continentalData.geoss_text = "";
            continentalData.geoss_source = [];
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/externaldb.json?continent='+continent+'&geoss_search=true'
            }).then(function (data) {
                continentalData.layers = data['layers'];
                continentalData.databases = data['databases'];
                continentalData.geoss = data['geoss'];
                
                $timeout(function(){
                   $('#continental_geoss_select.selectpicker').selectpicker({
                      style: 'btn-info'
                    }); 
                    $('#continental_geoss_select.selectpicker').selectpicker('refresh');
                });
            });
        }
        
        function externalDBSearchGeoss(geossID, rel) {
            $('#loading-div').show();
            var searchData = {"extent":continentalData.selected_bbox,"rel":rel};
            
            // if geossID is a parameter, than direct search from national databases record
            // otherwise search within GEOSS is used
            if (geossID != null) {
                searchData["source"] = geossID;
                searchData["text"] = "";
            } else {
                searchData["text"] = continentalData.geoss_text;
                if (typeof continentalData.geoss_source != 'undefined') {
                    searchData["source"] = continentalData.geoss_source.join(',');
                }
            }
            
            window.searchData = searchData;
            var geossWindow = $modal.open({
                bindToController: true,
                controller: 'GEOSSSearchResultsModalCtrl',
                controllerAs: 'gsrm',
                templateUrl: subdir+'/static/includes/searchresults_geoss.html',
                windowClass: 'geoss-window',
                backdrop: 'static',
                resolve: {
                    title: function() {return 'Search results'; },
                    searchData: function() {return searchData;}
                }
            }).rendered.then(function(){
                initSearchBar();
            });
        }
    }
})();