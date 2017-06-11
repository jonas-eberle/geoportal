(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('RouteAlertCtrl', RouteAlertCtrl);

    RouteAlertCtrl.$inject = ['$route', 'AlertService'];
    function RouteAlertCtrl($route, AlertService) {
        AlertService.addAlert({'type': $route.current.alertType, 'msg': $route.current.alertMsg});
    }
})();