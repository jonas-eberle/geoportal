(function() {
    'use strict';

    angular.module('webgisApp')
        .service('csw', csw)
        .controller('SearchBoxCtrl', SearchBoxCtrl)
        .controller('SearchResultsModalCtrl', SearchResultsModalCtrl);

    csw.$inject = ['djangoRequests', '$modal'];
    function csw(djangoRequests, $modal) {
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
            'setPage': function(page) { },
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
                        bindToController: true,
                        controller: 'SearchResultsModalCtrl',
                        controllerAs: 'srm',
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
    }

    SearchBoxCtrl.$inject = ['csw'];
    function SearchBoxCtrl(csw){
        var sb = this;

        sb.search = search;
        sb.text = '';

        //--------------------------------------------------------------------------------------------------------------

        function search() {
            csw.setMapViewer(mapId);
            csw.search(sb.text);
        }
    }

    SearchResultsModalCtrl.$inject = ['csw', 'mapviewer', '$modal', '$modalInstance', 'djangoRequests', 'title', 'results', 'searchData'];
    function SearchResultsModalCtrl(csw, mapviewer, $modal, $modalInstance, djangoRequests, title, results, searchData) {
        var srm = this;

        srm.addLayerToMap = addLayerToMap;
        srm.close = $modalInstance.close;
        srm.currentPage = 1;
        srm.maxSize = 10;
        srm.page_changed = pageChanged;
        srm.results = results;
        srm.searchData = searchData;
        srm.showMetadata = showMetadata;
        srm.title = title;

        //--------------------------------------------------------------------------------------------------------------

        function addLayerToMap(layer) {
            var olLayer = mapviewer.addLayer(layer);
            if (olLayer instanceof ol.layer.Base) {
                var layerObj = olLayer.get('layerObj');
                var extent = [layerObj.west, layerObj.south, layerObj.east, layerObj.north].map(parseFloat);
                extent = ol.proj.transformExtent(extent, "EPSG:4326", mapviewer.map.getView().getProjection().getCode());
                mapviewer.map.getView().fit(extent);
            }
        }

        function showMetadata(layer) {
            $modal.open({
                bindToController: true,
                controller: 'ModalInstanceCtrl',
                controllerAs: 'mi',
                templateUrl: subdir+'/static/includes/metadata.html',
                resolve: {
                    data: function() {return layer;},
                    title: function() {return layer.title;}
                }
            });
        }

        function pageChanged() {
            srm.searchData.start = srm.currentPage*srm.maxSize - srm.maxSize;
            $('#loading-div').show();
            djangoRequests.request({
                url: '/csw/search/'+csw.server,
                method: 'POST',
                data: srm.searchData
            }).then(function(data){
                srm.results = data;
                $('#loading-div').hide();
            });

        }
    }
})();