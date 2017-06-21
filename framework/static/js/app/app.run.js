(function() {
    'use strict';

    angular
        .module('webgisApp')
        .run(runBlock);

    runBlock.$inject = ['djangoRequests'];
    function runBlock(djangoRequests) {
            djangoRequests.initialize(subdir, true);
        }
})();