(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('GlobalDataCtrl', GlobalDataCtrl);

    GlobalDataCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function GlobalDataCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, TrackingService, $location, Attribution, $modal, $rootScope) {
        var globalData = this;
        
        globalData.open_global_maps = true;
        globalData.layers = [];
        globalData.databases = [];
        
        $scope.$on('mapviewer.catalog_loaded', function () {
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/externaldb.json?continent=Global'
            }).then(function (data) {
                globalData.layers = data['layers'];
                globalData.databases = data['databases'];
            });
        });
    }
})();