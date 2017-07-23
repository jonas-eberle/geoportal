(function() {
    'use strict';

    angular
        .module('webgisApp.validation', [
            'webgisApp.core',
            'webgisApp.map',
            'webgisApp.tracking'
        ]);

    angular.module('webgisApp').requires.push('webgisApp.validation');
})();