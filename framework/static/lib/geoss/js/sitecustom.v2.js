var mapBoxAccessToken = "pk.eyJ1IjoicHphYm9yb3dza2kiLCJhIjoiY2lxamM0MjAzMDBkMGkwbWNjN2Y0NXl0dCJ9.yN5b5HdzNx5sgUUw4hTG3w";
var search_display_target = '#geoss-search-widget .search';

/* Geoss Search Widget [Config] */
Geoss.resultsContainer = '#geoss-search-widget .results';
Geoss.paginationContainer = '#geoss-search-widget .pagination';
Geoss.popupsContainer = '.popups-container';
Geoss.mapUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + mapBoxAccessToken; // You can use Mapbox, Google, OSM or other map API

drawMap();
initSearchBar();

/********************************************/
/*          Functions declarations          */
/********************************************/

// Draws initial map
function drawMap() {
    //access token from GEOSS
    
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
            	source: new ol.source.XYZ({
            		tileSize: [512, 512],
            		url: Geoss.mapUrl
            	})
            })
        ],
        view: new ol.View({
        	center: ol.proj.fromLonLat([20, 50]),
            zoom: 4,
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

// Initializes simple search bar
function initSearchBar() {
    if (!search_display_target) {
        console.log('Please provide an element to display searchbox, e.g. search_display_target = "body .searchbox";');
        return;
    }
    var searchBar =
        '<div class="gsw_search clearfix">' +
        '   <input placeholder="Enter search words ..." id="gsw_query_search" type="search">' +
        '   <button id="gsw_search_button" title="Search"></span>' +
        '   <button id="gsw_clear_button" title="Clear All" type="button"></button>' +
        '</div>';

    $(search_display_target).html(searchBar);
    $('#gsw_search_button').on('click', submitQuery);
    $('#gsw_query_search').on('keyup', function(e) {
        if (e.which == 13) {
            submitQuery();
        }
    });
    $('#gsw_clear_button').on('click', clearAll);
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
        alert("AJAX request failed.");
    } else if (error == "xhr") {
        alert("Wrong response code.");
    } else if (error == "noresults") {
        alert("No results to show.");
    }

    // other instructions here ...
}

// Sets basic parameters and sends request
function submitQuery() {
    var params = new Object();
    params.query = $('#gsw_query_search').val();
    params.bbox = ",,,";
    params.rel = "CONTAINS";
    params.si = 1;
    //params.sources = "geodabgbifid"; //GBIF catalog
    /* Geoss Search Widget [Search] */
    Geoss.search(params, successCallback, failureCallback);
}

// Clears search bar and results
function clearAll() {
    $(gsw_query_search).val('');
    $(Geoss.resultsContainer).html('');
    $(Geoss.popupsContainer).html('');
    $(Geoss.paginationContainer).html('');
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