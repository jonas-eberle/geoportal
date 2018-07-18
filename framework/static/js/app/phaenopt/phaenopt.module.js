(function() {
    'use strict';

    angular
        .module('webgisApp.phaenopt', [
            'webgisApp.core',
            'webgisApp.map',
            'webgisApp.tracking',
            /* 3rd party modules */
            'nvd3',
            'infinite-scroll',
            'webgisApp.legend',
            'ngSanitize'
        ]);

    angular.module('webgisApp').requires.push('webgisApp.phaenopt');
    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);
})();
