(function() {
    'use strict';

    angular
        .module('webgisApp.core')
        .service('djangoRequests', djangoRequests);

    djangoRequests.$inject = ['$q', '$http', '$cookies'];
    function djangoRequests($q, $http, $cookies) {

        var service = {
            'API_URL': '',
            // Set use_session to true to use Django sessions to store security token.
            // Set use_session to false to store the security token locally and transmit it as a custom header.
            'use_session': true,
            'request': function(args){
                // Let's retrieve the token from the cookie, if available
                if ($cookies.get('token')) {
                    $http.defaults.headers.common.Authorization = 'Token ' + $cookies.get('token');
                }
                $http.defaults.headers.common["Cache-Control"] = "no-cache";
                $http.defaults.headers.common.Pragma = "no-cache";
                $http.defaults.headers.common["If-Modified-Since"] = "0";

                // Continue
                params = args.params || {};
                args = args || {};
                var deferred = $q.defer(), url = this.API_URL + args.url, method = args.method || "GET", params = params, data = args.data || {};
                // Fire the request, as configured.
                $http({
                    url: url,
                    withCredentials: this.use_session,
                    method: method.toUpperCase(),
                    headers: {
                        'X-CSRFToken': $cookies.get('csrftoken')
                    },
                    params: params,
                    data: data
                }).then((angular.bind(this, function(data, status){
                    deferred.resolve(data.data, status);
                })),(angular.bind(this, function(data, status, headers, config){
                    // Set request status
                    if (typeof data  === 'object') {
                        data.status = status;
                    }
                    if (status == 0) {
                        if (data == "") {
                            data = {};
                            data['status'] = 0;
                            data['non_field_errors'] = ["Could not connect. Please try again."];
                        }
                        // or if the data is null, then there was a timeout.
                        if (data == null) {
                            // Inject a non field error alerting the user
                            // that there's been a timeout error.
                            data = {};
                            data['status'] = 0;
                            data['non_field_errors'] = ["Server timed out. Please try again."];
                        }
                    }
                    deferred.reject(data, status, headers, config);
                })));
                return deferred.promise;
            },
            'initialize': function (url, sessions) {
                this.API_URL = url;
                this.use_session = sessions;
            }
        };
        return service;
    }
})();