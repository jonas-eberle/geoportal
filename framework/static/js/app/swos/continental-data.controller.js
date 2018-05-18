(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('ContinentalDataCtrl', ContinentalDataCtrl);

    ContinentalDataCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function ContinentalDataCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, TrackingService, $location, Attribution, $modal, $rootScope) {
        var continentalData = this;
        
        continentalData.open_maps = true;
        continentalData.layers = [];
        continentalData.databases = [];
        continentalData.selectedContinent = "";
        continentalData.continents = ["Africa", "Asia", "Europe", "North America", "South America", "Australasia"];
        continentalData.selectContinent = selectContinent; 
        
        $scope.$on('mapviewer.catalog_loaded', function () {
            
        });
        
        function selectContinent(continent) {
            continentalData.selectedContinent = continent;
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/externaldb.json?continent='+continent
            }).then(function (data) {
                continentalData.layers = data['layers'];
                continentalData.databases = data['databases'];
            });
        }
    }
})();