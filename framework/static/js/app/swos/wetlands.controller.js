(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('WetlandsCtrl', WetlandsCtrl);

    WetlandsCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'WetlandsService', 'TrackingService', '$location', 'Attribution'];
    function WetlandsCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, WetlandsService, TrackingService, $location, Attribution) {
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
        wetlands.value = WetlandsService.value;
        wetlands.formatValue = formatValue;
        // wetlands.wetlands_opened = {};

        $scope.$on("mapviewer.alllayersremoved", function () {
            wetlands.layerIdMap = {};
            attributionList();
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
                    if (prop["country"].includes("-")) {
                        var country_array = prop["country"].split("-");
                        for (var key in country_array) {
                            WetlandsService.country_list.push(country_array[key])
                        }
                    } else {
                        WetlandsService.country_list.push(prop["country"]);
                    }
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
                        var style = new ol.style.Style({
                            fill  : fill,
                            stroke: stroke
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
                bootbox.dialog({
                    title   : 'Welcome to the SWOS Geoportal',
                    message : $('#welcome_text').html(),
                    backdrop: true,
                    onEscape: true,
                    buttons : {
                        confirm: {
                            label   : 'Start Tour',
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
                        close  : {label: 'Close'}
                    }
                });
                loadWetland();
            }, function () {
                bootbox.alert('<h1>Error while loading wetlands</h1>');
            })
        });

        $scope.$on("mapviewer.layerremoved", function ($broadcast, id) {
            if (id !== undefined && id !== null) {
                wetlands.layerIdMap[id] = undefined;
                attributionList();
            }
        });

        $scope.$on('mapviewer.wetland_selected', function ($broadCast, id) {
            WetlandsService.selectWetlandFromId(id);
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
                        title      : "Warning",
                        message    : "More than one layer has been added to the map. This means " +
                        "that layers are visualized in combination, i.e. the layer added most " +
                        "recently is displayed on top.",
                        closeButton: false,
                        buttons    : {
                            "Do not show again": function () {
                                $cookies.put('hasNotifiedAboutLayers', true);
                            },
                            cancel             : {
                                label: "Close"
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
            attributionList();
        }

        function attributionList() {
            var layers = mapviewer.map.getLayers().getArray();
            Attribution.refreshDisplay(layers);
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
                                    closestPanel.find('a').trigger('click'); // find headline and open accordion
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
            TrackingService.trackPageView(
                '/wetland/' + WetlandsService.value.name + '/products/' + layer.product_name + '/' + layer.alternate_title,
                'Map: ' + layer.title
            );
        }
    }
})();
