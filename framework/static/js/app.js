(function() {
    'use strict';

    angular.module('webgisApp', [
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ui.bootstrap',
        'dndLists',
        'nsPopover',
        'ui.bootstrap-slider',
        'angular.filter',
        'nvd3'
    ])
        .service('djangoRequests', djangoRequests)
        .service('AlertService', AlertService)
        .controller('AlertCtrl', AlertCtrl)
        .controller('RouteAlertCtrl', RouteAlertCtrl)
        .controller('ModalInstanceCtrl', ModalInstanceCtrl)
        .controller('InfoCtrl', InfoCtrl)
        .directive('modalDraggable', modalDraggable)
        .run(['djangoRequests', function (djangoRequests) {
            djangoRequests.initialize(subdir, true);
        }]);

    djangoRequests.$inject = ['$q', '$http', '$cookies'];
    function djangoRequests($q, $http, $cookies) {

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
                }).then((angular.bind(this, function(data, status){
                    deferred.resolve(data.data, status);
                })),(angular.bind(this, function(data, status, headers, config){
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

    AlertService.$inject = ['$rootScope'];
    function AlertService($rootScope) {
        var sharedService = {
            alert: null,
            'addAlert': function (alert) {
                this.alert = alert;
                $rootScope.$broadcast('alert.added');
            }
        };
        return sharedService;
    }

    AlertCtrl.$inject = ['$scope', 'AlertService'];
    function AlertCtrl($scope, AlertService) {
        var ac = this;

        ac.alerts = [];
        ac.closeAlert = closeAlert;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('alert.added', function () {
            ac.alerts = [AlertService.alert];
        });

        //--------------------------------------------------------------------------------------------------------------

        function closeAlert() {
            ac.alerts = [];
        }
    }

    RouteAlertCtrl.$inject = ['$route', 'AlertService'];
    function RouteAlertCtrl($route, AlertService) {
        AlertService.addAlert({'type': $route.current.alertType, 'msg': $route.current.alertMsg});
    }

    // TODO: remove $modal if not needed
    ModalInstanceCtrl.$inject = ['$modal', '$modalInstance', 'data', 'title'];
    function ModalInstanceCtrl($modal, $modalInstance, data, title) {
        var mi = this;

        mi.close = $modalInstance.close;
        mi.title = title;
        mi.value_passed = data;
    }

    InfoCtrl.$inject = ['$modal', 'mapviewer'];
    function InfoCtrl($modal, mapviewer) {
        var ic = this;

        ic.credits = credits;
        ic.help = help;
        ic.imprint = imprint;
        ic.info = info;

        //--------------------------------------------------------------------------------------------------------------

        function credits() {
            try {
                _paq.push(['setCustomUrl', '/credits']);
                _paq.push(['setDocumentTitle', 'Credits']);
                _paq.push(['trackPageView']);
            } catch (err) {
            }

            $modal.open({
                bindToController: true,
                controller: 'ModalInstanceCtrl',
                controllerAs: 'mi',
                templateUrl: subdir + '/static/includes/credits.html',
                backdrop: 'static',
                resolve: {
                    data: function() {return {};},
                    title: function() {return '';}
                }
            });
        }

        function help() {
            try {
                _paq.push(['setCustomUrl', '/help']);
                _paq.push(['setDocumentTitle', 'Help']);
                _paq.push(['trackPageView']);
            } catch (err) {
            }

            var url = subdir + '/static/help/help.html';
            if(mapviewer.title == 'SWOS') {
                url = subdir + '/static/help/help_swos.html';
            }

            $modal.open({
                bindToController: true,
                controller      : 'ModalInstanceCtrl',
                controllerAs    : 'mi',
                templateUrl     : url,
                backdrop        : 'static',
                resolve         : {
                    data : function(){return {};},
                    title: function(){return '';}
                }
            });
        }

        function imprint() {
            try {
                _paq.push(['setCustomUrl', '/imprint']);
                _paq.push(['setDocumentTitle', 'Imprint']);
                _paq.push(['trackPageView']);
            } catch (err) {}
        }

        function info() {
            try {
                _paq.push(['setCustomUrl', '/info']);
                _paq.push(['setDocumentTitle', 'Info']);
                _paq.push(['trackPageView']);
            } catch (err) {
            }
            $modal.open({
                bindToController: true,
                controller      : 'ModalInstanceCtrl',
                controllerAs    : 'mi',
                template        : $('#info_text').html(),
                //templateUrl: subdir+'/static/includes/window_info.html?v=3',
                backdrop        : 'static',
                resolve         : {
                    data : function(){return {};},
                    title: function(){return '';}
                }
            });
        }
    }

    modalDraggable.$inject = [];
    function modalDraggable() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $(element).parent().drags({handle:'.modal-header'});
            }
        };
    }
})();