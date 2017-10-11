(function() {
    'use strict';

    angular
        .module('webgisApp.csw')
        .service('csw', csw);

    csw.$inject = ['djangoRequests', '$uibModal', '$timeout'];
    function csw(djangoRequests, $modal, $timeout) {
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
                    url: '/swos/searchresult.json?search_text=' + text,
                    method: 'GET'
                }).then(function (data) {
                    $('#loading-div').hide();
                    $modal.open({
                        bindToController: true,
                        controller: 'SearchResultsModalCtrl',
                        controllerAs: 'srm',
                        templateUrl: subdir + '/static/includes/searchresults.html',
                        backdrop: 'static',
                        windowClass: 'search-window',
                        resolve: {
                            title: function () {return 'Search results for: ' + text;},
                            results: function () {return data;},
                            searchData: function () {return searchData;
                            }
                        }
                    }).rendered.then(function () {
                        $('.modal-backdrop').remove();
                        $('.modal-backdrop').remove();
                        var left = angular.element('.search-window .modal-dialog').offset().left;
                        var top = angular.element('.search-window .modal-dialog').offset().top;
                        var width = 800;
                        angular.element('.search-window').removeClass('modal').addClass('mymodal');
                        $('.modal-content', angular.element('.search-window')).css('left', left).css('top', -30).css('width', width);
                    });
    });



            },
			'searchData': null,
            'search_geoss': function(text) {
                var csw = this;
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
				window.searchData = searchData;
                var geossModal = $modal.open({
                    bindToController: true,
                    controller: 'GEOSSSearchResultsModalCtrl',
                    controllerAs: 'gsrm',
                    templateUrl: subdir+'/static/includes/searchresults_geoss.html',
                    windowClass: 'geoss-window',
                    backdrop: 'static',
                    resolve: {
                        title: function() {return 'Search results for: '+text; },
                        searchData: function() {return searchData;}
                    }
                }).rendered.then(function(){
                    Geoss.initSearchBarCallback = csw.search_geoss_callback;
					initSearchBar();
					
                });
            },
			'search_geoss_callback': function() {
				var csw = this;
				var params = new Object();
	            params.aoiRelation = "CONTAINS";
	            console.log(window.searchData);
	            if ('text' in window.searchData) {
	                params.query = window.searchData['text'];
	            } else {
	                params.query = '';
	            }
	            if ('source' in window.searchData) {
	                params.sources = window.searchData['source'];
	            }
	            if ('extent' in window.searchData) {
	                params.aoiOption = 'Coordinates';
	                params.aoiBoundingBox = window.searchData.extent.join(',')
	                params.aoiRelation = "bbox_overlaps";
	            } else {
	                params.aoiOption = 'Coordinates';
	                params.aoiBoundingBox = ",,,";
	            }
	            if ('rel' in window.searchData) {
	                params.aoiRelation = window.searchData.rel;
	            }
	            
	            /* Geoss Search Widget [Search] */
	            console.log(params);
	            $('#loading-div').show();
	            Geoss.search(params);
			}
        };
        return service;
    }
})();