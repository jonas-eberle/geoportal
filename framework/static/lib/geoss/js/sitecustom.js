var mapBoxAccessToken = "pk.eyJ1IjoicHphYm9yb3dza2kiLCJhIjoiY2lxamM0MjAzMDBkMGkwbWNjN2Y0NXl0dCJ9.yN5b5HdzNx5sgUUw4hTG3w";
var map;
drawMap();

/* Geoss Search Widget [Config] */
Geoss.searchContainer = '#geoss-search-widget .search';
Geoss.popupsContainer = '.popups-container';
Geoss.layersContainer = '.layers-container';
Geoss.imagesLocation = './'; // 'images' directory location in reference to index.html
Geoss.mapUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + mapBoxAccessToken; // You can use Mapbox, Google, OSM or other map API
Geoss.mainMap = map;
Geoss.actionBeforeRequest = actionBeforeRequest;
Geoss.successCallback = successCallback;
Geoss.failureCallback = failureCallback;
Geoss.metadataCallback = metadataCallback;
Geoss.synchronizeLayerList = synchronizeLayerList;
Geoss.addLayerCallback = addLayerCallback;
initSearchBar();
addBBoxInteraction(Geoss.mainMap);
initLayerBox();


/********************************************/
/*              Event handlers              */
/********************************************/

$('.layers-button').click(function(){
    $('.layers-container').slideToggle();
});

/********************************************/
/*          Functions declarations          */
/********************************************/

// Draws initial map
function drawMap() {
    //access token from GEOSS
    
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
            	source: new ol.source.XYZ({
            		tileSize: [512, 512],
            		url: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + mapBoxAccessToken
            	})
            })
        ],
        view: new ol.View({
        	center: ol.proj.fromLonLat([10, 10]),
            zoom: 2,
            minZoom: 1.5
        }),
        controls: ol.control.defaults({
          attributionOptions: ({
            collapsible: false
          })
        })
    });
	
    $('#map').data('map', map);
}

// Called before requesting new data (on search, next/previous page, drill down, ...)
function actionBeforeRequest() {
    console.log('actionBeforeRequest called');
}

// Called on successful response
function successCallback(dataXml) {
    console.log("Success!");
    updatePagination(dataXml);
    // other instructions here ...
}

// Called on error
function failureCallback(error) {
    if (error == "ajax") {
        GeossUtil.showMessage("Error", "AJAX request failed.");
    } else if (error == "xhr") {
        GeossUtil.showMessage("Error", "Wrong response code.");
    } else if (error == "noresults") {
        GeossUtil.showMessage("Error", "No results to show.");
    }

    removeBboxLayers(map);
    // other instructions here ...
}

// Called after metadata window show-up
function metadataCallback() {
	console.log('Metadata window loaded.');
}

// Function used to synchronize values of checkboxes in layer-popup of given resource (basing on active layers container)
function synchronizeLayerList() {
    $('.black2.active .checkbox-decoration input').each(function() {
        $(this).prop('checked', false);
    });
    $('.inner-layer-box input').each(function() {
        var menuUrl = $(this).attr('data-value');
        var entryChecked = $(this).prop('checked');
        $('.black2.active .checkbox-decoration input').each(function() {
            var popupUrl = $(this).attr('data-value');
            if (popupUrl == menuUrl && entryChecked) {
                $(this).prop('checked', true);
            }
        });
    });
}

// Called after choosing WMS/TMS layer from layer-popup of given resource; Design to add this layer on map;
// 'element' is a reference to clicked checkbox
function addLayerCallback(layer, element) {
    // Add layer to map and layer container (if not already added) + include tileReloadHandler
    var elementUrl = element.attr('data-value');
    if (layer && !getLayerByName(elementUrl)) {
        layer.getSource().on('tileloaderror', function(event) {
            tileReloadHandler(layer, event);
        });
        Geoss.mainMap.addLayer(layer);
        DAB.View.addLayerToBoxLayers(element);
    }
    
    // Present layer (tick checkbox, hide bboxes, close popup, zoom on layer)
    $('.inner-layer-box .checkbox-decoration input[data-value="' + elementUrl + '"]').trigger('click');
    
    if( Geoss.showBoundingBoxes && element.closest('.black2').is(':visible')) {
        $('.inner-layer-box .checkbox-decoration .bbox').trigger('click');
    }
    
    $('.black2 .top-strip .close-popup').trigger('click');

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
