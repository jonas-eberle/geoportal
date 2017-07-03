(function() {
    'use strict';

    angular
        .module('webgisApp.csw')
        .service('csw', csw);

    csw.$inject = ['djangoRequests', '$uibModal'];
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
            },
            'search_geoss': function(text) {
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
                $modal.open({
                    bindToController: true,
                    controller: 'GEOSSSearchResultsModalCtrl',
                    controllerAs: 'gsrm',
                    templateUrl: subdir+'/static/includes/searchresults_geoss.html',
                    backdrop: 'static',
                    resolve: {
                        title: function() {return 'Search results for: '+text; },
                        searchData: function() {return searchData;}
                    }
                });
            }
        };
        return service;
    }
})();