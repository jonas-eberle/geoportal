(function() {
    'use strict';

    angular
        .module('webgisApp.auth')
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    ResetPasswordCtrl.$inject = ['$modalInstance', 'djangoAuth', 'djangoRequests'];
    function ResetPasswordCtrl($modalInstance, djangoAuth, djangoRequests) {
        var rp = this;

        rp.close = $modalInstance.close;
        rp.email = '';
        rp.submit = submit;

        function submit() {
            djangoAuth.resetPassword(rp.email).then(function (data) {
                bootbox.alert(data.success);
                rp.close();
                djangoRequests.request({
                    url: '/authapi/rest/setmapid/'+mapId,
                    method: 'GET'
                });
            }, function (error) {
                bootbox.alert(error.email);
            });
        }
    }
})();