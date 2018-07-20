(function () {
    'use strict';

    angular
        .module('webgisApp.phaenopt')
        .service('RegionsService', RegionsService);

    RegionsService.$inject = ['djangoRequests', 'mapviewer', '$rootScope', '$q', 'mediaConfig', '$timeout', '$location'];
    function RegionsService(djangoRequests, mapviewer, $rootScope, $q, mediaConfig, $timeout, $location) {
        var service = {
            data: {
                activeTab: -1
            },
            dataCount: {},
            externalImages: {},
            images: {},
            olLayer: null,
            value: {},
            videos: {},
            regionList: [],
            regions_without_geom: [],
            region_id: "",
            regionFeature: "",

            closeRegion: function() {
                this.dataCount = {};
                this.externalImages = {};
                this.images = {};
                this.value = {};
                this.videos = {};
                this.region_id = "";
                mapviewer.selectInteraction.getFeatures().clear();
                mapviewer.currentFeature.setStyle(null);
                RegionsService.regionFeature = null;
                this.diagram_layer_list = null;
            },

            selectFeature: function (id) {

                if (this.regionList[id]) {

                    var extent = this.regionList[id].geometry.getExtent();
                    //pan = ol.animation.pan({duration: 500, source: mapviewer.map.getView().getCenter()})
                    //zoom = ol.animation.zoom({duration: 500, resolution: mapviewer.map.getView().getResolution()})
                    //mapviewer.map.beforeRender(pan, zoom)
                    mapviewer.map.getView().fit(extent, {size: mapviewer.map.getSize()});

                    var regionFeature = this.olLayer.getSource().getFeatureById(id);
                    RegionsService.regionFeature = regionFeature;

                    mapviewer.map.getView().un('change:resolution', this.styleOnZoom);
                    mapviewer.map.getView().on('change:resolution', this.styleOnZoom);

                    regionFeature.setStyle(new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: "#000000",
                            width: 5
                        })
                    }));

                    mapviewer.selectInteraction.getFeatures().clear();
                    mapviewer.selectInteraction.getFeatures().push(regionFeature);

                    // reset style of previously selected feature
                    if (mapviewer.currentFeature !== null && mapviewer.currentFeature.getId() !== regionFeature.getId()) {
                        mapviewer.currentFeature.setStyle(null);
                    }
                    // save the currently selected feature
                    mapviewer.currentFeature = regionFeature;
                }
            },
            selectRegion: function (region, callback) {
                $('#loading-div').show();
                if (typeof(callback)==='undefined') callback = null;

                this.diagram_layer_list = null;
                var region_service = this;

                return djangoRequests.request({
                    'method': "GET",
                    'url'   : '/phaenopt/region/' + region.id
                }).then(function (data) {
                    Object.assign(region_service.dataCount, data['count']);
                    // we do not need the count in other wetland data
                    delete data['count'];

                    region['data'] = data;
                    if (region['data']['climatelayers'].length > 0) {
                        region['data']['climatelayers'][0]['open'] = true;
                    }
                    Object.assign(region_service.value, region);

                    region_service.videosCurrentPage = 1;
                    region_service.allVideos = false;
                    region_service.region_id = region.id;

                    /*
                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + region.id + '/satdata.json'
                    }).then((function (data) {
                        region_service.value['satdata'] = data;
                        }), (function () {}
                     ));
                    */

                    region_service.selectFeature(region.id);
                    $rootScope.$broadcast("region_loaded",region);
                    if (mapId < 0) {
                        // currently not used, maybe still valid for the validation portal...
                        region_service.data.activeTab = 1;
                    } else {
                        region_service.data.activeTab = -1;
                        $('#sidebar-tabs a:first').tab('show');
                    }
                    $('#loading-div').hide();
                    if (typeof(callback)  === 'function') {
                        callback();
                    }

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/geospatial/region/' + region.id + '/satdata.json'
                    }).then((function (data) {
                        //$scope.wetlands_opened[wetland.id]['satdata'] = data;
                        region_service.value['satdata'] = data;
                    }), (function () {
                    }));

                }, function () {
                    $('#loading-div').hide();
                    bootbox.alert('<h1>Error while loading region details</h1>');
                });
            },
            selectRegionFromId: function (id, callback) {

                var region;
                if (region = this.regionList[id]) {
                    return this.selectRegion(region, callback);
                }
                return $q.reject();
            },
            styleOnZoom: function (evt) {
                if (RegionsService.regionFeature == null) {
                    return true;
                }
                var zoom = mapviewer.map.getView().getZoom();
                var oldZoom = mapviewer.map.getView().getZoomForResolution(evt.oldValue);

                if (oldZoom > 7 && zoom <= 7) {
                    mapviewer.selectInteraction.getFeatures().clear();
                }
                if (oldZoom <= 7 && zoom > 7) {
                    mapviewer.selectInteraction.getFeatures().clear();
                    mapviewer.selectInteraction.getFeatures().push(RegionsService.regionFeature);
                }

                if (zoom <= 7) {
                    var color = "#ef1111";
                    var width = 1;
                    var fill_color = 'rgba(239, 17, 18, 0.3)';
                }
                else {
                    var color = "#000000";
                    var width = 5;
                    var fill_color = 'rgba(239, 17, 18, 0)';
                }

                var newStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: color,
                            width: width
                        }),
                        fill: new ol.style.Fill({color: fill_color})
                });
                RegionsService.regionFeature.setStyle(newStyle);

            },
            loadLayer: function (region_id, type_name, layer_id, load_layer, no_scroll) {
                if (typeof(no_scroll)==='undefined') no_scroll = false;

                var layer_is_new = "true";

                //check if layer was already added to avoid "layer already exist error" (e.g. important for "back")
                for (var key in mapviewer.layersMeta) {
                    if (mapviewer.layersMeta[key].django_id == layer_id) {
                        layer_is_new = false;
                    }
                }

                //only load a new layer, if the the layer is not already added
                if (layer_id && layer_is_new) {

                    // add layer to map only if wanted, if not: only open everything around
                    if (load_layer === "yes") {
                        $("#layer_vis_" + layer_id).attr('checked', 'checked');
                        angular.element("#layer_vis_" + layer_id).triggerHandler('click'); // add layer to map
                    }
                }
                var layer_id_ = "#layer_vis_" + layer_id;

                //open menu according to the last layer id
                if (type_name === "product") {

                    $location.path('/region/' + region_id + '/product/' + layer_id);

                    if ($(layer_id_).closest('.panel').find('i')[0].className.includes("glyphicon-chevron-right")) {
                        $(layer_id_).closest('.panel').find('a').first().trigger('click'); // find headline and open accordion
                    }

                    $timeout(function () {  //scroll page down
                        if(no_scroll == true){}
                        else {
                            $(".tab-content").animate({
                                scrollTop: $("#layer_vis_div_" + layer_id).offset().top - 400
                            }, 2000);
                        }
                    });
                }

            },
            loadRegion: function (region_id, callback) {
                if (typeof(callback)==='undefined') callback = null;
                var current_region_id = "";

                if (mapviewer.currentFeature) {
                    current_region_id = mapviewer.currentFeature.get('id');
                }
                if (region_id !== current_region_id) {
                    this.selectRegionFromId(region_id, callback);
                } else {
                    $timeout(function () {
                        if ($("#link_wetland_list").parents().hasClass("active")) {
                            try {
                                $("#link_wetland_opened")[0].click(); // open catalog tab
                            } catch (e) {
                            }
                        }
                    }, 0, false);

                    this.selectFeature(current_region_id);
                }
            },
            selectTab: function (type_name) {
                var target = ""; //default tab

                // open wetland tab
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
                } else {
                    //open wetland catalog
                    $timeout(function () {
                        var linkWetlandList = $('#link_wetland_list');
                        if (!linkWetlandList.parents().hasClass("active")) {
                            try {
                                linkWetlandList[0].click(); // open catalog tab
                            } catch (e) {
                            }
                        }
                    }, 0, false);
                }
            }

        };
        return service;
    }
})();
