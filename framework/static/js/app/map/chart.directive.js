(function() {
    'use strict';

    angular
        .module('webgisApp')
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
