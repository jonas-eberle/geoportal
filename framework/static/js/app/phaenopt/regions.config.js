(function() {
    'use strict';

    angular
        .module('webgisApp.phaenopt')
        .config(routeConfig)
        .config(locationConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/region/:region_id', {
                controller: 'RegionsCtrl',
                controllerAs: 'regions'
            })
            .when('/regions/:region_id/:type_name', {
                controller: 'RegionsCtrl',
                controllerAs: 'regions'
            })
            .when('/regions/:region_id/:type_name/:layer_id', {
                controller: 'RegionsCtrl',
                controllerAs: 'regions'
            })
        ;
    }

    locationConfig.$inject = ['$locationProvider'];
    function locationConfig($locationProvider) {
        $locationProvider.hashPrefix('');
    }
})();