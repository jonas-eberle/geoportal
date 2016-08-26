'use strict';

var fill = new ol.style.Fill({
   color: 'rgba(12, 216, 247, 1)'
 });
 var stroke = new ol.style.Stroke({
   color: 'rgba(0, 0, 204, 1)',
   width: 1.25
 });

var popup;
var stationPopup;

angular.module('webgisApp')
    .service('mapviewer', function mapviewer(djangoRequests, $rootScope, $modal) {
        var service = {
            'baseLayers': [],
            'baseLayerGroup': null,     // hold the leaflet LayerGroup object we will use for baselayers
            'layers': {},
            'layersTime': [],
            'layersMeta': [],
            'datacatalog': [],

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

            /* functions */
            'createMap': function(id) {
                this.baseLayerGroup = new L.LayerGroup();

                this.map = new L.Map(id,
                    {
                        layers: [ this.baseLayerGroup ],
                        center: this.center,
                        zoom: this.zoom_init,
                        minZoom: this.zoom_min,
                        maxZoom: this.zoom_max,
                        zoomControl: false,
                        renderer: L.canvas({padding: 0.75}),
                        // renderer: L.svg({padding: 0.75}),
                        fadeAnimation: false,
                        zoomAnimation: false,
                        worldCopyJump: true
                    }
                ).addControl(
                    L.control.coordinates({
                        position: "bottomleft",
                        customLabelFcn: function(latLonObj) {
                            return L.NumberFormatter.round(latLonObj.lng, 4, ".") + ", "
                                 + L.NumberFormatter.round(latLonObj.lat, 4, ".")
                        }
                    })
                );
                return this.map;
            },
            /**
             * Adds the desired baselayer to the map and corrects the appearance of leaflet's attribution control.
             * @param index     array index relative to the mapviewer's baselayer array
             */
            'setBaseLayer': function(index) {
                if (index != this.currentBaseLayerIndex) {
                    // remove the current baselayer (if it is associated with the map)
                    if ((this.currentBaseLayerIndex !== -1) || this.baseLayerGroup.hasLayer(this.baseLayers[this.currentBaseLayerIndex])) {
                        this.baseLayerGroup.removeLayer(this.baseLayers[this.currentBaseLayerIndex]);
                    } else {
                        console.log("nothing to do, baselayer is not associated with the map");
                    }

                    // update the current baselayer index and add the new baselayer to the map
                    this.currentBaseLayerIndex = index;
                    var newBaseLayer = this.baseLayers[this.currentBaseLayerIndex];
                    this.baseLayerGroup.addLayer(newBaseLayer);

                    // hide/show leaflet's attribution field depending on the chosen baselayer (Google has its own
                    // attribution line)
                    var $leafletAttribution = $(".leaflet-bottom.leaflet-right");
                    switch (newBaseLayer.layerObj.ogc_type) {
                        case "GoogleMaps":
                            $leafletAttribution.hide();
                            break;
                        case "OSM":
                        case "BingMaps":
                            $leafletAttribution.show();
                            break;
                    }
                }
            },
            'getLayerById': function(id) {
                return this.layers[id];
            },
            /**
             * Creates Leaflet layers from layer data provided.
             * @param layerData
             * @returns L.ILayer|null
             */
            "createLayer": function(layerData) {
                //var _this = this;
                var layer = null;
                switch(layerData.ogc_type) {
                    case 'WMS':
                        console.log("WMS");
                        // var source = new L.WMS.Source(layerData.ogc_link,{
                        //     transparent: true,
                        //     untiled: false,
                        //     format: "image/png",
                        //     version: "1.3.0"
                        // });
                        //
                        // TODO: maybe strsplit ogc_layer on ,
                        layer = L.tileLayer.wms(layerData.ogc_link, {
                            layers: layerData.ogc_layer,
                            version: "1.3.0",
                            format: "image/png",
                            transparent: true
                        });
                        break;
                    case 'TMS':
                        console.log("TMS");
                        layer = L.tileLayer(layerData.ogc_link, {
                            tms: true,
                            errorTileUrl: '../../static/img/errorTile.png'
                        });
                        break;
                    case 'WMTS':
                        console.log("WMTS");
                        // if (typeof(layer.capabilities) == 'object') {
                        //     // does not work with NASA WMTS!
                        //     var options = ol.source.WMTS.optionsFromCapabilities(layer.capabilities, {layer: layer.ogc_layer, matrixSet: layer.wmts_matrixset});
                        //     olLayer = new ol.layer.Tile({
                        //         source: new ol.source.WMTS(options)
                        //     });
                        // } else {
                        //     if (parseInt(layer.epsg) > 0) layer.epsg = 'EPSG:'+layer.epsg;
                        //     var resolutions = [];
                        //     var proj = ol.proj.get(layer.wmts_projection);
                        //     var multiply = 1;
                        //     if (layer.multiply) {
                        //         var metersperUnit = proj.getMetersPerUnit();
                        //         multiply = 0.28E-3 / metersperUnit;
                        //     }
                        //     $.each(layer.wmts_resolutions.split(' '), function(){
                        //         resolutions.push(parseFloat(this)* multiply)
                        //     })
                        //     var matrixIds = [];
                        //     for (var i=0; i<resolutions.length; i++) { matrixIds.push(i); }
                        //     olLayer = new ol.layer.Tile({
                        //         name: layer.title,
                        //         layerObj: layer,
                        //         source: new ol.source.WMTS({
                        //             layer: layer.ogc_layer,
                        //             url:layer.ogc_link,
                        //             format: layer.ogc_imageformat,
                        //             matrixSet:layer.wmts_matrixset,
                        //             projection: proj,
                        //             tileGrid: new ol.tilegrid.WMTS({
                        //                 origin: ol.extent.getTopLeft(proj.getExtent()),
                        //                 resolutions: resolutions,
                        //                 matrixIds: matrixIds,
                        //                 tileSize: layer.wmts_tilesize
                        //             })
                        //         })
                        //     });
                        // }
                        break;
                    case 'BingMaps':
                        console.log("BingMaps");
                        // olLayer = new ol.layer.Tile({
                        //     name: layer.title,
                        //     layerObj: layer,
                        //     source: new ol.source.BingMaps({
                        //       key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
                        //       imagerySet: layer.ogc_layer,
                        //       maxZoom: 19
                        //     })
                        // })

                        layer = L.bingLayer('Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
                            {
                                type: layerData.ogc_layer
                            }
                        );
                        break;
                    case 'GoogleMaps':
                        console.log("GoogleMaps");
                        layer = L.google(layerData.ogc_layer,
                            {
                                mapOptions: {
                                    disableDefaultUI: true,
                                    keyboardShortcuts: false,
                                    draggable: false,
                                    disableDoubleClickZoom: true,
                                    scrollwheel: false,
                                    streetViewControl: false
                                }
                            }
                        );
                        break;
                    case 'OSM':
                        console.log("OSM");
                        // var osmSource;
                        // if (layer.ogc_link != '') {
                        //     osmSource = new ol.source.OSM({url: layer.ogc_link});
                        // } else {
                        //     osmSource = new ol.source.OSM();
                        // }
                        // olLayer = new ol.layer.Tile({
                        //     name: layer.title,
                        //     layerObj: layer,
                        //     source: osmSource
                        // })
                        var url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                        if (layerData.ogc_link != '') {
                            url = layerData.ogc_link;
                        }
                        layer = L.tileLayer(url, {
                            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
                        });
                        break;
                    case 'WFS':
                        console.log("WFS");
                        // var vectorSource = new ol.source.ServerVector({
                        //     format: new ol.format.GeoJSON(),
                        //     loader: function(extent, resolution, projection) {
                        //         var url = layer.ogc_link+'?service=WFS&version=1.1.0&request=GetFeature' +
                        //             '&typename=' + layer.ogc_layer +
                        //             '&outputFormat=json' +
                        //             '&srsname='+_this.displayProjection+'&bbox=' + extent.join(',') + ','+_this.displayProjection;
                        //         url = '/layers/data?url='+encodeURIComponent(url);
                        //         $('#loading-div').show();
                        //         djangoRequests.request({
                        //             url: url,
                        //             method: 'GET'
                        //         }).then(function(data){
                        //             vectorSource.addFeatures(vectorSource.readFeatures(data));
                        //             $('#loading-div').hide();
                        //         })
                        //     },
                        //     projection: _this.displayProjection
                        // });
                        // olLayer = new ol.layer.Vector({
                        //     name: layer.title,
                        //     layerObj: layer,
                        //     source: vectorSource
                        // })
                        break;
                    case 'Tiled-WFS':
                        console.log("Tiled-WFS");
                        // var vectorSource = new ol.source.ServerVector({
                        //     format: new ol.format.GeoJSON(),
                        //     loader: function(extent, resolution, projection) {
                        //         var url = layer.ogc_link+'?service=WFS&version=1.1.0&request=GetFeature' +
                        //             '&typename=' + layer.ogc_layer +
                        //             '&outputFormat=json' +
                        //             '&srsname='+_this.displayProjection+'&bbox=' + extent.join(',') + ','+_this.displayProjection;
                        //         url = '/layers/data?url='+encodeURIComponent(url);
                        //         $('#loading-div').show();
                        //         djangoRequests.request({
                        //             url: url,
                        //             method: 'GET'
                        //         }).then(function(data){
                        //             vectorSource.addFeatures(vectorSource.readFeatures(data));
                        //             $('#loading-div').hide();
                        //         })
                        //     },
                        //     strategy: ol.loadingstrategy.createTile(
                        //         new ol.tilegrid.XYZ({maxZoom: 19})
                        //     ),
                        //     projection: _this.displayProjection
                        // });
                        // olLayer = new ol.layer.Vector({
                        //     name: layer.title,
                        //     layerObj: layer,
                        //     source: vectorSource
                        // })
                        break;
                    case 'GeoJSON':
                        console.log("GeoJSON");
                        $('#loading-div').show();
                        layer = L.geoJson();
                        djangoRequests.request({
                            url   : layerData.ogc_link,
                            method: 'GET'
                        }).then(function(data){
                            layer.addData(data);
                            $('#loading-div').hide();
                        });
                        break;
                    case 'XYZ':
                        console.log("XYZ");
                        layer = L.tileLayer(layerData.ogc_link);

                        // olLayer = new ol.layer.Tile({
                        //     name: layer.title,
                        //     layerObj: layer,
                        //     source: new ol.source.XYZ({
                        //         url: layer.ogc_link
                        //     })
                        // });
                        break;
                    case 'SOS':
                        console.log("SOS");
                        // var layerID = layer.id;
                        // if (typeof(layer.django_id) == 'number') {
                        //     layerID = layer.django_id;
                        // }
                        // var url = '/layers/sos/'+layerID+'/stations?format=json';
                        // var vectorSource = new ol.source.ServerVector({
                        //     format: new ol.format.GeoJSON(),
                        //     loader: function(extent, resolution, projection) {
                        //         $('#loading-div').show();
                        //         djangoRequests.request({
                        //             url: url,
                        //             method: 'GET'
                        //         }).then(function(data){
                        //             var features = vectorSource.readFeatures(data);
                        //             $.each(features, function(){
                        //                 this.getGeometry().transform('EPSG:4326', _this.displayProjection);
                        //             })
                        //             vectorSource.addFeatures(features);
                        //             $('#loading-div').hide();
                        //         })
                        //     },
                        //     projection: 'EPSG:4326'
                        // });
                        // olLayer = new ol.layer.Vector({
                        //     name: layer.title,
                        //     layerObj: layer,
                        //     source: new ol.source.Cluster({
                        //         distance: 20,
                        //         source: vectorSource
                        //     }),
                        //     style: function(feat, res) {
                        //         var size = feat.get('features').length;
                        //         var text = null;
                        //         if (size > 1) {
                        //             text = new ol.style.Text({
                        //                 text: size.toString(),
                        //                 fill: new ol.style.Fill({color:'#fff'}),
                        //                 stroke: new ol.style.Stroke({color: 'rgba(0, 0, 0, 0.6)',width:3})
                        //             })
                        //         }
                        //         return [new ol.style.Style({
                        //             image: new ol.style.Circle({
                        //                 fill: fill,
                        //                 stroke: stroke,
                        //                 radius: 8
                        //             }),
                        //             text: text,
                        //             fill: fill,
                        //             stroke: stroke
                        //         })]
                        //     }
                        // })
                        break;
                }

                if (layer) {
                    L.extend(layer, {
                        layerObj: layerData,
                        name: layerData.title
                    });
                }
                return layer;
            },
            /**
             * Creates a layer from the supplied layerData and adds it to the map.
             * @param layerData
             * @returns L.ILayer | null
             */
            'addLayer': function(layerData) {
                for (var i=0; i<this.layersMeta.length; i++) {
                    if (layerData.title == this.layersMeta[i].name) {
                        bootbox.alert('Layer exists already in the map. Please see the "Current" tab.');
                        return null;
                    }
                }

                layerData = angular.copy(layerData);
                var llLayer = this.createLayer(layerData);
                if (llLayer === null) {
                    alert('Layer could not be added, type '+layerData.type+' is not implemented!');
                    return null;
                }
                if (typeof(layerData.django_id) == 'undefined') {
                    layerData.django_id = layerData.id;
                }
                layerData.name = layerData.title;
                layerData.id = Math.random().toString(36).substring(2, 15);
                this.layers[layerData.id] = llLayer;
                if (layerData.ogc_time == true) {
                    this.layersTime.push(layerData.id);
                    $('#slider .tooltip.bottom').css('margin-top', '20px');
                    $('.ol-attribution, .ol-scale-line').css('bottom', '70px');
                    $('.ol-mouse-position').css('bottom', '100px');
                    $("#gmap img[src*='google_white']").parent().parent().parent().css('bottom', '60px');
                    $('#gmap .gm-style-cc, #gmap .gmnoprint').css('bottom', '60px');
                    $('#slider').show();
                }
                this.data.layersCount++;
                llLayer.layerObj = layerData;
                llLayer.options.pane = "overlayPane";
                this.layersMeta.unshift(llLayer);
                this.restackLayers();
                this.map.addLayer(llLayer);
                return llLayer;
            },
            /**
             * Removes the layer from the map.
             * @param layer     Leaflet Layer Object
             * @param index     index of the layer in layersMeta
             */
            'removeLayer': function(layer, index) {
                this.map.removeLayer(layer);
                this.layersMeta.splice(index, 1);
                this.restackLayers();
                this.data.layersCount--;

                var timeIndex = jQuery.inArray(layer.layerObj.id, this.layersTime);
                if (timeIndex > -1) {
                    this.layersTime.splice(timeIndex, 1);
                    $('#slider').hide();
                    $('#slider .tooltip.bottom').css('margin-top', '3px');
                    $('.ol-attribution, .ol-scale-line').css('bottom', '5px');
                    $('.ol-mouse-position').css('bottom', '33px');
                    $("#gmap img[src*='google_white']").parent().parent().parent().css('bottom', '0px');
                    $('#gmap .gm-style-cc, #gmap .gmnoprint').css('bottom', '0px');
                }
            },
            'restackLayers': function() {
                var layersCount = this.data.layersCount;
                this.layersMeta.forEach(function(layer, index) {
                    layer.setZIndex(450 + layersCount - index);
                });
            },
            'raiseLayer': function(id, delta) {
                var layer = this.layers[id];
                var layerIndex = $.inArray(layer, this.map.getLayers().getArray());
                var layers = this.map.getLayers();

                layers.insertAt(layerIndex+delta, layer);
                if (delta < 0) layerIndex = layerIndex+1;
                layers.removeAt(layerIndex);
            },
            'changeWMSTime': function(time) {
                var _this = this;
                $.each(this.layersTime, function() {
                    var layer = _this.layers[this];
                    var source = layer.getSource();
                    source.updateParams({'TIME':time});
                });
            },
            /**
             * Prepares the parameters of a GetFeatureInfo request and adds them to the provided geoserver url.
             * @param url {string}          the url of the geoserver to query
             * @param clickedPoint L.Point  coordinates relative to the map's viewport
             * @param wmsParams Object      parameters of the WMS layer at clickedPoint
             * @returns {string}
             */
            'generateGetFeatureInfoUrl': function(url, clickedPoint, wmsParams) {
                var size   = this.map.getSize();
                var crs    = this.map.options.crs;
                var bounds = this.map.getBounds();
                var nw     = crs.project(bounds.getNorthWest());
                var se     = crs.project(bounds.getSouthEast());
                var bbox   = (
                    crs === L.CRS.EPSG4326 ? [se.y, nw.x, nw.y, se.x] : [nw.x, se.y, se.x, nw.y]
                ).join(',');

                var params = {
                    service: "WMS",
                    version: wmsParams.version,
                    request: "GetFeatureInfo",
                    format: wmsParams.format,
                    transparent: wmsParams.transparent,
                    query_layers: wmsParams.layers,
                    layers: wmsParams.layers,
                    info_format: 'text/html',
                    // tell geoserver that the map's viewport is one tile...
                    width: size.x,
                    height: size.y,
                    // ...so we can use pixel coordinates relative to the map
                    i: clickedPoint.x,
                    j: clickedPoint.y,
                    crs: crs.code,
                    styles: wmsParams.styles,
                    bbox: bbox
                };

                return url + L.Util.getParamString(params, url, true);
            },
            'initialize': function(id, mapElement, baseLayer) {
                var mapviewer = this;
                djangoRequests.request({
                    'method': "GET",
                    'url': '/mapviewer/detail/'+id+'.json'
                }).then(function(data){
                    console.log(data);
                    var $center = $("#center");
                    var $nav = $("#nav-top-right2");

                    if (data.error != '') {
                        $center.hide();
                        $nav.hide();
                        bootbox.alert('<h2>Authentication error</h2>'+data.error, function(){$('.login').click()});
                        return
                    }

                    $center.show();
                    $nav.show();
                    
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
                    mapviewer.center = [data.center_lat, data.center_lon];
                    mapviewer.datacatalog = data.layergroups;
                    if (data.layerauth == true) {
                        bootbox.alert('Please log in to see further layers!');
                    }
                    if (baseLayer == true) {
                        mapviewer.baseLayers = [];
                        jQuery.each(data.baselayers, function(){
                            var olLayer = mapviewer.createLayer(this);
                            if (olLayer !== null) {
                                mapviewer.baseLayers.push(olLayer);
                            }
                        });
                    }
                    $rootScope.$broadcast('mapviewer.catalog_loaded', mapviewer.datacatalog);

                    if (mapviewer.map != null) {
                        mapviewer.map.remove();
                    }
                    mapviewer.createMap(mapElement);
                    mapviewer.setBaseLayer(0);
                    $rootScope.$broadcast('mapviewer.map_created', {});
                    // $rootScope.$broadcast("mapviewer.baselayers_loaded", {});
                    $rootScope.$broadcast('djangoAuth.registration_enabled', data.auth_registration);
                    $('#loading-div').hide();

                    // TODO: === true or just any truthy value?
                    if (data.time_slider == true) {
                        var times = data.time_slider_dates.split(','),
                            noLabels = parseInt($("#slider").width()/80),
                            eachLabels = Math.round(times.length/noLabels);

                        if (eachLabels == 0) { eachLabels = 1; }

                        var ticks = [], labels = [], i = 0, j=0;
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

                        $("#slider .input").slider({
                            tooltip: 'always',
                            handle: 'round',
                            ticks: ticks,
                            ticks_labels: labels,
                            value: times.length-1,
                            selection: 'none', formatter: function (value) {
                                return times[value];
                            }
                        }).on('slideStop', function (e) {
                            mapviewer.changeWMSTime(times[e.value]);
                        });
                        $('#slider .slider .tooltip-main').removeClass('top').addClass('bottom');
                        $('#slider').hide();
                    }
                    $rootScope.$broadcast("mapviewer.baselayers_loaded", {});
                });
            }
        };
        return service;
    })
    .controller('MapViewerCtrl', function($scope, mapviewer, djangoRequests, $modal, $rootScope){
        $scope.$on('mapviewer.map_created', function ($broadCast, data) {
            console.log("mapviewer.map_created");
            /*popup = new ol.Overlay({element: document.getElementById('popup')});
            mapviewer.map.addOverlay(popup);
            stationPopup = new ol.Overlay({element: document.getElementById('stationPopup'),offset: [0, -5]});
            mapviewer.map.addOverlay(stationPopup);

            var element = popup.getElement();

            */

            mapviewer.map.on("mousemove", function(e){
                //console.log(e);
               // var matches = mapviewer.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) { //Feature callback
               //     if (layer == null || layer.get('layerObj') == null) return false;
               //     if (layer.get('layerObj').ogc_type == 'SOS') {
               //         var feats = feature.get('features');
               //         var content = '<ul style="margin: 0;padding:0;list-style-type: none;">';
               //         $.each(feats, function () {
               //             content += '<li style="white-space: nowrap">' + this.get('description') + '</li>';
               //         })
               //         content += '</ul>';
               //
               //         var title = '';
               //         if (feats.length > 1) {
               //             title = '<strong>'+feats.length+' stations</strong>';
               //         }
               //
               //         popup.setPosition(e.coordinate);
               //         //$(element).popover('destroy');
               //         $(element).popover({
               //             'placement': 'top',
               //             'animation': false,
               //             'html': true,
               //             'title': title,
               //             'content': content
               //         });
               //         $(element).popover('show');
               //         //$('.popover-title', $('#'+element.getAttribute('aria-describedby'))).append('<button id="popovercloseid" type="button" onclick="$(\'#popup\').popover(\'destroy\');" class="close">&times;</button>');
               //     }
               //     return true;
               //
               // });
               // if (typeof(matches) == 'undefined') {
               //     $(element).popover('destroy');
               //     //mapviewer.selectInteraction.getFeatures().clear();
               // }
            });


            mapviewer.map.on("click", function(e) {
                //mapviewer.selectPointerMove.getFeatures().clear();
                // var matches = mapviewer.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) { //Feature callback
                //     if (layer == null) return false;
                    //
                    // if (layer.get('name') == 'Wetlands' && feature != null) {
                    //     console.log('Selected wetland: '+feature.get('id'));
                    //     $rootScope.$broadcast('mapviewer.wetland_selected', feature.get('id'));
                    //     return true;
                    // }
                    //
                    // if (layer.get('layerObj') == null) return false;
                    // switch(layer.get('layerObj').ogc_type) {
                //         case 'SOS':
                //             if (feature.get('features').length > 1) {
                //                 var options = '';
                //                 $.each(feature.get('features'), function(index, feat){
                //                    options += '<option value="'+index+'">'+feat.get('description')+'</option>';
                //                 });
                //                 bootbox.dialog({
                //                     title: 'Please select a station',
                //                     message: '<select id="select_station" name="select_station">'+options+'</select>',
                //                     buttons: {
                //                         success: {
                //                             label: 'Show chart',
                //                             callback: function () {
                //                                 var station = $('#select_station').val();
                //                                 var feat = feature.get('features')[station];
                //                                 var modalInstance = $modal.open({
                //                                     controller: 'ClimateChartCtrl',
                //                                     templateUrl: subdir+'/static/includes/climatechart.html',
                //                                     backdrop: 'static',
                //                                     resolve: {
                //                                         layer: function() {return layer.get('layerObj');},
                //                                         feature: function() { return feat; },
                //                                         title: function() {return feat.get('description');}
                //                                     }
                //                                 });
                //
                //                             }
                //                         }
                //                     }
                //                 });
                //             } else {
                //                 var feature = feature.get('features')[0];
                //                 var modalInstance = $modal.open({
                //                     controller: 'ClimateChartCtrl',
                //                     templateUrl: subdir+'/static/includes/climatechart.html',
                //                     backdrop: 'static',
                //                     resolve: {
                //                         layer: function() {return layer.get('layerObj');},
                //                         feature: function() { return feature; },
                //                         title: function() {return feature.get('description');}
                //                     }
                //                 });
                //             }
                //             break;
                //         default:
                //             var output = '<h2>Properties</h2><ul>';
                //             $.each(feature.getKeys(), function(){
                //                 if (this != 'geometry') {
                //                     output += '<li><strong>' + this + ': </strong>' + feature.get(this) + '</li>';
                //                 }
                //             })
                //             output += '</ul>'
                //             bootbox.dialog({title:'Feature info', message: output, backdrop: false});
                //             break;
                //     }
                //     //feature is the selected feature
                //     //layer is the layer it belongs to
                //     //
                //     //handle the your selected feature here
                //     //
                //     //Return a truthy value to stop processing, otherwise forEachFeatureAtPixel will continue with the next matching feature
                //     //and this callback will be invoked again for that feature
                //     return true;
                // }, mapviewer, function(layer) { //Layer filter callback
                //     //Return true if features in the passed in layer should be considered for selection
                //     return true;
                // }, mapviewer);
            });
        });

        $scope.$on('djangoAuth.logged_in', function ($broadCast, data) {
            mapviewer.initialize(mapId, 'map', false);
        });

        $scope.stopPropagation = function($event) {
            $event.stopPropagation();
        };

        $scope.zoomIn = function() {
            mapviewer.map.zoomIn();
        };

        $scope.zoomOut = function() {
            mapviewer.map.zoomOut();
        };

        $scope.zoomMaxExtent = function() {
            mapviewer.map.fitBounds([[64, 60],[14, -10]]);
        };
        
        $scope.changeSitesVisibility = function(id, $event) {
            console.log("Changing visibility of "+id);
            if ($event.target.checked) {
                mapviewer.map.addLayer(mapviewer.layers[id]);
            } else {
                mapviewer.map.eachLayer(function(layer) {
                    if (layer.name == id) {
                        mapviewer.map.removeLayer(layer);
                    }
                });
            }
        };

        $scope.infoStatus = false;
        $scope.infoEventKey = {};
        $scope.requestInfo = function($event) {
            if (!$scope.infoStatus) {
                mapviewer.map.addEventListener('click', function(event) {
                    var clickedLatLng = event.latlng;
                    var lngArrow = (clickedLatLng.lng < 0 ? 'West' : 'East');
                    var latArrow = (clickedLatLng.lat < 0 ? 'South' : 'North');

                    var coordinate = '<p><strong>Position</strong><br />'
                        + L.NumberFormatter.round(Math.abs(clickedLatLng.lng), 2, ".")
                        + '&deg; ' + lngArrow + '&nbsp;&nbsp;&nbsp;'
                        + L.NumberFormatter.round(Math.abs(clickedLatLng.lat), 2, ".") + '&deg; ' + latArrow + '</p>';

                    // retrieve a list of all currently visible layers (hasLayer) of type WMS (ogc_type == "WMS")
                    var visibleWMSLayers = mapviewer.layersMeta.filter(function(layer) {
                        return mapviewer.map.hasLayer(layer) && (layer.layerObj.ogc_type == "WMS");
                    });

                    var urls = [], names = [];
                    $.each(visibleWMSLayers, function(index, layer){
                        urls.push(encodeURIComponent(
                            mapviewer.generateGetFeatureInfoUrl(
                                layer.layerObj.ogc_link, event.containerPoint, layer.wmsParams
                            )
                        ));
                        names.push(encodeURIComponent(layer.name));
                    });

                    if (urls.length > 0) {
                        $('#loading-div').show();
                        djangoRequests.request({
                            url: '/layers/info?url='+urls.join('||')+'&names='+names.join('||'),
                            method: 'GET'
                        }).then(function(data) {
                            var dialog = bootbox.dialog({title: 'Feature Info Response', message: coordinate+data, backdrop: false});
                            dialog.removeClass('modal').addClass('mymodal').drags({handle:'.modal-header'});
                            var width = $(document).width()/2-300;
                            if (width < 0) {width='2%';}
                            $('.modal-content', dialog).css('left', width);
                            $('#loading-div').hide();
                        }, function(err){
                            $('#loading-div').hide();
                            bootbox.alert('An error occurred while loading data: '+err.error);
                        });

                    }
                });
            } else {
                mapviewer.map.removeEventListener('click');
            }
            $scope.infoStatus = !$scope.infoStatus;
        }
    })
    .controller('MapSettingsCtrl', function($scope, mapviewer, djangoRequests, $modal){
        $scope.baseLayers = [];

        $scope.$on("mapviewer.baselayers_loaded", function () {
            if (!mapviewer.mapSettingsLoaded) {
                console.log("initializing baselayer selector");
                $.each(mapviewer.baseLayers, function(){
                   if (this['name'] != '') {
                       $scope.baseLayers.push(this['name']);
                   }
                   $scope.selectedBaseLayer = $scope.baseLayers[mapviewer.currentBaseLayerIndex];
                });
                mapviewer.mapSettingsLoaded = true;
            } else {
                console.log("map setting already loaded");
            }
        });

        $scope.changeBaseLayer = function() {
            var index = $.inArray($scope.selectedBaseLayer, $scope.baseLayers);
            mapviewer.setBaseLayer(index);
        };
        
        $scope.showMetadata = function() {
            var layer = mapviewer.baseLayers[mapviewer.currentBaseLayerIndex];
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url': '/layers/detail/'+layer.layerObj.id+'.json'
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
        $scope.layerTree = mapviewer.datacatalog;
        console.log($scope.layerTree);
        $scope.$on('mapviewer.catalog_loaded', function () {
            console.log("mapviewer.catalog_loaded, MapCatalogCtrl");
            $scope.layerTree = mapviewer.datacatalog;
            console.log($scope.layerTree);
        });

        $scope.addLayerToMap = function(layer) {
            mapviewer.addLayer(layer);
        };

        $scope.showMetadata = function(layer) {
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url': '/layers/detail/'+layer.id+'.json'
            }).then(function(data){
                var modalInstance = $modal.open({
                    controller: 'ModalInstanceCtrl',
                    templateUrl: subdir+'/static/includes/metadata.html',
                    resolve: {
                        data: function() {return data;},
                        title: function() {return data.title;}
                    }
                });
                $('#loading-div').hide();
            }, function(error) {
                bootbox.alert('<h1>No Metadata information available!</h1>');
            })
        };

        $scope.activeLayer = -1;
        $scope.hoverLayer = function(elem, layerID, $event) {
            if ($scope.activeLayer == layerID && $('body .popover').length > 0) {
                return false;
            }
            $scope.activeLayer = layerID;
            $($event.target).popover('show');
            $('body .popover').on('mouseleave', function(){
                var _this = this;
                setTimeout(function () {
                    if (!$($event.target).parent().is(':hover')) {
                        $(_this).popover('hide');
                    }
                }, 300)
            })
        };

        $scope.hidePopover = function() {
            setTimeout(function () {
                if (!$(".popover:hover").length) {
                   $('body .popover').popover('hide');
                }
            }, 300);
        };

        $scope.download = function(layer) {
            window.open(subdir+'/layers/detail/'+layer.id+'/download', 'download_'+layer.id);
        }
    })
    .controller('MapCurrentLayersCtrl', function($scope, mapviewer, $modal, djangoRequests) {
        $scope.layersMeta = mapviewer.layersMeta;
        $scope.slider = [];
        $scope.newLayerIndex = -1;
        $scope.mapviewerdata = mapviewer.data;
        $scope.prepareIndex = function(event, index, item) {
            $scope.newLayerIndex = index;
            return item;
        };
        $scope.toggleLegend = function(layer) {
            // boolean negation of showLegend
            layer.showLegend = !layer.showLegend;
        };
        $scope.toggleStations = function(layer) {
            //load stations if no one available
            if (typeof(layer.stations) == 'undefined') {
                layer.stations = []
                var olLayer = mapviewer.getLayerById(layer.id);
                var features = olLayer.getSource().getSource().getFeatures();
                $.each(features, function(){
                   var coords = this.getGeometry().clone().transform(mapviewer.displayProjection, 'EPSG:4326').getCoordinates();
                   layer.stations.push({name: this.get('name'), lat: coords[0], lon: coords[1], feature: this})
                });
                //console.log(features);
            }
            if (layer.showStations == true) {
                layer.showStations = false;
            } else {
                layer.showStations = true;
            }
        };
        $scope.zoomToStation = function(station) {
            var extent = [station.lat, station.lon, station.lat, station.lon];
            extent = ol.proj.transformExtent(extent, 'EPSG:4326', mapviewer.map.getView().getProjection().getCode());
            mapviewer.map.getView().fitExtent(extent, mapviewer.map.getSize());
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
            // HACK: actually we overwrite the layerObj with the leaflet layer object here
            $scope.layersMeta[$scope.newLayerIndex] = $scope.layersMeta[index];
            $scope.layersMeta.splice(index, 1);
            mapviewer.restackLayers();
        };
        $scope.changeVisibility = function(layer, $event) {
            if ($event.target.checked) {
                mapviewer.map.addLayer(layer);
            } else {
                mapviewer.map.removeLayer(layer);
            }
        };
        $scope.changeOpacity = function(id) {
            var olLayer = mapviewer.getLayerById(id);
            olLayer.setOpacity(parseFloat($scope.slider[id])/100);
        };
        $scope.removeLayer = function(layer, index) {
            mapviewer.removeLayer(layer, index);
            var checkbox;
            if (layer.layerObj["django_id"] !== undefined
                && (checkbox = document.getElementById("layer_vis_"+layer.layerObj.django_id))) {
                checkbox.checked = "";
            }
        };
        /**
         * Pans and zooms the map so that layer is in the center of the map.
         * @param layerObj     layer data (without the surrounding Leaflet Layer data)
         */
        $scope.zoomToLayer = function(layerObj) {
            var bounds = L.latLngBounds([
                [layerObj.south, layerObj.west],
                [layerObj.north, layerObj.east]
            ]);
            mapviewer.map.fitBounds(bounds);
        };
        $scope.showMetadata = function(layer) {
            if (parseInt(layer.django_id) > 0) {
                $('#loading-div').show();
                djangoRequests.request({
                    'method': "GET",
                    'url': '/layers/detail/' + layer.django_id + '.json'
                }).then(function (data) {
                    var modalInstance = $modal.open({
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
                }, function (error) {
                    bootbox.alert('<h1>No Metadata information available!</h1>');
                    $('#loading-div').hide();
                })
            } else {
                var modalInstance = $modal.open({
                    controller: 'ModalInstanceCtrl',
                    templateUrl: subdir+'/static/includes/metadata.html',
                    resolve: {
                        data: function() {return layer;},
                        title: function() {return layer.title;}
                    }
                });
            }

        };

        $scope.updateLayer = function(id, date) {
            var olLayer = mapviewer.getLayerById(id);
            var source = olLayer.getSource();
            var type = olLayer.get('layerObj').ogc_type;
            if (type == 'WMS') {
                source.updateParams({'TIME': date});
            } else if (type == 'WMTS') {
                source.updateDimensions({'time':date});
            }
        };

        $scope.download = function(layer) {
            window.open(subdir+'/layers/detail/'+layer.django_id+'/download', 'download_'+layer.django_id);
        };

        $scope.addOwnLayer = function() {
            var modalInstance = $modal.open({
                controller: 'MapAddOwnLayer',
                templateUrl: subdir+'/static/includes/addownlayer.html',
                resolve: {
                    title: function() {return 'Add own layer to map';}
                }
            });
        }
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

            }, function(err) {
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
                }, function (err) {
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
        $scope.parameters = []

        $scope.labels = ['isodate',$scope.feature.get('name')];
        $scope.colors = ['black'];

        $scope.download = function() {
            var url = subdir+$scope.request_url+'&download=true';
            window.open(url, 'download_sos');
        }

        $scope.changeOptions = function() {
            var start = (typeof($scope.startDate) == 'object') ? $scope.startDate.toISOString() : $scope.startDate;
            var end = (typeof($scope.endDate) == 'object') ? $scope.endDate.toISOString() : $scope.endDate;
            var param = $scope.parameter.definition;

            $scope.request_url = '/layers/sos/data?id='+$scope.layer.django_id+'&procedure='+$scope.feature.get('procedure')+'&start='+start+'&end='+end+'&param='+param

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
    .directive('transparencySlider', function () {
      return {
        restrict: 'A',
        link: function(scope, element) {
          element.slider({})
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
