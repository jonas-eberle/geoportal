(function() {
    'use strict';

    angular
        .module('webgisApp.auth')
        .controller('EditProfileCtrl', EditProfileCtrl);

    EditProfileCtrl.$inject = ['$uibModalInstance', 'djangoAuth', 'AlertService'];
    function EditProfileCtrl($modalInstance, djangoAuth, AlertService) {
        var ep = this;

        ep.close = $modalInstance.close;
        ep.delete = deleteProfile;
        ep.save = saveProfile;
        ep.userdata = {};

        //--------------------------------------------------------------------------------------------------------------

        djangoAuth.profile().then(function (data) {
            ep.userdata = data;
        });

        //--------------------------------------------------------------------------------------------------------------

        function deleteProfile() {
            bootbox.confirm('Really delete your account? (Cannot be undone!)', function (result) {

                if (result === true) {
                    djangoAuth.delete().then(function () {
                        ep.close();
                        djangoAuth.profile();
                    }, function (error) {
                        console.log(error);
                        bootbox.alert('Error occurred');
                    })
                }
            })
        }

        function saveProfile() {
            var changePassword = false;
            if (ep.userdata.hasOwnProperty('password1') && ep.userdata.hasOwnProperty('password2')) {
                if (ep.userdata.password1 !== ep.userdata.password2) {
                    bootbox.alert('Given passwords are not equal!');
                    return false;
                }
                changePassword = true;
            }
            djangoAuth.updateProfile(ep.userdata).then(function () {
                $modalInstance.close();
                AlertService.addAlert({'type': 'success', 'msg': 'Profile updated!'});
                
                if (changePassword === true) {
                    djangoAuth.changePassword(ep.userdata.password1, ep.userdata.password2).then(function () {
                        bootbox.alert('Successfully changed password.')
                    }, function (error) {
                        bootbox.alert('An error occurred');
                    });
                }
                
            }, function (error) {
                console.log('update profile error');
                console.log(error)
                AlertService.addAlert({'type': 'danger', 'msg': 'An error occurred!'});
            });
        }
    }
})();