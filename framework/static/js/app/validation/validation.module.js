(function() {
    'use strict';

    angular
        .module('webgisApp.validation', [
            'webgisApp.core',
            'webgisApp.map',
            'webgisApp.tracking',
            'webgisApp.legend'
        ]);

    angular.module('webgisApp').requires.push('webgisApp.validation');
})();