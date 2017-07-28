(function () {
    'use strict';

    angular.module('webgisApp.csw')
        .controller('GEOSSSearchResultsModalCtrl', GEOSSSearchResultsModalCtrl);

    GEOSSSearchResultsModalCtrl.$inject = ['$scope', 'csw', 'mapviewer', '$uibModal', '$uibModalInstance', 'djangoRequests', 'title', 'searchData'];
    function GEOSSSearchResultsModalCtrl($scope, csw, mapviewer, $modal, $modalInstance, djangoRequests, title, searchData){
        var gsrm = this;
        gsrm.searchData = searchData;
        gsrm.close = close;
        gsrm.search = search;
        gsrm.actionBeforeRequest = actionBeforeRequest; 
        gsrm.successCallback = successCallback;
        gsrm.successCallBackFirst = successCallBackFirst;
        gsrm.failureCallback = failureCallback;
        gsrm.metadataCallback = metadataCallback; 
        gsrm.downloadBoxCallback = downloadBoxCallback;
        gsrm.addLayerCallback = addLayerCallback;
        gsrm.clearAll = clearAll;
        gsrm.firstCall = true;
        
        Geoss.actionBeforeRequest = gsrm.actionBeforeRequest;
        Geoss.successCallback = gsrm.successCallback;
        Geoss.failureCallback = gsrm.failureCallback;
        Geoss.metadataCallback = gsrm.metadataCallback;
        Geoss.downloadBoxCallback = gsrm.downloadBoxCallback;
        Geoss.addLayerCallback = gsrm.addLayerCallback;
        
        Geoss.searchContainer = '#geoss-search-widget .search';
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
        
        function close() {
            removeBboxLayers(mapviewer.map);
            $('#clear_filters_button').trigger('click');
            $modalInstance.close();
        }
        
        function search() {
            var params = new Object();
            params.aoiRelation = "CONTAINS";
            
            if ('text' in searchData) {
                params.query = gsrm.searchData['text'];
            } else {
                params.query = '';
            }
            if ('source' in gsrm.searchData) {
                params.sources = gsrm.searchData['source'];
            }
            if ('extent' in gsrm.searchData) {
                params.aoiOption = 'Coordinates';
                params.aoiBoundingBox = gsrm.searchData.extent.join(',')
                params.aoiRelation = "bbox_overlaps";
            } else {
                params.aoiOption = 'Coordinates';
                params.aoiBoundingBox = ",,,";
            }
            if ('rel' in gsrm.searchData) {
                params.aoiRelation = gsrm.searchData.rel;
                if (params.aoiRelation == 'OVERLAPS') {
                    params.aoiRelation = 'bbox_overlaps';
                }
            }
            
            /* Geoss Search Widget [Search] */
            console.log(params);
            $('#loading-div').show();
            Geoss.search(params);
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
            updatePagination(dataXml);
            
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
            $('#layer_sites').click().click();
            gsrm.dialog.modal('hide');
            
            // hide geoss bbox layers on map
            if ($('#hideBoundingBoxes')[0].checked == true) {
                $('.layers-container.geoss .hide_layer .bbox').trigger('click');
            }
        
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

        // Clears search bar and results
        function clearAll() {
            $(gsw_query_search).val('');
            $(Geoss.resultsContainer).html('');
            $(Geoss.popupsContainer).html('');
            $(Geoss.paginationContainer).html('');
            removeBboxLayers(mapviewer.map);
        }
    }
})();