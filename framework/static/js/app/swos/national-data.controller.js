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
        nationalData.ownmaps_open = true;
        nationalData.wetlands_open = false;
        nationalData.maps_open = true;
        nationalData.databases_open = false;
        nationalData.geoss_open = true;
        nationalData.selectedCountry = null;
        nationalData.countries = []; 
        nationalData.selectCountry = selectCountry;
        nationalData.loadWetland = loadWetland;
        nationalData.formatValue = formatValue;
        nationalData.first_selection = false;
        nationalData.selected_bbox = null;
        nationalData.externalDBSearchGeoss = externalDBSearchGeoss;
        nationalData.olLayer = null;
        
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
                            nationalData.selected_bbox = bbox;
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
            nationalData.geoss_text = "";
            nationalData.geoss_source = [];
            if (nationalData.olLayer != null) {
                mapviewer.removeLayerByDjangoID(nationalData.olLayer.get('layerObj').django_id);    
            }
            var layer = mapviewer.baseLayers[1].get('layerObj');
            layer['ogc_link'] = "http://earthcare.ads.uni-jena.de:8070/geoserver/SWOS/wms?cql_filter=ADMIN='"+country['name']+"'";
            //layer['ogc_type'] = 'WMS';
            layer['title'] = country['name'] + ' - Boundaries';
            nationalData.olLayer = mapviewer.addLayer(layer);            
            
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/'+country.id+'/nationaldata.json'
            }).then(function (data) {
                nationalData.wetlands = data['wetlands'];
                nationalData.maps = data['layers'];
                nationalData.geoss = data['geoss'];
                
                $timeout(function(){
                   $('#national_geoss_select.selectpicker').selectpicker({
                      style: 'btn-info'
                    });
                    $('#national_geoss_select.selectpicker').selectpicker('refresh');
 
                });
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
        
        function externalDBSearchGeoss(geossID, rel) {
            $('#loading-div').show();
            var searchData = {"extent":nationalData.selected_bbox,"rel":rel};
            
            // if geossID is a parameter, than direct search from national databases record
            // otherwise search within GEOSS is used
            if (geossID != null) {
                searchData["source"] = geossID;
                searchData["text"] = "";
            } else {
                searchData["text"] = nationalData.geoss_text;
                if (typeof nationalData.geoss_source != 'undefined') {
                    searchData["source"] = nationalData.geoss_source.join(',');
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
