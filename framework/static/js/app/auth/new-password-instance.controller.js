(function() {
    'use strict';

    angular
        .module('webgisApp.auth')
        .controller('NewPasswordInstanceCtrl', NewPasswordInstanceCtrl);

    NewPasswordInstanceCtrl.$inject = ['$modalInstance', 'uid', 'token', 'djangoAuth', 'AlertService'];
    function NewPasswordInstanceCtrl($modalInstance, uid, token, djangoAuth, AlertService) {
        var npi = this;

        npi.changePassword = changePassword;
        npi.close = $modalInstance.close;
        npi.uid = uid;
        npi.token = token;
        npi.password1 = '';
        npi.password2 = '';

        //--------------------------------------------------------------------------------------------------------------

        function changePassword() {
            if (npi.password1 !== npi.password2 || npi.password1 === '') {
                bootbox.alert('Passwords are not correct or empty, please check!');
                return false;
            }

            djangoAuth.confirmReset(npi.uid, npi.token, npi.password1, npi.password2).then(function () {
                npi.uid = npi.token = npi.password1 = npi.password2 = '';
                $modalInstance.close();
                AlertService.addAlert({'type': 'success', 'msg': 'Password has been reset with the new password.'});
            }, function (error) {
                bootbox.alert(error);
            });
        }
    }
})();