(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .controller('MapViewerCtrl', MapViewerCtrl);

    MapViewerCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$uibModal', '$rootScope', '$window', '$timeout', '$cookies', 'Attribution'];
    function MapViewerCtrl($scope, mapviewer, djangoRequests, $modal, $rootScope, $window, $timeout, $cookies, Attribution){
        var mv = this;

        mv.data = mapviewer.data;
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
            if ($cookies.get('hideCookieNote')) {
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

        $scope.$on('turn_off_request_info', function () {
            if (mv.infoStatus){
                requestInfo();
            }
        });

        //--------------------------------------------------------------------------------------------------------------

        function changeSitesVisibility($event) {
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
                var features = mapviewer.selectInteraction.getFeatures();
                if (features.getLength() > 0) {
                    mv.selectedFeature = features.pop();
                }
                mv.visibility_state_wetland_layer = false;
            }
        }

        function closeCookieNote() {
            $cookies.put('hideCookieNote', true);
            mv.hideCookieNote =  true;
        }

        function requestInfo() {

            if (mv.infoStatus === false) {
                 mv.infoStatus = true;

                //Add Feature Layer for points to map
                mapviewer.pointFeatureLayer("featureRequest", "add");
                var point_count = 0;

                mv.infoEventKey = mapviewer.map.on('singleclick', function (evt) {
                    var viewResolution = mapviewer.map.getView().getResolution();
                    var lonlat = ol.proj.transform(evt.coordinate, mapviewer.map.getView().getProjection(), 'EPSG:4326');

                    point_count++;
                    //Add point to map
                    mapviewer.pointFeature('featureRequest', "add", lonlat, "rgb(255, 127, 14)", '# ' + point_count, "bottom");

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
                    var coordinate = '<p><strong># ' + point_count + '</strong><br />' + lon + '&deg; ' + lon_arrow + '&nbsp;&nbsp;&nbsp;' + lat + '&deg; ' + lat_arrow + '</p>';

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
                            if (!angular.element('#feature_info').length) {
                                var dialog = bootbox.dialog({
                                    title: 'Feature Info Response',
                                    message: '<p id="feature_info"></p><div class="feature_result">' + coordinate + data + "</div>",
                                    backdrop: false,
                                    buttons: {
                                        "Clear": {
                                            label: "Clear results",
                                            className: "btn-default",
                                            callback: function () {
                                                 angular.element('.feature_result').remove();
                                                 mapviewer.pointFeature('featureRequest', 'clear');
                                                 point_count = 0;
                                                 return false;
                                            }
                                    },
                                    cancel: {
                                        label: "Close",
                                        className: "btn-primary",
                                        callback: function () {
                                            mapviewer.pointFeature('featureRequest','clear');
                                            mapviewer.pointFeatureLayer('featureRequest','remove');
                                        }
                                    }
                                }});
                                dialog.removeClass('modal').addClass('mymodal').drags({handle: '.modal-header'});
                                var width = $(document).width() / 2 - 300;
                                if (width < 0) {
                                    width = '2%';
                                }
                                $('.modal-content', dialog).css('left', width);
                            }
                            else {
                                $("<div class=\"feature_result\">" + coordinate + data + '<div class="divider_feature_info"></div></div><div>').insertAfter('#feature_info');
                            }
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
                //Remove Feature Layer for points to map
                mapviewer.pointFeatureLayer('featureRequest',"remove");
            }
            mapviewer.selectInteraction.setActive(!mv.infoStatus);
        }

        function zoomIn() {
            var currentZoomLevel = mapviewer.map.getView().getZoom();
            if (currentZoomLevel < mapviewer.zoom_max) {
                mapviewer.map.getView().setZoom(currentZoomLevel + 1);
            }
        }

        function zoomMaxExtent() {
            mapviewer.map.getView().fit(
                ol.proj.transformExtent(mapviewer.maxExtent, 'EPSG:4326', mapviewer.displayProjection)
            );
        }

        function zoomOut() {
            var currentZoomLevel = mapviewer.map.getView().getZoom();
            if (currentZoomLevel > mapviewer.zoom_min) {
                mapviewer.map.getView().setZoom(currentZoomLevel - 1);
            }
        }
    }
})();
