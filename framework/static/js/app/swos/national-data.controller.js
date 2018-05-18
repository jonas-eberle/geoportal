(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('NationalDataCtrl', NationalDataCtrl);

    NationalDataCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope', 'WetlandsService'];
    function NationalDataCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, TrackingService, $location, Attribution, $modal, $rootScope, WetlandsService) {
        var nationalData = this;
        
        nationalData.open_maps = true;
        nationalData.layers = [];
        nationalData.databases = [];
        nationalData.selectedCountry = null;
        nationalData.countries = []; 
        nationalData.selectCountry = selectCountry;
        nationalData.loadWetland = loadWetland;
        nationalData.formatValue = formatValue;
        nationalData.first_selection = false;
        
        $scope.$on('mapviewer.catalog_loaded', function () {            
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/countries.json'
            }).then(function (data) {
                nationalData.countries = data;
                $timeout(function(){
                    $('#contries-selection').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Please select a country'
                    });
                    
                    $('#contries-selection').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
                        data = nationalData.countries[clickedIndex-1];
                        nationalData.selectCountry(data);
                        if (data.bbox != null) {
                            var bbox = data.bbox.split(",").map(Number);
                            mapviewer.map.getView().fit(
                                ol.proj.transformExtent(bbox, 'EPSG:4326', mapviewer.displayProjection)
                            );   
                        }
                    });
                }, 1);
            });
        });
        
        function selectCountry(country) {
            nationalData.selectedCountry = country;
            if (nationalData.first_selection === false) {
                mapviewer.addLayer(mapviewer.baseLayers[1].get('layerObj'));
                nationalData.first_selection = true;
            }
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/nationaldata.json?country='+country.name
            }).then(function (data) {
                nationalData.wetlands = data['wetlands'];
                nationalData.maps = data['layers'];
            });
            
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/externaldb.json?country='+country.name
            }).then(function (data) {
                nationalData.layers = data['layers'];
                nationalData.databases = data['databases'];
            });
        }
        
        function loadWetland(id) {
            WetlandsService.loadWetland(id, function(){
                WetlandsService.data.activeTab = -1;
                Object.assign(WetlandsService.data.activeTab, -1);
                //$('#link_wetland_list').click();
            });
            WetlandsService.data.activeTab = -1;
            Object.assign(WetlandsService.data.activeTab, -1);
        }
        
        function formatValue(value){
            return new Intl.NumberFormat('en-US').format(value);
        }
    }
})();