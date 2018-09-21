(function() {
    'use strict';

    angular
        .module('webgisApp.phaenopt')
        .controller('InSituCtrl', InSituCtrl);

    InSituCtrl.$inject = ['$scope', '$compile', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'RegionsService', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function InSituCtrl($scope, $compile, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, RegionsService, TrackingService, $location, Attribution, $modal, $rootScope) {
        var insitu = this;

        insitu.stationOpen = true;
        insitu.PhasenOpen = true;

        insitu.region_id = RegionsService.value.id;
        insitu.stationen = [];
        insitu.selectedStation = null;
        insitu.selectedStationData = {};
        insitu.stationDataLoaded = false;
        insitu.loadStation = loadStation;
        insitu.selectedPhaseLoaded = false;

        insitu.definitions = [];
        insitu.selectedDefinition = null;
        insitu.loadDefinition = loadDefinition;
        insitu.selectedDefinitionData = {};
        insitu.selectedDefinitionLoaded = false;
        insitu.years = [];
        insitu.yearStart = null;
        insitu.yearEnd = null;
        insitu.updateDefinitionsHistogram = updateDefinitionsHistogram;

        insitu.stations_layer = {"id": "dwd_stations_layer", "identifier": "DWD_Stations_Thueringen", "title": "DWD Stationen Thüringen", "alternate_title": "DWD Stationen Thüringen", "abstract": "das da", "ogc_link": "/phaenopt/region/1/dwd/stations.geojson", "ogc_layer": null, "ogc_type": "GeoJSON", "ogc_time": false, "ogc_times": null, "ogc_imageformat": null, "ogc_attribution": null, "west": 9.75591869832, "east": 12.8345545735, "north": 51.7477174724, "south": 50.0747773234, "dataset_epsg": "4326", "downloadable": false, "legend_url": null, "legend_graphic": null, "legend_colors": null, "legend_info": "", "download": null, "download_type": "", "map_layout_image": null, "wmts_matrixset": null, "wmts_resolutions": null, "wmts_tilesize": null, "wmts_projection": null, "wmts_multiply": false, "wmts_prefix_matrix_ids": null, "min_zoom": null, "max_zoom": null, "meta_file_info": null, "resolution_distance": null, "resolution_unit": null, "statistic": null};
        insitu.stations_layerOL = null;
        insitu.showStationMap = showStationMap;
        insitu.hideStationMap = hideStationMap;

        insitu.stations_overlay = null;

        $scope.$on('mapviewer.layerremoved', function(event, layerid) {
           if (layerid == 'dwd_stations_layer') {
               if (insitu.stations_overlay != null) {
                    mapviewer.map.removeOverlay(insitu.stations_overlay);
                }
           }
        });

        djangoRequests.request({
            'method': "GET",
            'url'   : '/phaenopt/region/' + insitu.region_id + '/dwd/stations.json'
        }).then(function (data) {
            insitu.stationen = data;
            $timeout(function(){
                    $('#stations-selection').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Bitte eine Station auswählen'
                    });
                    $('#stations-selection').selectpicker('refresh');

                    $('#stations-selection').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
                        data = JSON.parse(insitu.selectedStation);
                        //data = insitu.stationen[clickedIndex-1];
                        insitu.loadStation(data);
                    });
            }, 1);
        });

        function loadStation(data) {
            //insitu.selectedStation = data;
            insitu.stationDataLoaded = false;
            insitu.selectedPhaseLoaded = false;
            $timeout(function(){
                $('#stations-selection').selectpicker('refresh');
            });
            djangoRequests.request({
                'method': "GET",
                'url'   : '/phaenopt/dwd/station/' + data.id + '.json'
            }).then(function (data) {
                insitu.stationDataLoaded = true;
                insitu.selectedStationData = data;

                var coords = ol.proj.fromLonLat([data['geograph_Laenge'],data['geograph_Breite']], 'EPSG:3857');

                if (insitu.stations_overlay != null) {
                    mapviewer.map.removeOverlay(insitu.stations_overlay);
                }

                if (mapviewer.getIndexFromLayer(insitu.stations_layer.title) > -1) {
                    var extent=[coords[0],coords[1],coords[0],coords[1]];
                    mapviewer.map.getView().fit(extent, {maxZoom:14, size:mapviewer.map.getSize()});
                } else {
                    $('<div id="marker" title="Marker" style="position: absolute;top:-10px;left:-10px;width:20px;height:20px;border:1px solid black;border-radius: 10px;opacity: 0.5;z-index:99999999;background-color:#0FF;"></div>').appendTo('body')
                    insitu.stations_overlay = new ol.Overlay({
                        position: coords,
                        positioning: 'center-center',
                        element: document.getElementById('marker')
                    });
                    mapviewer.map.addOverlay(insitu.stations_overlay);
                }

                $timeout(function(){
                    $('#phases-selection').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Bitte eine phänologische Pflanzenphase auswählen'
                    });
                    $('#phases-selection').selectpicker('refresh');

                    $('#phases-selection').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
                        data = JSON.parse(insitu.selectedPhase);
                        //data = insitu.selectedStationData['phases'][clickedIndex-1];
                        //insitu.selectedPhase = data;
                        $timeout(function(){
                            $('#phases-selection').selectpicker('refresh');
                        });
                        insitu.selectedPhaseImage = '/phaenopt/dwd/station/plot.png?Stations_id=' + insitu.selectedStationData['Stations_id'] + '&Objekt_id=' + data['Objekt_id']+ '&Phase_id=' + data['Phase_id']
                        insitu.selectedPhaseLoaded = true;
                    });
            }, 1);
            });
        }

        djangoRequests.request({
            'method': "GET",
            'url'   : '/phaenopt/dwd/definitions.json'
        }).then(function (data) {
            insitu.definitions = data;
            $timeout(function(){
                    $('#definitions-selection').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Bitte eine Phase auswählen'
                    });
                    $('#definitions-selection').selectpicker('refresh');

                    $('#definitions-selection').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
                        insitu.selectedDefinitionLoaded = false;
                        data = JSON.parse(insitu.selectedDefinition);
                        console.log(data);
                        insitu.loadDefinition(data);
                    });
            }, 1);
        });

        function loadDefinition(phase) {
            //insitu.selectedDefinitionData = JSON.parse(insitu.selectedDefinition);
            //console.log(insitu.selectedDefinitionData);
            //$('#definitions-selection').selectpicker('refresh');
            $timeout(function(){
                $('#definitions-selection').selectpicker('refresh');
                insitu.selectedDefinitionData = phase;
                insitu.years = [];
                for (var year = phase['Referenzjahr__min']; year <= phase['Referenzjahr__max']; year++) {
                    insitu.years.push(year);
                }
                console.log(insitu.years);
                insitu.yearStart = phase['Referenzjahr__min']+"";
                insitu.yearEnd = phase['Referenzjahr__max']+"";
                insitu.selectedDefinitionImage = '/phaenopt/dwd/definitions/plot.png?Objekt_id=' + phase['Objekt_id']+ '&Phase_id=' + phase['Phasen_id']
                insitu.selectedDefinitionLoaded = true;
            }, 1);
        }

        function updateDefinitionsHistogram() {
            if (insitu.yearEnd < insitu.yearStart) {
                bootbox.alert('Enddatum muss größer/gleich dem Startdatum sein.');
            } else {
                insitu.selectedDefinitionImage = '/phaenopt/dwd/definitions/plot.png?Objekt_id=' + insitu.selectedDefinitionData['Objekt_id']+ '&Phase_id=' + insitu.selectedDefinitionData['Phasen_id'] + '&start=' + insitu.yearStart + '&end=' + insitu.yearEnd
            }
        }

        function showStationMap() {
            insitu.stations_layerOL = mapviewer.addLayer(insitu.stations_layer);
        }

        function hideStationMap() {
            mapviewer.removeLayerByDjangoID("dwd_stations_layer")
        }

        $('.button-checkbox').each(function () {

            // Settings
            var $widget = $(this),
                $button = $widget.find('button'),
                $checkbox = $widget.find('input:checkbox'),
                color = $button.data('color'),
                settings = {
                    on: {
                        icon: 'glyphicon glyphicon-check'
                    },
                    off: {
                        icon: 'glyphicon glyphicon-unchecked'
                    }
                };

            // Event Handlers
            $button.on('click', function () {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
                $checkbox.triggerHandler('change');
                updateDisplay();
            });
            $checkbox.on('change', function () {
                updateDisplay();
            });

            // Actions
            function updateDisplay() {
                var isChecked = $checkbox.is(':checked');

                // Set the button's state
                $button.data('state', (isChecked) ? "on" : "off");

                // Set the button's icon
                $button.find('.state-icon')
                    .removeClass()
                    .addClass('state-icon ' + settings[$button.data('state')].icon);

                // Update the button's color
                if (isChecked) {
                    $button
                        .removeClass('btn-default')
                        .addClass('btn-' + color + ' active');
                }
                else {
                    $button
                        .removeClass('btn-' + color + ' active')
                        .addClass('btn-default');
                }
            }

            // Initialization
            function init() {

                updateDisplay();

                // Inject the icon if applicable
                if ($button.find('.state-icon').length == 0) {
                    $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
                }
            }
            init();
        });

    }
})();