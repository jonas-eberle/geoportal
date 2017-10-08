This is sample site that uses Geoss Search Widget, which is still in development phase.
Currently widget is able to:
 - generate searchbar with advanced filters option,
 - generate result list with buttons and popup windows,
 - initialize interactive features on map,
 - manage WMS/TMS layers.


*** Prerequisites ***

1. Extract js, css, images and fonts directories into your project (relative paths between them must be preserved).
2. Add javascript and css dependencies (see index.html):
	<link href="css/jquery-ui.css" rel="stylesheet">
	<link href="css/jquery-ui-2.css" rel="stylesheet">
	<link href="css/jquery.datetimepicker.min.css" rel="stylesheet">
	<link href="css/jquery.rateyo.min.css" rel="stylesheet">
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/bootstrap-multiselect.css" rel="stylesheet">
	<link href="css/ol.css" rel="stylesheet" type="text/css">
	<link href="css/custom.min.css" rel="stylesheet" type="text/css">

	<script src="js/jQuery.js"></script>
	<script src="js/jquery-ui.min.js"></script>
	<script src="js/jquery.dotdotdot.min.js"></script>
	<script src="js/jquery.datetimepicker.full.min.js"></script>
	<script src="js/jquery.rateyo.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/bootstrap-multiselect.js"></script>
	<script src="js/ol.js"></script>
	<script src="js/elasticsearch.jquery.min.js"></script>

3. Add Geoss Search Widget script before your main js script (see index.html):
	<script src="js/geossSearchWidget.min.js"></script>

4. Create HTML containers, with 'geoss' class, where results, popups, layers, and pagination will be stored, e.g.:
	<div class="search geoss"></div>
	<div class="popups geoss"></div>
	<div class="box-layers-map geoss"></div>
	Next, make reference in your js file to the containers e.g.:
	Geoss.searchContainer = '#geoss-search-widget .search';
	Geoss.popupsContainer = 'footer .popups';
	Geoss.layersContainer = '.box-layers-map';

5. Create a reference to your main map, e.g.:
	Geoss.mainMap = map; //ol object for main map on your site

   Then create a reference for your metainfo map, e.g.:
	Geoss.mapUrl = 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=[yourPrivateKey]';
   The map preview is located in metainfo popup. Currently the widget uses Openlayers' tile maps that are generated dynamically on each metainfo button click (let us know if format different than ol.layer.Tile is needed).

   Finally, make a reference to 'images' folder where Geoss images are stored, e.g.:
	Geoss.imagesLocation = './';
   or
	Geoss.imagesLocation = '/static/lib/geoss/';

6. If you wish to use Geolocation function in advanced filters, link Google Places API to your project:
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>


*** Usage ***

Function Geoss.initSearchBarCallback() can be used to perform an action just after the widget is load.

Function Geoss.actionBeforeRequest() is called before each request sent to DAB (on new search, page change, opening drill-down, opening metainfo).

Function Geoss.successCallback(dataXml) is called on successful response, designed to interact with UI on your site. This function has access to XML with DAB response, e.g.:
	function successCallback(dataXml) {
	    updatePagination(dataXml);
	    progressBar.hide();

	    // other instructions here ...
	}

Function Geoss.failureCallback(error) is designed to interact with UI on your site in case of an error, e.g.:
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

Function Geoss.metadataCallback() is called after metadata window shows up.

Function Geoss.downloadBoxCallback() is triggered when download windows appears.

Function Geoss.synchronizeLayerList() is called after opening layer window of given resource. It is designed to synchronize checkboxes of this window with active layers container.

Function Geoss.addLayerCallback(layer, element) is triggered after selecting layer from layer window of given resource. This is a place to load layer on your map. The 'element' is a reference to clicked checkbox.

Function initSearchBar() initializes Geoss Search Widget.

Function addBBoxInteraction(map) adds LMB, RMB and hover actions to bounding boxes on previously initialized map.

Function initLayerBox() appends custom layer-popup to previously defined Geoss.layersContainer.

Function Geoss.search(params) automatically fills search form and sends request to Discovery and Access Broker (DAB).
	Argument 'params' is an object with search form parameters listed below:
		- query - searching term,
		- fullAndOpenDataset - data only from Geoss Data Core; values: true, false,
		- viewid - id of predefined view catalogs,
		- sources - id of predefined source catalog,
		- dateFrom - start time of data collection (e.g. 2017-06-28),
		- dateTo - end time of data collection (e.g. 2017-06-29),
		- datePeriod - predefined time periods (values: last-week, last-month, last-year),
		- aoiRelation - relation of area of interest (bbox_contains, bbox_overlaps or bbox_disjoint),
		- aoiOption* - way of providing AOI (values: Coordinates, Geolocation, ContinentAndCountry),
		- aoiBoundingBox - box defining area of interest (format: W,S,E,N; e.g. -178.217,18.925,-68,71.351).
		- aoiGeolocation - name of AOI (just a label; used only if aoiOption is set to Geolocation).

	All parameters are defined as strings.
	* - aoiOption = Coordinates with provided aoiBoundingBox is most convinient option for use in this simple API. In fact, Geolocation and ContinentAndCountry come down to usage of coordinates as well.
	Example:
		var params = new Object();
		params.query = "Water";
		params.sources = "geodabgbifid"
		params.aoiOption = "Coordinates";
		params.aoiBoundingBox = "-100,-60,0,20";
		params.aoiRelation = "bbox_contains";
		params.datePeriod = "last-year";
		Geoss.search(params);

*** Additional info ***

* @font-face rule at the beginning of custom.css file might change all the fonts on your site. The rule can be removed if necessary.
* OpenLayers has been updated to version 4.2.0.
* New packages: datetimepicker, bootstrap-multiselect and rateYo are required in project. Both js and css files can be download from https://github.com/xdan/datetimepicker, https://github.com/davidstutz/bootstrap-multiselect and https://github.com/prrashi/rateYo respectively. They can also be found in widget directories.
* Geoss.resultsContainer and Geoss.paginationContainer are no longer in use. Now containers for search bar, result list and pagination bar are all merged into Geoss.searchContainer.
* Geoss.search(params) changed functionality and now it fills out search form and trigger new query. It gets only one argument with search form parameters (previously used arguments, success and failure callbacks, are now read from global Geoss object). Moreover, as Geoss.search refer to search form, not DAB, the parameters are different than before (take a look at list above).