(function () {
    'use strict';

    angular
        .module('webgisApp.swos')
        .service('WetlandsService', WetlandsService);

    WetlandsService.$inject = ['djangoRequests', 'mapviewer', '$rootScope', '$q', 'mediaConfig', '$timeout', '$location'];
    function WetlandsService(djangoRequests, mapviewer, $rootScope, $q, mediaConfig, $timeout, $location) {
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
            wetlandList: [],
            wetlands_without_geom: [],
            wetland_id: "",
            wetlandFeature: "",
            
            closeWetland: function() {
                this.dataCount = {};
                this.externalImages = {};
                this.images = {};
                this.value = {};
                this.videos = {};
                this.wetland_id = "";
                mapviewer.selectInteraction.getFeatures().clear();
                mapviewer.currentFeature.setStyle(null);
                WetlandsService.wetlandFeature = null;
                this.diagram_layer_list = null;
            },

            selectFeature: function (id) {

                if (this.wetlandList[id]) {

                    var extent = this.wetlandList[id].geometry.getExtent();
                    //pan = ol.animation.pan({duration: 500, source: mapviewer.map.getView().getCenter()})
                    //zoom = ol.animation.zoom({duration: 500, resolution: mapviewer.map.getView().getResolution()})
                    //mapviewer.map.beforeRender(pan, zoom)
                    mapviewer.map.getView().fit(extent, {size: mapviewer.map.getSize()});

                    var wetlandFeature = this.olLayer.getSource().getFeatureById(id);
                    WetlandsService.wetlandFeature = wetlandFeature;

                    mapviewer.map.getView().un('change:resolution', this.styleOnZoom);
                    mapviewer.map.getView().on('change:resolution', this.styleOnZoom);

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
                }
            },
            selectWetland: function (wetland, callback) {
                if (typeof(callback)==='undefined') callback = null;

                this.diagram_layer_list = null;
                var wetland_service = this;
                /*
                 try {
                 _paq.push(['setCustomUrl', '/wetland/'+wetland.name]);
                 _paq.push(['setDocumentTitle', wetland.name]);
                 _paq.push(['trackPageView']);
                 } catch (err) {}
                 */

                //wetland.id;
                //$('#sidebar-tabs li').removeClass('active');
                //$('#sidebar .tab-content .tab-pane').removeClass('active');

                //if (!(wetland.id in $scope.wetlands_opened)) {

                return djangoRequests.request({
                    'method': "GET",
                    'url'   : '/swos/wetland/' + wetland.id
                }).then(function (data) {
                    Object.assign(wetland_service.dataCount, data['count']);
                    // we do not need the count in other wetland data
                    delete data['count'];

                    wetland['data'] = data;
                    Object.assign(wetland_service.value, wetland);

                    wetland_service.videosCurrentPage = 1;
                    wetland_service.allVideos = false;
                    wetland_service.wetland_id = wetland.id;

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + wetland.id + '/images.json?start=0&max=' + mediaConfig.imagesPerPage
                    }).then((function (data) {
                        data.currentPage = 1;
                        data.lastPage = Math.ceil(data.count / mediaConfig.imagesPerPage);
                        Object.assign(wetland_service.images, data);
                    }), (function () {
                    }));

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + wetland.id + '/panoramio.json?start=0&max=' + mediaConfig.imagesPerPage
                    }).then((function (data) {
                        data.currentPage = 1;
                        data.lastPage = Math.ceil(data.count / mediaConfig.imagesPerPage);
                        Object.assign(wetland_service.externalImages, data);
                    }), (function () {
                    }));

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + wetland.id + '/youtube.json?start=0&max=' + mediaConfig.videosPerPage
                    }).then((function (data) {
                        Object.assign(wetland_service.videos, {
                            currentPage: 1,
                            lastPage: Math.ceil(wetland_service.dataCount['videos'] / mediaConfig.videosPerPage),
                            videos: data
                        });
                    }), (function () {
                    }));

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + wetland.id + '/satdata.json'
                    }).then((function (data) {
                        //$scope.wetlands_opened[wetland.id]['satdata'] = data;
                        wetland_service.value['satdata'] = data;
                    }), (function () {
                    }));


                    wetland_service.selectFeature(wetland.id);
                    $rootScope.$broadcast("wetland_loaded",wetland);
                    if (mapId < 7) {
                        wetland_service.data.activeTab = 1;   
                    } else {
                        wetland_service.data.activeTab = -1;
                        $timeout(function(){
                            $("#link_wetland_list").click();
                        }, 1);
                    }
                    if (typeof(callback)  === 'function') {
                        callback();
                    }

                }, function () {
                    bootbox.alert('<h1>Error while loading wetland details</h1>');
                });
            },
            selectWetlandFromId: function (id, callback) {

                var wetland;
                if (wetland = this.wetlandList[id]) {
                    return this.selectWetland(wetland, callback);
                }
                return $q.reject();
            },
            styleOnZoom: function (evt) {
                if (WetlandsService.wetlandFeature == null) {
                    return true;
                }
                var zoom = mapviewer.map.getView().getZoom();
                var oldZoom = mapviewer.map.getView().getZoomForResolution(evt.oldValue);

                if (oldZoom > 7 && zoom <= 7) {
                    mapviewer.selectInteraction.getFeatures().clear();
                }
                if (oldZoom <= 7 && zoom > 7) {
                    mapviewer.selectInteraction.getFeatures().clear();
                    mapviewer.selectInteraction.getFeatures().push(WetlandsService.wetlandFeature);
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
                WetlandsService.wetlandFeature.setStyle(newStyle);   
                
            },
            loadLayer: function (wetland_id, type_name, layer_id, load_layer, no_scroll) {
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

                    $location.path('/wetland/' + wetland_id + '/product/' + layer_id);

                    if ($(layer_id_).closest('.panel').find('i')[0].className.includes("glyphicon-chevron-right")) {
                        $(layer_id_).closest('.panel').find('a').first().trigger('click'); // find headline and open accordion
                    }

                    $timeout(function () {  //scroll page down
                        if(no_scroll == true){}
                        else {
                            $(".tab-content").animate({
                                scrollTop: $("#layer_vis_div_" + layer_id).offset().top - 200
                            }, 2000);
                        }
                    });
                }
                if (type_name === "indicator") {

                    $location.path('/wetland/' + wetland_id + '/indicator/' + layer_id);

                    if ($(layer_id_).closest('.panel').find('i')[0].className.includes("glyphicon-chevron-right")) {
                        $(layer_id_).closest('.panel').find('a').first().trigger('click'); // find headline and open accordion
                    }

                    $timeout(function () {  //scroll page down
                        if(no_scroll == true){}
                        else {
                            $(".tab-content").animate({
                                scrollTop: $("#layer_vis_div_" + layer_id).offset().top - 200
                            }, 2000);
                        }
                    });
                }
                if (type_name === "externaldb") {
                    $location.path('/wetland/' + wetland_id + '/externaldb/' + layer_id);

                    if ($(layer_id_).closest('.panel').parents().eq(4).find('i')[0].className.includes("glyphicon-chevron-right")) {
                        $(layer_id_).closest('.panel').parents().eq(4).find('a').first().trigger('click'); //open parent accordion
                    }
                    if ($(layer_id_).closest('.panel').find('i')[0].className.includes("glyphicon-chevron-right")) {
                        $(layer_id_).closest('.panel').find('a').first().trigger('click'); // find headline and open accordion
                    }
                    $timeout(function () {  //scroll page down
                        if(no_scroll == true){}
                        else {
                            $(".tab-content").animate({
                                scrollTop: $("#layer_vis_div_" + layer_id).offset().top - 500
                            }, 2000);
                        }
                    });
                }

            },
            loadWetland: function (wetland_id, callback) {
                if (typeof(callback)==='undefined') callback = null;
                var current_wetland_id = "";

                if (mapviewer.currentFeature) {
                    current_wetland_id = mapviewer.currentFeature.get('id');
                }
                if (wetland_id !== current_wetland_id) {
                    this.selectWetlandFromId(wetland_id, callback);
                } else {
                    $timeout(function () {
                        if ($("#link_wetland_list").parents().hasClass("active")) {
                            try {
                                $("#link_wetland_opened")[0].click(); // open catalog tab
                            } catch (e) {
                            }
                        }
                    }, 0, false);

                    this.selectFeature(current_wetland_id);
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
