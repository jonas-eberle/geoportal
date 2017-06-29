(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .controller('MapCatalogCtrl', MapCatalogCtrl);

    MapCatalogCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$modal'];
    function MapCatalogCtrl($scope, mapviewer, djangoRequests, $modal){
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
            if (layer.download_type === 'wcs') {
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

        function hoverLayer(layerID, $event) {
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
    }
})();
