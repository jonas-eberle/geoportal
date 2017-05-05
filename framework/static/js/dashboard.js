/* Alte Popups ausblenden, bevor ein neues eingeblendet wird */
$(this).on('show.bs.popover', function () {
  $('.popover').popover('hide')
});

/* Used for mobile version */
$('#toggle-sidebar').on('click', function() {
    var panel = $('#sidebar');

    if (panel.hasClass("visible")) {
        panel.removeClass('visible').animate({'left':'100%'},600);
    } else {
        panel.addClass('visible').animate({'left':'2%'},600);
    }
    return false;
});

/* When a form element is being focused, the dropdown-menu is closed, with this code we prevent this behaviour */
$('.dropdown-menu select, .dropdown-menu textearea').click(function(e) {
    e.stopPropagation();
});

/* Additional JavaScript for search box */
function opensearchextend() {
  $( "#search-extend" ).animate({
    height: 42
  }, 500, function() {}); 
}

function closesearchextend() {
  $( "#search-extend" ).delay(500).animate({
    height: 0
  }, 500, function() {}); 
}

$('#map_search').click(function(e) {
    opensearchextend();
});

$('#map_search').mouseleave(function(e) {
    closesearchextend();
});
/* End additional JavaScript for search box */