(function() {
    'use strict';

    angular
        .module('webgisApp.swos', [
            'webgisApp.core',
            'webgisApp.map',
            'webgisApp.tracking',
            /* 3rd party modules */
            'nvd3'
        ]);

    angular.module('webgisApp').requires.push('webgisApp.swos');
})();