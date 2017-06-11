(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    // TODO: remove $modal if not needed
    ModalInstanceCtrl.$inject = ['$modal', '$modalInstance', 'data', 'title'];
    function ModalInstanceCtrl($modal, $modalInstance, data, title) {
        var mi = this;

        mi.close = $modalInstance.close;
        mi.title = title;
        mi.value_passed = data;
    }
})();