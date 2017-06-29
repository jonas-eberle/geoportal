(function() {
    'use strict';

    angular
        .module('webgisApp.auth')
        .service('djangoAuth', djangoAuth);

    djangoAuth.$inject = ['$q', '$http', '$cookies', '$rootScope', 'djangoRequests'];
    function djangoAuth($q, $http, $cookies, $rootScope, djangoRequests) {
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
                        $cookies.put('token', data.key);
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
                    $cookies.remove('token');
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
    }
})();