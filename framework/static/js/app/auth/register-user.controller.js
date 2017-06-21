(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('RegisterUserCtrl', RegisterUserCtrl);

    RegisterUserCtrl.$inject = ['$modalInstance', 'djangoAuth'];
    function RegisterUserCtrl($modalInstance, djangoAuth) {
        var ru = this;

        ru.close = $modalInstance.close;
        ru.model = {
            email : '',
            organization : '',
            password1 : '',
            password2 : '',
            username : ''
        };
        ru.register = register;

        //--------------------------------------------------------------------------------------------------------------

        function register() {
            djangoAuth.register(ru.model.username, ru.model.password1, ru.model.password2, ru.model.email, {'organization': ru.model.organization})
                .then(function () {
                    bootbox.alert('Please check your emails for verfication!');
                    ru.model.password1 = ru.model.password2 = ru.model.email = ru.model.organization = '';
                    ru.close();
                }, function (error) {
                    var errors = '';
                    if ('username' in error) {
                        errors += '<li><strong>Username:</strong> ' + error.username[0] + '</li>';
                    }
                    if ('password1' in error) {
                        errors += '<li><strong>Password:</strong> ' + error.password1[0] + '</li>';
                    }
                    if ('email' in error) {
                        errors += '<li><strong>Email:</strong> ' + error.email[0] + '</li>';
                    }
                    if ('non_field_errors' in error) {
                        for (var i = 0; i < error.non_field_errors.length; i++) {
                            errors += '<li>' + error.non_field_errors[i] + '</li>';
                        }
                    }

                    bootbox.alert('<h2>Error while registration!</h2><ul>' + errors + '</ul>');
                });
        }
    }
})();