(function() {
    'use strict';

    angular
        .module('webgisApp.auth')
        .controller('NewPasswordCtrl', NewPasswordCtrl);

    NewPasswordCtrl.$inject = ['$uibModal', '$routeParams'];
    function NewPasswordCtrl($modal, $routeParams) {
        var np = this;

        np.token = $routeParams.token;
        np.uid = $routeParams.uid;

        //--------------------------------------------------------------------------------------------------------------

        activate();

        //--------------------------------------------------------------------------------------------------------------

        function activate() {
            $modal.open({
                resolve: {
                    uid: function () {
                        return np.uid
                    },
                    token: function () {
                        return np.token
                    }
                },
                templateUrl: subdir+'/static/includes/auth-new-password.html',
                bindToController: true,
                controller: 'NewPasswordInstanceCtrl',
                controllerAs: 'npi'
            });
        }
    }
})();