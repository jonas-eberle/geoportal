//drawMap();
var search_display_target = '#geoss-search-widget .search';
initSearchBar();

/* Geoss Search Widget [Config] */
Geoss.resultsContainer = '#geoss-search-widget .results';


/********************************************/
/*          Functions declarations          */
/********************************************/

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
	$('#loading-div').hide();
    console.log("Success!");
    // console.log(dataXml.html());

    // other instructions here ...
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
	$('#loading-div').show();
    Geoss.search(params, successCallback, failureCallback);
}

// Clears search bar and results
function clearAll() {
    $(gsw_query_search).val('');
    $(Geoss.resultsContainer).html('');
}
