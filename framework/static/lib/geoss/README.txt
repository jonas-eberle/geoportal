This is sample site that uses Geoss Search Widget. The widget is in its very early development phase and now it is just able to generate simple result list with buttons but without any interaction with map.


*** Prerequisites ***

1. Extract js, css, images and fonts directories into your project (relative paths between them must be preserved).
2. Add javascript and css dependencies (see index.html):
	<link href="css/jquery-ui.css" rel="stylesheet">
	<link href="css/jquery-ui-2.css" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/ol.css" rel="stylesheet" type="text/css">
	<link href="css/custom.min.css" rel="stylesheet" type="text/css">

	<script src="js/jQuery.js"></script>
	<script src="js/jquery-ui.min.js"></script>
	<script src="js/jquery.dotdotdot.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/ol.js"></script>
	<script src="js/elasticsearch.jquery.min.js"></script>

3. Add Geoss Search Widget script before your main js script (see index.html):
	<script src="js/geossSearchWidget.min.js"></script>

4. Create HTML containers, with 'geoss' class, where results, popups, and pagination will be stored, e.g.:
	<div class="results geoss"></div>
	<div class="pagination geoss"></div>
	<div class="popups geoss"></div>
	Next, make reference in your js file to the containers e.g.:
	Geoss.resultsContainer = '#geoss-search-widget .results';
	Geoss.paginationContainer = '#geoss-search-widget .pagination';
	Geoss.popupsContainer = 'footer .popups';

5. Create reference to your map, e.g.:
	Geoss.mapUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=[yourPrivateKey]';
	The map preview is located in metainfo popup. Currently the widget uses Openlayers' tile maps (new ol.layer.Tile, let us know if different format is needed).


*** Usage ***

Function Geoss.search(params, successCallback, failureCallback) sends request to Discovery and Access Broker (DAB) and presents results in specified container. Arguments:
- 'params' is an object with request parameters taken from your search form, e.g.:
	var params = new Object();
    params.query = "Water';
    params.bbox = "-180,-90,180,90";
    params.rel = "CONTAINS";
    params.si = 1;
    params.sources = "geodabgbifid";

- 'successCallback' is a function called on successful response, designed to interact with UI on your site. This function has access to XML with DAB response, e.g.:
	function successCallback(dataXml) {
	    updatePagination(dataXml);
	    progressBar.hide();

	    // other instructions here ...
	}

- 'failureCallback' is a function designed to interact with UI on your site in case of an error, e.g.:
	function failureCallback(error) {
	    if (error == "ajax") {
	        alert("AJAX request failed.");
	    } else if (error == "xhr") {
	        alert("Wrong response code.");
	    } else if (error == "noresults") {
	        alert("No results to show.");
	    }
	    progressBar.hide();
	    clearPagination();

	    // other instructions here ...
	}


*** Additional info ***

@font-face rule at the beginning of custom.css file might change all the fonts on your site. The rule can be removed if necessary.
After moving request-broker from esaportal.eu to ospartner.pl, for some reason much more requests end up with failure.
