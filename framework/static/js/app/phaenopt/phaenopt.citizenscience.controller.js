(function() {
    'use strict';

    angular
        .module('webgisApp.phaenopt')
        .filter('slice', function() {
          return function(arr, start, end) {
            return arr.slice(start, end);
          };
        })
        .controller('CitizenScienceCtrl', CitizenScienceCtrl);

    CitizenScienceCtrl.$inject = ['$scope', '$compile', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'RegionsService', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function CitizenScienceCtrl($scope, $compile, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, RegionsService, TrackingService, $location, Attribution, $modal, $rootScope) {
        var citizenscience = this;

        citizenscience.region_id = RegionsService.value.id;
        citizenscience.selectObservation = selectObservation;

        var project_id = 1;
        citizenscience.myseasons_layer = {"id": "myseasons_layer", "identifier": "MySeasons Database", "title": "MySeasons Database", "alternate_title": "MySeasons Database", "abstract": "das da", "ogc_link": '/phaenopt/region/' + citizenscience.region_id + '/csproject/' + project_id +'/data.json', "ogc_layer": null, "ogc_type": "GeoJSON", "ogc_time": false, "ogc_times": null, "ogc_imageformat": null, "ogc_attribution": null, "west": 9.75591869832, "east": 12.8345545735, "north": 51.7477174724, "south": 50.0747773234, "dataset_epsg": "4326", "downloadable": false, "legend_url": null, "legend_graphic": null, "legend_colors": null, "legend_info": "", "download": null, "download_type": "", "map_layout_image": null, "wmts_matrixset": null, "wmts_resolutions": null, "wmts_tilesize": null, "wmts_projection": null, "wmts_multiply": false, "wmts_prefix_matrix_ids": null, "min_zoom": null, "max_zoom": null, "meta_file_info": null, "resolution_distance": null, "resolution_unit": null, "statistic": null};
        citizenscience.myseasons_layerOL = null;
        citizenscience.addMySeasonsLayer = addMySeasonsLayer;
        citizenscience.stations_overlay = null;
        citizenscience.end = 10;
        citizenscience.start = 0;
        citizenscience.getFeatures = getFeatures;
        citizenscience.features = [];
        citizenscience.totalItems = -1;
        citizenscience.currentPage = 1;
        citizenscience.itemsPerPage = 10;

        $scope.$on('mapviewer.layerremoved', function(event, layerid) {
           if (layerid == 'myseasons_layer') {
               if (citizenscience.stations_overlay != null) {
                    mapviewer.map.removeOverlay(citizenscience.stations_overlay);
                }
           }
        });

        function getFeatures(features) {
            citizenscience.totalItems = features.length;
            features.sort(function(a, b) {
                return new Date(a.get('pubdate')) - new Date(b.get('pubdate'));
            }).reverse();
            return features;
        }

        function selectObservation(feature) {
            if (citizenscience.stations_overlay != null) {
                mapviewer.map.removeOverlay(citizenscience.stations_overlay);
            }
            $('<div id="marker" title="Marker" style="position: absolute;top:-10px;left:-10px;width:20px;height:20px;border:1px solid black;border-radius: 10px;opacity: 0.5;z-index:99999999;background-color:#0FF;"></div>').appendTo('body');
            citizenscience.stations_overlay = new ol.Overlay({
                position: feature.getGeometry().getCoordinates(),
                positioning: 'center-center',
                element: document.getElementById('marker')
            });
            mapviewer.map.addOverlay(citizenscience.stations_overlay);
            mapviewer.map.getView().fit(feature.getGeometry().getExtent(), {maxZoom: 18, size: mapviewer.map.getSize()});

            var output = '<h4 style="font-size:20px">Eigenschaften</h4><ul>';
			var keys = feature.getKeys();
            keys.sort();
            $.each(keys, function () {
                if (this !== 'geometry') {
                    output += '<li><strong>' + this + ': </strong>' + feature.get(this) + '</li>';
                }
            });
            output += '</ul>';
            bootbox.dialog({title: 'Feature info', message: output, backdrop: false});
        }

        function addMySeasonsLayer() {
            citizenscience.myseasons_layerOL = mapviewer.addLayer(citizenscience.myseasons_layer);
        }

    }
})();