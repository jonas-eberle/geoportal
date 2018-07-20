(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .controller('MapViewerCtrl', MapViewerCtrl);

    MapViewerCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$uibModal', '$window', '$timeout', '$cookies', 'Attribution',  'lulcLegend'];
    function MapViewerCtrl($scope, mapviewer, djangoRequests, $modal, $window, $timeout, $cookies, Attribution,  lulcLegend){
        var mv = this;

        mv.data = mapviewer.data;
        mv.changeSitesVisibility = changeSitesVisibility;
        mv.closeCookieNote = closeCookieNote;
        mv.collapseSearchBox = collapseSearchBox;
        mv.expandSearchBox = expandSearchBox;
        mv.hasAttribution = false;
        mv.hideCookieNote = false;
        mv.infoEventKey = null;
        mv.infoStatus = false;
        // mv.legendLayers = [];
        mv.requestInfo = requestInfo;
        mv.selectedFeature = null;
        mv.showAttribution = showAttribution;
        mv.visibility_state_wetland_layer = true;
        mv.zoomIn = zoomIn;
        mv.zoomMaxExtent = zoomMaxExtent;
        mv.zoomOut = zoomOut;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('attribution_list_new', function (){
            mv.layer_attribution = Attribution.getList();
            mv.hasAttribution = (mv.layer_attribution.length > 0)
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
                        var output = '<h3>Properties</h3><ul>';
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

        function collapseSearchBox(event) {
            var searchInput = $('#search_desktop');
            $( "#search-extend" ).delay(500).animate({
                height: 0
            }, 0, function() {
                if (event.data.shouldCollapseInput) {
                    searchInput.css('width', '');
                }
            });

            searchInput.off('blur');
        }

        function expandSearchBox() {
            var shouldCollapseInput = false;
            var searchInput = $('#search_desktop');
            if (searchInput.css('width') === '130px') {
                searchInput.css('width', '200px');
                shouldCollapseInput = true;
            }

            $( "#search-extend" ).animate({
                height: 42
            }, 0, function() {});
            searchInput.on('blur', {shouldCollapseInput: shouldCollapseInput}, mv.collapseSearchBox);
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
                        var name = layer.get('name');
                        if (layer.getVisible() === false) {
                            return true;
                        }

                        // Request JSON for SWOS layer
                        if (String(name).includes("SWOS")){
                            var info_format = 'application/json';
                        }
                        // Request Text for all other
                        else{
                            var info_format = 'text/html';
                        }

                        // Works only for WMS layers
                        try {
                            var source = layer.getSource();
                            var url = '';
                            if (source instanceof ol.source.TileWMS) {
                                url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, mapviewer.displayProjection, {
                                    'INFO_FORMAT': info_format
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
                                    INFOFORMAT   : info_format,
                                    STYLE        : source.getStyle(),
                                    FORMAT       : source.getFormat(),
                                    TileCol      : tileCol,
                                    TileRow      : tileRow,
                                    TileMatrix   : matrixIds,
                                    TileMatrixSet: matrixSet,
                                    I            : tileI,
                                    J            : tileJ
                                };
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
                            console.log(data);
                            if (!angular.element('#feature_info').length) {
                                var dialog = bootbox.dialog({
                                    title: 'Feature Info Response',
                                    message: showFeatureRequestResult(coordinate, data),
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
                                $(showFeatureRequestResult(coordinate, data)).insertAfter('#feature_info');
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

        function showFeatureRequestResult(coordinate, data) {
            var result = '<p id="feature_info"></p><div class="feature_result"><div>' + coordinate + '</div>';
            var table_values = [];

            if (data["json"].length > 0) {
                var output = [];
                for (var i = 0; i < data["json"].length; i++) {

                    if (!data["json"][i]["output"].includes("ExceptionReport ")) {
                        output = JSON.parse(data["json"][i]["output"]);
                    } else {
                        continue;
                    }

                    console.log(output, data["json"][i]["name"]);

                    if ("features" in output && output["features"].length == 0) {
                        // do not show layer without result
                    }

                    else if (data["json"][i]["name"].includes("LULC RAMSAR-CLC")) {
                        var property_value;
                        var legend_value = Math.max(output["features"][0]["properties"]["CLC_L1"], output["features"][0]["properties"]["CLC_L2"], output["features"][0]["properties"]["CLC_L3"], output["features"][0]["properties"]["CLC_L4"]);
                        $.each(lulcLegend.CLC, function (index, value) {
                            if (value[0] == legend_value) {
                                property_value = value[2];
                                return false;
                            }
                        });
                        table_values = [];
                        table_values["CLC class"] = property_value;
                        table_values["Area (ha)"] = output["features"][0]["properties"]["Area_ha"];
                        table_values["Perimeter (m)"] = output["features"][0]["properties"]["Perimeter"];

                        result += createHTML(table_values, data["json"][i]["name"]);

                    }
                    else if (data["json"][i]["name"].includes("LULC MAES")) {
                        var property_value;
                        var legend_value = Math.max(output["features"][0]["properties"]["MAES_L1"], output["features"][0]["properties"]["MAES_L2"], output["features"][0]["properties"]["MAES_L3"], output["features"][0]["properties"]["MAES_L4"]);
                        $.each(lulcLegend.MAES, function (index, value) {
                            if (value[0] == legend_value) {
                                property_value = value[2];
                                return false;
                            }
                        });
                        table_values = [];
                        table_values["MAES class"] = property_value;
                        table_values["Area (ha)"] = output["features"][0]["properties"]["Area_ha"];
                        table_values["Perimeter (m)"] = output["features"][0]["properties"]["Perimeter"];

                        result += createHTML(table_values, data["json"][i]["name"]);

                    }
                    else if (data["json"][i]["name"].includes("LULCC_L")) {
                        var property_value;
                        var legend_value = Math.max(output["features"][0]["properties"]["MAES_L1"], output["features"][0]["properties"]["MAES_L2"], output["features"][0]["properties"]["MAES_L3"], output["features"][0]["properties"]["MAES_L4"]);

                        table_values = [];
                        table_values["Land Use Land Cover Change code"] = output["features"][0]["properties"]["ChangeCode"];
                        table_values["Area (ha)"] = output["features"][0]["properties"]["Area_ha"];
                        table_values["Perimeter (m)"] = output["features"][0]["properties"]["Perimeter"];

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("LULCC S")) {
                        table_values = [];
                        table_values["Frequency of change"] = output["features"][0]["properties"]["GRAY_INDEX"];

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("Sentinel-1")) {
                        table_values = [];

                        if (data["json"][i]["name"].includes("Max")) {
                            table_values["Maximum value over one year in dB"] = output["features"][0]["properties"]["GRAY_INDEX"];
                        }
                        if (data["json"][i]["name"].includes("Min")) {
                            table_values["Minimum value over one year in dB"] = output["features"][0]["properties"]["GRAY_INDEX"];
                        }
                        if (data["json"][i]["name"].includes("Mean")) {
                            table_values["Maen value over one year in dB"] = output["features"][0]["properties"]["GRAY_INDEX"];
                        }

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("WQ CDOM")) {
                        table_values = [];
                        var value;
                        if (output["features"][0]["properties"]["GRAY_INDEX"] == -1) {
                            value = "no result"
                        }
                        else {
                            value = parseFloat(output["features"][0]["properties"]["GRAY_INDEX"]).toFixed(3);
                        }
                        table_values["Colored dissolved organic matter (m<sup>-1</sup>)"] = value;

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("WQ CHL")) {
                        table_values = [];
                        var value;
                        if (output["features"][0]["properties"]["GRAY_INDEX"] == -1) {
                            value = "no result"
                        }
                        else {
                            value = parseFloat(output["features"][0]["properties"]["GRAY_INDEX"]).toFixed(3);
                        }
                        table_values["Chlorophyll (µg/l)"] = value;

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("WQ TSM")) {
                        table_values = [];
                        var value;
                        if (output["features"][0]["properties"]["GRAY_INDEX"] == -1) {
                            value = "no result"
                        }
                        else {
                            value = parseFloat(output["features"][0]["properties"]["GRAY_INDEX"]).toFixed(3);
                        }
                        table_values["Suspended sediments (TSM)(mg/l)"] = value;

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("SWD TD OP")) {
                        var swd_class = [];
                        swd_class[1] = "permanently flooded";
                        swd_class[2] = "temporarly flooded";
                        swd_class[3] = "never flooded";

                        table_values = [];
                        table_values["SWD class"] = swd_class[output["features"][0]["properties"]["PALETTE_INDEX"]];

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("SWD TF OP")) {
                        table_values = [];
                        table_values["Temporal flood frequency (%)"] = output["features"][0]["properties"]["GRAY_INDEX"].toFixed(3);

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("SWD TF SAR")) {
                        table_values = [];
                        table_values["Temporal flood frequency (%)"] = output["features"][0]["properties"]["GRAY_INDEX"].toFixed(3);

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("LSTT")) {
                        table_values = [];
                        table_values["Land Surface Temperature Trend (°C)"] = output["features"][0]["properties"]["GRAY_INDEX"].toFixed(3);

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("InvDel")) {
                        table_values = [];
                        table_values["Probability for wetlands"] = output["features"][0]["properties"]["GRAY_INDEX"].toFixed(3);

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else if (data["json"][i]["name"].includes("FloodReg")) {
                        table_values = [];
                        table_values["Estimated capacity for flood regulation"] = output["features"][0]["properties"]["GRAY_INDEX"].toFixed(3);

                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                    else {
                        table_values = output["features"][0]["properties"];
                        result += createHTML(table_values, data["json"][i]["name"]);
                    }
                }
            }
            result += data["html"];

            result += "</div>";

            return result;
        }

        function createHTML(table_values, name) {
            var result = '<p><strong>' + name + '</strong><br/>';

            result += '<div style="display: table; padding-left: 20px;">';
            for (var index in table_values) {
                result += '<div style="display: table-row"><div style="padding-right: 15px;display: table-cell">' + index + ':</div><div style="display: table-cell">' + table_values[index] + '</div></div>';
            }
            result += '</div></p>';
            return result;
        }

        function showAttribution() {
            var attributionList = Attribution.getList();

            $modal.open({
                bindToController: true,
                controller: 'ModalInstanceCtrl',
                controllerAs: 'mi',
                templateUrl: subdir+'/static/includes/attribution.html',
                resolve: {
                    data: function() { return {attributionList: attributionList}; },
                    title: function() {return 'Layer Attribution';}
                }
            });
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
