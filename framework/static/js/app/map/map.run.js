// TODO: move into config objects or constants
var fill = new ol.style.Fill({
    //color: 'rgba(12, 216, 247, 1)'
    color: 'rgba(255, 255, 255, 0.6)'
});
var stroke = new ol.style.Stroke({
    //color: 'rgba(0, 0, 204, 1)',
    color: '#319FD3',
    width: 1.25
});

// TODO: move into variable service objects
var popup;
var stationPopup;
//var mapColors = {};

(function() {
    'use strict';

    angular
        .module('webgisApp')
        .run(runBlock);
    
    runBlock.$inject = ['mapviewer'];
    function runBlock(mapviewer) {
        mapviewer.initialize(mapId, 'map', true); //id of mapviewer
    }
})();
