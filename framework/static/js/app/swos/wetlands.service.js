(function() {
    'use strict';

    angular
        .module('webgisApp')
        .service('WetlandsService', WetlandsService);

    WetlandsService.$inject = ['djangoRequests', 'mapviewer', '$rootScope', '$q', 'mediaConfig'];
    function WetlandsService(djangoRequests, mapviewer, $rootScope, $q, mediaConfig) {
        var service = {
            data: {
                activeTab: -1
            },
            dataCount: {},
            externalImages: {},
            images: {},
            olLayer  : null,
            value    : {},
            videos: {},
            wetlandList: [],
            wetlands_without_geom: [],

            selectFeature: function (id) {
                if (this.wetlandList[id]) {
                    var extent = this.wetlandList[id].geometry.getExtent();
                    //pan = ol.animation.pan({duration: 500, source: mapviewer.map.getView().getCenter()})
                    //zoom = ol.animation.zoom({duration: 500, resolution: mapviewer.map.getView().getResolution()})
                    //mapviewer.map.beforeRender(pan, zoom)
                    mapviewer.map.getView().fit(extent, {size: mapviewer.map.getSize()});

                    var wetlandFeature = this.olLayer.getSource().getFeatureById(id);
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

            selectWetland: function (wetland) {
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

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + wetland.id + '/images.json?start=0&max=' + mediaConfig.imagesPerPage
                    }).then((function (data) {
                        data.currentPage = 1;
                        data.lastPage = Math.ceil(data.count / mediaConfig.imagesPerPage);
                        Object.assign(wetland_service.images, data);
                    }),(function(){}));

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + wetland.id + '/panoramio.json?start=0&max=' + mediaConfig.imagesPerPage
                    }).then((function (data) {
                        data.currentPage = 1;
                        data.lastPage = Math.ceil(data.count / mediaConfig.imagesPerPage);
                        Object.assign(wetland_service.externalImages, data);
                    }),(function(){}));

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + wetland.id + '/youtube.json?start=0&max=' + mediaConfig.videosPerPage
                    }).then((function (data) {
                        Object.assign(wetland_service.videos, {
                            currentPage: 1,
                            lastPage: Math.ceil(wetland_service.dataCount['videos'] / mediaConfig.videosPerPage),
                            videos: data
                        });
                    }),(function(){}));

                    djangoRequests.request({
                        'method': "GET",
                        'url'   : '/swos/wetland/' + wetland.id + '/satdata.json'
                    }).then((function (data) {
                        //$scope.wetlands_opened[wetland.id]['satdata'] = data;
                        wetland_service.value['satdata'] = data;
                    }),(function(){}));


                    wetland_service.selectFeature(wetland.id);
                    $rootScope.$broadcast("wetland_loaded");
                    wetland_service.data.activeTab = 1;

                }, function () {
                    bootbox.alert('<h1>Error while loading wetland details</h1>');
                });
            },
            selectWetlandFromId: function (id) {
                var wetland;
                if (wetland = this.wetlandList[id]) {
                    return this.selectWetland(wetland);
                }
                return $q.reject();
            }
        };
        return service;
    }
})();
