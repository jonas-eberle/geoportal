(function () {
    'use strict';

    angular.module('webgisApp.csw')
        .controller('GEOSSSearchResultsModalCtrl', GEOSSSearchResultsModalCtrl);

    GEOSSSearchResultsModalCtrl.$inject = ['$scope', 'csw', 'mapviewer', '$uibModal', '$uibModalInstance', 'djangoRequests', 'title', 'searchData'];
    function GEOSSSearchResultsModalCtrl($scope, csw, mapviewer, $modal, $modalInstance, djangoRequests, title, searchData){
        var gsrm = this;
        gsrm.searchData = searchData;
        gsrm.close = close;
        gsrm.actionBeforeRequest = actionBeforeRequest; 
        gsrm.successCallback = successCallback;
        gsrm.successCallBackFirst = successCallBackFirst;
        gsrm.failureCallback = failureCallback;
        gsrm.metadataCallback = metadataCallback; 
        gsrm.downloadBoxCallback = downloadBoxCallback;
        gsrm.addLayerCallback = addLayerCallback;
        gsrm.submitQuery = submitQuery;
        gsrm.submitInitialQuery = submitInitialQuery;
        gsrm.searchKeyUp = searchKeyUp;
        gsrm.clearAll = clearAll;
        gsrm.updatePagination = updatePagination;
        gsrm.firstCall = true;
        
        Geoss.actionBeforeRequest = gsrm.actionBeforeRequest;
        Geoss.successCallback = gsrm.successCallback;
        Geoss.failureCallback = gsrm.failureCallback;
        Geoss.metadataCallback = gsrm.metadataCallback;
        Geoss.downloadBoxCallback = gsrm.downloadBoxCallback;
        Geoss.addLayerCallback = gsrm.addLayerCallback;
        
        Geoss.searchContainer = '#geoss-search-widget .search';
        //Geoss.resultsContainer = '#geoss-search-widget .results';
        //Geoss.paginationContainer = '#geoss-search-widget .pagination';
        Geoss.popupsContainer = '.popups-container';
        Geoss.layersContainer = '.layers-container';
        
        Geoss.imagesLocation = '/static/lib/geoss/';
        Geoss.mapBoxAccessToken = 'pk.eyJ1IjoiZWJlcmxlIiwiYSI6ImNpZXR1YndyNTAwNGt0Ym0wcW93dmM1bHoifQ.k0_TYhDwtSyGi6hWrJB0ag';
        Geoss.mapUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + Geoss.mapBoxAccessToken; // You can use Mapbox, Google, OSM or other map API
        Geoss.mainMap = mapviewer.map;        
        
        if ($('.layers-container').html() == "") {
            console.log('init layer box');
            addBBoxInteraction(Geoss.mainMap);
            initLayerBox();
        }
        
        gsrm.submitInitialQuery();
        
        function close() {
            removeBboxLayers(mapviewer.map);
            $modalInstance.close();
        }
        
        // Called before requesting new data (on search, next/previous page, drill down, ...)
        function actionBeforeRequest() {
            console.log('actionBeforeRequest called');
            $('#loading-div').show();
        }
        
        function successCallBackFirst() {
            console.log('successCallBackFirst');
            $('.modal-backdrop').remove();
            var left = angular.element('.geoss-window .modal-dialog').offset().left;
            var top = angular.element('.geoss-window .modal-dialog').offset().top;
            var width = angular.element('.geoss-window .modal-dialog').width();
            angular.element('.geoss-window').removeClass('modal').addClass('mymodal');
            $('.modal-content', angular.element('.geoss-window')).css('left', left).css('top', -30).css('width', width);
        }
        
        // Called on successful response
        function successCallback(dataXml) {
            $('#loading-div').hide();
            if (gsrm.firstCall === true) {
                gsrm.successCallBackFirst();
                gsrm.firstCall = false;
            }
            gsrm.updatePagination(dataXml);
            // console.log(dataXml.html());
            
            $('.results-icons button.map').click(function(){
                gsrm.dialog = bootbox.dialog({
                    title: 'View layers',
                    className: 'geoss-layers',
                    message: $('#geoss-popup .modal-body').clone().html(),
                    backdrop: true,
                    closeButton: false,
                    buttons: {
                        cancel: {
                            label: "Close",
                            className: "btn-default",
                            callback: function () {
                                $('#geoss-popup .modal-body .popups-container.geoss').html('');
                            }
                        }
                    }
                });
            });
            /*
            $('.results-icons button.imgBox, .results-icons button.otherBox').click(function(){
                
            });
            */
        }
        
        // Called on error
        function failureCallback(error) {
            $('#loading-div').hide();
            if (error == "ajax") {
                alert("AJAX request failed.");
            } else if (error == "xhr") {
                alert("Wrong response code.");
            } else if (error == "noresults") {
                alert("No results to show.");
            }
            
            removeBboxLayers(mapviewer.map)
        
            // other instructions here ...
        }
        
        // Called after downloadBox window show-up
        function downloadBoxCallback() {
            console.log('downloadBoxCallback');
            var dialog = bootbox.dialog({
                title: 'View download options',
                className: 'geoss-layers',
                message: $('#geoss-popup .modal-body').clone().html(),
                backdrop: true,
                closeButton: false,
                buttons: {
                    cancel: {
                        label: "Close",
                        className: "btn-default",
                        callback: function () {
                            $('#geoss-popup .modal-body .popups-container.geoss').html('');
                        }
                    }
                }
            });
        }
        
        // Called after metadata window show-up
        function metadataCallback() {
            var dialog = bootbox.dialog({
                title: 'Metadata',
                className: 'geoss-metadata',
                message: $('#geoss-popup .modal-body').clone().html(),
                backdrop: true,
                closeButton: false,
                buttons: {
                    cancel: {
                        label: "Close",
                        className: "btn-default",
                        callback: function () {
                            $('#geoss-popup .modal-body .popups-container.geoss').html('');
                        }
                    }
                }
            });
            $('#loading-div').hide();
        }
        
        function addLayerCallback(layer, element) {
            console.log(element);
            console.log(layer);
            
            var layer_new = {}
            layer_new['title'] = element.attr('namelayer');
            layer_new['olLayer'] = layer;
            layer_new['ogc_type'] = layer.layerType;
            layer_new['geoss_metainfo'] = element.attr('data-metainfo');
            var bbox = element.attr('data-bbox');
            if (bbox != '' && bbox != null) {
                bbox = element.attr('data-bbox').split(' ');
                layer_new['south'] = parseFloat(bbox[0]);
                layer_new['north'] = parseFloat(bbox[2]);
                layer_new['west'] = parseFloat(bbox[1]);
                layer_new['east'] = parseFloat(bbox[3]);
            }
            
            // Add layer to map and layer container (if not already added) + include tileReloadHandler
            var elementUrl = element.attr('data-value');
            if (layer && !getLayerByName(elementUrl)) {
                layer.getSource().on('tileloaderror', function(event) {
                    tileReloadHandler(layer, event);
                });
                mapviewer.addLayer(layer_new);
                DAB.View.addLayerToBoxLayers(element);
                //Geoss.showBoundingBoxes = false;
            }
            
            // Present layer (tick checkbox, hide bboxes, close popup, zoom on layer)
            //$('.inner-layer-box .checkbox-decoration input[data-value="' + elementUrl + '"]').trigger('click');
            
            /*
            if( Geoss.showBoundingBoxes && element.closest('.black2').is(':visible')) {
                $('.inner-layer-box .checkbox-decoration .bbox').trigger('click');
            }
            */
            
            //hide wms layer window
            $('#geoss-popup .modal-body .popups-container.geoss').html('');
            gsrm.dialog.modal('hide');
            $('#bbox_layers').click();
            //$('.black2 .top-strip .close-popup').trigger('click');
        
            var ind = element.closest('.black2.wms').attr('class');
            if ((element.siblings('label').is(':hover'))) {
                var idOf = ind.indexOf('show_');
                if (idOf > -1) {
                    ind = ind.substring(idOf + 5, idOf.length);
                    ind = ind.replace('active', '').trim();
                }
                $('.add_map.showWmsOnMap_' + ind).trigger('click');
            }
            
               
        }
        
        function searchKeyUp(e) {
            if (e.which == 13) {
                gsrm.submitQuery();
            }
        }
        
        // Sets basic parameters and sends request
        function submitInitialQuery() {
            
            if (!DAB.View.searchInProgress) {
                console.log(searchData);
                var params = new Object();
                params.rel = "CONTAINS";
                
                if ('text' in searchData) {
                    params.query = searchData['text'];
                } else {
                    params.query = '';
                }
                if ('source' in searchData) {
                    params.sources = searchData['source'];
                }
                if ('extent' in searchData) {
                    params.bbox = searchData.extent.join(',')
                    params.rel = "OVERLAPS";
                } else {
                    params.bbox = ",,,";
                }
                if ('rel' in searchData) {
                    params.rel = searchData.rel;
                }
                
                params.si = 1;
                
                /* Geoss Search Widget [Search] */
                $('#loading-div').show();
                Geoss.search(params, Geoss.successCallback, Geoss.failureCallback);
            }
        }
        
        function submitQuery() {
            if (!DAB.View.searchInProgress) {
                var params = new Object();
                params.query = $('#gsw_query_search').val();
                params.rel = "CONTAINS";
                params.si = 1;
                
                if ('source' in searchData) {
                    params.sources = searchData['source'];
                }
                if ('extent' in searchData) {
                    params.bbox = searchData.extent.join(',')
                    params.rel = "OVERLAPS";
                } else {
                    params.bbox = ",,,";
                }
                if ('rel' in searchData) {
                    params.rel = searchData.rel;
                }
                
                //params.sources = "geodabgbifid"; //GBIF catalog
                /* Geoss Search Widget [Search] */
                $('#loading-div').show();
                Geoss.search(params, Geoss.successCallback, Geoss.failureCallback);
            }
        }

        // Clears search bar and results
        function clearAll() {
            $(gsw_query_search).val('');
            $(Geoss.resultsContainer).html('');
            $(Geoss.popupsContainer).html('');
            $(Geoss.paginationContainer).html('');
            removeBboxLayers(mapviewer.map);
        }

        
        // Sets new page numbering
        function updatePagination(resultSet) {
            initializePaginationContainer();
            var totalResults = resultSet.find('totalResults').text();
            var startIndex = resultSet.find('startIndex').text();
            var endIndex = parseInt(startIndex) + parseInt(resultSet.find('itemsPerPage').text()) - 1;
            
            if (endIndex >= totalResults) {
                endIndex = totalResults;
                $('.inner-pagination-container span.next').addClass('disabled');
            } else {
                $('.inner-pagination-container span.next').removeClass('disabled');
            }
        
            if (startIndex == 1) {
                $('.inner-pagination-container span.prev').addClass('disabled');
            } else {
                $('.inner-pagination-container span.prev').removeClass('disabled');
            }
        
            if (totalResults == 0) {
                $(Geoss.paginationContainer).hide();
                startIndex = 0;
            } else {
                $(Geoss.paginationContainer).show();
            }
        
            $('.inner-pagination-container .numbers-pagination').text(startIndex + "-" + endIndex + " of " + totalResults);
        }

    }
})();