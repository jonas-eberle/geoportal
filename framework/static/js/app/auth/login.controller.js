(function() {
    'use strict';

    angular
        .module('webgisApp.auth')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$scope', 'djangoAuth', '$uibModal'];
    function LoginCtrl($scope, djangoAuth, $modal) {
        var lc = this;

        lc.authenticated = false;
        lc.complete = false;
        lc.editProfileForm = editProfileForm;
        lc.isCollapsed = true;
        lc.login = login;
        lc.logout = logout;
        lc.model = {'username': '', 'password': ''};
        lc.registerForm = registerForm;
        lc.registration_enabled = false;
        lc.resetPasswordForm = resetPasswordForm;
        lc.user = '';
        lc.userData = {};

        //--------------------------------------------------------------------------------------------------------------

        djangoAuth.authenticationStatus(true).then(function () {
            lc.authenticated = true;
            lc.user = djangoAuth.user;
            lc.userData = djangoAuth.userData;
        });

        //--------------------------------------------------------------------------------------------------------------

        // Wait and respond to the log in event.
        $scope.$on('djangoAuth.logged_in', function () {
            lc.authenticated = true;
            lc.user = djangoAuth.user;
            lc.userData = djangoAuth.userData;
        });

        // Wait and respond to the logout event.
        $scope.$on('djangoAuth.logged_out', function () {
            lc.authenticated = false;
            lc.user = djangoAuth.user;
            lc.userData = {};
        });

        $scope.$on('djangoAuth.registration_enabled', function ($broadCast, status) {
            lc.registration_enabled = status;
        });

        //--------------------------------------------------------------------------------------------------------------

        function editProfileForm() {
            $modal.open({
                bindToController: true,
                controller: 'EditProfileCtrl',
                controllerAs: 'ep',
                templateUrl: subdir+'/static/includes/auth-edit-profile.html'
            })
        }

        function login() {
            djangoAuth.login(lc.model.username, lc.model.password)
                .then(function () {
                    // success case
                    lc.authenticated = true;
                }, function (data) {
                    $('#loading-div').hide();

                    // error case
                    lc.errors = data;
                    var errors = '';

                    if (typeof data === 'object') {
                        errors += '<ul>';
                        if ('username' in data) {
                            errors += '<li><strong>Username:</strong> ' + data.username[0] + '</li>';
                        }
                        if ('password' in data) {
                            errors += '<li><strong>Password:</strong> ' + data.password[0] + '</li>';
                        }
                        if ('non_field_errors' in data) {
                            for (var i = 0; i < data.non_field_errors.length; i++) {
                                errors += '<li>' + data.non_field_errors[i] + '</li>';
                            }
                        }
                        errors += '</ul>';
                    } else {
                        errors = data;
                    }

                    $modal.open({
                        bindToController: true,
                        controller: 'ModalInstanceCtrl',
                        controllerAs: 'mi',
                        template: '<div modal-draggable class="modal-header"><h1>Error while logging in!</h1></div><div class="modal-body">' + errors + '</div><div class="modal-footer"><button class="btn btn-primary" ng-click="mi.close()">Close</button></div>',
                        resolve: {
                            data: function() {return {};},
                            title: function() {return '';}
                        }
                    });
                });
        }

        function logout() {
            djangoAuth.logout().then(function () {
            }, function () {
                bootbox.alert('Error while logging out...');
            });
        }

        function registerForm() {
            $modal.open({
                bindToController: true,
                controller: 'RegisterUserCtrl',
                controllerAs: 'ru',
                templateUrl: subdir+'/static/includes/auth-register.html'
            });
        }

        function resetPasswordForm() {
            $modal.open({
                bindToController: true,
                controller: 'ResetPasswordCtrl',
                controllerAs: 'rp',
                templateUrl: subdir+'/static/includes/auth-reset-password.html'
            });
        }
    }
})();