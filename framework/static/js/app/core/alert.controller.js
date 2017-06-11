(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('AlertCtrl', AlertCtrl);

    AlertCtrl.$inject = ['$scope', 'AlertService'];
    function AlertCtrl($scope, AlertService) {
        var ac = this;

        ac.alerts = [];
        ac.closeAlert = closeAlert;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('alert.added', function () {
            ac.alerts = [AlertService.alert];
        });

        //--------------------------------------------------------------------------------------------------------------

        function closeAlert() {
            ac.alerts = [];
        }
    }
})();