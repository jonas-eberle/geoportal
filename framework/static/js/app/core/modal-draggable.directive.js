(function() {
    'use strict';

    angular
        .module('webgisApp.core')
        .directive('modalDraggable', modalDraggable);

    modalDraggable.$inject = [];
    function modalDraggable() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $(element).parent().drags({handle:'.modal-header'});
            }
        };
    }
})();