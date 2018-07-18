(function() {
    'use strict';

    angular
        .module('webgisApp.phaenopt')
        .controller('CitizenScienceCtrl', CitizenScienceCtrl);

    CitizenScienceCtrl.$inject = ['$scope', '$compile', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'RegionsService', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function CitizenScienceCtrl($scope, $compile, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, RegionsService, TrackingService, $location, Attribution, $modal, $rootScope) {
        var citizenscience = this;

        citizenscience.region_id = RegionsService.value.id;
        citizenscience.loadData = loadData;

        djangoRequests.request({
            'method': "GET",
            'url'   : '/phaenopt/region/' + citizenscience.region_id + '/citizenscience/data.json'
        }).then(function (data) {
            citizenscience.data = data;
        });

        function loadData(project_id, start) {
            djangoRequests.request({
                'method': "GET",
                'url'   : '/phaenopt/region/' + citizenscience.region_id + '/csproject/' + project_id +'/data.json?start=' + start
            }).then(function (data) {
                if (data['features'].length > 0) {
                    citizenscience.data[project_id]['features'] = citizenscience.data[project_id]['features'].concat(data['features']);
                    citizenscience.data[project_id]['totalFeatures'] = citizenscience.data[project_id]['features'].length;
                } else {
                    citizenscience.data[project_id]['allLoaded'] = true;
                }
            });
        }

    }
})();