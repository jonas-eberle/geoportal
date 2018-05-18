(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('WetlandsCtrl', WetlandsCtrl);

    WetlandsCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'WetlandsService', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function WetlandsCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, WetlandsService, TrackingService, $location, Attribution, $modal, $rootScope) {
        var proceed = true;
        var wetlands = this;

        wetlands.addLayerToMap = addLayerToMap;
        // wetlands.closeWetland = closeWetland;
        wetlands.data = WetlandsService.data;
        wetlands.dataCount = WetlandsService.dataCount;
        wetlands.externaldb_search = {'searchText': "", 'layer_exist': ""};
        // wetlands.foo = foo;
        // we need a mapping between the django_id and the hash-like id of a layer to access it in mapviewer.layers
        wetlands.layerIdMap = {};
        wetlands.layers = mapviewer.layers;
        wetlands.removeAllLayers = removeAllLayers;
        wetlands.removeLayersByWetland = removeLayersByWetland;
        wetlands.satdata_image = true;
        wetlands.satdata_table = false;
        wetlands.selectWetland = selectWetland;
        wetlands.closeWetland = closeWetland;
        wetlands.value = WetlandsService.value;
        wetlands.formatValue = formatValue;
        wetlands.showSatdataExplorer = showSatdataExplorer;
        wetlands.externalDBSearchGeoss = externalDBSearchGeoss;
        wetlands.download = download;
        // wetlands.wetlands_opened = {};

        $scope.$on("mapviewer.alllayersremoved", function () {
            wetlands.layerIdMap = {};
        });

        $scope.$on('mapviewer.catalog_loaded', function () {
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/wetlands.geojson'
            }).then(function (data) {
                WetlandsService.wetlandList = [];
                var vectorSource = new ol.source.Vector();
                var features = (new ol.format.GeoJSON()).readFeatures(data);

                $.each(features, function () {
                    this.getGeometry().transform('EPSG:4326', mapviewer.displayProjection);

                    var prop = this.getProperties();
                    // set show to true, when there is at least one product
                    prop['show'] = (prop['products'].length > 0);
                    WetlandsService.wetlandList[ prop['id'] ] = prop;

                    var without_geom;

                        without_geom = {
                            "name"        : prop["name"],
                            "country"     : prop["country"].replace(/-/g, ", "),
                            "id"          : prop["id"],
                            "show"        : prop["show"],
                            "geo_scale"   : prop["geo_scale"],
                            "size"        : prop["size"],
                            "ecoregion"   : prop["ecoregion"],
                            "wetland_type": prop["wetland_type"],
                            "site_type"   : prop["site_type"],
                            "products"    : prop["products"]
                        };

                        WetlandsService.wetlands_without_geom.push(without_geom);

                });

                vectorSource.addFeatures(features);

                WetlandsService.olLayer = new ol.layer.Vector({
                    name  : 'Wetlands',
                    source: vectorSource,
                    style : function (feature, res) {

                        var fill_color = fill;
                        var stroke_ = stroke;

                        //count listed wetlands
                        var count_listed_wetlands = 0;
                        for (var i = 0; i < WetlandsService.wetlands_without_geom.length; i++){
                                if (WetlandsService.wetlands_without_geom[i].show) {
                                    count_listed_wetlands++;
                                }
                        }
                        // change style for listed wetlands
                        for (var i = 0; i < WetlandsService.wetlands_without_geom.length; i++){
                            if (WetlandsService.wetlands_without_geom[i].id === feature.get("id")){
                                // mark filtered wetland;do not mark if all are shown
                                if (WetlandsService.wetlands_without_geom[i].show && WetlandsService.wetlands_without_geom.length != count_listed_wetlands ) {
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
                mapviewer.map.addLayer(WetlandsService.olLayer);

                $('#loading-div').hide();

                //prevent open welcome info box if open via direct link
                if ($routeParams.wetland_id || $routeParams.story_line_id){
                    loadWetland();
                    $rootScope.$broadcast("wetlands_loaded");
                }
                else {

                    bootbox.dialog({
                        title: 'Welcome to the GEO Wetlands Community Portal',
                        message: $('#welcome_text').html(),
                        backdrop: true,
                        onEscape: true,
                        buttons: {
                            confirm: {
                                label: 'Start Tour',
                                className: 'hidden-xs',
                                callback: function () {
                                    var sidebar = document.getElementById('wetland_sites');
                                    var scope = angular.element(sidebar).scope();
                                    var rootScope = scope.$root;
                                    scope.$apply(function () {
                                        rootScope.$broadcast("start_tour");
                                    });
                                }
                            },
                            close: {label: 'Close'}
                        }
                    });
                }

            }, function () {
                bootbox.alert('<h1>Error while loading wetlands</h1>');
            })
        });

        $scope.$on("mapviewer.layerremoved", function ($broadcast, id) {
            if (id !== undefined && id !== null) {
                wetlands.layerIdMap[id] = undefined;
            }
        });

        $scope.$on('mapviewer.wetland_selected', function ($broadCast, id) {
            if(WetlandsService.wetland_id != id){
                WetlandsService.selectWetlandFromId(id);
            }

        });

        $scope.$on("StopLoadingWetlandFromURL", function () {
            proceed = false;
        });

        //--------------------------------------------------------------------------------------------------------------

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

                var intersection = turf.intersect(mapJSON, layerJSON);

                if (parseInt(WetlandsService.wetland_id) > 0) {
                    var wetlandpExtent = WetlandsService.wetlandList[WetlandsService.wetland_id].geometry.getExtent();
                    wetlandpExtent = ol.proj.transformExtent(wetlandpExtent, 'EPSG:3857', 'EPSG:4326');
                    var wetlandJSON = {
                        "type"      : "Feature",
                        "properties": {"fill": "#fff"},
                        "geometry"  : {
                            "type"       : "Polygon",
                            "coordinates": [[
                                [wetlandpExtent[0], wetlandpExtent[1]],
                                [wetlandpExtent[0], wetlandpExtent[3]],
                                [wetlandpExtent[2], wetlandpExtent[3]],
                                [wetlandpExtent[2], wetlandpExtent[1]],
                                [wetlandpExtent[0], wetlandpExtent[1]]
                            ]]
                        }
                    };
    
                    if (turf.area(wetlandJSON) < (turf.area(layerJSON) - turf.area(layerJSON)* 0.05) || turf.area(wetlandJSON) > (turf.area(layerJSON) + turf.area(layerJSON)* 0.05 )){
                        mapviewer.showExtentInfo[layer.id] = true;
                    }
                    else {
                         mapviewer.showExtentInfo[layer.id] = false;
                    }
                }

                //Zoom to extent except of global extent
                if (typeof intersection === 'undefined' && !(layer.west === -180 && layer.south === -90 && layer.east === 180 && layer.north === 90)) {

                    // zoom to new layer
                    var layerExtent = [layer.west, layer.south, layer.east, layer.north];
                    if (layer.epsg > 0) {
                        layerExtent = ol.proj.transformExtent(layerExtent, 'EPSG:' + layer.epsg, mapviewer.map.getView().getProjection().getCode());
                    }
                    mapviewer.map.getView().fit(layerExtent);
                }

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

        // function changeWetlandFeatureStyle() {
        //     var wetlandFeatureNewStyle = mapviewer.currentFeature;
        //
        //     wetlandFeatureNewStyle.setStyle(new ol.style.Style({
        //         stroke: new ol.style.Stroke({
        //             color: "#4B94B6",
        //             width: 5
        //         })
        //     }));
        //
        //     mapviewer.selectInteraction.getFeatures().clear();
        //     mapviewer.selectInteraction.getFeatures().push(wetlandFeatureNewStyle);
        // }

        // function closeWetland(id) {
        //     $('#link_wetland_' + id).remove();
        //     $('#wetland_' + id).remove();
        //     delete wetlands.wetlands_opened[id];
        //     $('.scroller-left').click();
        //     $('#link_wetland_list').click();
        // }

        // function foo() {
        //     //console.log('foo');
        //     reAdjust();
        //     $('.scroller-right').click();
        //     //$('#sidebar-tabs a:last').tab('show')
        // }

        function formatValue(value){
            return new Intl.NumberFormat('en-US').format(value);
        }

        function loadWetland() {
            var wetland_id = $routeParams.wetland_id;
            var type_name = $routeParams.type_name;
            var layer_id = $routeParams.layer_id;
            if (wetland_id && proceed) {
                WetlandsService.selectWetlandFromId(wetland_id).then(function () {
                    var target = "overview";
                    if (type_name) {
                        switch (type_name) {
                            case "product":
                                target = 'li.flaticon-layers a';
                                break;
                            case "indicator":
                                target = 'li.flaticon-business a';
                                break;
                            case "satdata":
                                target = 'li.flaticon-space-satellite-station a';
                                break;
                            case "images":
                                target = 'li.flaticon-technology-1 a';
                                break;
                            case "video":
                                target = 'li.flaticon-technology a';
                                break;
                            case "externaldb":
                                target = 'li.flaticon-technology-2 a';
                                break;
                        }

                        $timeout(function () {
                            try {
                                $(target).click(); // open tab
                            } catch (e) {
                            }

                            if (layer_id && proceed) {
                                var layer_ids = layer_id.split("_");

                                $.each(layer_ids, function (i, value) {
                                    var layer_id = "#layer_vis_" + value; // create layer id
                                    $(layer_id).attr('checked', 'checked'); // mark as checked
                                    angular.element(layer_id).triggerHandler('click'); // add layer to map
                                });

                                var last_layer_id = "#layer_vis_" + layer_ids.pop(); // create layer id

                                //open menu according to the last layer id
                                var closestPanel = $(last_layer_id).closest('.panel');
                                if (type_name === "product") {
                                    $location.path('/wetland/' + wetland_id + '/product/' + layer_id);
                                    closestPanel.find('a').first().trigger('click'); // find headline and open accordion
                                }

                                if (type_name === "externaldb") {
                                    $location.path('/wetland/' + wetland_id + '/externaldb/' + layer_id);
                                    closestPanel.parents().eq(4).find('a').trigger('click'); //open parent accordion
                                    closestPanel.find('a').trigger('click'); // find headline and open accordion
                                }
                            }
                        });
                    }
                });
            }
        }
        
        function closeWetland() {
            WetlandsService.closeWetland();
            wetlands.value = WetlandsService.value;
            wetlands.data = WetlandsService.data;
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

        function removeLayersByWetland(wetlandId) {
            // get layers of opened wetland
            var layersToRemove = mapviewer.layersMeta.filter(function (layer) {
                return layer.wetland_id === wetlandId;
            });

            // remove layers of opened wetland
            // NOTE: never iterate over layersMeta while manipulating layersMeta
            $.each(layersToRemove, function () {
                var layersMetaIndex = mapviewer.getIndexFromLayer(this.title);
                mapviewer.removeLayer(this.id, layersMetaIndex);
            });

        }

        function selectWetland(layer) {
            WetlandsService.selectWetland(layer);
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
        
        function externalDBSearchGeoss(geossID, rel) {
            $('#loading-div').show();
            var extent = ol.proj.transformExtent(WetlandsService.wetlandList[WetlandsService.value.data.id].geometry.getExtent(), 'EPSG:3857', 'EPSG:4326');
            var searchData = {"extent":extent,"rel":rel};
            if (geossID != null) {
                searchData["source"] = geossID;
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
                '/wetland/' + WetlandsService.value.name + layer_type + type_name + '/' + layer.alternate_title,
                type + ': ' + layer.title
            );

        }
    }
})();
