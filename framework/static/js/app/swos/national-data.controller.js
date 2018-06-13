(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('NationalDataCtrl', NationalDataCtrl);

    NationalDataCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope', 'WetlandsService'];
    function NationalDataCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, TrackingService, $location, Attribution, $modal, $rootScope, WetlandsService) {
        var nationalData = this;
        
        nationalData.open_maps = true;
        nationalData.products = [];
        nationalData.layers = []; //external national layers
        nationalData.databases = [];
        nationalData.ownmaps_open = true;
        nationalData.statistics_open = true;
        nationalData.wetlands_open = false;
        nationalData.maps_open = true;
        nationalData.databases_open = false;
        nationalData.geoss_open = true;
        nationalData.selectedCountry = null;
        nationalData.countries = []; 
        nationalData.selectCountry = selectCountry;
        nationalData.selectedCountryName = '';
        nationalData.loadWetland = loadWetland;
        nationalData.formatValue = formatValue;
        nationalData.first_selection = false;
        nationalData.selected_bbox = null;
        nationalData.externalDBSearchGeoss = externalDBSearchGeoss;
        nationalData.olLayer = null;
		nationalData.showStatistics = showStatistics;
        nationalData.clc_type = '-1';
        $scope.$watch('nationalData.clc_type', function(){
          if (nationalData.clc_type != '-1') {
              if (!$.inArray(nationalData.year, nationalData.clc_type.dates)) {
                    nationalData.year = nationalData.clc_type.dates[0];   
              }   
          }
          $timeout(function(){
              $('#statistics_year').selectpicker('refresh');
          }); 
        });
        nationalData.year = '';
        
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
                    $('#contries-selection').selectpicker('refresh');
                    
                    $('#contries-selection').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
                        data = nationalData.countries[clickedIndex-1];
                        nationalData.selectCountry(data);
                        $location.path('/national/' + data['id']);
                    });
                    
                    if ($routeParams.country_id){
                        $.each(nationalData.countries, function(c) {
                            var c = nationalData.countries[c];
                            console.log(c);
                            if (c['id'] == parseInt($routeParams.country_id)) {
                                $($('#sidebar-tabs a')[1]).tab('show');
                                nationalData.selectCountry(c);
                                return true;
                            } 
                        });
                    }
                }, 1);
            });
        });
        
        function selectCountry(country) {
            nationalData.selectedCountry = country;
            nationalData.selectedCountryName = country.name;
            $timeout(function(){
                $('#contries-selection').selectpicker('refresh');
            });
            
            if (country.bbox != null) {
                var bbox = country.bbox.split(",").map(Number);
                nationalData.selected_bbox = bbox;
                mapviewer.map.getView().fit(
                    ol.proj.transformExtent(bbox, 'EPSG:4326', mapviewer.displayProjection)
                );   
            }
            
            nationalData.geoss_text = "";
            nationalData.geoss_source = [];
            if (nationalData.olLayer != null) {
                mapviewer.removeLayerByDjangoID(nationalData.olLayer.get('layerObj').django_id);    
            }
            var layer = mapviewer.baseLayers[1].get('layerObj');
            layer['ogc_link'] = "http://swos-services2.ssv-hosting.de/geoserver/SWOS/wms?cql_filter=ADMIN='"+country['name']+"'";
            //layer['ogc_type'] = 'WMS';
            layer['title'] = country['name'] + ' - Boundaries';
            nationalData.olLayer = mapviewer.addLayer(layer);            
            
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/'+country.id+'/nationaldata.json'
            }).then(function (data) {
                $('#loading-div').hide();
                nationalData.wetlands = data['wetlands'];
                nationalData.products = data['products'];
                WetlandsService.national_products = data['products'];
                WetlandsService.national_name = country.name;
                nationalData.geoss = data['geoss'];
                nationalData.lulc_layers = data['lulc_layers'];
                if (nationalData.lulc_layers.length > 0)  {
                    nationalData.clc_type = nationalData.lulc_layers[0]; 
                    nationalData.year = nationalData.clc_type.dates[0];   
                }             
                
                $timeout(function(){
                   $('#national_geoss_select.selectpicker').selectpicker({
                      style: 'btn-info'
                    });
                   $('#national_geoss_select.selectpicker').selectpicker('refresh');
                   
                   $('#statistics_clc').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Please select a classification legend'
                    });
                   $('#statistics_clc').selectpicker('refresh');
                    
                   $('#statistics_year').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Please select a year to compare'
                    });
                   $('#statistics_year').selectpicker('refresh'); 
                   
                   if ($routeParams.national_layer_id){
                        var layer_id = "#layer_vis_" + $routeParams.national_layer_id; // create layer id
                        $(layer_id).attr('checked', 'checked'); // mark as checked
                        angular.element(layer_id).triggerHandler('click'); // add layer to map
                        var closestPanel = $(layer_id).closest('.panel');
                        closestPanel.find('a').trigger('click'); // find headline and open accordion   
                    }
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
		
		function showStatistics() {
			$modal.open({
                bindToController: true,
                controller: 'NationalDataStatisticsCtrl',
                controllerAs: 'wsdc',
                templateUrl: subdir+'/static/includes/national-data-statistics.html',
                windowClass: 'nationaldata-window',
                backdrop: 'static',
				resolve: {
                    data: function () {
                        return {'clc': nationalData.clc_type.legend, 'date': nationalData.year, 'country': nationalData.selectedCountry.name};
                    },
                    title: function () {
                        return nationalData.selectedCountry.name + ': National wetland statistics for ' + nationalData.clc_type.legend + ' legend in year ' + nationalData.year;
                    }
                }
            }).rendered.then(function(){
                $('.modal-backdrop').remove();
                var left = angular.element('.nationaldata-window .modal-dialog').offset().left;
                var top = angular.element('.nationaldata-window .modal-dialog').offset().top;
                var width = 800;
                angular.element('.nationaldata-window').removeClass('modal').addClass('mymodal');
                $('.modal-content', angular.element('.nationaldata-window')).css('left', left).css('top', -30).css('width', width);
				$timeout(function(){
                    var legend = d3.select('#national-data-chart g.nv-legendWrap').selectAll('g.nv-series');
					if (legend.length > 0) {
                        legend[0][0].dispatchEvent(new Event('click'));
                        legend.each(function(){this.dispatchEvent(new Event('click'))});   
                    }
	            }, 150);
            });
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
