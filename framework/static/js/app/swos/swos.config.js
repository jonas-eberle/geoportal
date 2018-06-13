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
            .when('/storyline/:story_line_id', {
                controller: 'StoryLineCtrl',
                controllerAs: 'storyLine'
            })
            .when('/storyline/:story_line_id/:story_line_part_id', {
                controller: 'StoryLineCtrl',
                controllerAs: 'storyLine'
            })
            .when('/global/:global_layer_id', {
                controller: 'GlobalDataCtrl',
                controllerAs: 'globalData'
            })
            .when('/continental/:continent', {
                controller: 'ContinentalDataCtrl',
                controllerAs: 'continentalData'
            })
            .when('/continental/:continent/:continental_layer_id', {
                controller: 'ContinentalDataCtrl',
                controllerAs: 'continentalData'
            })
            .when('/national/:country_id', {
                controller: 'NationalDataCtrl',
                controllerAs: 'nationalData'
            })
            .when('/national/:country_id/:national_layer_id', {
                controller: 'NationalDataCtrl',
                controllerAs: 'nationalData'
            })
            .when('/:view', {
                controller: 'GlobalDataCtrl',
                controllerAs: 'globalData'
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
