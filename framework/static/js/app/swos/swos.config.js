(function() {
    'use strict';

    angular
        .module('webgisApp')
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider
                .when('/wetland/:wetland_id', {controller: 'WetlandsCtrl'})
                .when('/wetland/:wetland_id/:type_name', {controller: 'WetlandsCtrl'})
                .when('/wetland/:wetland_id/:type_name/:layer_id', {controller: 'WetlandsCtrl'})
            ;
        }])
        .config(['$locationProvider', function($locationProvider) {
            $locationProvider.hashPrefix('');
        }]);
})();

$(document).ready(function () {
    $(".fancybox").fancybox({
        openEffect: 'none',
        closeEffect: 'none'
    });
});
