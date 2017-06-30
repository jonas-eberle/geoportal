(function() {
    'use strict';

    angular
        .module('webgisApp.truncation')
        //copied from https://github.com/lorenooliveira/ng-text-truncate/blob/master/ng-text-truncate.js
        .factory("WordBasedTruncation", WordBasedTruncation);

    WordBasedTruncation.$inject = ['$compile'];
    function WordBasedTruncation($compile) {
        return {
            truncationApplies: function ($scope, threshould) {
                return $scope.text.split(" ").length > threshould;
            },

            applyTruncation: function (threshould, $scope, $element) {
                var splitText = $scope.text.split(" ");
                if ($scope.useToggling) {
                    var el = angular.element("<span>" +
                        splitText.slice(0, threshould).join(" ") + " " +
                        "<span ng-show='!open'>...</span>" +
                        "<span class='btn-link ngTruncateToggleText' " +
                        "ng-click='toggleShow()'" +
                        "ng-show='!open'>" +
                        " " + ($scope.customMoreLabel ? $scope.customMoreLabel : "More") +
                        "</span>" +
                        "<span ng-show='open'>" +
                        splitText.slice(threshould, splitText.length).join(" ") +
                        "<span class='btn-link ngTruncateToggleText'" +
                        "ng-click='toggleShow()'>" +
                        " " + ($scope.customLessLabel ? $scope.customLessLabel : "Less") +
                        "</span>" +
                        "</span>" +
                        "</span>");
                    $compile(el)($scope);
                    $element.append(el);
                } else {
                    $element.append(splitText.slice(0, threshould).join(" ") + "...");
                }
            }
        };
    }
})();
