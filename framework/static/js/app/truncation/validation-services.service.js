(function() {
    'use strict';

    angular
        .module('webgisApp.truncation')
        //copied from https://github.com/lorenooliveira/ng-text-truncate/blob/master/ng-text-truncate.js
        .factory("ValidationServices", ValidationServices);

    ValidationServices.$inject = [];
    function ValidationServices() {
        return {
            failIfWrongThreshouldConfig: function (firstThreshould, secondThreshould) {
                if ((!firstThreshould && !secondThreshould) || (firstThreshould && secondThreshould)) {
                    throw "You must specify one, and only one, type of threshould (chars or words)";
                }
            }
        };
    }
})();
