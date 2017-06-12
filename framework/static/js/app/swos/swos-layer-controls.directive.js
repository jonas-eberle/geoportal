(function() {
    'use strict';

    angular
        .module('webgisApp')
        .directive('swosLayerControls', swosLayerControls);

    swosLayerControls.$inject = ['mapviewer'];
    function swosLayerControls(mapviewer) {
        var directive = {
            restrict: "E",
            scope: true,
            controller: swosLayerControlsCtrl,
            controllerAs: "slc",
            transclude: true,
            bindToController: true,
            templateUrl: "../../static/includes/swos-layer-controls.html",
            link: linkFunc
        };
        return directive;

        function linkFunc(scope, iElement, iAttr) {
            // TODO: no need to pass the whole layer to the view, extract only required properties
            scope.slc.layer = mapviewer.getLayerById(iAttr.layerHash).get("layerObj");
        }
    }

    swosLayerControlsCtrl.$inject = ['$scope'];
    function swosLayerControlsCtrl($scope) {
        // necessary so we can use controllerAs syntax
        var slc = this;
    }
})();
