(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('GlobalDataCtrl', GlobalDataCtrl);

    GlobalDataCtrl.$inject = ['$scope', 'mapviewer', 'djangoRequests', '$cookies', '$routeParams', '$timeout', 'TrackingService', '$location', 'Attribution', '$uibModal', '$rootScope'];
    function GlobalDataCtrl($scope, mapviewer, djangoRequests, $cookies, $routeParams, $timeout, TrackingService, $location, Attribution, $modal, $rootScope) {
        var globalData = this;
        
        globalData.open_global_maps = true;
        globalData.layers = [];
        globalData.databases = [];
        globalData.maps_open = true;
        globalData.databases_open = false;
        globalData.geoss_open = true;
        globalData.externalDBSearchGeoss = externalDBSearchGeoss;
        
        $scope.$on('mapviewer.catalog_loaded', function () {
            
            if ($routeParams.view){
                if ($routeParams.view == 'global') {
                    $('#sidebar-tabs a:last').tab('show');
                }
            }
            
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/externaldb.json?continent=Global&geoss_search=true'
            }).then(function (data) {
                globalData.layers = data['layers'];
                globalData.databases = data['databases'];
                globalData.geoss = data['geoss'];
                
                $timeout(function(){
                   $('#global_geoss_select.selectpicker').selectpicker({
                      style: 'btn-info'
                    }); 
                   $('#global_geoss_select.selectpicker').selectpicker('refresh');
                   
                   if ($routeParams.global_layer_id){
                        $('#sidebar-tabs a:last').tab('show');
                        var layer_id = "#layer_vis_" + $routeParams.global_layer_id; // create layer id
                        $(layer_id).attr('checked', 'checked'); // mark as checked
                        angular.element(layer_id).triggerHandler('click'); // add layer to map
                        var closestPanel = $(layer_id).closest('.panel');
                        closestPanel.find('a').trigger('click'); // find headline and open accordion   
                    }
                   
                });
            });
        });
        
        function externalDBSearchGeoss(geossID, rel) {
            $('#loading-div').show();
            var searchData = {};
            
            // if geossID is a parameter, than direct search from national databases record
            // otherwise search within GEOSS is used
            if (geossID != null) {
                searchData["source"] = geossID;
                searchData["text"] = "";
            } else {
                searchData["text"] = globalData.geoss_text;
                if (typeof globalData.geoss_source != 'undefined') {
                    searchData["source"] = globalData.geoss_source.join(',');
                }
            }
            
            window.searchData = searchData;
            var geossWindow = $modal.open({
                bindToController: true,
                controller: 'GEOSSSearchResultsModalCtrl',
                controllerAs: 'gsrm',
                templateUrl: subdir+'/static/includes/searchresults_geoss.html',
                windowClass: 'geoss-window',
                backdrop: 'static',
                resolve: {
                    title: function() {return 'Search results'; },
                    searchData: function() {return searchData;}
                }
            }).rendered.then(function(){
                initSearchBar();
            });
        }
    }
})();
