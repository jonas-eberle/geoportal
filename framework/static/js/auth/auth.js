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
                }
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
                        if (data.first_name != "" && data.last_name != "") {
                            djangoAuth.user = data.first_name + ' ' + data.last_name;
                        } else {
                            djangoAuth.user = data.username;
                        }
                        djangoAuth.userData = data;
                        $rootScope.$broadcast("djangoAuth.logged_in", data);
                    })
                    $('#loading-div').hide();
                });
            },
            'logout': function () {
                var djangoAuth = this;
                return djangoRequests.request({
                    'method': "POST",
                    'url': this.API_URL+"/logout/"
                }).then(function (data) {
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
                }).then(function (data) {
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
                        if (data.first_name != "" && data.last_name != "") {
                            da.user = data.first_name + ' ' + data.last_name;
                        } else {
                            da.user = data.username;
                        }
                        da.userData = data;
                    })
                }
                var da = this;
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

        }
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
                controller: 'NewPasswordCtrl'
            });
    })
    .controller('LoginCtrl', function ($scope, $location, djangoAuth, $modal) {
        $scope.isCollapsed = true;
        $scope.authenticated = false;
        $scope.user = '';
        $scope.userData = {}

        djangoAuth.authenticationStatus(true).then(function () {
            $scope.authenticated = true;
            $scope.user = djangoAuth.user;
            $scope.userData = djangoAuth.userData;
        });
        // Wait and respond to the logout event.
        $scope.$on('djangoAuth.logged_out', function () {
            $scope.authenticated = false;
            $scope.user = djangoAuth.user;
            $scope.userData = {};
        });
        // Wait and respond to the log in event.
        $scope.$on('djangoAuth.logged_in', function () {
            $scope.authenticated = true;
            $scope.user = djangoAuth.user;
            $scope.userData = djangoAuth.userData;
        });

        $scope.$on('djangoAuth.registration_enabled', function ($broadCast, status) {
            $scope.registration_enabled = status;
        });


        $scope.model = {'username': '', 'password': ''};
        $scope.complete = false;
        $scope.login = function (formData) {
            djangoAuth.login($scope.model.username, $scope.model.password)
                .then(function (data) {
                    // success case
                    $scope.authenticated = true;
                }, function (data, status) {
                    $('#loading-div').hide();

                    // error case
                    $scope.errors = data;
                    var errors = '';

                    if (typeof(data) == 'object') {
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

                    var modalInstance = $modal.open({
                        controller: 'ModalInstanceCtrl',
                        template: '<div modal-draggable class="modal-header"><h1>Error while logging in!</h1></div><div class="modal-body">' + errors + '</div><div class="modal-footer"><button class="btn btn-primary" ng-click="close()">Close</button></div>',
					    resolve: {
		                        data: function() {return {};},
		                        title: function() {return '';}
		                }
					});
                });
        }

        $scope.logout = function () {
            djangoAuth.logout().then(function () {
            }, function (error) {
                bootbox.alert('Error while logging out...');
            });
        }

        $scope.editProfileForm = function () {
            var modalInstance = $modal.open({
                controller: 'EditProfileCtrl',
				templateUrl: subdir+'/static/includes/auth-edit-profile.html'
            })
        }

        $scope.registerForm = function () {
            var modalInstance = $modal.open({
                controller: 'RegisterUserCtrl',
				templateUrl: subdir+'/static/includes/auth-register.html'
            });
        }

        $scope.resetPasswordForm = function () {
            var modalInstance = $modal.open({
                controller: 'ResetPasswordCtrl',
				templateUrl: subdir+'/static/includes/auth-reset-password.html'
            });
        }

    })
    .controller('RegisterUserCtrl', function ($scope, $modalInstance, djangoAuth) {
        $scope.model = {};
        $scope.model.username = '';
        $scope.model.password1 = '';
        $scope.model.password2 = '';
        $scope.model.email = '';
        $scope.model.organization = '';

        $scope.register = function() {
            djangoAuth.register($scope.model.username, $scope.model.password1, $scope.model.password2, $scope.model.email, {'organization': $scope.model.organization})
                .then(function (data) {
                    bootbox.alert('Please check your emails for verfication!');
                    $scope.model.password1, $scope.model.password2, $scope.model.email, $scope.model.organization = '';
                    $scope.close();
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
        };

        $scope.close = function () {
            $modalInstance.close();
        };
    })
    .controller('ResetPasswordCtrl', function ($scope, $modalInstance, djangoAuth, djangoRequests) {
        $scope.email = '';
        $scope.submit = function () {
            djangoAuth.resetPassword($scope.email).then(function (data) {
                bootbox.alert(data.success);
                $scope.close();
                djangoRequests.request({
                    url: '/authapi/rest/setmapid/'+mapId,
                    method: 'GET'
                });
            }, function (error) {
                bootbox.alert(error.email);
            });
        };
        $scope.close = function () {
            $modalInstance.close();
        };
    })
    .controller('NewPasswordCtrl', function ($scope, $modal, $routeParams) {
        $scope.uid = $routeParams.uid;
        $scope.token = $routeParams.token;
        var modalInstance = $modal.open({
            resolve: {
                uid: function () {
                    return $scope.uid
                },
                token: function () {
                    return $scope.token
                }
            },
            templateUrl: subdir+'/static/includes/auth-new-password.html',
			controller: 'NewPasswordInstanceCtrl'
        });
		
		$scope.submit
		
    })
    .controller('NewPasswordInstanceCtrl', function ($scope, $modalInstance, uid, token, djangoAuth, AlertService) {
        $scope.uid = uid;
        $scope.token = token;
        $scope.password1 = '';
        $scope.password2 = '';
        $scope.changePassword = function () {
            if ($scope.password1 != $scope.password2 || $scope.password1 == '') {
                bootbox.alert('Passwords are not correct or empty, please check!');
                return false;
            }
            djangoAuth.confirmReset($scope.uid, $scope.token, $scope.password1, $scope.password2).then(function (data) {
                $scope.uid, $scope.token, $scope.password1, $scope.password2 = '';
                $modalInstance.close();
				AlertService.addAlert({'type': 'success', 'msg': 'Password has been reset with the new password.'});
            }, function (error) {
                bootbox.alert(error);
            })
        };
        $scope.close = function () {
            $modalInstance.close();
        };
    })
    .controller('EditProfileCtrl', function ($scope, $modalInstance, djangoAuth, AlertService) {
        $scope.userdata = {};
        djangoAuth.profile().then(function (data) {
            $scope.userdata = data;
        });
        $scope.delete = function () {
            bootbox.confirm('Really delete your account? (Cannot be undone!)', function (result) {

                if (result == true) {
                    djangoAuth.delete().then(function (data) {
                        $scope.close();
                        djangoAuth.profile();
                    }, function (error) {
                        console.log(error);
                        bootbox.alert('Error occurred');
                    })
                }
            })
        }

        $scope.save = function () {
            djangoAuth.updateProfile($scope.userdata).then(function (data) {
                $modalInstance.close();
                AlertService.addAlert({'type': 'success', 'msg': 'Profile updated!'});
            }, function (error) {
                console.log('update profile error');
                console.log(error)
            });
            if ($scope.userdata.password1 != null && $scope.userdata.password2 != null) {
                if ($scope.userdata.password1 != $scope.userdata.password2) {
                    bootbox.alert('Given passwords are not equal!');
                    return false;
                }
                djangoAuth.changePassword($scope.userdata.password1, $scope.userdata.password2).then(function (data) {
                    bootbox.alert('Successfully changed password.')
                }, function (error) {
                    bootbox.alert('An error occurred');
                });
            }
        };
        $scope.close = function () {
            $modalInstance.close();
        };
    }).run(function (djangoAuth) {
        djangoAuth.initialize('/authapi/rest', true);
    });
