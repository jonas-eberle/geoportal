(function() {
    'use strict';

    angular
        .module('webgisApp.core')
        .service('AlertService', AlertService);

    AlertService.$inject = ['$rootScope'];
    function AlertService($rootScope) {
        var sharedService = {
            alert: null,
            'addAlert': function (alert) {
                this.alert = alert;
                $rootScope.$broadcast('alert.added');
            }
        };
        return sharedService;
    }
})();