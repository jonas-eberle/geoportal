(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .directive('chart', chart);

    chart.$inject = [];
    function chart() {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.addChart(element);
            }
        };
    }
})();
