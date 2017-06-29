(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .config(routeConfig)
        .config(locationConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/wetland/:wetland_id', {
                controller: 'WetlandsCtrl',
                controllerAs: 'wetlands'
            })
            .when('/wetland/:wetland_id/:type_name', {
                controller: 'WetlandsCtrl',
                controllerAs: 'wetlands'
            })
            .when('/wetland/:wetland_id/:type_name/:layer_id', {
                controller: 'WetlandsCtrl',
                controllerAs: 'wetlands'
            })
        ;
    }

    locationConfig.$inject = ['$locationProvider'];
    function locationConfig($locationProvider) {
        $locationProvider.hashPrefix('');
    }
})();

$(document).ready(function () {
    $(".fancybox").fancybox({
        openEffect: 'none',
        closeEffect: 'none'
    });
});
