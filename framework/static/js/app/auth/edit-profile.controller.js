(function() {
    'use strict';

    angular
        .module('webgisApp.auth')
        .controller('EditProfileCtrl', EditProfileCtrl);

    EditProfileCtrl.$inject = ['$modalInstance', 'djangoAuth', 'AlertService'];
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
            djangoAuth.updateProfile(ep.userdata).then(function () {
                $modalInstance.close();
                AlertService.addAlert({'type': 'success', 'msg': 'Profile updated!'});
            }, function (error) {
                console.log('update profile error');
                console.log(error)
            });
            if (ep.userdata.password1 !== null && ep.userdata.password2 !== null) {
                if (ep.userdata.password1 !== ep.userdata.password2) {
                    bootbox.alert('Given passwords are not equal!');
                    return false;
                }
                djangoAuth.changePassword(ep.userdata.password1, ep.userdata.password2).then(function () {
                    bootbox.alert('Successfully changed password.')
                }, function (error) {
                    bootbox.alert('An error occurred');
                });
            }
        }
    }
})();