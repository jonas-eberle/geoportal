(function() {
    'use strict';

    angular
        .module('webgisApp.validation')
        .controller('ValidationCtrl', ValidationCtrl);

    ValidationCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'TrackingService', '$location', 'Attribution', 'lulcLegend'];
    function ValidationCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, TrackingService, $location, Attribution, lulcLegend) {
        var proceed = true;
        var validation = this;
        validation.tabs = {activeTab: -1};
        validation.loadValidationLayer = loadValidationLayer;
        
        validation.loaded = false;
        validation.data = [];
        
        // add segment highlight overlay
        validation.getFeatureRequestInfoURL = getFeatureRequestInfoURL; 
        validation.showValidationWindow = showValidationWindow;
        validation.dialog_pos = null;
        validation.segmentListType = '';
        validation.segments = {'features':[]};
        validation.showSegment = showSegment;
        validation.segmentsMaxFeatures = 5;
        
        $scope.$watch('validation.segmentListType', function() {
            if (validation.segmentListType == '') {
                return;
            }
            validation.loadSegments(0, 1);
        });
        
        validation.loadSegments = loadSegments; 
        function loadSegments(start, page) {
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url'   : '/validation/segments',
                'params': {'type':validation.segmentListType, 'layer': validation.layer.ogc_layer, 'start': start, 'max': validation.segmentsMaxFeatures}
            }).then(function (data) {
                validation.segments = data;
                validation.segmentsCurrentPage = page;
                validation.segmentsLastPage = Math.ceil(data.totalFeatures / validation.segmentsMaxFeatures);
                $('#loading-div').hide();
                if (data.features.length === 0) {
                    validation.segmentListType = '';
                    bootbox.alert('No features available.');
                }
            }, function () {
                $('#loading-div').hide();
                bootbox.alert('<h1>Error while loading segments</h1>');
            })
        }
        
        validation.segmentsPaging = segmentsPaging;
        function segmentsPaging(type) {
            var page = validation.segmentsCurrentPage;
            switch(type) {
                case 'prev':
                    page = validation.segmentsCurrentPage-1;
                    break;
                case 'next':
                    page = validation.segmentsCurrentPage+1;
                    break;
            }
            var start = (page-1) * validation.segmentsMaxFeatures;
            validation.loadSegments(start, page);
            
        }
        
        function showSegment(segment) {
            var response = angular.copy(validation.segments);
            response.features = [segment];
            response.totalFeatures = 1;
            validation.showValidationWindow(response, true);
        }
        
        validation.changeMapStyle = changeMapStyle;
        function changeMapStyle(event) {
            var source = validation.validation_layer_ol.getSource();
            $('#loading-div').show();
            if (event.target.checked) {
                source.updateDimensions({'style': 'segmentation_done', 'time': new Date().getTime()});
            } else {
                source.updateDimensions({'style': ''});
            }
        }
        
        validation.exportSegments = exportSegments;
        function exportSegments() {
            window.location.href = '/validation/segments/export?layer='+validation.layer.ogc_layer;
        }        
        
        validation.addLayerToMap = addLayerToMap;
        // we need a mapping between the django_id and the hash-like id of a layer to access it in mapviewer.layers
        validation.layerIdMap = {};
        validation.layers = mapviewer.layers;
        
        $scope.$on("mapviewer.alllayersremoved", function () {
            validation.layerIdMap = {};
            attributionList();
        });

        $scope.$on('mapviewer.catalog_loaded', function () {
            $('#loading-div').show();
            djangoRequests.request({
                'method': "GET",
                'url'   : '/validation/layers.json'
            }).then(function (data) {
                validation.data = data;
                validation.loaded = true;

                $('#loading-div').hide();
                /*
                bootbox.dialog({
                    title   : 'Welcome to the SWOS Validation Geoportal',
                    message : $('#welcome_text').html(),
                    backdrop: true,
                    onEscape: true,
                    buttons : {
                        close  : {label: 'Close'}
                    }
                });
                */
            }, function () {
                bootbox.alert('<h1>Error while loading validation layers</h1>');
            })
        });

        $scope.$on("mapviewer.layerremoved", function ($broadcast, id) {
            if (id !== undefined && id !== null) {
                validation.layerIdMap[id] = undefined;
                attributionList();
            }
        });

        //--------------------------------------------------------------------------------------------------------------
        
        function loadValidationLayer(site_id, layer) {
            // remove other layers
            mapviewer.removeAllLayers();
            validation.layerIdMap = {};
            
            // reset variables
            validation.segmentListType = '';
            validation.segments = {'features':[]};
            
            // open tab
            validation.layer = layer;
            validation.tabs.activeTab = 1;
            
            // TODO: add site boundaries to map using site_id
            
            // add validation layer to map
            validation.background_layer_ol = mapviewer.addLayer(layer.background_layer);
            var layerObjBG = validation.background_layer_ol.get("layerObj");
            validation.layerIdMap[layerObjBG.django_id] = layerObjBG.id;
            
            validation.validation_layer_ol = mapviewer.addLayer(layer);
            validation.validation_layer_ol.getSource().on('tileloadend', function(event) { 
                 $('#loading-div').hide();
            } );
            
            var layerObj = validation.validation_layer_ol.get("layerObj");
            validation.layerIdMap[layerObj.django_id] = layerObj.id;
            
            validation.parser = new ol.format.GeoJSON();
            validation.highlightOverlay = new ol.layer.Vector({
                  style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                      color: [255, 0, 0, 1.0],
                      width: 2,
                      lineCap: 'round'
                    })
                  }),
                  source: new ol.source.Vector(),
                  map: mapviewer.map
            });
            
            mapviewer.map.on('singleclick', function(evt) {
              var url = validation.getFeatureRequestInfoURL(evt, validation.validation_layer_ol);
              
              $('#loading-div').show();
              djangoRequests.request({
                'method': "GET",
                'url'   : url
              }).then(function (response) {                
                    validation.showValidationWindow(response, false);
              }, function () {
                    $('#loading-div').hide();
                    bootbox.alert('<h1>Error while loading feature info</h1>');
              });
            });
            
            var layerExtent = [layer.west, layer.south, layer.east, layer.north];
            if (layer.epsg > 0) {
                layerExtent = ol.proj.transformExtent(layerExtent, 'EPSG:' + layer.epsg, mapviewer.map.getView().getProjection().getCode());
            }
            mapviewer.map.getView().fit(layerExtent);
        }
        
        function showValidationWindow(response, zoomto) {
            var epsg = -1;
            var features = validation.parser.readFeatures(response);
            if (response.features.length === 0) {
                $('#loading-div').hide();
                bootbox.alert('No features found. Please select one in the map!');
                return true;
            }
            
            var feature = response.features[0];
            try {
                var crs = response.crs.properties.name;
                if (crs.includes('EPSG')) {
                    epsg = crs.split('::')[1]
                    if (ol.proj.get('EPSG:'+epsg) == null) {
                        $.get({
                            url: 'http://epsg.io/' + epsg + '.proj4',
                            crossDomain: true
                        }, function(resp) {
                            proj4.defs("EPSG:"+epsg, resp);
                            $.each(features, function () {
                                this.getGeometry().transform('EPSG:'+epsg, mapviewer.displayProjection);
                            });
                            validation.highlightOverlay.getSource().clear();
                            validation.highlightOverlay.getSource().addFeatures(features);
                            if (zoomto == true) {
                                var ext=features[0].getGeometry().getExtent();
                                mapviewer.map.getView().fit(ext, mapviewer.map.getSize());
                            }
                        })
                    } else {
                        $.each(features, function () {
                            this.getGeometry().transform('EPSG:'+epsg, mapviewer.displayProjection);
                        });
                        validation.highlightOverlay.getSource().clear();
                        validation.highlightOverlay.getSource().addFeatures(features);
                        if (zoomto == true) {
                            var ext=features[0].getGeometry().getExtent();
                            mapviewer.map.getView().fit(ext, mapviewer.map.getSize());
                        }
                    }
                }
            } catch(e) {
                console.log('ERROR for CRS request');
                console.log(e);
            }
            
            var output = '<table>';
            output += '<tr><td>Segment ID:</td><td>'+feature.properties.SEGMENT_ID+'</td></tr>';
            output += '<tr><td>ValID:</td><td>'+feature.properties.ValID+'</td></tr>';
            
            var legend;
            if (validation.layer.hasOwnProperty('legend')) {
                legend = lulcLegend[validation.layer.legend]
            }
            
            var select = '<select name="valcode" id="valcode">';
            select += '<option value="-1">== No class ==</option>\n';
            $.each(legend, function(key, value){
                if (parseInt(value[0]) === parseInt(feature.properties.ValCode)) {
                    select += '<option value="'+value[0]+'" selected="selected" style="color:'+value[2]+'">'+value[1]+'</option>\n';
                } else {
                    select += '<option value="'+value[0]+'" style="color:'+value[2]+'">'+value[1]+'</option>\n';
                }
            })
            select += '</select>';
            output += '<tr><td>ValCode:</td><td>'+select+'</td></tr>';
            
            output += '</table>';
            
            try {
                if (validation.dialog != null) {
                    validation.dialog_pos = $('.modal-content', validation.dialog).position();
                }
                validation.dialog.modal('hide');
            } catch(e) {}
            
            $('#loading-div').hide();
            
            var buttons = {
                savenext: {
                    label: "Save & Next",
                    className: 'btn-primary',
                    callback: function() {
                        // save
                        var params ={};
                        params['layer'] = validation.layer.ogc_layer;
                        params['feature_id'] = feature.id;
                        params['val_code'] = $('#valcode').val();
                        params['val_id'] = feature.properties.ValID;
                        
                        $('#loading-div').show();
                        djangoRequests.request({
                            'method': 'GET',
                            'url'   : '/validation/update',
                            'params': params
                        }).then(function(data){
                            validation.highlightOverlay.getSource().clear();
                            validation.validation_layer_ol.getSource().updateDimensions({'style': '', 'time': new Date().getTime()});
                            if (data.features.length === 0) {
                                validation.dialog_pos = $('.modal-content', validation.dialog).position();
                                validation.dialog.modal('hide');
                                $('#loading-div').hide();
                                bootbox.alert('You have finished all your validation segments! Thank you!');
                            } else {
                                // show feature and panel and zoom to feature
                                validation.showValidationWindow(data, true);
                            }
                        }, function (err) {
                            console.log('ERROR');
                            console.log(err);
                            $('#loading-div').hide();
                            bootbox.alert('<h1>Error while updating feature</h1>');
                        });
                        
                        return false;
                    }
                },
                save: {
                    label: "Save & Close",
                    className: 'btn-primary',
                    callback: function() {
                        // save
                        var params ={};
                        params['layer'] = validation.layer.ogc_layer;
                        params['feature_id'] = feature.id;
                        params['val_code'] = $('#valcode').val();
                        
                        $('#loading-div').show();
                        djangoRequests.request({
                            'method': 'GET',
                            'url'   : '/validation/update',
                            'params': params
                        }).then(function(data){
                            validation.highlightOverlay.getSource().clear();
                            validation.validation_layer_ol.getSource().updateDimensions({'style': '', 'time': new Date().getTime()});
                            $('#loading-div').hide();
                            validation.dialog_pos = $('.modal-content', validation.dialog).position();
                            validation.dialog.modal('hide');
                        }, function (err) {
                            console.log('ERROR');
                            console.log(err);
                            $('#loading-div').hide();
                            bootbox.alert('<h1>Error while updating feature</h1>');
                        });
                        
                        return false;
                    }
                },
                cancel: {
                    label: "Cancel",
                    className: 'btn-primary',
                    callback: function() {
                        validation.highlightOverlay.getSource().clear();
                        validation.dialog_pos = $('.modal-content', validation.dialog).position();
                        validation.dialog = null;
                    }
                }
            };
            
            if (feature.properties.ValID == null) {
                delete buttons['savenext'];
            }
            
            validation.dialog = bootbox.dialog({
                title: 'Segment ID: ' + feature.properties.SEGMENT_ID,
                message: output,
                backdrop: false,
                closeButton: false,
                buttons: buttons,
                callback: function (result) {
                    console.log('This was logged in the callback: ' + result);
                }
            });

            validation.dialog.removeClass('modal').addClass('mymodal').drags({handle: '.modal-header'});
            if (validation.dialog_pos == null) {
                var width = $(document).width() / 2 - 300;
                if (width < 0) {
                    width = '2%';
                }
                $('.modal-content', validation.dialog).css('left', width);
            } else {
                $('.modal-content', validation.dialog).css('left', validation.dialog_pos.left).css('top', validation.dialog_pos.top);
            }
        }
        
        function getFeatureRequestInfoURL(evt, layer) {
            var viewResolution = mapviewer.map.getView().getResolution();
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
                    SERVICE: 'WMTS',
                    REQUEST: 'GetFeatureInfo',
                    VERSION: source.getVersion(),
                    LAYER: source.getLayer(),
                    INFOFORMAT: 'application/json',
                    STYLE: source.getStyle(),
                    FORMAT: source.getFormat(),
                    TileCol: tileCol,
                    TileRow: tileRow,
                    TileMatrix: matrixIds,
                    TileMatrixSet: matrixSet,
                    I: tileI,
                    J: tileJ
                };
                console.log(params);
                url = layer.get('layerObj').ogc_link + '?' + jQuery.param(params);
            }
            return '/layers/data?url='+encodeURIComponent(url);
        }

        function addLayerToMap(layer, $event) {
            var checkbox = $event.target;

            //changeWetlandFeatureStyle(); // change Style (remove fill)

            if (checkbox.checked) {
                //trackAddLayer(layer);

                var layerObj = mapviewer.addLayer(layer).get("layerObj");
                // store the mapping between django_id and hash-like id
                validation.layerIdMap[layerObj.django_id] = layerObj.id;

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
    }
})();
