(function() {
    'use strict';

    angular
        .module('webgisApp.swos', [
            'webgisApp.core',
            'webgisApp.map',
            'webgisApp.tracking',
            /* 3rd party modules */
            'nvd3',
            'infinite-scroll',
            'webgisApp.legend'
        ]);

    angular.module('webgisApp').requires.push('webgisApp.swos');
    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);
})();
