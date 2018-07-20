(function() {
    'use strict';

    angular
        .module('webgisApp.phaenopt')
        .controller('CitizenScienceCtrl', CitizenScienceCtrl);

    CitizenScienceCtrl.$inject = ['$scope', '$compile', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'RegionsService', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function CitizenScienceCtrl($scope, $compile, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, RegionsService, TrackingService, $location, Attribution, $modal, $rootScope) {
        var citizenscience = this;

        citizenscience.region_id = RegionsService.value.id;
        citizenscience.loadData = loadData;

        citizenscience.myseasons_layer = {"id": "myseasons_layer", "identifier": "MySeasons Database", "title": "MySeasons Database", "alternate_title": "MySeasons Database", "abstract": "das da", "ogc_link": null, "ogc_layer": null, "ogc_type": "GeoJSON", "ogc_time": false, "ogc_times": null, "ogc_imageformat": null, "ogc_attribution": null, "west": 9.75591869832, "east": 12.8345545735, "north": 51.7477174724, "south": 50.0747773234, "dataset_epsg": "4326", "downloadable": false, "legend_url": null, "legend_graphic": null, "legend_colors": null, "legend_info": "", "download": null, "download_type": "", "map_layout_image": null, "wmts_matrixset": null, "wmts_resolutions": null, "wmts_tilesize": null, "wmts_projection": null, "wmts_multiply": false, "wmts_prefix_matrix_ids": null, "min_zoom": null, "max_zoom": null, "meta_file_info": null, "resolution_distance": null, "resolution_unit": null, "statistic": null};
        citizenscience.myseasons_layerOL = null;
        citizenscience.addMySeasonsLayer = addMySeasonsLayer;

        djangoRequests.request({
            'method': "GET",
            'url'   : '/phaenopt/region/' + citizenscience.region_id + '/citizenscience/data.json'
        }).then(function (data) {
            citizenscience.data = data;
            citizenscience.myseasons_layer['geojsonObject'] = data["1"];
        });

        function loadData(project_id, start) {
            djangoRequests.request({
                'method': "GET",
                'url'   : '/phaenopt/region/' + citizenscience.region_id + '/csproject/' + project_id +'/data.json?start=' + start
            }).then(function (data) {
                if (data['features'].length > 0) {
                    citizenscience.data[project_id]['features'] = citizenscience.data[project_id]['features'].concat(data['features']);
                    citizenscience.data[project_id]['totalFeatures'] = citizenscience.data[project_id]['features'].length;
                    if (project_id === 1) {
                        citizenscience.myseasons_layer['geojsonObject'] = citizenscience.data[project_id];
                        if (citizenscience.myseasons_layerOL !== null) {
                            var vectorSource = citizenscience.myseasons_layerOL.getSource();
                            var format = new ol.format.GeoJSON();
                            var features = format.readFeatures(data, {
                                featureProjection: 'EPSG:4326'
                            });
                            $.each(features, function(){
                                this.getGeometry().transform('EPSG:4326', mapviewer.displayProjection);
                            });
                            vectorSource.addFeatures(features);
                        }

                    }
                } else {
                    citizenscience.data[project_id]['allLoaded'] = true;
                }
            });
        }

        function addMySeasonsLayer() {
            citizenscience.myseasons_layerOL = mapviewer.addLayer(citizenscience.myseasons_layer);
        }

    }
})();