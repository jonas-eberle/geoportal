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

        insitu.definitions = []
        insitu.selectedDefinition = null;
        insitu.loadDefinition = loadDefinition;
        insitu.selectedDefinitionData = {};
        insitu.selectedDefinitionLoaded = false;
        insitu.years = [];
        insitu.yearStart = null;
        insitu.yearEnd = null;
        insitu.updateDefinitionsHistogram = updateDefinitionsHistogram;

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
                        insitu.selectedPhaseImage = '/phaenopt/dwd/station/plot.png?Stations_id=' + insitu.selectedStationData['Stations_id'] + '&Objekt_id=' + data['Objekt_id']+ '&Phase_id=' + data['Phase_id']
                        insitu.selectedPhaseLoaded = true;
                    });
            }, 1);
            });
        }

        djangoRequests.request({
            'method': "GET",
            'url'   : '/phaenopt/dwd/definitions.json'
        }).then(function (data) {
            insitu.definitions = data;
            $timeout(function(){
                    $('#definitions-selection').selectpicker({
                      style: 'btn-info',
                      width: '100%',
                      size: 10,
                      title: 'Bitte eine Phase auswählen'
                    });
                    $('#definitions-selection').selectpicker('refresh');

                    $('#definitions-selection').on('changed.bs.select', function(e, clickedIndex, newValue, oldValue){
                        insitu.selectedDefinitionLoaded = false;
                        data = JSON.parse(insitu.selectedDefinition);
                        console.log(data);
                        insitu.loadDefinition(data);
                    });
            }, 1);
        });

        function loadDefinition(phase) {
            //insitu.selectedDefinitionData = JSON.parse(insitu.selectedDefinition);
            //console.log(insitu.selectedDefinitionData);
            //$('#definitions-selection').selectpicker('refresh');
            $timeout(function(){
                $('#definitions-selection').selectpicker('refresh');
                insitu.selectedDefinitionData = phase;
                insitu.years = [];
                for (var year = phase['Referenzjahr__min']; year <= phase['Referenzjahr__max']; year++) {
                    insitu.years.push(year);
                }
                console.log(insitu.years);
                insitu.yearStart = phase['Referenzjahr__min']+"";
                insitu.yearEnd = phase['Referenzjahr__max']+"";
                insitu.selectedDefinitionImage = '/phaenopt/dwd/definitions/plot.png?Objekt_id=' + phase['Objekt_id']+ '&Phase_id=' + phase['Phasen_id']
                insitu.selectedDefinitionLoaded = true;
            }, 1);
        }

        function updateDefinitionsHistogram() {
            if (insitu.yearEnd < insitu.yearStart) {
                bootbox.alert('Enddatum muss größer/gleich dem Startdatum sein.');
            } else {
                insitu.selectedDefinitionImage = '/phaenopt/dwd/definitions/plot.png?Objekt_id=' + insitu.selectedDefinitionData['Objekt_id']+ '&Phase_id=' + insitu.selectedDefinitionData['Phasen_id'] + '&start=' + insitu.yearStart + '&end=' + insitu.yearEnd
            }
        }

    }
})();