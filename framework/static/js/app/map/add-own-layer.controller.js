(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .controller('MapAddOwnLayerCtrl', MapAddOwnLayerCtrl);

    MapAddOwnLayerCtrl.$inject = ['$modalInstance', 'djangoRequests', 'mapviewer', 'title'];
    function MapAddOwnLayerCtrl($modalInstance, djangoRequests, mapviewer, title) {
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
    }
})();
