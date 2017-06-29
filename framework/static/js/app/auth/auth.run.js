(function() {
    'use strict';

    angular
        .module('webgisApp.auth')
        .run(runBlock);

    runBlock.$inject = ['djangoAuth'];
    function runBlock(djangoAuth) {
            djangoAuth.initialize('/authapi/rest', true);
        }
})();