(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .controller('MapSettingsCtrl', MapSettingsCtrl);

    MapSettingsCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$uibModal'];
    function MapSettingsCtrl($scope, mapviewer, djangoRequests, $modal){
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
    }
})();
