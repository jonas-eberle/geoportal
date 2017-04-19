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
            'zoom_max': 28,
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
                  streetViewControl: false
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
                        new ol.interaction.MouseWheelZoom({duration: 0})
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
                    $rootScope.$broadcast('mapviewer.catalog_loaded');

                    if (mapviewer.map !== null) {
                        mapviewer.map.setTarget(null);
                        mapviewer.map = null;
                    }
                    mapviewer.createMap(mapElement);
                    if (mapviewer.baseLayers.length > 0) {
                        mapviewer.setBaseLayer(0);
                    }
                    $rootScope.$broadcast('djangoAuth.registration_enabled', data.auth_registration);
                    $('#loading-div').hide();

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
        var setList = function(newList) {
            list = newList;
            $rootScope.$broadcast("attribution_list_new")
        };
        var getList = function(){
            return list;
        };

    return {
        setList: setList,
        getList: getList
    };
    })

    .controller('MapViewerCtrl', function($scope, mapviewer, djangoRequests, $modal, $rootScope, $window, $timeout, $cookies, Attribution){

        // $scope.legendLayers = [];
        $scope.selectedFeature = null;

        $scope.$on('attribution_list_new', function (){
            $scope.layer_attribution = Attribution.getList();
        });

        $scope.$on('current_wetland_id', function ($broadCast, id) {
            $scope.currentSelectWetland = id
        });

        $scope.$on('mapviewer.map_created', function () {
            if ($cookies.hideCookieNote) {
                $scope.hideCookieNote = true;
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

                // $scope.legendLayers = [];
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

                if (feature && $scope.currentSelectWetland !== feature.get('id')
                    && $scope.visibility_state_wetland_layer === true) {
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
                if (layer === null || layer.get('name') === 'Wetlands' || layer.get('layerObj') === null) {
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
                                                controller : 'ClimateChartCtrl',
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
                                controller : 'ClimateChartCtrl',
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

        $scope.$on('djangoAuth.logged_in', function () {
            mapviewer.initialize(mapId, 'map', false);
        });

        $scope.hideCookieNote = false;
        $scope.closeCookieNote = function() {
            $cookies.hideCookieNote = true;
            $scope.hideCookieNote =  true;
        };

        $scope.zoomIn = function() {
            //mapviewer.map.getView().setResolution(mapviewer.map.getView().getResolution() / 2);
            mapviewer.map.getView().setZoom(mapviewer.map.getView().getZoom()+1);
        };

        $scope.zoomOut = function() {
            //mapviewer.map.getView().setResolution(mapviewer.map.getView().getResolution() * 2);
            mapviewer.map.getView().setZoom(mapviewer.map.getView().getZoom()-1);
        };

        $scope.zoomMaxExtent = function() {
            mapviewer.map.getView().fit(
                ol.proj.transformExtent(mapviewer.maxExtent, 'EPSG:4326', mapviewer.displayProjection)
            );
        };

        $scope.visibility_state_wetland_layer = true;

        $scope.changeSitesVisibility = function(id, $event) {
            var olLayer = mapviewer.map.getLayers().getArray()[1];
            var checkbox = $event.target;

            if (checkbox.checked) {
                olLayer.setVisible(true);

                if($scope.selectedFeature){
                    mapviewer.selectInteraction.getFeatures().push($scope.selectedFeature);
                }
                $scope.visibility_state_wetland_layer = true;
            } else {
                olLayer.setVisible(false);
                $scope.selectedFeature = mapviewer.selectInteraction.getFeatures().pop();
                $scope.visibility_state_wetland_layer = false;
            }
        };

        $scope.infoStatus = false;
        $scope.infoEventKey = null;
        $scope.requestInfo = function () {
            if ($scope.infoStatus === false) {
                $scope.infoStatus = true;
                $scope.infoEventKey = mapviewer.map.on('singleclick', function (evt) {
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
                $scope.infoStatus = false;
                ol.Observable.unByKey($scope.infoEventKey);
            }
            mapviewer.selectInteraction.setActive(!$scope.infoStatus);
        }
    })
    .controller('MapSettingsCtrl', function($scope, mapviewer, djangoRequests, $modal){
        $scope.baseLayers = [];

        $scope.$on('mapviewer.baselayers_loaded', function () {
           $.each(mapviewer.baseLayers, function(){
               if (this.get('name') !== '') {
                   $scope.baseLayers.push(this.get('name'));
               }
               $scope.selectedBaseLayer = $scope.baseLayers[mapviewer.currentBaseLayerIndex];
           });
        });

        //$scope.selectedBaseLayer = $scope.baseLayers[mapviewer.currentBaseLayerIndex];
        $scope.changeBaseLayer = function() {
            var index = $.inArray($scope.selectedBaseLayer, $scope.baseLayers);
            mapviewer.setBaseLayer(index);
        };

        $scope.showMetadata = function() {
            var layer = mapviewer.baseLayers[mapviewer.currentBaseLayerIndex];
            var layerObj = layer.get('layerObj');
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url': '/layers/detail/'+layerObj.id+'.json'
            }).then(function(data){
                $modal.open({
                    controller: 'ModalInstanceCtrl',
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
        };

        $('.dropdown').find('select').click(function (e) {
            e.stopPropagation();
        });
    })
    .controller('MapCatalogCtrl', function($scope, mapviewer, djangoRequests, $modal){
        var mapCatalog = this;

        mapCatalog.activeLayer = -1;
        mapCatalog.addLayerToMap = addLayerToMap;
        mapCatalog.download = function(layer) {
            window.open(subdir+'/layers/detail/'+layer.id+'/download', 'download_'+layer.id);
        };
        mapCatalog.hidePopover = hidePopover;
        mapCatalog.hoverLayer = hoverLayer;
        mapCatalog.layerTree = mapviewer.datacatalog;
        mapCatalog.showMetadata = showMetadata;

        $scope.$on('mapviewer.catalog_loaded', function () {
            mapCatalog.layerTree = mapviewer.datacatalog;
        });

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

        function showMetadata(layer) {
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url': '/layers/detail/'+layer.id+'.json'
            }).then(function(data){
                $modal.open({
                    controller: 'ModalInstanceCtrl',
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
        $scope.layersMeta = mapviewer.layersMeta;
        $scope.mapviewerdata = mapviewer.data;
        $scope.newLayerIndex = -1;
        $scope.sliderValues = mapviewer.sliderValues;
        $scope.selectedLayerDates = mapviewer.selectedLayerDates;

        $scope.prepareIndex = function(index, item) {
            $scope.newLayerIndex = index;
            return item;
        };
        $scope.toggleLegend = function(layer) {
            // negate showLegend
            layer.showLegend = !layer.showLegend;
        };
        $scope.toggleStations = function(layer) {
            //load stations if no one available
            if (typeof(layer.stations) == 'undefined') {
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
        };
        $scope.zoomToStation = function(station) {
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
        };
        $scope.changeLayer = function(index) {
            var layerId = $scope.layersMeta[index].id;
            $scope.layersMeta.splice(index, 1);

            if ($scope.newLayerIndex > index) {
                $scope.newLayerIndex = $scope.newLayerIndex-1;
            }

            var delta = index-$scope.newLayerIndex;
            mapviewer.raiseLayer(layerId, delta);
        };
        $scope.changeVisibility = function(id, $event) {
            var olLayer = mapviewer.getLayerById(id);
            var checkbox = $event.target;
            if (checkbox.checked) {
                olLayer.setVisible(true);
            } else {
                olLayer.setVisible(false);
            }
        };
        $scope.changeOpacity = function(id) {
            var olLayer = mapviewer.getLayerById(id);
            olLayer.setOpacity(parseInt($scope.sliderValues[id])/100);
        };
        $scope.removeLayer = function(id, index, django_id) {
            mapviewer.removeLayer(id, index);
            var checkbox;
            if (django_id !== undefined
                && django_id !== null
                && (checkbox = document.getElementById("layer_vis_"+django_id))
            ) {
                checkbox.checked = "";
            }
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
            $rootScope.$broadcast("mapviewer.alllayersremoved");
        };
        $scope.zoomToLayer = function(id) {
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
                //Zoom to max extent (should be equal to MapViewerCtrl $scope.zoomMaxExtent )
                mapviewer.map.getView().fit(
                    ol.proj.transformExtent(mapviewer.maxExtent, 'EPSG:4326', mapviewer.map.getView().getProjection().getCode())
                );
            }
            else{
                mapviewer.map.getView().fit(extent);
            }
        };

        $scope.shareLink = function(id) {
            var host = document.location.protocol +"//"+ document.location.hostname + document.location.pathname;
            var hash = '#/wetland/'+$routeParams.wetland_id+'/'+$routeParams.type_name+'/'+id;
            var url = host+hash;
            bootbox.alert('<h4>Share dataset link</h4><div class="share_link">Please use the following link to share the dataset: <br /><a href="'+url+'" target="_blank">'+url+'</a></div>'); 
        };

        $scope.showMetadata = function(layer) {
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
                        controller: 'ModalInstanceCtrl',
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
                    controller: 'ModalInstanceCtrl',
                    templateUrl: subdir+'/static/includes/metadata.html',
                    resolve: {
                        data: function() {return layer;},
                        title: function() {return layer.title;}
                    }
                });
            }

        };

        $scope.updateLayer = function(id) {
            var olLayer = mapviewer.getLayerById(id);
            var source = olLayer.getSource();
            var type = olLayer.get('layerObj').ogc_type;
            if (type === 'WMS') {
                source.updateParams({'TIME': $scope.selectedLayerDates[id]});
            } else if (type === 'WMTS') {
                source.updateDimensions({'time':$scope.selectedLayerDates[id]});
            }
        };

        $scope.download = function(layer) {
            window.open(subdir+'/layers/detail/'+layer.django_id+'/download', 'download_'+layer.django_id);
        };

        $scope.addOwnLayer = function() {
            $modal.open({
                controller: 'MapAddOwnLayer',
                templateUrl: subdir+'/static/includes/addownlayer.html',
                resolve: {
                    title: function() {return 'Add own layer to map';}
                }
            });
        };

        $scope.wetlandListState = "";
        $scope.showToggleButton = false;
        //$scope.wetlandListGlyph = "glyphicon-chevron-right";

        $scope.toggleWetlandList = function(action) {
            $('.toggle-button-wrapper > button').blur();
            /*
            close the list, if:
            - there are no layers in the map
            - OR user clicked the arrow-button to close the list
            - OR the list was closed and a layer has been removed
             */
            if ((mapviewer.data.layersCount < 1)
                || (($scope.wetlandListState === "expanded") && (action === "click"))
                || (($scope.wetlandListState === "") && (action === "change"))
            ) {
                $scope.wetlandListState = "";
                //$scope.wetlandListGlyph = "glyphicon-chevron-right";
            } else {
                $scope.wetlandListState = "expanded";
                //$scope.wetlandListGlyph = "glyphicon-chevron-left";
            }
        };

        $scope.$on("mapviewer.layerremoved", function() {
            $scope.toggleWetlandList("change");
            if (mapviewer.data.layersCount < 1) {
              $scope.showToggleButton = false;
            }
        });
        $scope.$on("mapviewer.layeradded", function() {
            $scope.showToggleButton = true;
        });

        $scope.toggleLayerControls = function(id, event) {
            $(".layer-control-wrapper."+id).toggle();
            $(event.target).toggleClass("glyphicon-chevron-down glyphicon-chevron-up");
        };
    })
    .controller('MapAddOwnLayer', function($scope, $modalInstance, djangoRequests, mapviewer, title) {
        $scope.title = title;
        $scope.service = {
            url: '',
            type: 'WMS'
        };
        $scope.layers = [];
        $scope.showLayers = false;
        $scope.selectedLayer = '';
        $scope.layerURL = '';

        $scope.ogc_readers = {
            'WMS': new ol.format.WMSCapabilities(),
            'WMTS': new ol.format.WMTSCapabilities()
        };

        $scope.submitURL = function() {
            var urlExtentChar = '?';
            if ($scope.service.url.indexOf('?') > -1) {
                urlExtentChar = '&';
            }
            $scope.capabilitiesURL = $scope.service.url+urlExtentChar+'service='+$scope.service.type+'&request=GetCapabilities';

            djangoRequests.request({
                url: '/layers/capabilities/'+$scope.service.type+'.json?url='+encodeURIComponent($scope.capabilitiesURL),
                method: 'GET'
            }).then(function(response) {

                $scope.layers = response.layers;
                $scope.showLayers = true;
                /*
                var parser = $scope.ogc_readers[$scope.service.type];
                var result = parser.read(response);
                console.log(result);
                $scope.result = result;

                switch ($scope.service.type) {
                    case 'WMS':
                        $scope.layers = result.Capability.Layer.Layer;
                        $scope.layerURL = result.Service.OnlineResource;
                        break;
                    case 'WMTS':
                        $scope.layers = [];
                        $.each(result.Contents.Layer, function(){
                            var layer = this;
                            layer.Name = layer.Identifier;
                            $scope.layers.push(layer);
                        })
                        $scope.layerURL = $scope.service.url;
                        break;
                }
                */

            }, function() {
                bootbox.alert('An error occurred');
                //console.log(err);
            });
        };

        $scope.selectLayer = function(selectedLayer) {
            $scope.selectedLayer = selectedLayer;

            /*
            var layer;
            var time = {};
            var extent;
            var title;
            var matrixSet;

            var options = {}

            switch ($scope.service.type) {
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
                    $.each($scope.result.Contents.TileMatrixSet, function(){
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
                'ogc_type': $scope.service.type,
                'ogc_link': $scope.layerURL,
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

        };

        $scope.close = function() {
            $modalInstance.close();
        }
    })
    .controller('MapCurrentLayersTabCtrl', function($scope, mapviewer) {
        $scope.data = mapviewer.data;
    })
    .directive('chart', function () {
      return {
        restrict: 'A',
        link: function($scope, element) {
            $scope.addChart(element);
        }
      };
    })
    .controller('ClimateChartCtrl', function ($scope, $modalInstance, djangoRequests, mapviewer, layer, feature, title) {
        $scope.title = title;
        $scope.layer = layer;
        $scope.feature = feature;
        $scope.request_url = '';

        $scope.startDate = '2001-01-01';
        $scope.endDate = '2012-01-01';
        $scope.minDate = new Date('1970-01-01');
        $scope.maxDate = new Date('2015-03-01');
        $scope.dateOptions = {
            startingDay: 1
        };

        $scope.openedStart = false;
        $scope.openStart = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedStart = true;
        };
        $scope.openedEnd = false;
        $scope.openEnd = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedEnd = true;
        };

        $scope.close = function () {
            $modalInstance.close();
            mapviewer.selectInteraction.getFeatures().clear();
        };

        $scope.ylabel = 'name [unit]';
        $scope.chartdata = [];
        $scope.parameters = [];

        $scope.labels = ['isodate',$scope.feature.get('name')];
        $scope.colors = ['black'];

        $scope.download = function() {
            var url = subdir+$scope.request_url+'&download=true';
            window.open(url, 'download_sos');
        };

        $scope.changeOptions = function() {
            var start = (typeof($scope.startDate) == 'object') ? $scope.startDate.toISOString() : $scope.startDate;
            var end = (typeof($scope.endDate) == 'object') ? $scope.endDate.toISOString() : $scope.endDate;
            var param = $scope.parameter.definition;

            $scope.request_url = '/layers/sos/data?id='+$scope.layer.django_id+'&procedure='+$scope.feature.get('procedure')+'&start='+start+'&end='+end+'&param='+param;

            $('#loading-div').show();
            djangoRequests.request({
                url: $scope.request_url,
                method: 'GET'
            }).then(function(data) {
                $scope.chartdata = [];
                $scope.ylabel = data.param.name+' ['+data.param.uom+']';
                $scope.minDate = new Date(data.minDate);
                $scope.maxDate = new Date(data.maxDate);
                $.each(data.values, function(){
                    if (parseFloat(this[1]) == -999.9) {
                        this[1] = Number.NaN;
                    } else {
                        this[1] = parseFloat(this[1]);
                    }
                    $scope.chartdata.push([new Date(this[0]), this[1]]);
                });
                $scope.chart.updateOptions({
                    file: $scope.chartdata,
                    valueRange: null,
                    windowRange: null,
                    ylabel: $scope.ylabel
                });
                $('#loading-div').hide();
            });

        };

        $scope.addChart = function(elem) {

            $scope.request_url = '/layers/sos/data?id='+$scope.layer.django_id+'&procedure='+$scope.feature.get('procedure');

            $('#loading-div').show();
            djangoRequests.request({
                url: $scope.request_url,
                method: 'GET'
            }).then(function(data) {
                $scope.chartdata = [];
                $scope.startDate = data.start;
                $scope.endDate = data.end;
                $scope.parameters = data.parameters;
                $scope.parameter = data.param;
                $scope.ylabel = data.param.name+' ['+data.param.uom+']';
                $scope.minDate = new Date(data.minDate);
                $scope.maxDate = new Date(data.maxDate);

                $.each(data.values, function(){
                    if (parseFloat(this[1]) == -999.9) {
                        this[1] = Number.NaN;
                    } else {
                        this[1] = parseFloat(this[1]);
                    }
                    $scope.chartdata.push([new Date(this[0]), this[1]]);
                });

                $scope.chart = new Dygraph(
                    elem[0],
                    $scope.chartdata,
                    {
                        labels: $scope.labels,
                        colors: $scope.colors,
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
                        ylabel: $scope.ylabel,
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
