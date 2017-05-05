'use strict';

angular.module('webgisApp')
    .service('djangoAuth', function djangoAuth($q, $http, $cookies, $rootScope, djangoRequests) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var service = {
            /* START CUSTOMIZATION HERE */
            // Change this to point to your Django REST Auth API
            // e.g. /api/rest-auth  (DO NOT INCLUDE ENDING SLASH)
            'API_URL': '',
            // Set use_session to true to use Django sessions to store security token.
            /* END OF CUSTOMIZATION */
            'authenticated': null,
            'authPromise': null,
            'user': null,
            'registration_enabled': null,

            'register': function (username, password1, password2, email, more) {
                if (parseInt(mapId) == 0) {
                    bootbox.alert('MapId not found!');
                    return false;
                }
                var data = {
                    'username': username,
                    'password1': password1,
                    'password2': password2,
                    'email': email
                };
                data = angular.extend(data, more);
                return djangoRequests.request({
                    'method': "POST",
                    'url': this.API_URL+"/registration/"+mapId,
                    'data': data
                });
            },
            'login': function (username, password) {
                var djangoAuth = this;
                $('#loading-div').show();
                return djangoRequests.request({
                    'method': "POST",
                    'url': this.API_URL+"/login/",
                    'data': {
                        'username': username,
                        'password': password
                    }
                }).then(function (data) {
                    if (!djangoRequests.use_session) {
                        $http.defaults.headers.common.Authorization = 'Token ' + data.key;
                        $cookies.token = data.key;
                    }
                    djangoAuth.authenticated = true;
                    djangoAuth.profile().then(function (data) {
                        if ((data.first_name != /** @type {boolean} **/"") && (data.last_name != /** @type {boolean} **/"")) {
                            djangoAuth.user = data.first_name + ' ' + data.last_name;
                        } else {
                            djangoAuth.user = data.username;
                        }
                        djangoAuth.userData = data;
                        $rootScope.$broadcast("djangoAuth.logged_in", data);
                    });
                    $('#loading-div').hide();
                });
            },
            'logout': function () {
                var djangoAuth = this;
                return djangoRequests.request({
                    'method': "POST",
                    'url': this.API_URL+"/logout/"
                }).then(function () {
                    delete $http.defaults.headers.common.Authorization;
                    delete $cookies.token;
                    djangoAuth.authenticated = false;
                    djangoAuth.user = null;
                    djangoAuth.userData = {};
                    $rootScope.$broadcast("djangoAuth.logged_out");
                    location.reload()
                });
            },
            'changePassword': function (password1, password2) {
                return djangoRequests.request({
                    'method': "POST",
                    'url': this.API_URL+"/password/change/",
                    'data': {
                        'new_password1': password1,
                        'new_password2': password2
                    }
                });
            },
            'resetPassword': function (email) {
                return djangoRequests.request({
                    'method': "POST",
                    'url': this.API_URL+"/password/reset/",
                    'data': {
                        'email': email
                    }
                });
            },
            'profile': function () {
                return djangoRequests.request({
                    'method': "GET",
                    'url': this.API_URL+"/user/"
                });
            },
            'updateProfile': function (data) {
                return djangoRequests.request({
                    'method': "PATCH",
                    'url': this.API_URL+"/user/",
                    'data': data
                });
            },
            'verify': function (key) {
                return djangoRequests.request({
                    'method': "POST",
                    'url': this.API_URL+"/registration/verify-email/",
                    'data': {'key': key}
                });
            },
            'confirmReset': function (uid, token, password1, password2) {
                return djangoRequests.request({
                    'method': "POST",
                    'url': this.API_URL+"/password/reset/confirm/",
                    'data': {
                        'uid': uid,
                        'token': token,
                        'new_password1': password1,
                        'new_password2': password2
                    }
                });
            },
            'delete': function () {
                var djangoAuth = this;
                return djangoRequests.request({
                    'method': "DELETE",
                    'url': this.API_URL+"/user/delete/"
                }).then(function () {
                    djangoAuth.logout();
                });
            },
            'authenticationStatus': function (restrict, force) {
                // Set restrict to true to reject the promise if not logged in
                // Set to false or omit to resolve when status is known
                // Set force to true to ignore stored value and query API
                restrict = restrict || false;
                force = force || false;
                var da = this;
                if (this.authPromise == null || force) {
                    this.authPromise = djangoRequests.request({
                        'method': "GET",
                        'url': this.API_URL+"/user/"
                    }).then(function (data) {
                        if (data.first_name != /** @type {boolean} **/"" && data.last_name != /** @type {boolean} **/"") {
                            da.user = data.first_name + ' ' + data.last_name;
                        } else {
                            da.user = data.username;
                        }
                        da.userData = data;
                    })
                }
                da = this;
                var getAuthStatus = $q.defer();
                if (this.authenticated != null && !force) {
                    // We have a stored value which means we can pass it back right away.
                    if (this.authenticated == false && restrict) {
                        getAuthStatus.reject("User is not logged in.");
                    } else {
                        getAuthStatus.resolve();
                    }
                } else {
                    // There isn't a stored value, or we're forcing a request back to
                    // the API to get the authentication status.
                    this.authPromise.then(function () {
                        da.authenticated = true;
                        getAuthStatus.resolve();
                    }, function () {
                        da.authenticated = false;
                        if (restrict) {
                            getAuthStatus.reject("User is not logged in.");
                        } else {
                            getAuthStatus.resolve();
                        }
                    });
                }
                return getAuthStatus.promise;
            },
            'initialize': function (url, sessions) {
                this.API_URL = url;
                this.use_session = sessions;
                return this.authenticationStatus();
            }

        };
        return service;
    })
    .config(function ($routeProvider) {
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
    })
    .controller('LoginCtrl', function ($scope, $location, djangoAuth, $modal) {
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
    })
    .controller('RegisterUserCtrl', function ($modalInstance, djangoAuth) {
        var ru = this;

        ru.close = $modalInstance.close;
        ru.model = {
            email : '',
            organization : '',
            password1 : '',
            password2 : '',
            username : ''
        };
        ru.register = register;

        //--------------------------------------------------------------------------------------------------------------

        function register() {
            djangoAuth.register(ru.model.username, ru.model.password1, ru.model.password2, ru.model.email, {'organization': ru.model.organization})
                .then(function () {
                    bootbox.alert('Please check your emails for verfication!');
                    ru.model.password1 = ru.model.password2 = ru.model.email = ru.model.organization = '';
                    ru.close();
                }, function (error) {
                    var errors = '';
                    if ('username' in error) {
                        errors += '<li><strong>Username:</strong> ' + error.username[0] + '</li>';
                    }
                    if ('password1' in error) {
                        errors += '<li><strong>Password:</strong> ' + error.password1[0] + '</li>';
                    }
                    if ('email' in error) {
                        errors += '<li><strong>Email:</strong> ' + error.email[0] + '</li>';
                    }
                    if ('non_field_errors' in error) {
                        for (var i = 0; i < error.non_field_errors.length; i++) {
                            errors += '<li>' + error.non_field_errors[i] + '</li>';
                        }
                    }

                    bootbox.alert('<h2>Error while registration!</h2><ul>' + errors + '</ul>');
                });
        }
    })
    .controller('ResetPasswordCtrl', function ($modalInstance, djangoAuth, djangoRequests) {
        var rp = this;

        rp.close = $modalInstance.close;
        rp.email = '';
        rp.submit = submit;

        function submit() {
            djangoAuth.resetPassword(rp.email).then(function (data) {
                bootbox.alert(data.success);
                rp.close();
                djangoRequests.request({
                    url: '/authapi/rest/setmapid/'+mapId,
                    method: 'GET'
                });
            }, function (error) {
                bootbox.alert(error.email);
            });
        }
    })
    .controller('NewPasswordCtrl', function ($modal, $routeParams) {
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
    })
    .controller('NewPasswordInstanceCtrl', function ($modalInstance, uid, token, djangoAuth, AlertService) {
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
    })
    .controller('EditProfileCtrl', function ($modalInstance, djangoAuth, AlertService) {
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
    })
    .run(function (djangoAuth) {
        djangoAuth.initialize('/authapi/rest', true);
    });
