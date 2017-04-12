'use strict';

angular.module('webgisApp')

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/wetland/:wetland_id', {controller: 'WetlandsCtrl'})
            .when('/wetland/:wetland_id/:type_name', {controller: 'WetlandsCtrl'})
            .when('/wetland/:wetland_id/:type_name/:layer_id', {controller: 'WetlandsCtrl'})
        ;

    }])

    .config(function($locationProvider) {
        $locationProvider.hashPrefix('');
    })

    .service('WetlandsService', function(djangoRequests, mapviewer, $rootScope) {
        var service = {
            olLayer: null,
            value: {},
            activeTab: -1,

            selectFeature: function (wetland) {
                var extent = wetland.geometry.getExtent();
                //pan = ol.animation.pan({duration: 500, source: mapviewer.map.getView().getCenter()})
                //zoom = ol.animation.zoom({duration: 500, resolution: mapviewer.map.getView().getResolution()})
                //mapviewer.map.beforeRender(pan, zoom)
                mapviewer.map.getView().fit(extent, {size: mapviewer.map.getSize()});

                var wetlandFeature = this.olLayer.getSource().getFeatureById(wetland.id);
                wetlandFeature.setStyle(new ol.style.Style({

                    stroke: new ol.style.Stroke({
                        color: "#000000",
                        width: 5
                    })
                }));

                mapviewer.selectInteraction.getFeatures().clear();
                mapviewer.selectInteraction.getFeatures().push(wetlandFeature);

                // reset style of previously selected feature
                if (mapviewer.currentFeature !== null && mapviewer.currentFeature.getId() !== wetlandFeature.getId()) {
                    mapviewer.currentFeature.setStyle(null);
                }
                // save the currently selected feature
                mapviewer.currentFeature = wetlandFeature;

            },

            selectWetland: function(wetland) {
                /*
                 try {
                 _paq.push(['setCustomUrl', '/wetland/'+wetland.name]);
                 _paq.push(['setDocumentTitle', wetland.name]);
                 _paq.push(['trackPageView']);
                 } catch (err) {}
                 */
                var wetland_service = this;
                 //wetland.id;
                //$('#sidebar-tabs li').removeClass('active');
                //$('#sidebar .tab-content .tab-pane').removeClass('active');

                //if (!(wetland.id in $scope.wetlands_opened)) {

                // wetland_service.value = [];
                wetland_service.wetland_found = false;

                return djangoRequests.request({
                    'method': "GET",
                    'url': '/swos/wetland/'+wetland.id
                }).then(function(data){
                    wetland['data'] = data;
                    //$scope.wetlands_opened[wetland.id] = wetland;
                    wetland_service.value = wetland;
                    wetland_service.data_count = data['count'];
                    //console.log($scope.data_count);

                    wetland_service.videosCurrentPage = 1;
                    wetland_service.imagesCurrentPage = 1;
                    wetland_service.allVideos = false;
                    wetland_service.allImages = false;
                    wetland_service.allImages_external = false;

                    djangoRequests.request({
                        'method': "GET",
                        'url': '/swos/wetland/'+wetland.id+'/images.json?start=0&max=24'
                    }).then(function(data){
                        //$scope.wetlands_opened[wetland.id]['pictures'] = data;
                        wetland_service.value['pictures'] = data;
                        if (data['photos'].length < wetland_service.imagesMaxPage) {
                            wetland_service.allImages = true;
                        }
                    });


                    djangoRequests.request({
                        'method': "GET",
                        'url': '/swos/wetland/'+wetland.id+'/panoramio.json?start=0&max=24'
                    }).then(function(data){
                        //$scope.wetlands_opened[wetland.id]['pictures'] = data;
                        wetland_service.value['external_pictures'] = data;
                        if (data['photos'].length < wetland_service.imagesMaxPage) {
                            wetland_service.allImages_external = true;
                        }
                    });

                    djangoRequests.request({
                        'method': "GET",
                        'url': '/swos/wetland/'+wetland.id+'/youtube.json?start=0&max=9'
                    }).then(function(data){
                        //$scope.wetlands_opened[wetland.id]['videos'] = data;
                        wetland_service.value['videos'] = data;
                        if (data.length < wetland_service.videosMaxPage) {
                            wetland_service.allVideos = true;
                        }
                    });

                    djangoRequests.request({
                        'method': "GET",
                        'url': '/swos/wetland/'+wetland.id+'/satdata.json'
                    }).then(function(data){
                        //$scope.wetlands_opened[wetland.id]['satdata'] = data;
                        wetland_service.value['satdata'] = data;
                    });


                    $.each(wetland_service.wetlands, function(){
                        if (this['id'] == wetland.id) {
                            wetland_service.wetland_found = this;
                            return false;
                        }
                    });
                    wetland_service.selectFeature(wetland_service.wetland_found);
                    $rootScope.$broadcast("wetland_loaded");
                    wetland_service.activeTab = 1;

                }, function() {
                    bootbox.alert('<h1>Error while loading wetland details</h1>');
                });

                /*} else {
                 $('.scroller-right').click();
                 $('#link_wetland_'+wetland.id).click();
                 }*/

            },
            selectWetlandFromId: function (id) {
                var wetland = null;
                $.each(this.wetlands, function() {
                    if (this['id'] == id) {
                        wetland = this;
                        return false;
                    }
                });
                if (wetland){
                    return this.selectWetland(wetland);
                }
                return $q.reject();
            }
        };
        return service;
    })

    .controller('WetlandsCtrl', function($scope, $compile, mapviewer, djangoRequests, $modal, $rootScope, $cookies, Attribution, $routeParams, $q, $timeout, WetlandsService){

        $scope.WetlandsService = WetlandsService;
        $scope.value = WetlandsService.value;
        $scope.$on('wetland_loaded', function (){
             $scope.value = WetlandsService.value;
        });

        $scope.wetlands = [];
        $scope.wetlands_without_geom = [];
        $scope.wetlands_map = {};
        $scope.$on('mapviewer.catalog_loaded', function () {
            djangoRequests.request({
                'method': "GET",
                'url': '/swos/wetlands.geojson'
            }).then(function(data){
                //$scope.wetlands = data.features;
                $scope.wetlands = [];
                var vectorSource = new ol.source.Vector();
                //var features = (new ol.format.GeoJSON()).readFeatures(data.data);
                var features = (new ol.format.GeoJSON()).readFeatures(data);
                $.each(features, function(){
                    this.getGeometry().transform('EPSG:4326', mapviewer.displayProjection);
                    var prop = this.getProperties();

                    $scope.filtered_testmapping = true;
                    // show: true, when id is less or equal 9
                    prop['show'] = (prop['id'] <= 9);

                    $scope.wetlands.push(prop);
                    var without_geom = {
                        "name":         prop["name"],
                        "country":      prop["country"],
                        "id":           prop["id"],
                        "show":         prop["show"],
                        "geo_scale":    prop["geo_scale"],
                        "size":         prop["size"],
                        "ecoregion":    prop["ecoregion"],
                        "wetland_type": prop["wetland_type"],
                        "site_type":    prop["site_type"],
                        "products":    prop["products"]
                    };

                    $scope.wetlands_without_geom.push(without_geom);
                });


                WetlandsService.wetlands = $scope.wetlands;
                vectorSource.addFeatures(features);
                WetlandsService.olLayer = new ol.layer.Vector({
                    name: 'Wetlands',
                    source: vectorSource,
                    style: function(feature, res) {
                        var style = new ol.style.Style({
                            fill: fill,
                            stroke: stroke
                        });
                        var textStyleConfig = {
                            text:new ol.style.Text({
                                text:res < 1230 ? feature.get('name') : '' ,
                                fill: new ol.style.Fill({ color: "#000000" }),
                                stroke: new ol.style.Stroke({ color: "#FFFFFF", width: 2 })
                            }),
                            geometry: function(feature){
                                var retPoint;
                                if (feature.getGeometry().getType() === 'MultiPolygon') {
                                    retPoint = feature.getGeometry().getPolygons()[0].getInteriorPoint();
                                } else if (feature.getGeometry().getType() === 'Polygon') {
                                    retPoint = feature.getGeometry().getInteriorPoint();
                                }
                                return retPoint;
                            }
                        }
                        var textStyle = new ol.style.Style(textStyleConfig);
                        return [style,textStyle];
                    }
                });
                mapviewer.map.addLayer(WetlandsService.olLayer);

                load_wetland();
            }, function() {
                bootbox.alert('<h1>Error while loading wetlands</h1>');
            })
        });

        $scope.data_count = {};
        $scope.videosCurrentPage = 1;
        $scope.allVideos = false;
        $scope.videosMaxPage = 9;
        $scope.loadMoreVideos = function() {
            $scope.videosCurrentPage += 1;
            var start = $scope.videosCurrentPage*$scope.videosMaxPage - $scope.videosMaxPage;
            //console.log('start = '+start);
            djangoRequests.request({
                'method': "GET",
                'url': '/swos/wetland/'+$scope.value.id+'/youtube.json?start='+start+'&max='+$scope.videosMaxPage
            }).then(function(data){
                //$scope.value['videos'] = data;
                $scope.value['videos'].push.apply($scope.value['videos'], data);
                if (data.length < $scope.videosMaxPage) {
                    $scope.allVideos = true;
                }
            })
        };

        $scope.pictures_is_open = true;
        $scope.external_pictures_is_open = true;
        $scope.imagesCurrentPage = 1;
        $scope.imagesCurrentPage_external = 1;
        $scope.allImages = false;
        $scope.allImages_external = false;
        $scope.imagesMaxPage = 24;
        $scope.loadMoreImages = function() {
            $scope.imagesCurrentPage += 1;
            var start = $scope.imagesCurrentPage*$scope.imagesMaxPage - $scope.imagesMaxPage;
            djangoRequests.request({
                'method': "GET",
                'url': '/swos/wetland/'+$scope.value.id+'/images.json?start='+start+'&max='+$scope.imagesMaxPage
            }).then(function(data){
                $scope.value['pictures']['photos'].push.apply($scope.value['pictures']['photos'], data['photos']);
                if (data['photos'].length < $scope.imagesMaxPage) {
                    $scope.allImages = true;
                }
            })
        };
        $scope.loadMoreImages_external = function() {
            $scope.imagesCurrentPage_external += 1;
            var start = $scope.imagesCurrentPage_external*$scope.imagesMaxPage - $scope.imagesMaxPage;
            djangoRequests.request({
                'method': "GET",
                'url': '/swos/wetland/'+$scope.value.id+'/panoramio.json?start='+start+'&max='+$scope.imagesMaxPage
            }).then(function(data){
                $scope.value['external_pictures']['photos'].push.apply($scope.value['external_pictures']['photos'], data['photos']);
                if (data['photos'].length < $scope.imagesMaxPage) {
                    $scope.allImages_external = true;
                }
            })
        };
        $scope.moreImages_external = function(action) {
            if (action == 'prev') {
                $scope.imagesCurrentPage_external -= 1;
            } else {
                $scope.imagesCurrentPage_external += 1;
            }
            var start = $scope.imagesCurrentPage_external*$scope.imagesMaxPage - $scope.imagesMaxPage;
            djangoRequests.request({
                'method': "GET",
                'url': '/swos/wetland/'+$scope.value.id+'/panoramio.json?start='+start+'&max='+$scope.imagesMaxPage
            }).then(function(data){
                $scope.value['external_pictures']['photos'] = data['photos'];

                $scope.allImages_external = (data['photos'].length < $scope.imagesMaxPage);
            })
            
        };
        $scope.moreImages = function(action) {
            if (action == 'prev') {
                $scope.imagesCurrentPage -= 1;
            } else {
                $scope.imagesCurrentPage += 1;
            }
            var start = $scope.imagesCurrentPage*$scope.imagesMaxPage - $scope.imagesMaxPage;
            djangoRequests.request({
                'method': "GET",
                'url': '/swos/wetland/'+$scope.value.id+'/panoramio.json?start='+start+'&max='+$scope.imagesMaxPage
            }).then(function(data){
                $scope.value['pictures']['photos'] = data['photos'];

                $scope.allImages = (data['photos'].length < $scope.imagesMaxPage);
            })

        };
        $scope.showFoto = function(picture) {
            console.log(picture);
            return false;
        };
        
        $scope.filtered_country = '';
        $scope.filtered_geo_scale = '';
        $scope.filtered_ecoregion = '';
        $scope.filtered_wetland_type = '';
        $scope.filtered_site_type = '';
        $scope.filtered_products = '';
        $scope.filtered_testmapping = false;
        $scope.filterCountry = function() {
            $scope.filtered_testmapping = false;
            $scope.sortByCountryName = false;
            $.each($scope.wetlands_without_geom, function(){
                this['show'] = ((this['country'] == $scope.filtered_country) || $scope.filtered_country== '');
            });

            $scope.filtered_geo_scale = '';
            $scope.filtered_ecoregion = '';
            $scope.filtered_wetland_type = '';
            $scope.filtered_site_type = '';
        	$scope.filtered_products = '';
            if ($scope.filtered_country == null) {
                $scope.filterReset();
            }
        };
        $scope.filterScale = function() {
            $scope.filtered_testmapping = false;
            $scope.sortByCountryName = false;
            $.each($scope.wetlands_without_geom, function(){
                this['show'] = ((this['geo_scale'] == $scope.filtered_geo_scale) || ($scope.filtered_geo_scale == ''));
            });
            $scope.filtered_country = '';
            $scope.filtered_ecoregion = '';
            $scope.filtered_wetland_type = '';
            $scope.filtered_site_type = '';
        	$scope.filtered_products = '';
            if ($scope.filtered_geo_scale == null) {
                $scope.filterReset();
            }
        };
        $scope.filterEcoregion = function() {
            $scope.filtered_testmapping = false;
            $scope.sortByCountryName = false;
            $.each($scope.wetlands_without_geom, function(){
                this['show'] = ((this['ecoregion'] == $scope.filtered_ecoregion) || ($scope.filtered_ecoregion == ''));
            });
            $scope.filtered_country = '';
            $scope.filtered_geo_scale = '';
            $scope.filtered_wetland_type = '';
            $scope.filtered_site_type = '';
        	$scope.filtered_products = '';
            if ($scope.filtered_ecoregion == null) {
                $scope.filterReset();
            }
        };
        $scope.filterWetlandType = function() {
            $scope.filtered_testmapping = false;
            $scope.sortByCountryName = false;
            $.each($scope.wetlands_without_geom, function(){
                this['show'] = ((this['wetland_type'] == $scope.filtered_wetland_type) || ($scope.filtered_wetland_type == ''));
            });
            $scope.filtered_country = '';
            $scope.filtered_geo_scale = '';
            $scope.filtered_ecoregion = '';
            $scope.filtered_site_type = '';
        	$scope.filtered_products = '';
            if ($scope.filtered_wetland_type == null) {
                $scope.filterReset();
            }
        };
        $scope.filterSiteType = function() {
            $scope.filtered_testmapping = false;
            $scope.sortByCountryName = false;
            $.each($scope.wetlands_without_geom, function(){
                this['show'] = ((this['site_type'] == $scope.filtered_site_type) || ($scope.filtered_site_type == ''));
            });
            $scope.filtered_country = '';
            $scope.filtered_geo_scale = '';
            $scope.filtered_ecoregion = '';
            $scope.filtered_wetland_type = '';
        	$scope.filtered_products = '';
            if ($scope.filtered_site_type == null) {
                $scope.filterReset();
            }
        };
        $scope.filterProduct = function() {
            $scope.filtered_testmapping = false;
            $scope.sortByCountryName = false;
            $.each($scope.wetlands_without_geom, function(){
                this['show'] = ((jQuery.inArray($scope.filtered_products, this['products']) > -1) || ($scope.filtered_products == ''));
            });
            $scope.filtered_country = '';
            $scope.filtered_geo_scale = '';
            $scope.filtered_ecoregion = '';
            $scope.filtered_wetland_type = '';
            $scope.filtered_site_type = '';
            if ($scope.filtered_products == null) {
                $scope.filterReset();
            }
        };
        $scope.filterTestmapping = function() {
            $scope.filtered_country = '';
            $scope.filtered_geo_scale = '';
            $scope.filtered_ecoregion = '';
            $scope.filtered_wetland_type = '';
            $scope.filtered_site_type = '';
        	$scope.filtered_products = '';

            if ($scope.filtered_testmapping == false) {
                $scope.filterReset();
            } else {
                $.each($scope.wetlands_without_geom, function(){
                    this['show'] = (this['id'] <= 9);
                })
            }
        };
        $scope.filterReset = function() {
            $.each($scope.wetlands_without_geom, function(){
                this['show'] = true;
            })
        };

        $scope.sortByCountryName = false;
        $scope.sortOrder = 'name';
        $scope.setSortOrder = function () {
            if ($scope.sortByCountryName) {
                $scope.sortOrder = ['country', 'name'];
            }
            else {
                $scope.sortOrder = 'name';
            }
        };
        
        $scope.wetlands_opened = {};

        
        $scope.$on('mapviewer.wetland_selected', function ($broadCast, id) {
            WetlandsService.selectWetlandFromId(id);
        });

        $scope.satdata_table = false;
        $scope.satdata_image = true;

        $scope.externaldb_search = {'searchText':  "", 'layer_exist': ""};

        $scope.trackWetlandTab = function(type, $location) {

            window.location.hash = '#/wetland/'+$scope.value.id+'/'+type;

        try {
                _paq.push(['setCustomUrl', '/wetland/'+$scope.value.name+'/'+type]);
                _paq.push(['setDocumentTitle', $scope.value.name+'/'+type]);
                _paq.push(['trackPageView']);
            } catch (err) {}
        };
        
        $scope.trackProduct = function(product, open) {
            if (open) {
                try {
                    _paq.push(['setCustomUrl', '/wetland/'+$scope.value.name+'/products/'+product]);
                    _paq.push(['setDocumentTitle', $scope.value.name+'/products/'+product]);
                    _paq.push(['trackPageView']);
                } catch (err) {}
            }
        };

        $scope.trackAddLayer = function(layer) {
            try {
                _paq.push(['setCustomUrl', '/wetland/'+$scope.value.name+'/products/'+layer.product_name+'/'+layer.alternate_title]);
                _paq.push(['setDocumentTitle', 'Map: '+layer.title]);
                _paq.push(['trackPageView']);
            } catch (err) {}
        };
        
        $scope.trackShowSatdataImage = function(image) {
            try {
                _paq.push(['trackEvent', 'Show Satdata Image', $scope.value.name, image]);
            } catch (err) {}
        };
        
        $scope.trackShowImage = function(url) {
            try {
                _paq.push(['trackEvent', 'Show Photo', $scope.value.name, url]);
            } catch (err) {}
        };
        
        $scope.trackShowVideo = function(url) {
            try {
                _paq.push(['trackEvent', 'Show Video', $scope.value.name, url]);
            } catch (err) {}
        };


        $scope.foo = function() {
            //console.log('foo');
            reAdjust();
            $('.scroller-right').click();
            //$('#sidebar-tabs a:last').tab('show')
        };
        
        $scope.closeWetland = function(id) {
            $('#link_wetland_'+id).remove();
            $('#wetland_'+id).remove();
            delete $scope.wetlands_opened[id];
            $('.scroller-left').click();
            $('#link_wetland_list').click();
        };
        
        $scope.addLayer = function(product) {
            if (product.layers.length > 0) {
                mapviewer.addLayer(product.layers[0]);
            } else {
                alert('No layer found');
            }
        };

        // we need a mapping between the django_id and the hash-like id of a layer to access it in mapviewer.layers
        $scope.layerIdMap = {};
        $scope.layers = mapviewer.layers;
        $scope.addLayerToMap = function(layer, $event) {
            var checkbox = $event.target;

            //changeWetlandFeatureStyle(); // change Style (remove fill)

            if (checkbox.checked) {
                $scope.trackAddLayer(layer);

                var layerObj = mapviewer.addLayer(layer).get("layerObj");
                // store the mapping between django_id and hash-like id
                $scope.layerIdMap[layerObj.django_id] = layerObj.id;
                
                // check intersection, if no, please zoom to the new layer!
                var mapExtent = mapviewer.map.getView().calculateExtent(mapviewer.map.getSize());
                mapExtent = ol.proj.transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
                var mapJSON = {
                  "type": "Feature",
                  "properties": {"fill":"#fff"},
                  "geometry": {
                    "type": "Polygon",
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
                  "type": "Feature",
                  "properties": {"fill":"#fff"},
                  "geometry": {
                    "type": "Polygon",
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
                if (typeof intersection === 'undefined' && !(layer.west == -180 && layer.south == -90 && layer.east == 180 && layer.north == 90)) {

                    // zoom to new layer
                    var layerExtent = [layer.west, layer.south, layer.east, layer.north];
                    if (layer.epsg > 0) {
                        layerExtent = ol.proj.transformExtent(layerExtent, 'EPSG:'+layer.epsg, mapviewer.map.getView().getProjection().getCode());
                    }
                    mapviewer.map.getView().fit(layerExtent);
                }

                // if this the first time the user added a second layer to map, notify them
                // about it. using cookies to prevent the dialog from popping up everytime.
                if (mapviewer.layersMeta.length > 1 && ! $cookies.hasNotifiedAboutLayers) {
                    bootbox.dialog({
                        title: "Warning",
                        message: "More than one layer has been added to the map. This means " +
                        "that layers are visualized in combination, i.e. the layer added most " +
                        "recently is displayed on top.",
                        closeButton: false,
                        buttons: {
                            "Do not show again": function() {
                                $cookies.hasNotifiedAboutLayers = true;
                            },
                            cancel: {
                                label: "Close"
                            }
                        }
                    });
                }
            } else {
                var layers = mapviewer.map.getLayers().getArray();
                // NOTE: iterating over an array here whilst deleting elements from this array!
                $.each(layers, function(){
                    if (layer.title == this.get('name')) {
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
            $scope.attributionList();
        };

        $scope.attributionList = function() {
            var layers = mapviewer.map.getLayers().getArray();
            var attribution_arr = [];
            $.each(layers, function() {
                    var layer = this.get('layerObj');

                    if(typeof(layer) !== 'undefined') {
                        if (attribution_arr.indexOf(layer.ogc_attribution) == -1  ) {
                                if(layer.ogc_attribution != 'null') {
                                    attribution_arr.push(layer.ogc_attribution);
                                }
                        }
                    }
                });
                var attr_list = attribution_arr.join(' | \u00A9 ');
                if(attr_list.length > 0){
                    $('.map-controls-wrapper').css('height', '82px');
                }
                else{
                    $('.map-controls-wrapper').css('height', '53px');
                }
                Attribution.setList(attr_list);
        };

        $scope.removeAllLayers = function () {
            while (mapviewer.layersMeta.length > 0) {
                var layer = mapviewer.layersMeta[0];
                mapviewer.removeLayer(layer.id, 0);
                var checkbox = undefined;
                if (layer["django_id"] !== undefined
                    && layer.django_id !== null
                    && (checkbox = document.getElementById("layer_vis_"+layer.django_id))
                ) {
                    checkbox.checked = "";
                }
            }
            $scope.layerIdMap = {};

        };

        $scope.removeLayersByWetland = function(wetlandId) {
            // get layers of opened wetland
            var layersToRemove = mapviewer.layersMeta.filter(function(layer) {
                return layer.wetland_id === wetlandId;
            });

            // remove layers of opened wetland
            // NOTE: never iterate over layersMeta while manipulating layersMeta
            $.each(layersToRemove, function() {
                var layersMetaIndex = mapviewer.getIndexFromLayer(this.title);
                mapviewer.removeLayer(this.id, layersMetaIndex);
            });

        };

        $scope.$on("mapviewer.alllayersremoved", function () {
            $scope.layerIdMap = {};
            $scope.attributionList()

        });

        $scope.$on("mapviewer.layerremoved", function($broadcast, id) {
            if (id !== undefined && id !== null) {
                $scope.layerIdMap[id] = undefined;
                $scope.attributionList()
            }

        });




        var load_wetland = function () {
            var wetland_id = $routeParams.wetland_id;
            var type_name = $routeParams.type_name;
            var layer_id = $routeParams.layer_id;
            if (wetland_id){
                WetlandsService.selectWetlandFromId(wetland_id).then(function(){
                    var target = "overview";
                    if (type_name) {
                        switch (type_name){
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
                        } catch(e) {}

                        if (layer_id) {

                            var layer_ids = layer_id.split("_");


                            $.each(layer_ids, function (i, value) {
                                var layer_id = "#layer_vis_" + value; // create layer id
                                $(layer_id).attr('checked', 'checked'); // mark as checked
                                angular.element(layer_id).triggerHandler('click'); // add layer to map
                            });

                            var last_layer_id = "#layer_vis_" + layer_ids.pop(); // create layer id

                            //open menu according to the last layer id
                            if (type_name == "product") {
                                window.location.hash = '#/wetland/'+wetland_id+'/product/'+layer_id;
                                $(last_layer_id).closest('.panel').find('a').trigger('click'); // find headline and open accordion
                            }
                            if (type_name == "externaldb") {
                                window.location.hash = '#/wetland/'+wetland_id+'/externaldb/'+layer_id;
                                $(last_layer_id).closest('.panel').parents().eq(4).find('a').trigger('click'); //open parent accordion
                                $(last_layer_id).closest('.panel').find('a').trigger('click'); // find headline and open accordion
                            }
                        }
                      });
                    }
                });
            }
        };

        var changeWetlandFeatureStyle = function () {

            var wetlandFeatureNewStyle = mapviewer.currentFeature;

            wetlandFeatureNewStyle.setStyle(new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "#4B94B6",
                    width: 5
                })
            }));

            var selectInteraction = mapviewer.map.getInteractions().getArray().filter(function (interaction) {
                return interaction instanceof ol.interaction.Select;
            });
            selectInteraction[0].getFeatures().clear();
            selectInteraction[0].getFeatures().push(wetlandFeatureNewStyle);
        }

        })
    .controller('IntroductionTour', function ($scope,mapviewer,WetlandsService, $timeout, $cookies, $rootScope ){

        //#todo move all ids and paramenter as variable to the top

        function only_load_wetland(wetland_id) {

            var current_wetland_id = "";

            if (mapviewer.currentFeature) {
                current_wetland_id = mapviewer.currentFeature.get('id');
            }
            if (wetland_id != current_wetland_id) {
                WetlandsService.selectWetlandFromId(wetland_id)
            }
            else {
                $timeout(function () {
                    if ($("#link_wetland_list").parents().hasClass("active")) {
                        try {
                            $("#link_wetland_opened")[0].click(); // open catalog tab
                        } catch (e) {
                        }
                    }
                }, 0, false);
            }
        }

        function select_tab(type_name) {
            var target = ""; //default tab
            if (type_name) {
                switch (type_name) {
                    case "overview":
                        target = 'li.flaticon-bars a';
                        break;
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

                try {
                    $(target).click(); // open tab
                } catch (e) {
                }
            }
            else {
                $timeout(function () {
                    if ($("#link_wetland_list").parents().hasClass("active")) {}
                    else {
                        try {
                            console.log("not active");
                            $("#link_wetland_list")[0].click(); // open catalog tab
                        } catch (e) {
                        }
                    }
                }, 0, false);
            }

    }

        function load_and_show_layer(wetland_id, type_name, layer_id, max_length) {

            var layer_is_new = "true";

            for (var key in mapviewer.layersMeta) {
                if(mapviewer.layersMeta[key].django_id === layer_id){
                    layer_is_new = false;
                };
            }

            //only load a new layer, if the the layer is not already added and the max number of needed layers is reached
            if (layer_id && layer_is_new && mapviewer.layersMeta.length == max_length ) {

                var layer_ids = layer_id.split("_");

                $.each(layer_ids, function (i, value) {
                    var layer_id = "#layer_vis_" + value; // create layer id
                    $(layer_id).attr('checked', 'checked'); // mark as checked
                    angular.element(layer_id).triggerHandler('click'); // add layer to map
                });

                var last_layer_id = "#layer_vis_" + layer_ids.pop(); // create layer id

                //open menu according to the last layer id
                if (type_name == "product") {
                    window.location.hash = '#/wetland/' + wetland_id + '/product/' + layer_id;
                    $(last_layer_id).closest('.panel').find('a').trigger('click'); // find headline and open accordion
                }
                if (type_name == "externaldb") {
                    window.location.hash = '#/wetland/' + wetland_id + '/externaldb/' + layer_id;
                    $(last_layer_id).closest('.panel').parents().eq(4).find('a').trigger('click'); //open parent accordion
                    $(last_layer_id).closest('.panel').find('a').trigger('click'); // find headline and open accordion
                }
            }
        }

        function reset() {
           // #todo replace remove and zoom once the function is available via service
            while (mapviewer.layersMeta.length > 0) {
                var layer = mapviewer.layersMeta[0];
                mapviewer.removeLayer(layer.id, 0);
                var checkbox = undefined;
                if (layer["django_id"] !== undefined
                    && layer.django_id !== null
                    && (checkbox = document.getElementById("layer_vis_"+layer.django_id))
                ) {
                    checkbox.checked = "";
                }
            }
            $rootScope.$broadcast("mapviewer.alllayersremoved");

             mapviewer.map.getView().fit(
                ol.proj.transformExtent(mapviewer.maxExtent, 'EPSG:4326', mapviewer.displayProjection),
                { size: mapviewer.map.getSize() }
             );
        }

        $scope.$on('start_tour', function () {
            return $scope.startAnno();
        });

        $scope.startAnno = function () {

            $('.main').css('position', 'absolute');
            //  $('.main').css('position', 'fixed');
            $('body').on("click",function(e){
                console.log(e);
            });

            var anno1 = new Anno([

                    {
                        target: '.sidebar',
                        position: {
                            top: '3em',
                            right: '420px'
                        },
                        className: 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons: [
                            {
                                text: 'Learn more about SWOS products',
                                className: 'anno-btn-low-importance',
                                click: function (anno, evt) {
                                }
                            },
                            {
                                text: 'Continue',
                                click: function (anno, evt) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow: function (anno, $target, $annoElem) {

                            select_tab();//ensure wetland catalog is shown

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {
                                console.log(e);
                                if (e.target.htmlFor === "cb_testmapping" || e.target.id === "cb_testmapping" || e.target.htmlFor === "cb_groupbycountry" || e.target.id === "cb_groupbycountry" || e.target.id === "link_wetland_list") {
                                }
                                else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler
                        },
                        onHide: function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true)
                        },
                        content: '<h4>Wetland Catalog</h4><div><p>Here you find the wetland sites of the <strong>SWOS project</strong>. They are located in Europe and Africa. Products (maps) and indicators based on the <strong>SWOS toolbox</strong> will be provided.</p> ' +
                        '<p>The preselected wetlands (<u>testmapping wetlands</u>) are used as test sites for the development of algorithms and its validation.</p>' +
                        '<p> <strong>Try it</strong>: Unselect the <u>testmapping wetlands</u> to see the full list or use filter to search for wetlands.</p>' +
                        '</div>'
                    },
                    {
                        target: '.sidebar',
                        position: {
                            top: '15em',
                            right: '420px'
                        },
                        className: 'anno-width-400',
                        arrowPosition: 'center-right',
                        buttons: [
                            AnnoButton.BackButton,
                            {
                                text: 'Continue',
                                click: function (anno, evt) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow: function (anno, $target, $annoElem) {

                            select_tab(); //ensure wetland catalog is shown

                            //  $("#gmap").css('z-index', '2000');
                            //  $('.map-controls-wrapper').css('z-index', '2002');
                            // $('.ol-viewport').css('z-index', '2001');

                            // prevent all click events (except of checkboxes)

                            var handler = function (e) {
                                console.log(e);
                                if (e.target.htmlFor === "cb_testmapping" || e.target.id === "cb_testmapping" || e.target.htmlFor === "cb_groupbycountry" || e.target.id === "cb_groupbycountry" || e.target.id === "link_wetland_list" || e.target.innerText === "Camargue") {
                                    if (e.target.innerText === "Camargue") {
                                        anno.switchToChainNext();
                                    }
                                }
                                else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler
                        },
                        onHide: function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true)
                        },
                        content: '<h4>Wetland Selection</h4><div><p>To get more information about a wetland you can select it on the <strong>map</strong> or from the <strong>list</strong>.</p>' +
                        '<p><strong>Try it:</strong> Select the <u>Camargue</u> (France) from the list.</p></div>'
                    },
                    {
                        target: '.sidebar',
                        position: {
                            top: '6em',
                            right: '420px'
                        },
                        className: 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons: [
                            AnnoButton.BackButton,
                            {
                                text: 'Continue',
                                click: function (anno, evt) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow: function (anno, $target, $annoElem) {

                            //Load wetland (id 4 - Camargue)
                            only_load_wetland(4);

                            //ensure overview of wetland is shown
                            select_tab("overview");

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products
                                if (e.target.id === "link_wetland_opened" || e.target.className === "flaticon-layers" || e.target.parentElement.className === "flaticon-layers ng-scope ng-isolate-scope") {
                                    if (e.target.className === "flaticon-layers" || e.target.parentElement.className === "flaticon-layers ng-scope ng-isolate-scope") {
                                        anno.switchToChainNext(); // switch to next step, if the user click on "products"
                                    }
                                }
                                else {
                                    e.stopPropagation();
                                }
                            }
                            $target[0].addEventListener('click', handler, true);
                            return handler
                        },
                        onHide: function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                        },
                        content: '<h4>Wetlands Overview</h4><div><p>Summary of available information for a wetland:</p>' +
                        '<ol style="list-style-type:disc;list-style-position:outside;">' +
                        '<li><u>Indicator</u>.Wetland indicators derived on the basis of satellite images / SWOS products.</li>' +
                        '<li><u>Products</u>. Maps produced with SWOS tools.</li>' +
                        '<li><u>Satellite data</u>. Overview on all available satellite data.</li>' +
                        '<li><u>Photos</u>. Uploaded and linked (source: Panoramio) photos.</li>' +
                        '<li><u>Videos</u>. Uploaded and linked (source: Youtube) videos.</li>' +
                        '<li><u>External databases</u>. Compilation of other external data sources (e.g. databases, maps, ...).</li></ol>' +
                        '<p></p><p><strong>Try it:</strong> Select <u>Products</u>.</p></div>'
                    },
                    {
                        target: '.sidebar',
                        position: {
                            top: '6em',
                            right: '420px'
                        },
                        className: 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons: [
                            AnnoButton.BackButton,
                            {
                                text: 'Continue',
                                click: function (anno, evt) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow: function (anno, $target, $annoElem) {

                            //ensure products is shown
                            select_tab("product");

                            // prevent all click events (except of ...)
                            var handler = function (e) {

                                // Allow preselection of product tab; allow accordion; allow layer selection
                                if (e.target.className === "accordion-toggle" || e.target.id === "link_wetland_opened" || e.target.className === "flaticon-layers" || e.target.id.substring(0, 9) === "layer_vis") {
                                    if (e.target.id.substring(0, 9) === "layer_vis") {
                                        anno.switchToChainNext();
                                    }
                                }
                                else {
                                    e.stopPropagation();
                                }
                            }
                            $target[0].addEventListener('click', handler, true);
                            return handler
                        },
                        onHide: function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true)
                        },
                        content: '<h4>Wetland Products</h4><div><p>Products derived with the help of <u>SWOS tools</u> on the basis of satellite images. Available products are:  </p>' +
                        '<ol style="list-style-type:disc;list-style-position:outside;">' +
                        '<li>Water Quality</li>' +
                        '<li>Land Surface Temperature Trend</li>' +
                        '<li>Surface Water Dynamics</li>' +
                        '<li>Land Use Land Cover</li>' +
                        '<li>Land Use Land Cover Change</li>' +
                        '<li>Surface Soil Moisture</li></ol>' +
                        '<p>(Please keep in mind not all products can and will be derived for each wetland.)</p>' +

                        '<p></p><p><strong>Try it:</strong> Choose a product category and select a map.</p></div>'
                    },
                    {
                        target: '.sidebar',
                        position: {
                            top: '300px',
                            right: '420px'
                        },
                        className: 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons: [
                            AnnoButton.BackButton,
                            {
                                text: 'Continue',
                                click: function (anno, evt) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow: function (anno, $target, $annoElem) {

                            //ensure products is shown
                            select_tab("product");

                            $cookies.hasNotifiedAboutLayers = true;
                            load_and_show_layer(4, "product", "2836", 0);

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products
                                if (e.target.className === "accordion-toggle" || e.target.parentElement.className === "flaticon-technology-2 ng-scope ng-isolate-scope") {

                                }
                                else {
                                    e.stopPropagation();
                                }
                            }
                            $target[0].addEventListener('click', handler, true);
                            return handler
                        },
                        onHide: function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $cookies.hasNotifiedAboutLayers = false;

                        },
                        content: '<h4>Wetland Products</h4><div><p>All available products for the selected wetland. You can display all of them on the map.</p>' +
                        '<p>For each layer you can:' +
                        '<ol style="list-style-type:none;list-style-position:outside;">' +
                        '<li><p><span class="fa fa-list fa-lg"></span> Show / Hide legend</p></li>' +
                        '<li><p><span class="fa fa-file-text-o fa-lg"></span> Show metadata</p></li>' +
                        '<li><span class="fa fa-search fa-lg"></span> Zoom to layer</li>' +
                        '<li><span class="fa fa-share-alt fa-lg"></span> Share link to dataset</li></ol></p>' +

                        '<p></p><p><strong>Try it:</strong> Move on to external <span class="flaticon-technology-2"></span>databases.</p></div>'
                    },
                    {
                        target: '.sidebar',
                        position: {
                            top: '6em',
                            right: '420px'
                        },
                        className: 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons: [
                            AnnoButton.BackButton,
                            {
                                text: 'Continue',
                                click: function (anno, evt) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow: function (anno, $target, $annoElem) {

                            //ensure products is shown
                            select_tab("externaldb");

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products
                                if (e.target.className === "accordion-toggle" || e.target.className === "flaticon-layers ng-binding ng-scope" || e.target.id === "only_layer" || e.target.id.substring(0, 9) === "layer_vis") {
                                    if (e.target.id.substring(0, 9) === "layer_vis") {
                                        anno.switchToChainNext();
                                    }
                                }
                                else {
                                    e.stopPropagation();
                                }
                            }
                            $target[0].addEventListener('click', handler, true);
                            return handler
                        },
                        onHide: function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true)
                        },
                        content: '<h4>External Databases </h4><div>' +
                        '<p>Here you find external databases and information source related to wetlands</p>' +
                        '<p></p><p><strong>Try it:</strong> Select an external global map (e.g. Global -> Global Surface Water -> Maximum Water extent).</p></div>'
                    },
                    {
                        target: '#active_layer',
                        position: {
                            top: '100px',
                            left: '400px'
                        },
                        className: 'anno-width-500',

                        buttons: [
                            AnnoButton.BackButton,
                            {
                                text: 'Continue',
                                click: function (anno, evt) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow: function (anno, $target, $annoElem) {

                            //ensure products is shown
                            //select_tab("externaldb");
                            $cookies.hasNotifiedAboutLayers = true;
                            load_and_show_layer(4, "externaldb", "2551", 1);

                            $('#show_active_layer').click();
                            $('#current').css('z-index', '1501');
                            $("#gmap").css('z-index', '1498');
                            $('.map-controls-wrapper').css('z-index', '1500');
                            $('.ol-viewport').css('z-index', '1499');

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products
                                // if (e.target.className === "accordion-toggle" || e.target.className === "flaticon-layers ng-binding ng-scope" || e.target.id === "only_layer" || e.target.id.substring(0,9) === "layer_vis" ) {

                                //  }
                                // else {
                                // e.stopPropagation();
                                // }
                            }
                            $target[0].addEventListener('click', handler, true);
                            return handler
                        },
                        onHide: function (anno, $target, $annoElem, handler) {

                            $('#current').css('z-index', '');
                            $("#gmap").css('z-index', '');
                            $('.map-controls-wrapper').css('z-index', '');
                            $('.ol-viewport').css('z-index', '');

                            $target[0].removeEventListener('click', handler, true);
                            $cookies.hasNotifiedAboutLayers = false;
                        },
                        content: '<h4>Active Layer</h4><div>' +
                        '<p>Here you find all activated layer. You can hide, remove or change the order. In addition you can do the same actions as on the left side (e.g. show metadata).</p>' +
                        '<p></p><p><strong>Try it:</strong> Change the order and transparency of the layer.</p></div>'
                    }
                    //,
                    //{target: '.map-controls-wrapper', content: 'This is an annotation', position: 'bottom'}
                ]
            );

            anno1.show();
        };
    })
    .directive('repeatDone', function() {
      return function(scope, element, attrs) {
        scope.$eval(attrs.repeatDone);
      }
    })
    .directive('swosLayerControls', function(){
        return {
            restrict: "E",
            scope: {
                olLayer: "=olLayer"
            },
            transclude: true,
            controller: function($scope) {
                // unveil our layer object (as we actually get handed over an ol3 layer object)
                $scope.layer = $scope.olLayer.get("layerObj");
                $scope.mcl = $scope.$parent.$parent;
            },
            templateUrl: "../../static/includes/swos-layer-controls.html"
        }
    })

    //coppied from https://github.com/lorenooliveira/ng-text-truncate/blob/master/ng-text-truncate.js
    .directive( "ngTextTruncate", [ "$compile", "ValidationServices", "CharBasedTruncation", "WordBasedTruncation",
        function( $compile, ValidationServices, CharBasedTruncation, WordBasedTruncation ) {
            return {
                restrict  : "A",
                scope     : {
                    text           : "=ngTextTruncate",
                    charsThreshould: "@ngTtCharsThreshold",
                    wordsThreshould: "@ngTtWordsThreshold",
                    customMoreLabel: "@ngTtMoreLabel",
                    customLessLabel: "@ngTtLessLabel"
                },
                controller: function ($scope, $element, $attrs) {
                    $scope.toggleShow = function () {
                        $scope.open = !$scope.open;
                    };

                    $scope.useToggling = $attrs.ngTtNoToggling === undefined;
                },
                link      : function ($scope, $element, $attrs) {
                    $scope.open = false;

                    ValidationServices.failIfWrongThreshouldConfig($scope.charsThreshould, $scope.wordsThreshould);

                    var CHARS_THRESHOLD = parseInt($scope.charsThreshould);
                    var WORDS_THRESHOLD = parseInt($scope.wordsThreshould);

                    $scope.$watch("text", function () {
                        $element.empty();

                        if (CHARS_THRESHOLD) {
                            if ($scope.text && CharBasedTruncation.truncationApplies($scope, CHARS_THRESHOLD)) {
                                CharBasedTruncation.applyTruncation(CHARS_THRESHOLD, $scope, $element);

                            } else {
                                $element.append($scope.text);
                            }

                        } else {

                            if ($scope.text && WordBasedTruncation.truncationApplies($scope, WORDS_THRESHOLD)) {
                                WordBasedTruncation.applyTruncation(WORDS_THRESHOLD, $scope, $element);

                            } else {
                                $element.append($scope.text);
                            }

                        }
                    });
                }
            };
        }
    ])
    .factory( "ValidationServices", function() {
        return {
            failIfWrongThreshouldConfig: function( firstThreshould, secondThreshould ) {
                if( (! firstThreshould && ! secondThreshould) || (firstThreshould && secondThreshould) ) {
                    throw "You must specify one, and only one, type of threshould (chars or words)";
                }
            }
        };
    })
    .factory( "CharBasedTruncation", [ "$compile", function( $compile ) {
        return {
            truncationApplies: function( $scope, threshould ) {
                return $scope.text.length > threshould;
            },

            applyTruncation: function( threshould, $scope, $element ) {
                if( $scope.useToggling ) {
                    var el = angular.element(    "<span>" +
                                                    $scope.text.substr( 0, threshould ) +
                                                    "<span ng-show='!open'>...</span>" +
                                                    "<span class='btn-link ngTruncateToggleText' " +
                                                        "ng-click='toggleShow()'" +
                                                        "ng-show='!open'>" +
                                                        " " + ($scope.customMoreLabel ? $scope.customMoreLabel : "More") +
                                                    "</span>" +
                                                    "<span ng-show='open'>" +
                                                        $scope.text.substring( threshould ) +
                                                        "<span class='btn-link ngTruncateToggleText'" +
                                                              "ng-click='toggleShow()'>" +
                                                            " " + ($scope.customLessLabel ? $scope.customLessLabel : "Less") +
                                                        "</span>" +
                                                    "</span>" +
                                                "</span>" );
                    $compile( el )( $scope );
                    $element.append( el );

                } else {
                    $element.append( $scope.text.substr( 0, threshould ) + "..." );

                }
            }
        };
    }])
    .factory( "WordBasedTruncation", [ "$compile", function( $compile ) {
        return {
            truncationApplies: function( $scope, threshould ) {
                return $scope.text.split( " " ).length > threshould;
            },

            applyTruncation: function( threshould, $scope, $element ) {
                var splitText = $scope.text.split( " " );
                if( $scope.useToggling ) {
                    var el = angular.element(    "<span>" +
                                                    splitText.slice( 0, threshould ).join( " " ) + " " +
                                                    "<span ng-show='!open'>...</span>" +
                                                    "<span class='btn-link ngTruncateToggleText' " +
                                                        "ng-click='toggleShow()'" +
                                                        "ng-show='!open'>" +
                                                        " " + ($scope.customMoreLabel ? $scope.customMoreLabel : "More") +
                                                    "</span>" +
                                                    "<span ng-show='open'>" +
                                                        splitText.slice( threshould, splitText.length ).join( " " ) +
                                                        "<span class='btn-link ngTruncateToggleText'" +
                                                              "ng-click='toggleShow()'>" +
                                                            " " + ($scope.customLessLabel ? $scope.customLessLabel : "Less") +
                                                        "</span>" +
                                                    "</span>" +
                                                "</span>" );
                    $compile( el )( $scope );
                    $element.append( el );

                } else {
                    $element.append( splitText.slice( 0, threshould ).join( " " ) + "..." );
                }
            }
        };
    }])

;



// copied from http://www.bootply.com/l2ChB4vYmC
var scrollBarWidths = 40;

var widthOfList = function(){
  var itemsWidth = 0;
  $('.list li').each(function(){
    itemsWidth += $(this).outerWidth();
  });
  return itemsWidth;
};

var widthOfHidden = function(){
  return (($('.wrapper').outerWidth())-widthOfList()-getLeftPosi())-scrollBarWidths;
};

var getLeftPosi = function(){
  return $('.list').position().left;
};

var reAdjust = function(){
  if (($('.wrapper').outerWidth()) < widthOfList()) {
    $('.scroller-right').show();
  }
  else {
    $('.scroller-right').hide();
  }
  
  if (getLeftPosi()<0) {
    $('.scroller-left').show();
  }
  else {
    $('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
      $('.scroller-left').hide();
  }
};

reAdjust();

$(window).on('resize',function(){
      reAdjust();
});

$('.scroller-right').click(function() {
  
  $('.scroller-left').fadeIn('slow');
  $('.scroller-right').fadeOut('slow');
  
  $('.list').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){

  });
});

$('.scroller-left').click(function() {
  
    $('.scroller-right').fadeIn('slow');
    $('.scroller-left').fadeOut('slow');
  
      $('.list').animate({left:"-="+getLeftPosi()+"px"},'slow',function(){
      
      });
});    

$(document).ready(function() {
    $(".fancybox").fancybox({
        openEffect    : 'none',
        closeEffect    : 'none'
    });
    bootbox.dialog({
        title:'Welcome to the SWOS Geoportal', 
        message: $('#welcome_text').html(), 
        backdrop: true, 
        onEscape:true, 
        buttons: {
            confirm: {
                label: 'Start Tour',
                 callback: function() {
                     var sidebar = document.getElementById('wetland_sites');
                     var scope = angular.element(sidebar).scope();
                     var rootScope = scope.$root;
                     scope.$apply(function () {
                         rootScope.$broadcast("start_tour");
                     });
                }
            },
            close:{
                label:'Close'}
        }
    });
});
