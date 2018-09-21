(function() {
    'use strict';

    angular
        .module('webgisApp.phaenopt')
        .filter('orderObjectBy', function(){
         return function(input, attribute) {
            if (!angular.isObject(input)) return input;

            var array = [];
            for(var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function(a, b){
                a = parseInt(a[attribute]);
                b = parseInt(b[attribute]);
                return a - b;
            });
            return array;
         }
        })
        .controller('RegionsCtrl', RegionsCtrl);

    RegionsCtrl.$inject = ['$scope', '$compile', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'RegionsService', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function RegionsCtrl($scope, $compile, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, RegionsService, TrackingService, $location, Attribution, $modal, $rootScope) {
        var proceed = true;
        var wetlands = this;

        wetlands.addLayerToMap = addLayerToMap;
        // wetlands.closeWetland = closeWetland;
        wetlands.data = RegionsService.data;
        wetlands.dataCount = RegionsService.dataCount;
        wetlands.externaldb_search = {'searchText': "", 'layer_exist': ""};
        // wetlands.foo = foo;
        // we need a mapping between the django_id and the hash-like id of a layer to access it in mapviewer.layers
        wetlands.layerIdMap = {};
        wetlands.layers = mapviewer.layers;
        wetlands.removeAllLayers = removeAllLayers;
        wetlands.satdata_vegetation = true;
        wetlands.satdata_image = true;
        wetlands.satdata_table = false;
        wetlands.selectRegion = selectRegion;
        wetlands.closeRegion = closeRegion;
        wetlands.value = RegionsService.value;
        wetlands.formatValue = formatValue;
        wetlands.showSatdataExplorer = showSatdataExplorer;
        wetlands.download = download;
        wetlands.startTour = startTour;
        wetlands.showSatdataExplorer = showSatdataExplorer;

        function cleanUpDiagram() {
                RegionsService.diagram_layer_list = null;
        }

        // wetlands.wetlands_opened = {};

        $scope.$on("mapviewer.alllayersremoved", function () {
            wetlands.layerIdMap = {};
        });

        $scope.$on('mapviewer.catalog_loaded', function () {
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url'   : '/geospatial/regions.geojson'
            }).then(function (data) {
                RegionsService.regionList = [];
                var vectorSource = new ol.source.Vector();
                var features = (new ol.format.GeoJSON()).readFeatures(data);

                $.each(features, function () {
                    this.getGeometry().transform('EPSG:4326', mapviewer.displayProjection);

                    var prop = this.getProperties();
                    // set show to true, when there is at least one product
                    RegionsService.regionList[ prop['id'] ] = prop;

                    var without_geom;

                        without_geom = {
                            "name"        : prop["name"],
                            "id"          : prop["id"]
                        };

                        RegionsService.regions_without_geom.push(without_geom);

                });
                wetlands.regions_without_geom = RegionsService.regions_without_geom;

                vectorSource.addFeatures(features);

                RegionsService.olLayer = new ol.layer.Vector({
                    name  : 'Regions',
                    source: vectorSource,
                    style : function (feature, res) {

                        var fill_color = fill;
                        var stroke_ = stroke;

                        //count listed wetlands
                        var count_listed_wetlands = 0;
                        for (var i = 0; i < RegionsService.regions_without_geom.length; i++){
                                if (RegionsService.regions_without_geom[i].show) {
                                    count_listed_wetlands++;
                                }
                        }
                        // change style for listed wetlands
                        for (var i = 0; i < RegionsService.regions_without_geom.length; i++){
                            if (RegionsService.regions_without_geom[i].id === feature.get("id")){
                                // mark filtered wetland;do not mark if all are shown
                                if (RegionsService.regions_without_geom[i].show && RegionsService.regions_without_geom.length != count_listed_wetlands ) {
                                    fill_color = new ol.style.Fill({color: "rgba(226, 125, 5, 0.4)"});
                                    stroke_ = new ol.style.Stroke({color: "rgba(226, 125, 5, 1)", width: 2})
                                }
                            }
                        }

                        var style = new ol.style.Style({
                            fill  : fill_color,
                            stroke: stroke_
                        });

                        var textStyleConfig = {
                            text: new ol.style.Text({
                                text  : res < 1230 ? feature.get('name') : '',
                                fill  : new ol.style.Fill({color: "#000000"}),
                                stroke: new ol.style.Stroke({color: "#FFFFFF", width: 2})
                            }),
                            geometry: function (feature) {
                                var retPoint;
                                if (feature.getGeometry().getType() === 'MultiPolygon') {
                                    retPoint = feature.getGeometry().getPolygons()[0].getInteriorPoint();
                                } else if (feature.getGeometry().getType() === 'Polygon') {
                                    retPoint = feature.getGeometry().getInteriorPoint();
                                }
                                return retPoint;
                            }
                        };
                        var textStyle = new ol.style.Style(textStyleConfig);
                        return [style, textStyle];
                    }
                });
                mapviewer.map.addLayer(RegionsService.olLayer);

                $('#loading-div').hide();

                //prevent open welcome info box if open via direct link
                console.log('Route params');
                console.log($routeParams);
                if ($routeParams.region_id || $routeParams.story_line_id){
                    loadRegion();
                    $rootScope.$broadcast("regions_loaded");
                } else {
                    RegionsService.selectRegionFromId(1);
                    bootbox.dialog({
                        title: 'Willkommen zum PhaenOPT Portal',
                        message: $compile($('#welcome_text').html())($scope),
                        backdrop: true,
                        onEscape: true,
                        className: 'welcome-dialog',
                        buttons: {
                            close: {label: 'Schlie&szlig;en'}
                        }
                    });
                }

            }, function () {
                bootbox.alert('<h1>Error while loading regions</h1>');
            })
        });

        $scope.$on("mapviewer.layerremoved", function ($broadcast, id) {
            if (id !== undefined && id !== null) {
                wetlands.layerIdMap[id] = undefined;
            }
        });

        $scope.$on('mapviewer.region_selected', function ($broadCast, id) {
            if(RegionsService.region_id != id){
                RegionsService.selectRegionFromId(id);
            }

        });

        $scope.$on("StopLoadingWetlandFromURL", function () {
            proceed = false;
        });

        function startTour() {
            $timeout(function () {
                angular.element('button.starttour').click();
            });
        }

        function addLayerToMap(layer, $event) {
            var checkbox = $event.target;

            //changeWetlandFeatureStyle(); // change Style (remove fill)

            if (checkbox.checked) {
                trackAddLayer(layer);

                var layerObj = mapviewer.addLayer(layer).get("layerObj");
                // store the mapping between django_id and hash-like id
                wetlands.layerIdMap[layerObj.django_id] = layerObj.id;

                // check intersection, if no, please zoom to the new layer!
                var mapExtent = mapviewer.map.getView().calculateExtent(mapviewer.map.getSize());
                mapExtent = ol.proj.transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
                var mapJSON = {
                    "type"      : "Feature",
                    "properties": {"fill": "#fff"},
                    "geometry"  : {
                        "type"       : "Polygon",
                        "coordinates": [[
                            [mapExtent[0], mapExtent[1]],
                            [mapExtent[0], mapExtent[3]],
                            [mapExtent[2], mapExtent[3]],
                            [mapExtent[2], mapExtent[1]],
                            [mapExtent[0], mapExtent[1]]
                        ]]
                    }
                };


                var layerJSON = {
                    "type"      : "Feature",
                    "properties": {"fill": "#fff"},
                    "geometry"  : {
                        "type"       : "Polygon",
                        "coordinates": [[
                            [layer.west, layer.south],
                            [layer.west, layer.north],
                            [layer.east, layer.north],
                            [layer.east, layer.south],
                            [layer.west, layer.south]
                        ]]
                    }
                };

                // zoom to new layer
                /*
                var layerExtent = [layer.west, layer.south, layer.east, layer.north];
                if (layer.epsg > 0) {
                    layerExtent = ol.proj.transformExtent(layerExtent, 'EPSG:' + layer.epsg, mapviewer.map.getView().getProjection().getCode());
                }
                mapviewer.map.getView().fit(layerExtent);
                */

                // if this the first time the user added a second layer to map, notify them
                // about it. using cookies to prevent the dialog from popping up everytime.
                if (mapviewer.layersMeta.length > 1 && $cookies.get('hasNotifiedAboutLayers') === undefined) {
                    bootbox.dialog({
                        title      : "Information",
                        message    : "More than one layer has been added to the map. This means " +
                        "that layers are visualized in combination, i.e. the layer added most " +
                        "recently is displayed on top. To view underlying layer you can change the transparency for each layer, hide a layer or change the order (left menu: Active layers).",
                        closeButton: false,
                        buttons     :{
                            cancel: {
                                label: "Close",
                                callback: function () {
                                    $cookies.put('hasNotifiedAboutLayers', true);
                                }
                            }
                        }
                    });
                }
            } else {
                var layers = mapviewer.map.getLayers().getArray();
                // NOTE: iterating over an array here whilst deleting elements from this array!
                $.each(layers, function () {
                    if (layer.title === this.get('name')) {
                        var layerId = this.get('layerObj').id;
                        //console.log('LayerId: '+layerId);
                        var index = mapviewer.getIndexFromLayer(layer.title);
                        //console.log('index: '+index);
                        mapviewer.removeLayer(layerId, index);
                        //this.setVisible(false);

                        // stop iterating over all the layers
                        return false;
                    }
                });
            }
        }

        function formatValue(value){
            return new Intl.NumberFormat('en-US').format(value);
        }

        function closeRegion() {
            RegionsService.closeRegion();
            regions.value = RegionsService.value;
            regions.data = RegionsService.data;
            regions.dataCount = RegionsService.dataCount;
        }

        function removeAllLayers() {
            while (mapviewer.layersMeta.length > 0) {
                var layer = mapviewer.layersMeta[0];
                mapviewer.removeLayer(layer.id, 0);
                var checkbox = undefined;
                if (layer["django_id"] !== undefined
                    && layer.django_id !== null
                    && (checkbox = document.getElementById("layer_vis_" + layer.django_id))
                ) {
                    checkbox.checked = "";
                }
            }
            wetlands.layerIdMap = {};
        }

        function selectRegion(layer) {
            RegionsService.selectRegion(layer);
        }

        function trackAddLayer(layer) {
            tracking("Map", layer);
        }

        function showSatdataExplorer() {
            $modal.open({
                bindToController: true,
                controller: 'WetlandsSatDataCtrl',
                controllerAs: 'wsdc',
                templateUrl: subdir+'/static/includes/satdata_explorer.html',
                windowClass: 'satdata-window',
                backdrop: 'static'
            }).rendered.then(function(){
                $('.selectpicker').selectpicker('render');
                $('.modal-backdrop').remove();
                var left = angular.element('.satdata-window .modal-dialog').offset().left;
                var top = angular.element('.satdata-window .modal-dialog').offset().top;
                var width = 800;
                angular.element('.satdata-window').removeClass('modal').addClass('mymodal');
                $('.modal-content', angular.element('.satdata-window')).css('left', left).css('top', -30).css('width', width);
            });
        }

        function download(layer){

            tracking("Download", layer);

            var url = '/swos/download_as_archive?ids='+ layer.django_id + '%complete';
            window.open(url, '_self');
        }

        function tracking(type, layer){ //type: e.g. Map, Download

            var layer_type = "/unknown/";
            var type_name = "";

            if(layer.product_name){
                layer_type = '/products/';
                type_name = layer.product_name;
            }
            else if(layer.indicator_name){
                layer_type = '/indicators/';
                type_name = layer.indicator_name;
            }
            else{
                layer_type = '/external/';
                type_name = "";
            }

            TrackingService.trackPageView(
                '/region/' + RegionsService.value.name + layer_type + type_name + '/' + layer.alternate_title,
                type + ': ' + layer.title
            );

        }

        function showSatdataExplorer() {
            $modal.open({
                bindToController: true,
                controller: 'WetlandsSatDataCtrl',
                controllerAs: 'wsdc',
                templateUrl: subdir+'/static/includes/satdata_explorer.html',
                windowClass: 'satdata-window',
                backdrop: 'static'
            }).rendered.then(function(){
                $('.selectpicker').selectpicker('render');
                $('.modal-backdrop').remove();
                var left = angular.element('.satdata-window .modal-dialog').offset().left;
                var top = angular.element('.satdata-window .modal-dialog').offset().top;
                var width = 800;
                angular.element('.satdata-window').removeClass('modal').addClass('mymodal');
                $('.modal-content', angular.element('.satdata-window')).css('left', left).css('top', -30).css('width', width);
            });
        }
    }
})();
/**
 * Created by we32zac on 14.07.2018.
 */
