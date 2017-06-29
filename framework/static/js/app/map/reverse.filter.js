(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .filter('reverse', function() {
            return function(items) {
                return items.slice().reverse();
            };
        });
})();
