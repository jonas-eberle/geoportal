(function() {
    'use strict';

    angular
        .module('webgisApp')
        .config(routeConfig)
        .config(locationConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/wetland/:wetland_id', {controller: 'WetlandsCtrl'})
            .when('/wetland/:wetland_id/:type_name', {controller: 'WetlandsCtrl'})
            .when('/wetland/:wetland_id/:type_name/:layer_id', {controller: 'WetlandsCtrl'})
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
