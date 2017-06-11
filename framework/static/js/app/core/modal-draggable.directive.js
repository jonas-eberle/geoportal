(function() {
    'use strict';

    angular
        .module('webgisApp')
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