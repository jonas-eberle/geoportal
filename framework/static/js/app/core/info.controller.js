(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('InfoCtrl', InfoCtrl);

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
})();