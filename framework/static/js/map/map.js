'use strict';

var fill = new ol.style.Fill({
    //color: 'rgba(12, 216, 247, 1)'
    color: 'rgba(255, 255, 255, 0.6)'
});
var stroke = new ol.style.Stroke({
    //color: 'rgba(0, 0, 204, 1)',
    color: '#319FD3',
    width: 1.25
});

var popup;
var stationPopup;

//var mapColors = {};

angular.module('webgisApp')
    .service('mapviewer', function mapviewer(djangoRequests, $rootScope) {
        var service = {
            'baseLayers': [],
            'layers': {},
            'layersTime': [],
            'layersMeta': [],
            'datacatalog': [],
            'sliderValues': {},
            'selectedLayerDates': {},
            'currentFeature': null,
            'map': null,

            'currentBaseLayerIndex': -1,
            'center': null,
            'displayProjection': null,
            'resolutions': undefined,
            'zoom_init': 4,
            'zoom_min': 0,
            'zoom_max': 20,
            'data': {
                'layersCount': 0,
                'addexternallayer': false
            },
            'maxExtent': [-10, 14, 60, 64],

            /* functions */
            'createMap': function(id) {
                var _this = this;

                this.gmap = new google.maps.Map(document.getElementById('gmap'), {
                    disableDefaultUI: true,
                    keyboardShortcuts: false,
                    draggable: false,
                    disableDoubleClickZoom: true,
                    scrollwheel: false,
                    streetViewControl: false,
                    maxZoom: this.zoom_max,
                    minZoom: this.zoom_min,
                    zoom: this.zoom_init
                });

                var view = new ol.View({
                    center: this.center,
                    projection: this.displayProjection,
                    zoom: this.zoom_init,
                    minZoom: this.zoom_min,
                    maxZoom: this.zoom_max,
                    resolutions: this.resolutions
                });

                var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');

                this.gmap.setZoom(view.getZoom());
                this.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
                view.on('change:center', function() {
                    var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
                    _this.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
                });
                view.on('change:resolution', function() {
                    _this.gmap.setZoom(view.getZoom());
                });
                //gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('map'));

                var baseLayers = [];
                if (this.currentBaseLayerIndex > -1) {
                    baseLayers.push(this.baseLayers[this.currentBaseLayerIndex]);
                }

                this.map = new ol.Map({
                    layers: baseLayers,
                    target: id,
                    view: view,
                    controls: [new ol.control.ScaleLine()],
                    interactions: ol.interaction.defaults({
                        dragPan: false,
                        mouseWheelZoom: false
                    }).extend([
                        new ol.interaction.DragPan({kinetic: null}),
                        new ol.interaction.MouseWheelZoom({duration: 0, constrainResolution: true})
                    ])
                });
                //console.log(id);
                //var olMapDiv = document.getElementById(id);
                //olMapDiv.parentNode.removeChild(olMapDiv);
                //this.gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
                this.mousePositionControl = new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(4),
                    projection: 'EPSG:4326',
                    undefinedHTML: ''
                });

                this.map.addControl(this.mousePositionControl);

                this.selectInteraction = new ol.interaction.Select({
                    style: function () {
                        return [new ol.style.Style({
                            image: new ol.style.Circle({
                                fill: new ol.style.Fill({ color: 'rgba(255,255,255,0.5)'}),
                                stroke: stroke,
                                radius: 8
                            })
                            /*
                             text: new ol.style.Text({
                             text: feat.get('features')[0].get('name'),
                             textAlign: 'right',
                             textBaseline: 'top',
                             fill: new ol.style.Fill({color: 'rgba(0,0,0,1)'}),
                             stroke: new ol.style.Stroke({color: 'rgba(0,0,0,0.5)'})
                             }),
                             */
                            //fill: new ol.style.Fill({
                            //    color: 'rgba(255,255,255,0.5)'
                            // })
                        })]
                    }
                });
                this.map.addInteraction(this.selectInteraction);
                $rootScope.$broadcast('mapviewer.map_created', {});
                return this.map;
            },
            'setBaseLayer': function(index) {
                var layers = this.map.getLayers();
                var layer = this.baseLayers[index];
                if (layer.get('layerObj').ogc_type === 'GoogleMaps') {
                    this.gmap.setMapTypeId(google.maps.MapTypeId[layer.get('layerObj').ogc_layer]);
                    $('#gmap').show();
                    google.maps.event.trigger(this.gmap, 'resize');
                    $('.ol-overlaycontainer-stopevent').css('left', '66px');
                } else {
                    $('#gmap').hide();
                    $('.ol-overlaycontainer-stopevent').css('left', '0px');
                }
                layers.remove(this.baseLayers[this.currentBaseLayerIndex]);
                layers.insertAt(0,layer);
                this.currentBaseLayerIndex = index;
            },
            'getLayerById': function(id) {
                return this.layers[id];
            },
            'layerObjToOl3': function(layer) {
                var _this        = this;
                var olLayer      = -1;
                var vectorSource = null;

                switch(layer.ogc_type) {
                    case 'WMS':
                        olLayer = new ol.layer.Tile({
                            name: layer.title,
                            layerObj: layer,
                            source: new ol.source.TileWMS({
                                url: layer.ogc_link,
                                params: {'LAYERS': layer.ogc_layer, 'TILED': true, 'TRANSPARENT': true}
                            })
                        });
                        break;
                    case 'TMS':
                        olLayer = new ol.layer.Tile({
                            name: layer.title,
                            layerObj: layer,
                            source: new ol.source.XYZ({
                                url: layer.ogc_link.replace('{y}','{-y}')
                            })
                        });
                        break;
                    case 'WMTS':
                        if (typeof layer.capabilities === 'object') {
                            // does not work with NASA WMTS!
                            var options = ol.source.WMTS.optionsFromCapabilities(layer.capabilities, {
                                layer: layer.ogc_layer,
                                matrixSet: layer.wmts_matrixset
                            });
                            olLayer = new ol.layer.Tile({
                                source: new ol.source.WMTS(options)
                            });
                        } else {
                            if (parseInt(layer.epsg) > 0) {
                                layer.epsg = 'EPSG:'+layer.epsg;
                            }

                            var resolutions = [];
                            var proj = ol.proj.get(layer.wmts_projection);
                            var multiply = 1;
                            if (layer.wmts_multiply) {
                                var metersperUnit = proj.getMetersPerUnit();
                                multiply = 0.28E-3 / metersperUnit;
                            }
                            $.each(layer.wmts_resolutions.split(' '), function(){
                                resolutions.push(parseFloat(this)* multiply)
                            });
                            var matrixIds = [];
                            var wmts_prefix_matrix_ids = '';
                            if (layer.wmts_prefix_matrix_ids) {
                                wmts_prefix_matrix_ids = layer.wmts_prefix_matrix_ids;
                            }
                            for (var i=0; i<resolutions.length; i++) { matrixIds.push(wmts_prefix_matrix_ids+i); }
                            olLayer = new ol.layer.Tile({
                                name: layer.title,
                                layerObj: layer,
                                source: new ol.source.WMTS({
                                    layer: layer.ogc_layer,
                                    url:layer.ogc_link,
                                    format: layer.ogc_imageformat,
                                    matrixSet:layer.wmts_matrixset,
                                    projection: proj,
                                    tileGrid: new ol.tilegrid.WMTS({
                                        origin: ol.extent.getTopLeft(proj.getExtent()),
                                        resolutions: resolutions,
                                        matrixIds: matrixIds,
                                        tileSize: layer.wmts_tilesize
                                    })
                                })
                            });
                        }
                        break;
                    case 'BingMaps':
                        olLayer = new ol.layer.Tile({
                            name: layer.title,
                            layerObj: layer,
                            source: new ol.source.BingMaps({
                                key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
                                imagerySet: layer.ogc_layer,
                                maxZoom: 19
                            })
                        });
                        break;
                    case 'GoogleMaps':
                        olLayer = new ol.layer.Tile({
                            name: layer.title,
                            layerObj: layer
                        });
                        break;
                    // case 'MapQuest':
                    //     olLayer = new ol.layer.Tile({
                    //         name: layer.title,
                    //         layerObj: layer,
                    //         minResolution: 76.43702828517625,
                    //         source: new ol.source.MapQuest({layer: layer.ogc_layer})
                    //     });
                    //     break;
                    case 'OSM':
                        var osmSource = null;
                        if (layer.ogc_link !== '') {
                            osmSource = new ol.source.OSM({url: layer.ogc_link});
                        } else {
                            osmSource = new ol.source.OSM();
                        }
                        olLayer = new ol.layer.Tile({
                            name: layer.title,
                            layerObj: layer,
                            source: osmSource
                        });
                        break;
                    case 'WFS':
                        vectorSource = new ol.source.Vector({
                            loader: function(extent) {
                                var url = layer.ogc_link+'?service=WFS&version=1.1.0&request=GetFeature' +
                                    '&typename=' + layer.ogc_layer +
                                    '&outputFormat=json' +
                                    '&srsname='+_this.displayProjection+'&bbox=' + extent.join(',') + ','+_this.displayProjection;
                                url = '/layers/data?url='+encodeURIComponent(url);
                                $('#loading-div').show();
                                djangoRequests.request({
                                    url: url,
                                    method: 'GET'
                                }).then(function(data){
                                    var format = new ol.format.GeoJSON();
                                    var features = format.readFeatures(data, {
                                        featureProjection: _this.displayProjection
                                    });
                                    vectorSource.addFeatures(features);
                                    $('#loading-div').hide();
                                })
                            },
                            strategy: ol.loadingstrategy.bbox
                        });
                        olLayer = new ol.layer.Vector({
                            name: layer.title,
                            layerObj: layer,
                            source: vectorSource
                        });
                        break;
                    case 'Tiled-WFS':
                        vectorSource = new ol.source.Vector({
                            loader: function() {
                                var url = layer.ogc_link+'?service=WFS&version=1.1.0&request=GetFeature' +
                                    '&typename=' + layer.ogc_layer +
                                    '&outputFormat=json' +
                                    '&srsname='+_this.displayProjection+'&bbox=' + extent.join(',') + ','+_this.displayProjection;
                                url = '/layers/data?url='+encodeURIComponent(url);
                                $('#loading-div').show();
                                djangoRequests.request({
                                    url: url,
                                    method: 'GET'
                                }).then(function(data){
                                    var format = new ol.format.GeoJSON();
                                    var features = format.readFeatures(data, {
                                        featureProjection: _this.displayProjection
                                    });
                                    vectorSource.addFeatures(features);
                                    $('#loading-div').hide();
                                })
                            },
                            strategy: ol.loadingstrategy.tile(
                                ol.tilegrid.createXYZ({maxZoom: 19})
                            )
                        });
                        olLayer = new ol.layer.Vector({
                            name: layer.title,
                            layerObj: layer,
                            source: vectorSource
                        });
                        break;
                    case 'GeoJSON':
                        vectorSource = new ol.source.Vector({
                            loader: function() {
                                $('#loading-div').show();
                                djangoRequests.request({
                                    url: layer.ogc_link,
                                    method: 'GET'
                                }).then(function(data){
                                    var format = new ol.format.GeoJSON();
                                    var features = format.readFeatures(data, {
                                        featureProjection: 'EPSG:4326'
                                    });
                                    $.each(features, function(){
                                        this.getGeometry().transform('EPSG:4326', _this.displayProjection);
                                    });
                                    vectorSource.addFeatures(features);
                                    $('#loading-div').hide();
                                })
                            }
                        });
                        olLayer = new ol.layer.Vector({
                            name: layer.title,
                            layerObj: layer,
                            source: vectorSource
                        });
                        break;
                    case 'XYZ':
                        olLayer = new ol.layer.Tile({
                            name: layer.title,
                            layerObj: layer,
                            source: new ol.source.XYZ({
                                url: layer.ogc_link
                            })
                        });
                        break;
                    case 'SOS':
                        var layerID = layer.id;
                        if (typeof layer.django_id === 'number') {
                            layerID = layer.django_id;
                        }
                        var url = '/layers/sos/'+layerID+'/stations?format=json';
                        vectorSource = new ol.source.Vector({
                            loader: function() {
                                $('#loading-div').show();
                                djangoRequests.request({
                                    url: url,
                                    method: 'GET'
                                }).then(function(data){
                                    var format = new ol.format.GeoJSON();
                                    var features = format.readFeatures(data, {
                                        featureProjection: 'EPSG:4326'
                                    });
                                    $.each(features, function(){
                                        this.getGeometry().transform('EPSG:4326', _this.displayProjection);
                                    });
                                    vectorSource.addFeatures(features);
                                    $('#loading-div').hide();
                                })
                            }
                        });
                        olLayer = new ol.layer.Vector({
                            name: layer.title,
                            layerObj: layer,
                            source: new ol.source.Cluster({
                                distance: 20,
                                source: vectorSource
                            }),
                            style: function(feat) {
                                var size = feat.get('features').length;
                                var text = null;
                                if (size > 1) {
                                    text = new ol.style.Text({
                                        text: size.toString(),
                                        fill: new ol.style.Fill({color:'#fff'}),
                                        stroke: new ol.style.Stroke({color: 'rgba(0, 0, 0, 0.6)',width:3})
                                    })
                                }
                                return [new ol.style.Style({
                                    image: new ol.style.Circle({
                                        fill: fill,
                                        stroke: stroke,
                                        radius: 8
                                    }),
                                    text: text,
                                    fill: fill,
                                    stroke: stroke
                                })]
                            }
                        });
                        break;
                }
                return olLayer;
            },
            'addLayer': function(layer) {
                for (var i=0; i<this.layersMeta.length; i++) {
                    if (layer.title === this.layersMeta[i].name) {
                        bootbox.alert('Layer exists already in the map. Please see the "Current" tab.');
                        return false;
                    }
                }

                layer = angular.copy(layer);
                var olLayer = this.layerObjToOl3(layer);
                if (olLayer === -1) {
                    alert('Layer could not be added, type '+layer.type+' is not implemented!');
                    return false;
                }
                if (typeof layer.django_id === 'undefined') {
                    layer.django_id = layer.id;
                }
                layer.name = layer.title;
                layer.id = Math.random().toString(36).substring(2, 15);
                this.sliderValues[layer.id] = 100;
                if (!layer.ogc_time && layer.ogc_times instanceof Array) {
                    this.selectedLayerDates[layer.id] = layer.ogc_times[layer.ogc_times.length-1];
                }

                layer.showLegend = true;
                this.layers[layer.id] = olLayer;

                if (layer.ogc_time === true) {
                    this.layersTime.push(layer.id);
                    var $slider = $('#slider');
                    $slider.find(".tooltip.bottom").css('margin-top', '20px');
                    $('.ol-attribution, .ol-scale-line').css('bottom', '70px');
                    $('.ol-mouse-position').css('bottom', '100px');
                    $("#gmap").find("img[src*='google_white']").parent().parent().parent().css('bottom', '60px');
                    $('#gmap .gm-style-cc, #gmap .gmnoprint').css('bottom', '60px');
                    $slider.show();
                }

                // if (mapColors[layer.django_id] === undefined) {
                //     djangoRequests.request({
                //         'method': "GET",
                //         'url'   : '/swos/wetland/layer/' + layer.django_id + '/colors.json'
                //     }).then(function (data) {
                //         mapColors[layer.django_id] = data;
                //         layer.legendColors = data;
                //     });
                // }

                this.layersMeta.unshift(layer);
                this.data.layersCount = this.data.layersCount+1;
                olLayer.set('layerObj', layer);
                this.map.addLayer(olLayer);
                $rootScope.$broadcast("mapviewer.layeradded", olLayer);
                return olLayer;
            },
            'getIndexFromLayer': function(title) {
                for (var i=0; i<this.layersMeta.length; i++) {
                    if (title == this.layersMeta[i].name) {
                        return i;
                    }
                }
            },
            'removeLayer': function(id, index) {
                var olLayer = this.layers[id];
                var layerIndex = $.inArray(olLayer, this.map.getLayers().getArray());
                if (layerIndex >= 0) {
                    //mapColors[olLayer.get("layerObj").django_id] = undefined;
                    this.layersMeta.splice(index, 1);
                    //this.selectInteraction.getFeatures().clear();
                    this.map.removeLayer(olLayer);
                    this.data.layersCount = this.data.layersCount-1;
                    $rootScope.$broadcast("mapviewer.layerremoved", olLayer.get("layerObj")["django_id"] || null);

                    var timeIndex = jQuery.inArray(id, this.layersTime);
                    if (timeIndex > -1) {
                        this.layersTime.splice(timeIndex, 1);
                        var $slider = $("#slider");
                        $slider.hide();
                        $slider.find('.tooltip.bottom').css('margin-top', '3px');
                        $('.ol-attribution, .ol-scale-line').css('bottom', '5px');
                        $('.ol-mouse-position').css('bottom', '33px');
                        $("#gmap").find("img[src*='google_white']").parent().parent().parent().css('bottom', '0px');
                        $('#gmap .gm-style-cc, #gmap .gmnoprint').css('bottom', '0px');
                    }

                }
            },
            'raiseLayer': function(id, delta) {
                var layer = this.layers[id];
                var layers = this.map.getLayers();
                var layerIndex = $.inArray(layer, layers.getArray());

                layers.removeAt(layerIndex);
                if (delta > 0) {
                    layerIndex--;
                }
                layers.insertAt(layerIndex+delta, layer);
            },
            'changeWMSTime': function(time) {
                var _this = this;
                $.each(this.layersTime, function() {
                    var layer = _this.layers[this];
                    var source = layer.getSource();
                    source.updateParams({'TIME':time});
                });
            },
            'initialize': function(id, mapElement, baseLayer) {
                var mapviewer = this;
                djangoRequests.request({
                    'method': "GET",
                    'url': '/mapviewer/detail/'+id+'.json'
                }).then(function(data){

                    if (data.error != '') {
                        $('#center').hide();
                        $('#nav-top-right2').hide();
                        bootbox.alert('<h2>Authentication error</h2>'+data.error, function(){$('.login').click()});
                        return
                    }

                    $('#center').show();
                    $('#nav-top-right2').show();

                    // hide search field if no server is configured!
                    if (data.search_url == null) {
                        $('#map_search').hide();
                        $('#xs-search').hide();
                    }

                    mapviewer.data.addexternallayer = data.addexternallayer;

                    mapviewer.displayProjection = data.map_proj;
                    if (data.map_resolutions != null && data.map_resolutions != '') {
                        //TODO: change map(Number) to something that works with older browsers!
                        mapviewer.resolutions = data.map_resolutions.split(' ').map(Number);
                    }
                    mapviewer.title = data.title;
                    mapviewer.zoom_init = data.zoom_init;
                    mapviewer.zoom_min = data.zoom_min;
                    mapviewer.zoom_max = data.zoom_max;
                    mapviewer.center = ol.proj.transform([data.center_lon, data.center_lat], data.center_proj, mapviewer.displayProjection);
                    mapviewer.datacatalog = data.layergroups;
                    if (data.layerauth === true) {
                        bootbox.alert('Please log in to see further layers!');
                    }
                    if (baseLayer === true) {
                        mapviewer.baseLayers = [];
                        if (data.baselayers.length > 0) {
                            mapviewer.currentBaseLayerIndex = 0;
                        }
                        jQuery.each(data.baselayers, function(){
                            var olLayer = mapviewer.layerObjToOl3(this);
                            if (olLayer !== -1) {
                                mapviewer.baseLayers.push(olLayer);
                            }
                        });

                        $rootScope.$broadcast('mapviewer.baselayers_loaded', mapviewer.baseLayers);
                    }

                    if (mapviewer.map !== null) {
                        mapviewer.map.setTarget(null);
                        mapviewer.map = null;
                    }
                    mapviewer.createMap(mapElement);
                    if (mapviewer.baseLayers.length > 0) {
                        mapviewer.setBaseLayer(0);
                    }
                    $('#loading-div').hide();
                    $rootScope.$broadcast('mapviewer.catalog_loaded');
                    $rootScope.$broadcast('djangoAuth.registration_enabled', data.auth_registration);

                    if (data.time_slider === true) {
                        var $slider = $("#slider");
                        var times = data.time_slider_dates.split(',');
                        var noLabels = parseInt($slider.width()/80);
                        var eachLabels = Math.round(times.length/noLabels);
                        if (eachLabels === 0) { eachLabels = 1; }

                        var ticks = []; var labels =  [];
                        var i = 0; var j=0;
                        $.each(times, function() {
                            ticks.push(i);
                            if (j==eachLabels) {
                                j=0;
                            }
                            if (j==0) {
                                labels.push(this);
                            } else {
                                labels.push('');
                            }
                            j++;
                            i++;
                        });

                        $slider.find(".input").slider({
                            tooltip: 'always',
                            handle: 'round',
                            ticks: ticks,
                            ticks_labels: labels,
                            value: times.length-1,
                            selection: 'none', formatter: function (value) {
                                return times[value];
                            }
                        }).on('change', function (e) {

                        }).on('slideStop', function (e) {
                            mapviewer.changeWMSTime(times[e.value]);
                        });
                        $slider.find(".slider .tooltip-main").removeClass('top').addClass('bottom');
                        $slider.hide();
                    }

                }, function(error) {

                })
            }
        };
        return service;
    })
    .service('Attribution', function ($rootScope) {
        var list = "";
        var getList = function(){
            return list;
        };
        var setList = function(newList) {
            list = newList;
            $rootScope.$broadcast("attribution_list_new")
        };

        return {
            setList: setList,
            getList: getList
        };
    })

    .controller('MapViewerCtrl', function($scope, mapviewer, djangoRequests, $modal, $rootScope, $window, $timeout, $cookies, Attribution){
        var mv = this;

        mv.changeSitesVisibility = changeSitesVisibility;
        mv.closeCookieNote = closeCookieNote;
        mv.hideCookieNote = false;
        mv.infoEventKey = null;
        mv.infoStatus = false;
        // mv.legendLayers = [];
        mv.requestInfo = requestInfo;
        mv.selectedFeature = null;
        mv.visibility_state_wetland_layer = true;
        mv.zoomIn = zoomIn;
        mv.zoomMaxExtent = zoomMaxExtent;
        mv.zoomOut = zoomOut;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('attribution_list_new', function (){
            mv.layer_attribution = Attribution.getList();
        });

        $scope.$on('current_wetland_id', function ($broadCast, id) {
            mv.currentSelectWetland = id
        });

        $scope.$on('djangoAuth.logged_in', function () {
            mapviewer.initialize(mapId, 'map', false);
        });

        $scope.$on('mapviewer.map_created', function () {
            if ($cookies.hideCookieNote) {
                mv.hideCookieNote = true;
            }

            popup = new ol.Overlay({element: document.getElementById('popup')});
            mapviewer.map.addOverlay(popup);
            stationPopup = new ol.Overlay({element: document.getElementById('stationPopup'), offset: [0, -5]});
            mapviewer.map.addOverlay(stationPopup);

            var element = popup.getElement();

            mapviewer.map.on("pointermove", function (e) {
                if (e.dragging) {
                    return;
                }

                // mv.legendLayers = [];
                // $('#map_legend').html('');
                // var layers = mapviewer.map.forEachLayerAtPixel(e.pixel, function (layer) {
                //     if (layer == null || layer.get('layerObj') == null) return false;
                //     var layerObj = layer.get('layerObj');
                //
                //     if (layerObj.django_id in mapColors) {
                //         var context = e.originalEvent.target.getContext("2d");
                //         var imagevalue = context.getImageData(e.pixel[0] * ol.has.DEVICE_PIXEL_RATIO, e.pixel[1] * ol.has.DEVICE_PIXEL_RATIO, 1, 1);
                //         var rgba = imagevalue.data;
                //         var legend_name = mapColors[layerObj.django_id][rgba[0] + '-' + rgba[1] + '-' + rgba[2]];
                //         $('#map_legend').append('<div style="padding: 5px;"><strong>' + layer.get('name') + ': </strong><br/><div style="float:left;width:16px;height:16px;background-color: rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', 1); border-color: black;margin-top:2px;"></div>&nbsp;' + legend_name + '</div>')
                //         return true;
                //     }
                // });

                var matches = mapviewer.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) { //Feature callback
                    if (layer === null || layer.get('layerObj') === undefined) {
                        return false;
                    } else if (layer.get('layerObj').ogc_type !== 'SOS') {
                        return true;
                    }

                    var feats = feature.get('features');
                    var content = '<ul style="margin: 0;padding:0;list-style-type: none;">';
                    $.each(feats, function () {
                        content += '<li style="white-space: nowrap">' + this.get('description') + '</li>';
                    });
                    content += '</ul>';

                    var title = '';
                    if (feats.length > 1) {
                        title = '<strong>' + feats.length + ' stations</strong>';
                    }

                    popup.setPosition(e.coordinate);
                    //$(element).popover('destroy');
                    $(element).popover({
                        'placement': 'top',
                        'animation': false,
                        'html'     : true,
                        'title'    : title,
                        'content'  : content
                    });
                    $(element).popover('show');
                    //$('.popover-title', $('#'+element.getAttribute('aria-describedby'))).append('<button id="popovercloseid" type="button" onclick="$(\'#popup\').popover(\'destroy\');" class="close">&times;</button>');
                    return true;
                });

                if (typeof matches === 'undefined') {
                    $(element).popover('destroy');
                    //mapviewer.selectInteraction.getFeatures().clear();
                }
            });

            // add event handler for select-event, i.e. when a feature is selected
            mapviewer.selectInteraction.on("select", function () {
                var feature = mapviewer.selectInteraction.getFeatures().item(0);
                if (!feature) {
                    mapviewer.selectInteraction.getFeatures().clear();
                    mapviewer.selectInteraction.getFeatures().push(mapviewer.currentFeature);
                    return;
                }

                if (feature && mv.currentSelectWetland !== feature.get('id')
                    && mv.visibility_state_wetland_layer === true) {
                    $rootScope.$broadcast('mapviewer.wetland_selected', feature.get('id'));
                }
            });

            mapviewer.map.on("click", function (e) {
                //mapviewer.selectPointerMove.getFeatures().clear();
                mapviewer.map.forEachFeatureAtPixel(e.pixel, featureCallback.bind(mapviewer), {
                    layerFilter: layerFilterCallback.bind(mapviewer)
                });
            });

            function featureCallback(feature, layer) {
                if (layer === null || layer.get('name') === 'Wetlands' || layer.get('layerObj') === undefined || layer.get('layerObj') === null ) {
                    return false;
                }

                switch (layer.get('layerObj').ogc_type) {
                    case 'SOS':
                        if (feature.get('features').length > 1) {
                            var options = '';
                            $.each(feature.get('features'), function (index, feat) {
                                options += '<option value="' + index + '">' + feat.get('description') + '</option>';
                            });
                            bootbox.dialog({
                                title  : 'Please select a station',
                                message: '<select id="select_station" name="select_station">' + options + '</select>',
                                buttons: {
                                    success: {
                                        label   : 'Show chart',
                                        callback: function () {
                                            var station = $('#select_station').val();
                                            var feat = feature.get('features')[station];
                                            $modal.open({
                                                bindToController: true,
                                                controller : 'ClimateChartCtrl',
                                                controllerAs: 'cc',
                                                templateUrl: subdir + '/static/includes/climatechart.html',
                                                backdrop   : 'static',
                                                resolve    : {
                                                    layer  : function () {
                                                        return layer.get('layerObj');
                                                    },
                                                    feature: function () {
                                                        return feat;
                                                    },
                                                    title  : function () {
                                                        return feat.get('description');
                                                    }
                                                }
                                            });

                                        }
                                    }
                                }
                            });
                        } else {
                            var feat = feature.get('features')[0];
                            $modal.open({
                                bindToController: true,
                                controller : 'ClimateChartCtrl',
                                controllerAs: 'cc',
                                templateUrl: subdir + '/static/includes/climatechart.html',
                                backdrop   : 'static',
                                resolve    : {
                                    layer  : function () {
                                        return layer.get('layerObj');
                                    },
                                    feature: function () {
                                        return feat;
                                    },
                                    title  : function () {
                                        return feat.get('description');
                                    }
                                }
                            });
                        }
                        break;
                    default:
                        var output = '<h2>Properties</h2><ul>';
                        $.each(feature.getKeys(), function () {
                            if (this !== 'geometry') {
                                output += '<li><strong>' + this + ': </strong>' + feature.get(this) + '</li>';
                            }
                        });
                        output += '</ul>';
                        bootbox.dialog({title: 'Feature info', message: output, backdrop: false});
                        break;
                }
                //feature is the selected feature
                //layer is the layer it belongs to
                //
                //handle the your selected feature here
                //
                //Return a truthy value to stop processing, otherwise forEachFeatureAtPixel will continue with the next matching feature
                //and this callback will be invoked again for that feature
                return true;
            }

            function layerFilterCallback() {
                //Return true if features in the passed in layer should be considered for selection
                return true;
            }

            angular.element($window).bind('resize', function () {
                $timeout(function () {
                    var center = ol.proj.transform(mapviewer.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326');
                    mapviewer.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
                }, 2);
            });
        });

        //--------------------------------------------------------------------------------------------------------------

        function changeSitesVisibility(id, $event) {
            var olLayer = mapviewer.map.getLayers().getArray()[1];
            var checkbox = $event.target;

            if (checkbox.checked) {
                olLayer.setVisible(true);

                if(mv.selectedFeature){
                    mapviewer.selectInteraction.getFeatures().push(mv.selectedFeature);
                }
                mv.visibility_state_wetland_layer = true;
            } else {
                olLayer.setVisible(false);
                mv.selectedFeature = mapviewer.selectInteraction.getFeatures().pop();
                mv.visibility_state_wetland_layer = false;
            }
        }

        function closeCookieNote() {
            $cookies.hideCookieNote = true;
            mv.hideCookieNote =  true;
        }

        function requestInfo() {
            if (mv.infoStatus === false) {
                mv.infoStatus = true;
                mv.infoEventKey = mapviewer.map.on('singleclick', function (evt) {
                    var viewResolution = mapviewer.map.getView().getResolution();
                    var lonlat = ol.proj.transform(evt.coordinate, mapviewer.map.getView().getProjection(), 'EPSG:4326');
                    var lon = lonlat[0].toFixed(2);
                    var lon_arrow = 'East';
                    if (lon < 0) {
                        lon_arrow = 'West';
                        lon = lon * -1;
                    }
                    var lat = lonlat[1].toFixed(2);
                    var lat_arrow = 'North';
                    if (lat < 0) {
                        lat_arrow = 'South';
                        lat = lat * -1;
                    }
                    var coordinate = '<p><strong>Position</strong><br />' + lon + '&deg; ' + lon_arrow + '&nbsp;&nbsp;&nbsp;' + lat + '&deg; ' + lat_arrow + '</p>';

                    var urls = [];
                    var names = [];
                    $.each(mapviewer.map.getLayers().getArray().slice(1), function () {
                        var layer = this;
                        if (layer.getVisible() === false) {
                            return true;
                        }
                        // Works only for WMS layers
                        try {
                            var source = layer.getSource();
                            var url = '';
                            if (source instanceof ol.source.TileWMS) {
                                url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, mapviewer.displayProjection, {
                                    'INFO_FORMAT': 'text/html'
                                });
                            } else if (source instanceof ol.source.WMTS) {
                                var resolution = viewResolution;
                                var tilegrid = source.getTileGrid();
                                var tileResolutions = tilegrid.getResolutions();
                                var zoomIdx, diff = Infinity;

                                for (var i = 0; i < tileResolutions.length; i++) {
                                    var tileResolution = tileResolutions[i];
                                    var diffP = Math.abs(resolution - tileResolution);

                                    if (diffP < diff) {
                                        diff = diffP;
                                        zoomIdx = i;
                                    }

                                    if (tileResolution < resolution) {
                                        break;
                                    }
                                }

                                //Getting parameters
                                //Reference: OpenLayers.Layer.WMTS.getTileInfo
                                var tileSize = tilegrid.getTileSize(zoomIdx);
                                var tileOrigin = tilegrid.getOrigin(zoomIdx);

                                var fx = (evt.coordinate[0] - tileOrigin[0]) / (resolution * tileSize);
                                var fy = (tileOrigin[1] - evt.coordinate[1]) / (resolution * tileSize);
                                var tileCol = Math.floor(fx);
                                var tileRow = Math.floor(fy);
                                var tileI = Math.floor((fx - tileCol) * tileSize);
                                var tileJ = Math.floor((fy - tileRow) * tileSize);
                                var matrixIds = tilegrid.getMatrixIds()[zoomIdx];
                                var matrixSet = source.getMatrixSet();

                                var params = {
                                    SERVICE      : 'WMTS',
                                    REQUEST      : 'GetFeatureInfo',
                                    VERSION      : source.getVersion(),
                                    LAYER        : source.getLayer(),
                                    INFOFORMAT   : 'text/html',
                                    STYLE        : source.getStyle(),
                                    FORMAT       : source.getFormat(),
                                    TileCol      : tileCol,
                                    TileRow      : tileRow,
                                    TileMatrix   : matrixIds,
                                    TileMatrixSet: matrixSet,
                                    I            : tileI,
                                    J            : tileJ
                                };
                                console.log(params);
                                url = layer.get('layerObj').ogc_link + '?' + jQuery.param(params);
                            }
                            if (url !== '') {
                                urls.push(encodeURIComponent(url));
                                names.push(encodeURIComponent(layer.get('name')));
                            }
                        } catch (e) {
                        }
                    });
                    if (urls.length > 0) {
                        $('#loading-div').addClass('nobg').show();
                        djangoRequests.request({
                            url   : '/layers/info?url=' + urls.join('||') + '&names=' + names.join('||'),
                            method: 'GET'
                        }).then(function (data) {
                            var dialog = bootbox.dialog({
                                title   : 'Feature Info Response',
                                message : coordinate + data,
                                backdrop: false
                            });
                            dialog.removeClass('modal').addClass('mymodal').drags({handle: '.modal-header'});
                            var width = $(document).width() / 2 - 300;
                            if (width < 0) {
                                width = '2%';
                            }
                            $('.modal-content', dialog).css('left', width);
                            $('#loading-div').removeClass('nobg').hide();
                        }, function (err) {
                            $('#loading-div').removeClass('nobg').hide();
                            bootbox.alert('An error occurred while loading data: ' + err.error);
                        });

                    }
                });
            } else {
                mv.infoStatus = false;
                ol.Observable.unByKey(mv.infoEventKey);
            }
            mapviewer.selectInteraction.setActive(!mv.infoStatus);
        }

        function zoomIn(event) {
            var currentZoomLevel = mapviewer.map.getView().getZoom();
            if (currentZoomLevel < mapviewer.zoom_max) {
                mapviewer.map.getView().setZoom(currentZoomLevel + 1);

                event.target.disabled = (currentZoomLevel + 1 === mapviewer.zoom_max);
                $('#zoomOutButton').attr('disabled', false);
            }
        }

        function zoomMaxExtent() {
            mapviewer.map.getView().fit(
                ol.proj.transformExtent(mapviewer.maxExtent, 'EPSG:4326', mapviewer.displayProjection)
            );
        }

        function zoomOut(event) {
            var currentZoomLevel = mapviewer.map.getView().getZoom();
            if (currentZoomLevel > mapviewer.zoom_min) {
                mapviewer.map.getView().setZoom(currentZoomLevel - 1);

                event.target.disabled = (currentZoomLevel - 1 === mapviewer.zoom_min);
                $('#zoomInButton').attr('disabled', false);
            }
        }
    })
    .controller('MapSettingsCtrl', function($scope, mapviewer, djangoRequests, $modal){
        var mapSettings = this;

        mapSettings.baseLayers = [];
        mapSettings.changeBaseLayer = changeBaseLayer;
        //mapSettings.selectedBaseLayer = mapSettings.baseLayers[mapviewer.currentBaseLayerIndex];
        mapSettings.showMetadata = showMetadata;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('mapviewer.baselayers_loaded', function () {
            $.each(mapviewer.baseLayers, function(){
                if (this.get('name') !== '') {
                    mapSettings.baseLayers.push(this.get('name'));
                }
                mapSettings.selectedBaseLayer = mapSettings.baseLayers[mapviewer.currentBaseLayerIndex];
            });
        });

        // TODO: ????
        $('.dropdown').find('select').click(function (e) {
            e.stopPropagation();
        });

        //--------------------------------------------------------------------------------------------------------------

        function changeBaseLayer() {
            var index = $.inArray(mapSettings.selectedBaseLayer, mapSettings.baseLayers);
            mapviewer.setBaseLayer(index);
        }

        function showMetadata() {
            var layer = mapviewer.baseLayers[mapviewer.currentBaseLayerIndex];
            var layerObj = layer.get('layerObj');
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url': '/layers/detail/'+layerObj.id+'.json'
            }).then(function(data){
                $modal.open({
                    bindToController: true,
                    controller: 'ModalInstanceCtrl',
                    controllerAs: 'mi',
                    templateUrl: subdir+'/static/includes/metadata.html',
                    resolve: {
                        data: function() {return data;},
                        title: function() {return data.title;}
                    }
                });
                $('#loading-div').hide();
            }, function() {
                bootbox.alert('<h1>No Metadata information available!</h1>');
            })
        }
    })
    .controller('MapCatalogCtrl', function($scope, mapviewer, djangoRequests, $modal){
        var mapCatalog = this;

        mapCatalog.activeLayer = -1;
        mapCatalog.addLayerToMap = addLayerToMap;
        mapCatalog.download = downloadLayer;
        mapCatalog.hidePopover = hidePopover;
        mapCatalog.hoverLayer = hoverLayer;
        mapCatalog.layerTree = mapviewer.datacatalog;
        mapCatalog.showMap = showMap;
        mapCatalog.showMetadata = showMetadata;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('mapviewer.catalog_loaded', function () {
            mapCatalog.layerTree = mapviewer.datacatalog;
        });

        //--------------------------------------------------------------------------------------------------------------

        function addLayerToMap(layer) {
            var olLayer = mapviewer.addLayer(layer);
            if (olLayer instanceof ol.layer.Layer) {
                var layerObj = olLayer.get('layerObj');
                var extent = [layerObj.west, layerObj.south, layerObj.east, layerObj.north];
                if (layerObj["epsg"] && layerObj.epsg > 0) {
                    extent = ol.proj.transformExtent(extent, 'EPSG:'+layerObj.epsg, mapviewer.map.getView().getProjection().getCode());
                } else {
                    extent = ol.proj.transformExtent(extent, 'EPSG:4326', mapviewer.map.getView().getProjection().getCode());
                }

                mapviewer.map.getView().fit(extent);
            }
        }

        function downloadLayer(layer) {
            if (layer.download_type == 'wcs') {
                alert('TODO');
            } else {
                window.open(subdir + '/layers/detail/' + layer.id + '/download', 'download_' + layer.id);
            }
        }

        function hidePopover() {
            setTimeout(function () {
                if (!$(".popover:hover").length) {
                    $('body .popover').popover('hide');
                }
            }, 300);
        }

        function hoverLayer(elem, layerID, $event) {
            var $popover = $('body .popover');
            if (mapCatalog.activeLayer === layerID && $popover.length > 0) {
                return false;
            }
            mapCatalog.activeLayer = layerID;
            $($event.target).popover('show');
            $popover.on('mouseleave', function(){
                var _this = this;
                setTimeout(function () {
                    if (!$($event.target).parent().is(':hover')) {
                        $(_this).popover('hide');
                    }
                }, 300)
            })
        }

        function showMap(layer) {
            window.open(subdir+layer.map_layout_image, 'map_'+layer.id);
        }

        function showMetadata(layer) {
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url': '/layers/detail/'+layer.id+'.json'
            }).then(function(data){
                $modal.open({
                    bindToController: true,
                    controller: 'ModalInstanceCtrl',
                    controllerAs: 'mi',
                    templateUrl: subdir+'/static/includes/metadata.html',
                    resolve: {
                        data: function() {return data;},
                        title: function() {return data.title;}
                    }
                });
                $('#loading-div').hide();
            }, function() {
                bootbox.alert('<h1>No Metadata information available!</h1>');
            })
        }
    })
    .controller('MapCurrentLayersCtrl', function($scope, mapviewer, $modal, djangoRequests, $rootScope, $routeParams) {
        var mcl = this;

        mcl.addDrawBox = addDrawBox;
        mcl.addOwnLayer = addOwnLayer;
        mcl.changeLayer = changeLayer;
        mcl.changeOpacity = changeOpacity;
        mcl.changeVisibility = changeVisibility;
        mcl.currentBBOX = null;
        mcl.download = downloadLayer;
        mcl.layersMeta = mapviewer.layersMeta;
        mcl.mapviewerdata = mapviewer.data;
        mcl.newLayerIndex = -1;
        mcl.prepareIndex = prepareIndex;
        mcl.removeAllLayers = removeAllLayers;
        mcl.removeDrawBox = removeDrawBox;
        mcl.removeLayer = removeLayer;
        mcl.requestWCS = requestWCS;
        mcl.selectedLayerDates = mapviewer.selectedLayerDates;
        mcl.shareLink = shareLink;
        mcl.showMap = showMap;
        mcl.showMetadata = showMetadata;
        mcl.showToggleButton = false;
        mcl.sliderValues = mapviewer.sliderValues;
        mcl.toggleLayerControls = toggleLayerControls;
        mcl.toggleLegend = toggleLegend;
        mcl.toggleStations = toggleStations;
        mcl.toggleWetlandList = toggleWetlandList;
        mcl.updateLayer = updateLayer;
        //mcl.wetlandListGlyph = "glyphicon-chevron-right";
        mcl.wetlandListState = "";
        mcl.zoomToLayer = zoomToLayer;
        mcl.zoomToStation = zoomToStation;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on("mapviewer.layeradded", function() {
            mcl.showToggleButton = true;
        });

        $scope.$on("mapviewer.layerremoved", function() {
            mcl.toggleWetlandList("change");
            if (mapviewer.data.layersCount < 1) {
                mcl.showToggleButton = false;
            }
        });

        //--------------------------------------------------------------------------------------------------------------

        function addDrawBox() {
            var draw;

            var source = new ol.source.Vector({wrapX: false});
            var vector = new ol.layer.Vector({source: source, name: "draw_box"});

            var source_2 = new ol.source.Vector({wrapX: false});
            var vector_2 = new ol.layer.Vector({source: source_2, name: "draw_box_2"});

            mapviewer.map.addLayer(vector);
            mapviewer.map.addLayer(vector_2);

            function addInteraction() {
                var value = "Box";
                if (value !== 'None') {
                    var geometryFunction, maxPoints;
                    if (value === 'Square') {
                        value = 'Circle';
                        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
                    } else if (value === 'Box') {
                        value = 'LineString';
                        maxPoints = 2;
                        geometryFunction = function (coordinates, geometry) {
                            if (!geometry) {
                                geometry = new ol.geom.Polygon(null);
                            }
                            var start = coordinates[0];
                            var end = coordinates[1];
                            geometry.setCoordinates([
                                [start, [start[0], end[1]], end, [end[0], start[1]], start]
                            ]);
                            return geometry;
                        };
                    }
                    draw = new ol.interaction.Draw({
                        source: source,
                        type: /** @type {ol.geom.GeometryType} */ (value),
                        geometryFunction: geometryFunction,
                        maxPoints: maxPoints
                    });
                    draw.on('drawstart', function (e) {
                        source.clear();
                        source_2.clear();
                    });
                    draw.on('drawend', function (e) {
                        var drawendExtent3857 = e.feature.getGeometry().getExtent();

                        var geom = new ol.geom.Polygon([[
                            [drawendExtent3857[0], drawendExtent3857[3]],
                            [drawendExtent3857[2], drawendExtent3857[3]],
                            [drawendExtent3857[2], drawendExtent3857[1]],
                            [drawendExtent3857[0], drawendExtent3857[1]]
                        ]]);
                        var feature = new ol.Feature({
                            name: "bbox",
                            geometry: geom
                        });
                        source_2.addFeature(feature);

                        var drawendExtent = ol.proj.transformExtent(e.feature.getGeometry().getExtent(), 'EPSG:3857', 'EPSG:4326');
                        $('#east').val(drawendExtent[2].toFixed(2));
                        $('#north').val(drawendExtent[3].toFixed(2));
                        $('#south').val(drawendExtent[1].toFixed(2));
                        $('#west').val(drawendExtent[0].toFixed(2));
                        $('input:radio[name="extent_type"]').filter('[value="bbox"]').prop('checked', true);

                        mcl.currentBBOX = drawendExtent;
                    });
                    mapviewer.map.addInteraction(draw);
                }
            }
            addInteraction();
        }

        function addOwnLayer() {
            $modal.open({
                bindToController: true,
                controller: 'MapAddOwnLayerCtrl',
                controllerAs: 'maol',
                templateUrl: subdir+'/static/includes/addownlayer.html',
                resolve: {
                    title: function() {return 'Add own layer to map';}
                }
            });
        }

        function changeLayer(index) {
            var layerId = mcl.layersMeta[index].id;
            mcl.layersMeta.splice(index, 1);

            if (mcl.newLayerIndex > index) {
                mcl.newLayerIndex = mcl.newLayerIndex-1;
            }

            var delta = index-mcl.newLayerIndex;
            mapviewer.raiseLayer(layerId, delta);
        }

        function changeOpacity(id) {
            var olLayer = mapviewer.getLayerById(id);
            olLayer.setOpacity(parseInt(mcl.sliderValues[id])/100);
        }

        function changeVisibility(id, $event) {
            var olLayer = mapviewer.getLayerById(id);
            var checkbox = $event.target;
            if (checkbox.checked) {
                olLayer.setVisible(true);
            } else {
                olLayer.setVisible(false);
            }
        }

        function downloadLayer(layer) {
            console.log(layer);
            if (layer.download_type == 'wcs') {
                mcl.requestWCS(layer);
            } else {
                window.open(subdir + '/layers/detail/' + layer.id + '/download', 'download_' + layer.id);
            }
        }

        function prepareIndex(index, item) {
            mcl.newLayerIndex = index;
            return item;
        }

        function removeAllLayers() {
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
        }

        function removeDrawBox() {
            mapviewer.map.getLayers().forEach(function (layer, i) {
                if (layer.get('name') == "draw_box" || layer.get('name') == "draw_box_2") {
                    mapviewer.map.removeLayer(layer);
                }
            });
            mapviewer.map.getInteractions().forEach(function (interaction) {
                if (interaction instanceof ol.interaction.Draw) {
                    interaction.setActive(false);
                }
            }, this);
        }

        function removeLayer(id, index, django_id) {
            mapviewer.removeLayer(id, index);
            var checkbox;
            if (django_id !== undefined
                && django_id !== null
                && (checkbox = document.getElementById("layer_vis_"+django_id))
            ) {
                checkbox.checked = "";
            }
        }

        function requestWCS(layer) {
            var layer_id = layer.id;
            mcl.addDrawBox();

            var dialog = bootbox.dialog({
                title: 'Download',
                message: output,
                backdrop: false,
                buttons: {
                    confirm: {
                        label: 'Download',
                        className: 'btn-primary',
                        callback: function () {
                            mcl.removeDrawBox();

                            var bbox = $('#west').val() + ',' + $('#south').val() + ',' + $('#east').val() + ',' + $('#north').val()
                            var url = subdir + '/layers/detail/' + layer.django_id + '/download?bbox=' + bbox + '&outputformat=' + $('#output_format').val();
                            mcl.removeDrawBox();
                            window.open(url, 'download_' + layer.django_id);
                        }
                    },
                    cancel: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function () {
                            mcl.removeDrawBox();
                        }
                    }
                }
            });
            var output = '<div  class="modal-body">' +
                '<div style="display: inline-flex;  white-space: nowrap;">Please select an output format:' +
                '<select name="output_format" id="output_format" class="form-control" style="margin-left: 16px;">' +
                '<option>GeoTiff</option>' +
                '</select>' +
                '</div>' +
                '<div><p>Bounding Box:</p><div><input type="text" name="north" id="north" class="form-control" style="width: 100px"></div>' +
                '<div style="display: inline-flex; width: 100%">' +
                '<input type="text" name="west" id="west" class="form-control" style="width: 100px">' +
                '<input type="text" name="east" id="east" class="form-control" style="width: 100px"></div>' +
                '<div><input type="text" name="south" id="south" class="form-control" style="width: 100px"></div>' +
                '<div>' +
                '<label for="bbox" style="margin-left: 100px"><input type="radio" name="extent_type" value="bbox" id="bbox">Map selection</label>' +
                '<label for="full_extent" style="margin-left: 20px; margin-right: 20px;"><input type="radio" name="extent_type" id="full_extent"  value="full_extent" >Entire dataset</label>' +
                '<label for="current_view"><input type="radio" name="extent_type" value="current_view" id="current_view">Current view</label>' +
                '</div></div>' +
                '';
            dialog.removeClass('modal').addClass('mymodal').drags({handle: '.modal-header'});
            var width = $(document).width() / 2 - 300;
            if (width < 0) {
                width = '2%';
            }
            $('.modal-content', dialog).css('left', width);
            $('#loading-div').removeClass('nobg').hide();

            // fill with full extent by default
            full_extent();
            $('input:radio[name="extent_type"]').filter('[value="full_extent"]').prop('checked', true);

            $("input[type=radio][name=extent_type]").change(function () {

                if (this.value == "bbox") {
                    var extent = mcl.currentBBOX;
                    $('#east').val(extent[2].toFixed(2));
                    $('#north').val(extent[3].toFixed(2));
                    $('#south').val(extent[1].toFixed(2));
                    $('#west').val(extent[0].toFixed(2));
                }
                if (this.value == "full_extent") {
                    full_extent();
                }
                if (this.value == "current_view") {

                    var extent = ol.proj.transformExtent(mapviewer.map.getView().calculateExtent(mapviewer.map.getSize()), 'EPSG:3857', 'EPSG:4326');
                    $('#east').val(extent[2].toFixed(2));
                    $('#north').val(extent[3].toFixed(2));
                    $('#south').val(extent[1].toFixed(2));
                    $('#west').val(extent[0].toFixed(2));
                }
            });

            function full_extent() {
                var olLayer = mapviewer.getLayerById(layer_id);

                var layerObj = olLayer.get('layerObj');

                var west = layerObj.west;
                var south = layerObj.south;
                var east = layerObj.east;
                var north = layerObj.north;

                var map_epsg = mapviewer.map.getView().getProjection().getCode();

                //reduce extent to fit to mercator projection (Google)
                if (layerObj["epsg"] == 4326 && (map_epsg == "EPSG:3857" || map_epsg == "EPSG:900913")) {
                    if (south < -85) {
                        south = -85
                    }
                    if (north > 85) {
                        north = 85
                    }
                }

                $('#east').val(east.toFixed(2));
                $('#north').val(north.toFixed(2));
                $('#south').val(south.toFixed(2));
                $('#west').val(west.toFixed(2));
            }

        }

        function shareLink(id) {
            var host = document.location.protocol +"//"+ document.location.hostname + document.location.pathname;
            var hash = '#/wetland/'+$routeParams.wetland_id+'/'+$routeParams.type_name+'/'+id;
            var url = host+hash;
            bootbox.alert('<h4>Share dataset link</h4><div class="share_link">Please use the following link to share the dataset: <br /><a href="'+url+'" target="_blank">'+url+'</a></div>');
        }

        function showMap(layer) {
            window.open(subdir+layer.map_layout_image, 'map_'+layer.id);
        }

        function showMetadata(layer) {
            if (parseInt(layer.django_id) > 0) {
                try {
                    _paq.push(['trackEvent', 'Show Metadata', layer.title]);
                } catch (err) {}

                $('#loading-div').show();
                djangoRequests.request({
                    'method': "GET",
                    'url': '/layers/detail/' + layer.django_id + '.json'
                }).then(function (data) {
                    $modal.open({
                        bindToController: true,
                        controller: 'ModalInstanceCtrl',
                        controllerAs: 'mi',
                        templateUrl: subdir+'/static/includes/metadata.html',
                        resolve: {
                            data: function () {
                                return data;
                            },
                            title: function () {
                                return data.title;
                            }
                        }
                    });
                    $('#loading-div').hide();
                }, function () {
                    bootbox.alert('<h1>No Metadata information available!</h1>');
                    $('#loading-div').hide();
                })
            } else {
                $modal.open({
                    bindToController: true,
                    controller: 'ModalInstanceCtrl',
                    controllerAs: 'mi',
                    templateUrl: subdir+'/static/includes/metadata.html',
                    resolve: {
                        data: function() {return layer;},
                        title: function() {return layer.title;}
                    }
                });
            }
        }

        function toggleLayerControls(id, event) {
            // each control wrapper has its layer id as class
            $(".layer-control-wrapper." + id).toggle();
            $(event.target).toggleClass("glyphicon-chevron-down glyphicon-chevron-up");
        }

        function toggleLegend(layer) {
            // negate showLegend
            layer.showLegend = !layer.showLegend;
        }

        function toggleStations(layer) {
            //load stations if no one available
            if (typeof layer.stations === 'undefined') {
                layer.stations = [];
                var olLayer = mapviewer.getLayerById(layer.id);
                var features = olLayer.getSource().getSource().getFeatures();
                $.each(features, function(){
                    var coords = this.getGeometry().clone().transform(mapviewer.displayProjection, 'EPSG:4326').getCoordinates();
                    layer.stations.push({name: this.get('name'), lat: coords[0], lon: coords[1], feature: this})
                });
                //console.log(features);
            }

            // negate showStations
            layer.showStations = !layer.showStations;
        }

        function toggleWetlandList(action) {
            $('.toggle-button-wrapper > button').blur();
            /*
             close the list, if:
             - there are no layers in the map
             - OR user clicked the arrow-button to close the list
             - OR the list was closed and a layer has been removed
             */
            if ((mapviewer.data.layersCount < 1)
                || ((mcl.wetlandListState === "expanded") && (action === "click"))
                || ((mcl.wetlandListState === "") && (action === "change"))
            ) {
                mcl.wetlandListState = "";
                //mcl.wetlandListGlyph = "glyphicon-chevron-right";
            } else {
                mcl.wetlandListState = "expanded";
                //mcl.wetlandListGlyph = "glyphicon-chevron-left";
            }
        }

        function updateLayer(id) {
            var olLayer = mapviewer.getLayerById(id);
            var source = olLayer.getSource();
            var type = olLayer.get('layerObj').ogc_type;
            if (type === 'WMS') {
                source.updateParams({'TIME': mcl.selectedLayerDates[id]});
            } else if (type === 'WMTS') {
                source.updateDimensions({'time': mcl.selectedLayerDates[id]});
            }
        }

        function zoomToLayer(id) {
            var olLayer = mapviewer.getLayerById(id);
            var layerObj = olLayer.get('layerObj');

            var west = layerObj.west;
            var south = layerObj.south;
            var east = layerObj.east;
            var north = layerObj.north;

            var map_epsg = mapviewer.map.getView().getProjection().getCode();

            //reduce extent to fit to mercator projection (Google)
            if (layerObj["epsg"] == 4326 &&  (map_epsg == "EPSG:3857" || map_epsg == "EPSG:900913")) {
                if (south < -85) {
                    south = -85
                }
                if (north > 85) {
                    north = 85
                }
            }

            var extent = [west, south, east, north].map(parseFloat);

            if (layerObj["epsg"] && layerObj.epsg > 0) {
                extent = ol.proj.transformExtent(extent, 'EPSG:'+layerObj.epsg, mapviewer.map.getView().getProjection().getCode());
            } else {
                extent = ol.proj.transformExtent(extent, 'EPSG:4326', mapviewer.map.getView().getProjection().getCode());
            }

            if(layerObj.west == -180 && layerObj.south == -90 && layerObj.east == 180 && layerObj.north == 90){
                //Zoom to max extent (should be equal to MapViewerCtrl mcl.zoomMaxExtent )
                mapviewer.map.getView().fit(
                    ol.proj.transformExtent(mapviewer.maxExtent, 'EPSG:4326', mapviewer.map.getView().getProjection().getCode())
                );
            }
            else{
                mapviewer.map.getView().fit(extent);
            }
        }

        function zoomToStation(station) {
            var extent = [station.lat, station.lon, station.lat, station.lon];
            extent = ol.proj.transformExtent(extent, 'EPSG:4326', mapviewer.map.getView().getProjection().getCode());
            mapviewer.map.getView().fit(extent);
            mapviewer.map.getView().setZoom(10);

            var element = stationPopup.getElement();
            $(element).popover('destroy');
            $(element).popover({
                'placement': 'top',
                'animation': false,
                'html': true,
                'title': '<strong>Selected&nbsp;feature:</strong>',
                'content': station.description
            });
            stationPopup.setPosition([extent[0], extent[1]]);
            $(element).popover('show');
            $('.ol-overlay-container .popover .arrow').show();
        }
    })
    .controller('MapAddOwnLayerCtrl', function($modalInstance, djangoRequests, mapviewer, title) {
        var maol = this;

        maol.capabilitiesURL = '';
        maol.close = $modalInstance.close;
        maol.layers = [];
        maol.layerURL = '';
        maol.ogc_readers = {
            'WMS': new ol.format.WMSCapabilities(),
            'WMTS': new ol.format.WMTSCapabilities()
        };
        maol.result = null;
        maol.selectedLayer = '';
        maol.selectLayer = selectLayer;
        maol.service = {
            url: '',
            type: 'WMS'
        };
        maol.showLayers = false;
        maol.submitURL = submitUrl;
        maol.title = title;

        //--------------------------------------------------------------------------------------------------------------

        function selectLayer(selectedLayer) {
            maol.selectedLayer = selectedLayer;

            /*
             var layer;
             var time = {};
             var extent;
             var title;
             var matrixSet;

             var options = {}

             switch (maol.service.type) {
             case 'WMS':
             layer = selectedLayer.Name;
             title = selectedLayer.Title;
             extent = selectedLayer.EX_GeographicBoundingBox;
             $.each(selectedLayer.Dimension, function() {
             if (this.name == 'time') {
             time.default = this.default;
             time.units = this.units;
             time.values = this.values;
             }
             })
             break;
             case 'WMTS':
             options.wmts_matrixset = selectedLayer.TileMatrixSetLink[0].TileMatrixSet;
             title = selectedLayer.Title;
             layer = selectedLayer.Identifier;
             extent = selectedLayer.WGS84BoundingBox;
             options.ogc_imageformat = selectedLayer.Format[0];
             options.multiply = true;
             $.each(maol.result.Contents.TileMatrixSet, function(){
             var _this = this;
             if (_this.Identifier == options.wmts_matrixset) {
             options.epsg = _this.SupportedCRS;
             options.wmts_resolutions = []
             options.wmts_tilesize = _this.TileMatrix[0].TileWidth;
             $.each(_this.TileMatrix, function(){
             options.wmts_resolutions.push(this.ScaleDenominator);
             });
             options.wmts_resolutions = options.wmts_resolutions.join(' ');
             return;
             }
             });
             break;
             }
             $.extend(options, {
             'title': title,
             'ogc_type': maol.service.type,
             'ogc_link': maol.layerURL,
             'ogc_layer': layer,
             'time': time,
             'west': extent[0],
             'south': extent[1],
             'east': extent[2],
             'north': extent[3]
             })
             */
            selectedLayer.multiply = true;
            if ('timeRange' in selectedLayer && selectedLayer.timeRange.indexOf(',') == -1) {
                djangoRequests.request({
                    url: '/layers/capabilities/time.json?time=' + selectedLayer.timeRange
                }).then(function (result) {
                    selectedLayer.dates = result.dates;
                    mapviewer.addLayer(selectedLayer);
                }, function () {
                    mapviewer.addLayer(selectedLayer);
                })
            } else if ('timeRange' in selectedLayer && selectedLayer.timeRange.indexOf(',') > 0) {
                selectedLayer.dates = selectedLayer.timeRange.split(',');
                mapviewer.addLayer(selectedLayer);
            } else {
                mapviewer.addLayer(selectedLayer);
            }
        }

        function submitUrl() {
            var urlExtentChar = '?';
            if (maol.service.url.indexOf('?') > -1) {
                urlExtentChar = '&';
            }
            maol.capabilitiesURL = maol.service.url+urlExtentChar+'service='+maol.service.type+'&request=GetCapabilities';

            djangoRequests.request({
                url: '/layers/capabilities/'+maol.service.type+'.json?url='+encodeURIComponent(maol.capabilitiesURL),
                method: 'GET'
            }).then(function(response) {

                maol.layers = response.layers;
                maol.showLayers = true;
                /*
                 var parser = maol.ogc_readers[maol.service.type];
                 var result = parser.read(response);
                 console.log(result);
                 maol.result = result;

                 switch (maol.service.type) {
                 case 'WMS':
                 maol.layers = result.Capability.Layer.Layer;
                 maol.layerURL = result.Service.OnlineResource;
                 break;
                 case 'WMTS':
                 maol.layers = [];
                 $.each(result.Contents.Layer, function(){
                 var layer = this;
                 layer.Name = layer.Identifier;
                 maol.layers.push(layer);
                 })
                 maol.layerURL = maol.service.url;
                 break;
                 }
                 */

            }, function() {
                bootbox.alert('An error occurred');
                //console.log(err);
            });
        }
    })
    .controller('MapCurrentLayersTabCtrl', function(mapviewer) {
        var mclt = this;

        mclt.data = mapviewer.data;
    })
    .controller('ClimateChartCtrl', function ($modalInstance, djangoRequests, mapviewer, layer, feature, title) {
        var cc = this;

        cc.addChart = addChart;
        cc.changeOptions = changeOptions;
        cc.chart = {};
        cc.chartdata = [];
        cc.close = close;
        cc.colors = ['black'];
        cc.dateOptions = {
            startingDay: 1
        };
        cc.download = downloadSOS;
        cc.endDate = '2012-01-01';
        cc.feature = feature;
        cc.labels = ['isodate',cc.feature.get('name')];
        cc.layer = layer;
        cc.maxDate = new Date('2015-03-01');
        cc.minDate = new Date('1970-01-01');
        cc.openedEnd = false;
        cc.openEnd = openEnd;
        cc.openedStart = false;
        cc.openStart = openStart;
        cc.parameter = {};
        cc.parameters = [];
        cc.request_url = '';
        cc.startDate = '2001-01-01';
        cc.title = title;
        cc.ylabel = 'name [unit]';

        function addChart(elem) {

            cc.request_url = '/layers/sos/data?id='+cc.layer.django_id+'&procedure='+cc.feature.get('procedure');

            $('#loading-div').show();
            djangoRequests.request({
                url: cc.request_url,
                method: 'GET'
            }).then(function(data) {
                cc.chartdata = [];
                cc.startDate = data.start;
                cc.endDate = data.end;
                cc.parameters = data.parameters;
                cc.parameter = data.param;
                cc.ylabel = data.param.name+' ['+data.param.uom+']';
                cc.minDate = new Date(data.minDate);
                cc.maxDate = new Date(data.maxDate);

                $.each(data.values, function(){
                    if (parseFloat(this[1]) == -999.9) {
                        this[1] = Number.NaN;
                    } else {
                        this[1] = parseFloat(this[1]);
                    }
                    cc.chartdata.push([new Date(this[0]), this[1]]);
                });

                cc.chart = new Dygraph(
                    elem[0],
                    cc.chartdata,
                    {
                        labels: cc.labels,
                        colors: cc.colors,
                        strokeWidth: 2,
                        legend: 'always',
                        title: '',
                        showRangeSelector: true,
                        rangeSelectorHeight: 30,
                        rangeSelectorPlotStrokeColor: 'black',
                        rangeSelectorPlotFillColor: 'green',
                        labelsDivStyles: {
                            'padding': '4px',
                            'border': '1px solid black',
                            'borderRadius': '3px',
                            'boxShadow': '4px 4px 4px #888',
                            'right': '10px'
                        },
                        labelsDivWidth: "100%",
                        axisLineColor: 'green',
                        axisLabelFontSize: 11,
                        axisLabelWidth: 150,
                        xAxisLabelWidth: 60,
                        highlightCircleSize: 4,
                        ylabel: cc.ylabel,
                        yAxisLabelWidth: 30,
                        axes: {
                            x: {
                                axisLabelFormatter: Dygraph.dateString_,
                                ticker:Dygraph.dateTicker
                            },
                            y: {
                                pixelsPerLabel: 20
                            }
                        },
                        interactionModel : {
                            'mousedown' : downV3,
                            'mousemove' : moveV3,
                            'mouseup' : upV3,
                            'click' : clickV3,
                            'dblclick' : dblClickV3,
                            'mousewheel' : scrollV3
                        }
                    }
                );
                $('#loading-div').hide();

                var modalElem = $(elem).parents('.modal');
                modalElem.removeClass('modal').addClass('mymodal');
                $('.modal-content', modalElem).css('left', $(document).width()/2-300);

                window.setTimeout("angular.element('.ng-isolate-scope').scope().chart.resize();", 500);
            }, function(err){
                $('#loading-div').hide();
                $modalInstance.close();
                bootbox.alert('An error occurred while loading data: '+err.error);
            });
        }

        function changeOptions() {
            var start = (typeof cc.startDate  === 'object') ? cc.startDate.toISOString() : cc.startDate;
            var end = (typeof cc.endDate === 'object') ? cc.endDate.toISOString() : cc.endDate;
            var param = cc.parameter.definition;

            cc.request_url = '/layers/sos/data?id='+cc.layer.django_id+'&procedure='+cc.feature.get('procedure')+'&start='+start+'&end='+end+'&param='+param;

            $('#loading-div').show();
            djangoRequests.request({
                url: cc.request_url,
                method: 'GET'
            }).then(function(data) {
                cc.chartdata = [];
                cc.ylabel = data.param.name+' ['+data.param.uom+']';
                cc.minDate = new Date(data.minDate);
                cc.maxDate = new Date(data.maxDate);
                $.each(data.values, function(){
                    if (parseFloat(this[1]) == -999.9) {
                        this[1] = Number.NaN;
                    } else {
                        this[1] = parseFloat(this[1]);
                    }
                    cc.chartdata.push([new Date(this[0]), this[1]]);
                });
                cc.chart.updateOptions({
                    file: cc.chartdata,
                    valueRange: null,
                    windowRange: null,
                    ylabel: cc.ylabel
                });
                $('#loading-div').hide();
            });

        }

        function close() {
            $modalInstance.close();
            mapviewer.selectInteraction.getFeatures().clear();
        }

        function downloadSOS() {
            var url = subdir+cc.request_url+'&download=true';
            window.open(url, 'download_sos');
        }

        function openEnd($event) {
            $event.preventDefault();
            $event.stopPropagation();

            cc.openedEnd = true;
        }

        function openStart($event) {
            $event.preventDefault();
            $event.stopPropagation();

            cc.openedStart = true;
        }
    })
    .directive('chart', function () {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.addChart(element);
            }
        };
    })
    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    })
    .run(function (mapviewer) {
        mapviewer.initialize(mapId, 'map', true); //id of mapviewer
    })
;
