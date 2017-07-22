(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .controller('MapCurrentLayersCtrl', MapCurrentLayersCtrl);

    MapCurrentLayersCtrl.$inject = ['$scope', 'mapviewer', '$uibModal', 'djangoRequests', '$rootScope', '$routeParams', '$window', '$location'];
    function MapCurrentLayersCtrl($scope, mapviewer, $modal, djangoRequests, $rootScope, $routeParams, $window, $location) {
        var mcl = this;

        mcl.addDrawBox = addDrawBox;
        mcl.addOwnLayer = addOwnLayer;
        mcl.changeLayer = changeLayer;
        mcl.changeOpacity = changeOpacity;
        mcl.changeVisibility = changeVisibility;
        mcl.getVisibility = getVisibility;
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
                    draw.on('drawstart', function () {
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

            var status = olLayer.getVisible();
            olLayer.setVisible(!status);
        }

        function downloadLayer(layer) {
            console.log(layer);
            if (layer.download_type === 'wcs') {
                mcl.requestWCS(layer);
            } else {
                window.open(subdir + '/layers/detail/' + layer.id + '/download', 'download_' + layer.id);
            }
        }

        function getVisibility(id){
            return mapviewer.getLayerById(id).getVisible();
        }

        function prepareIndex(index, item) {
            mcl.newLayerIndex = index;
            return item;
        }

        function removeAllLayers() {
            mapviewer.removeAllLayers();
            /*
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
            */
        }

        function removeDrawBox() {
            mapviewer.map.getLayers().forEach(function (layer, i) {
                if (layer.get('name') === "draw_box" || layer.get('name') === "draw_box_2") {
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

                            var bbox = $('#west').val() + ',' + $('#south').val() + ',' + $('#east').val() + ',' + $('#north').val();
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
                '<div style="display: inline-flex; white-space: nowrap;">Please select an output format:' +
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

                var extent;
                if (this.value === "bbox") {
                    extent = mcl.currentBBOX;
                    $('#east').val(extent[2].toFixed(2));
                    $('#north').val(extent[3].toFixed(2));
                    $('#south').val(extent[1].toFixed(2));
                    $('#west').val(extent[0].toFixed(2));
                } else if (this.value === "full_extent") {
                    full_extent();
                } else if (this.value === "current_view") {
                    extent = ol.proj.transformExtent(mapviewer.map.getView().calculateExtent(mapviewer.map.getSize()), 'EPSG:3857', 'EPSG:4326');
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
                if (layerObj["epsg"] === 4326 && (map_epsg === "EPSG:3857" || map_epsg === "EPSG:900913")) {
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
            var host = $location.protocol() +"://"+ $location.host() + $window.location.pathname;
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
    }
})();
