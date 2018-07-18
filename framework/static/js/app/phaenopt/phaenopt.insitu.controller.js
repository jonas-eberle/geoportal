(function() {
    'use strict';

    angular
        .module('webgisApp.phaenopt')
        .controller('InSituCtrl', InSituCtrl);

    InSituCtrl.$inject = ['$scope', '$compile', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'RegionsService', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function InSituCtrl($scope, $compile, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, RegionsService, TrackingService, $location, Attribution, $modal, $rootScope) {
        var insitu = this;

        insitu.region_id = RegionsService.value.id;
        insitu.stationen = [];
        insitu.selectedStation = null;
        insitu.selectedStationData = {};
        insitu.stationDataLoaded = false;
        insitu.loadStation = loadStation;
        insitu.selectedPhaseLoaded = false;

        djangoRequests.request({
            'method': "GET",
            'url'   : '/phaenopt/region/' + insitu.region_id + '/dwd/stations.json'
        }).then(function (data) {
            insitu.stationen = data;
            $timeout(function(){
                    $('#stations-selection').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Bitte eine Station auswählen'
                    });
                    $('#stations-selection').selectpicker('refresh');

                    $('#stations-selection').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
                        data = JSON.parse(insitu.selectedStation);
                        //data = insitu.stationen[clickedIndex-1];
                        insitu.loadStation(data);
                    });
            }, 1);
        });

        function loadStation(data) {
            //insitu.selectedStation = data;
            insitu.stationDataLoaded = false;
            insitu.selectedPhaseLoaded = false;
            $timeout(function(){
                $('#stations-selection').selectpicker('refresh');
            });
            djangoRequests.request({
                'method': "GET",
                'url'   : '/phaenopt/dwd/station/' + data.id + '.json'
            }).then(function (data) {
                insitu.stationDataLoaded = true;
                insitu.selectedStationData = data;
                $timeout(function(){
                    $('#phases-selection').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Bitte eine Phase auswählen'
                    });
                    $('#phases-selection').selectpicker('refresh');

                    $('#phases-selection').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
                        data = JSON.parse(insitu.selectedPhase);
                        //data = insitu.selectedStationData['phases'][clickedIndex-1];
                        //insitu.selectedPhase = data;
                        $timeout(function(){
                            $('#phases-selection').selectpicker('refresh');
                        });
                        insitu.selectedPhaseImage = '/phaenopt/dwd/station/plot.json?Stations_id=' + insitu.selectedStationData['Stations_id'] + '&Objekt_id=' + data['Objekt_id']+ '&Phase_id=' + data['Phase_id']
                        insitu.selectedPhaseLoaded = true;
                    });
            }, 1);
            });
        }

    }
})();