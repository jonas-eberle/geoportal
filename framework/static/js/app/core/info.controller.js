(function() {
    'use strict';

    angular
        .module('webgisApp.core')
        .controller('InfoCtrl', InfoCtrl);

    InfoCtrl.$inject = ['$uibModal', 'mapviewer', '$compile'];
    function InfoCtrl($modal, mapviewer, $compile) {
        var ic = this;

        ic.credits = credits;
        ic.help = help;
        ic.imprint = imprint;
        ic.info = info;
        ic.welcome = welcome;
        ic.helpFilter = helpFilter;

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

        function helpFilter() {


            var url = subdir + '/static/includes/filter_help.html';

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

        function welcome() {
            try {
                _paq.push(['setCustomUrl', '/welcome']);
                _paq.push(['setDocumentTitle', 'Welcome']);
                _paq.push(['trackPageView']);
            } catch (err) {
                
            }
            
            var wetlandsCtrlScope = angular.element(document.getElementById('sidebar')).scope();
            bootbox.dialog({
                title: 'Welcome to the GEO Wetlands Community Portal',
                message: $compile($('#welcome_text').html())(wetlandsCtrlScope),
                backdrop: true,
                onEscape: true,
                className: 'welcome-dialog',
                buttons: {
                    confirm: {
                        label: 'Start Tour',
                        className: 'hidden-xs starttour',
                        callback: function () {
                            var sidebar = document.getElementById('wetland_sites');
                            var scope = angular.element(sidebar).scope();
                            var rootScope = scope.$root;
                            scope.$apply(function () {
                                rootScope.$broadcast("start_tour");
                            });
                        }
                    },
                    close: {label: 'Close'}
                }
            });
        }
    }
})();