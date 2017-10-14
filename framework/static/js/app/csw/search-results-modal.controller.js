 (function() {
     'use strict';
 
     angular
          .module('webgisApp.csw')
          .controller('SearchResultsModalCtrl', SearchResultsModalCtrl);
          
    SearchResultsModalCtrl.$inject = ['csw', 'mapviewer', '$uibModal', '$uibModalInstance', 'djangoRequests', 'title', 'results', 'searchData'];
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