'use strict';

angular.module('webgisApp')
    .service('csw', function csw(djangoRequests, $rootScope, $modal) {
        var service = {
            'server': null,
            'setMapViewer': function(id) {
              this.server = id;
            },
            'results': {
                totalCount: 0,
                pages: 0,
                itemsPerPage: 10
            },
            'setPage': function(page) {

            },
            'search': function(text) {
                if (parseInt(this.server) === 0) {
                    bootbox.alert('Server ID is not valid!');
                    return false;
                }
                if (text == '') {
                    bootbox.alert('No search text given!');
                    return false;
                }
                
                try {
                    _paq.push(['trackSiteSearch',
                        // Search keyword searched for
                        text,
                        // Search category selected in your search engine. If you do not need this, set to false
                        "Mapsearch",
                        // Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
                        false
                    ]);
                } catch(err) {}
                
                var searchData = {"text":text};
                $('#loading-div').show();
                djangoRequests.request({
                    url: '/csw/search/'+this.server,
                    method: 'POST',
                    data: searchData
                }).then(function(data){
                    console.log(data);
                    //self.results.totalCount = data.totalCount
                    $('#loading-div').hide();
                    $modal.open({
                        controller: 'SearchResultsModalCtrl',
                        templateUrl: subdir+'/static/includes/searchresults.html',
                        backdrop: 'static',
                        resolve: {
                            title: function() {return 'Search results for: '+text; },
                            results: function() {return data; },
                            searchData: function() {return searchData;}
                        }
                    });
                });
            }
        };
        return service;
    })
    .controller('SearchBoxCtrl', function($scope, csw){

        $scope.text = '';

        $scope.search = function() {
            csw.setMapViewer(mapId);
            csw.search($scope.text);
        };

    })
    .controller('SearchResultsModalCtrl', function ($scope, csw, mapviewer, $modal, $modalInstance, djangoRequests, title, results, searchData) {
        $scope.title = title;
        $scope.results = results;
        $scope.searchData =searchData;

        $scope.addLayerToMap = function(layer) {
            var olLayer = mapviewer.addLayer(layer);
            var layerObj = olLayer.get('layerObj');
            var extent = [layerObj.west, layerObj.south, layerObj.east, layerObj.north].map(parseFloat);
            extent = ol.proj.transformExtent(extent, "EPSG:4326", mapviewer.map.getView().getProjection().getCode());
            mapviewer.map.getView().fit(extent);
        };

        $scope.showMetadata = function(layer) {
            $modal.open({
                controller: 'ModalInstanceCtrl',
                templateUrl: subdir+'/static/includes/metadata.html',
                resolve: {
                    data: function() {return layer;},
                    title: function() {return layer.title;}
                }
            });
        };


        $scope.currentPage = 1;
        $scope.maxSize = 10;
        $scope.page_changed = function() {
            $scope.searchData.start = $scope.currentPage*$scope.maxSize - $scope.maxSize;
            $('#loading-div').show();
            djangoRequests.request({
                url: '/csw/search/'+csw.server,
                method: 'POST',
                data: $scope.searchData
            }).then(function(data){
                $scope.results = data;
                $('#loading-div').hide();
            });

        };

        $scope.close = function () {
            $modalInstance.close();
        };
    });