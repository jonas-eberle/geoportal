(function() {
    'use strict';

    angular
        .module('webgisApp.core')
        .run(runBlock);

    runBlock.$inject = ['djangoRequests'];
    function runBlock(djangoRequests) {
        djangoRequests.initialize(subdir, true);
    }
})();