(function() {
    'use strict';

    angular
        .module('webgisApp')
        .filter('reverse', function() {
            return function(items) {
                return items.slice().reverse();
            };
        });
})();
