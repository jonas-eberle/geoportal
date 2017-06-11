(function() {
    'use strict';

    angular
        .module('webgisApp')
        .config(routeConfig);

    routeConfig.$inject = ['$routeProvider'];
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/verify_success', {
                template: '',
                controller: 'RouteAlertCtrl',
                alertType: 'success',
                alertMsg: 'Verification successful. Please use the log in form.'
            })
            .when('/verify_error', {
                template: '',
                controller: 'RouteAlertCtrl',
                alertType: 'danger',
                alertMsg: 'An error occurred during email verification!'
            })
            .when('/password-reset-confirm/:uid/:token', {
                template: '',
                bindToController: true,
                controller: 'NewPasswordCtrl',
                controllerAs: 'np'
            });
    }
})();