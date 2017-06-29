(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        //copied from https://github.com/lorenooliveira/ng-text-truncate/blob/master/ng-text-truncate.js
        .factory("CharBasedTruncation", CharBasedTruncation);

    CharBasedTruncation.$inject = ['$compile'];
    function CharBasedTruncation($compile) {
        return {
            truncationApplies: function ($scope, threshould) {
                return $scope.text.length > threshould;
            },

            applyTruncation: function (threshould, $scope, $element) {
                if ($scope.useToggling) {
                    var el = angular.element("<span>" +
                        $scope.text.substr(0, threshould) +
                        "<span ng-show='!open'>...</span>" +
                        "<span class='btn-link ngTruncateToggleText' " +
                        "ng-click='toggleShow()'" +
                        "ng-show='!open'>" +
                        " " + ($scope.customMoreLabel ? $scope.customMoreLabel : "More") +
                        "</span>" +
                        "<span ng-show='open'>" +
                        $scope.text.substring(threshould) +
                        "<span class='btn-link ngTruncateToggleText'" +
                        "ng-click='toggleShow()'>" +
                        " " + ($scope.customLessLabel ? $scope.customLessLabel : "Less") +
                        "</span>" +
                        "</span>" +
                        "</span>");
                    $compile(el)($scope);
                    $element.append(el);
                } else {
                    $element.append($scope.text.substr(0, threshould) + "...");
                }
            }
        };
}
})();
