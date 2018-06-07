(function() {
    'use strict';

    angular
        .module('webgisApp.map')
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
            scope.slc.hideShare = iAttr.hideShare;
        }
    }

    swosLayerControlsCtrl.$inject = ['$scope'];
    function swosLayerControlsCtrl($scope) {
        // necessary so we can use controllerAs syntax
        var slc = this;
        
        slc.description = [];
        slc.description['101'] = [1, 'Vegetated wetland; unknown if natural or artificial wetland'];
        slc.description['102'] = [2, 'Water bodies; unknown if natural or artificial wetland'];
        slc.description['103'] = [3, 'Rriver bodies; unknown if natural or artificial wetland'];
        slc.description['110'] = [4, 'Natural wetland; unknown if vegetated, river or water bodies'];
        slc.description['111'] = [5, 'Vegetated and natural wetland'];
        slc.description['112'] = [6, 'Water bodies within a natural wetland'];
        slc.description['113'] = [7, 'River bodies within a natural wetland'];
        slc.description['120'] = [8, 'Artificial wetland; unknown if vegetated, river or water bodies'];
        slc.description['121'] = [9, 'Vegetated and artificial wetland'];
        slc.description['122'] = [10, 'Water bodies within an artificial wetland'];
        slc.description['123'] = [11, 'River bodies within an artificial wetland'];
    }
})();
