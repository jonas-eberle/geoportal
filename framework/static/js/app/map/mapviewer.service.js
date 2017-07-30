(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .service('mapviewer', mapviewer);

    mapviewer.$inject = ['djangoRequests', '$rootScope', 'Attribution'];
    function mapviewer(djangoRequests, $rootScope, Attribution) {
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
                'addexternallayer': false,
                'canRequestFeatureInfo': false
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
                    resolutions: this.resolutions,
                    enableRotation: false
                });

                var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');

                this.gmap.setZoom(view.getZoom());
                this.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
                view.on('change:center', function() {
                    var center = ol.proj.transform(view.getCenter(), 'EPSG:3857', 'EPSG:4326');
                    _this.gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
                });
                view.on('change:resolution', function() {
                    if (view.getZoom() >= _this.zoom_max) {
                        angular.element('#zoomInButton').addClass('disabled');
                    } else {
                        angular.element('#zoomInButton').removeClass('disabled');
                    }
                    if (view.getZoom() <= _this.zoom_min) {
                        angular.element('#zoomOutButton').addClass('disabled');
                    } else {
                        angular.element('#zoomOutButton').removeClass('disabled');
                    }
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
                        new ol.interaction.MouseWheelZoom({duration: 0, constrainResolution: true}),
                        new ol.interaction.PinchZoom({duration: 0, constrainResolution: true})
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
                Attribution.refreshDisplay(layers.getArray());
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
                        var params = {'LAYERS': layer.ogc_layer, 'TILED': true, 'TRANSPARENT': true};
                        if (layer.hasOwnProperty('selectedDate')) {
                            params['TIME'] = layer.selectedDate+'/'+layer.selectedDate;
                        }
                        olLayer = new ol.layer.Tile({
                            name: layer.title,
                            layerObj: layer,
                            source: new ol.source.TileWMS({
                                url: layer.ogc_link,
                                params: params
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
                        if (layer.ogc_link === '' || layer.ogc_link === null) {
                            osmSource = new ol.source.OSM();
                        } else {
                            osmSource = new ol.source.OSM({url: layer.ogc_link});
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
                console.log(layer);
                for (var i=0; i<this.layersMeta.length; i++) {
                    if (layer.title === this.layersMeta[i].name) {
                        bootbox.alert('Layer exists already in the map. Please see the "Current" tab.');
                        return false;
                    }
                }

                layer = angular.copy(layer);
                var olLayer;
                if (typeof layer.olLayer === 'undefined') {
                    olLayer = this.layerObjToOl3(layer);
                } else {
                    olLayer = angular.copy(layer.olLayer);
                    olLayer.set('zIndex', 0);
                    delete layer.olLayer;
                }
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

                // true: button is already enabled OR layer that allows GetFeatureInfoRequests is added
                this.data.canRequestFeatureInfo = (
                    this.data.canRequestFeatureInfo || layer['ogc_type'] === 'WMS' || layer['ogc_type'] === 'WMTS'
                );

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

                this.layersMeta.unshift(layer);
                this.data.layersCount = this.data.layersCount+1;
                olLayer.set('layerObj', layer);
                this.map.addLayer(olLayer);
                $rootScope.$broadcast("mapviewer.layeradded", olLayer);
                return olLayer;
            },
            'getIndexFromLayer': function(title) {
                for (var i=0; i<this.layersMeta.length; i++) {
                    if (title === this.layersMeta[i].name) {
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

                    // returns true if there is at least one WMS or WMTS layer on the map
                    this.data.canRequestFeatureInfo = this.layersMeta.some(function(layer) {
                        return (layer['ogc_type'] === 'WMS' || layer['ogc_type'] === 'WMTS');
                    });

                    if (!this.data.canRequestFeatureInfo) {
                        $rootScope.$broadcast('turn_off_request_info');
                    }

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
            'removeAllLayers': function() {
                while (this.layersMeta.length > 0) {
                    var layer = this.layersMeta[0];
                    this.removeLayer(layer.id, 0);
                    var checkbox = undefined;
                    if (layer["django_id"] !== undefined
                        && layer.django_id !== null
                        && (checkbox = document.getElementById("layer_vis_"+layer.django_id))
                    ) {
                        checkbox.checked = "";
                    }
                }
                $rootScope.$broadcast("mapviewer.alllayersremoved");
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
                    source.updateParams({'TIME':time+'/'+time});
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
                        return;
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
            },
            'pointFeatureLayer': function (action) {
                if (action === "add") {
                    this.pointFeatures = [];
                    this.pointFeatureVectorSource = new ol.source.Vector({
                        features: this.pointFeatures      //add an array of features
                    });
                    this.pointFeatureVectorLayer = new ol.layer.Vector({
                        source: this.pointFeatureVectorSource
                    });
                    this.map.addLayer(this.pointFeatureVectorLayer);
                }
                if (action === "remove") {
                    this.map.removeLayer(this.pointFeatureVectorLayer);
                }
            },
            'pointFeature': function (action, lonlat, color, text) {
                if (action == "add") {
                    // add marker to map
                    var svgPathToURI = function (color) {
                        var svgPath = '<svg  width="50" height="50" version="1.1" xmlns="http://www.w3.org/2000/svg" ><circle cx="25" cy="25" r="5" stroke="black" stroke-width="1" fill="';
                        svgPath += color;
                        svgPath += '"/></svg>';
                        return "data:image/svg+xml;base64," + btoa(svgPath);
                    };

                    this.pointInMap = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([lonlat[0], lonlat[1]], 'EPSG:4326', 'EPSG:3857'))
                    });

                    this.pointInMap.setStyle(
                        new ol.style.Style({
                            image: new ol.style.Icon(( {
                                src: svgPathToURI(color)
                            } )),
                            text: new ol.style.Text({
                                textAlign: "start",
                                textBaseline: "middle",
                                font: 'Normal 12px Arial',
                                text: text,
                                scale: 1.3,
                                fill: new ol.style.Fill({
                                    color: color
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#000000',
                                    width: 3
                                }),
                                offsetX: 20,
                                offsetY: 0,
                                rotation: 0
                            })
                        }));

                    this.pointFeatureVectorSource.addFeature(this.pointInMap);
                }
                if (action === "clear") {
                    this.pointFeatureVectorSource.clear();
                }
                if (action === "remove") {
                    this.pointFeatureVectorSource.removeFeature(pointInMap);
                }
            }
        };
        return service;
    }
})();
