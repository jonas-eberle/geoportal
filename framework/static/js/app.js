'use strict';

angular.module('webgisApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'dndLists',
    'nsPopover',
    'ui.bootstrap-slider',
    'angular.filter'
])
    .service('djangoRequests', function djangoRequests($q, $http, $cookies) {

            var service = {
                'API_URL': '',
                // Set use_session to true to use Django sessions to store security token.
                // Set use_session to false to store the security token locally and transmit it as a custom header.
                'use_session': true,
                'request': function(args){
                    // Let's retrieve the token from the cookie, if available
                    if ($cookies.token) {
                        $http.defaults.headers.common.Authorization = 'Token ' + $cookies.token;
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
                            'X-CSRFToken': $cookies['csrftoken']
                        },
                        params: params,
                        data: data
                    }).success(angular.bind(this, function(data, status){
                        deferred.resolve(data, status);
                    })).error(angular.bind(this, function(data, status, headers, config){
                        // Set request status
                        if (typeof(data) == 'object') {
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
                    }));
                    return deferred.promise;
                },
                'initialize': function (url, sessions) {
                    this.API_URL = url;
                    this.use_session = sessions;
                }
            };
            return service;
    })
    .run(function (djangoRequests) {
        djangoRequests.initialize(subdir, true);
    })
    .service('AlertService', function AlertService($rootScope) {
        var sharedService = {
            alert: null,
            'addAlert': function (alert) {
                this.alert = alert;
                $rootScope.$broadcast('alert.added');
            }
        };
        return sharedService;
    })
    .controller('AlertCtrl', function ($scope, AlertService) {
        $scope.alerts = [];

        $scope.$on('alert.added', function () {
            $scope.alerts = [AlertService.alert];
        });

        $scope.closeAlert = function () {
            $scope.alerts = [];
        };
    })
    .controller('RouteAlertCtrl', function ($scope, $route, AlertService) {
        AlertService.addAlert({'type': $route.current.alertType, 'msg': $route.current.alertMsg});
    })
    .controller('ModalInstanceCtrl', function ($scope, $modal, $modalInstance, data, title) {
        $scope.value_passed = data;
        $scope.title = title;
        $scope.close = function () {
            $modalInstance.close();
        };
    })
    .controller('InfoCtrl', function ($scope, $modal, mapviewer) {
        $scope.info = function () {
            try {
                _paq.push(['setCustomUrl', '/info']);
                _paq.push(['setDocumentTitle', 'Info']);
                _paq.push(['trackPageView']);
            } catch (err) {}
           $modal.open({
                controller: 'ModalInstanceCtrl',
                template: $('#info_text').html(),
                //templateUrl: subdir+'/static/includes/window_info.html?v=3',
                backdrop: 'static',
                resolve: {
                        data: function() {return {};},
                        title: function() {return '';}
                }
            });
        };
        $scope.help = function () {
           try {
                _paq.push(['setCustomUrl', '/help']);
                _paq.push(['setDocumentTitle', 'Help']);
                _paq.push(['trackPageView']);
           } catch (err) {}
           
           if(mapviewer.title == 'SWOS') {
               var url = subdir + '/static/help/help_swos.html';
           }
           else{
               var url = subdir + '/static/help/help.html';
           } 
            
           $modal.open({
                controller: 'ModalInstanceCtrl',
                templateUrl: url,
                backdrop: 'static',
                resolve: {
                        data: function() {return {};},
                        title: function() {return '';}
                }
            });
        };
        $scope.credits = function () {
           try {
                _paq.push(['setCustomUrl', '/credits']);
                _paq.push(['setDocumentTitle', 'Credits']);
                _paq.push(['trackPageView']);
           } catch (err) {}
            
           $modal.open({
                controller: 'ModalInstanceCtrl',
                templateUrl: subdir + '/static/includes/credits.html',
                backdrop: 'static',
                resolve: {
                        data: function() {return {};},
                        title: function() {return '';}
                }
            });
        };
        $scope.imprint = function () {
           try {
                _paq.push(['setCustomUrl', '/imprint']);
                _paq.push(['setDocumentTitle', 'Imprint']);
                _paq.push(['trackPageView']);
           } catch (err) {}
        };
    })
    .directive('modalDraggable', function () {
      return {
        restrict: 'A',
        link: function(scope, element) {
          $(element).parent().drags({handle:'.modal-header'});
        }
      };
    })
;
