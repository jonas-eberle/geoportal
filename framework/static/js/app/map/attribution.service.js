(function() {
    'use strict';

    angular
        .module('webgisApp')
        .service('Attribution', Attribution);

    Attribution.$inject = ['$rootScope'];
    function Attribution($rootScope) {
        var list = "";
        var getList = function(){
            return list;
        };
        var setList = function(newList) {
            list = newList;
            $rootScope.$broadcast("attribution_list_new")
        };

        return {
            getList: getList,
            setList: setList
        };
    }
})();
