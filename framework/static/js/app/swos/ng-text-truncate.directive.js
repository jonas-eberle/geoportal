(function() {
    'use strict';

    angular
        .module('webgisApp')
        //copied from https://github.com/lorenooliveira/ng-text-truncate/blob/master/ng-text-truncate.js
        .directive("ngTextTruncate", ngTextTruncate);

    ngTextTruncate.$inject = ['ValidationServices', 'CharBasedTruncation', 'WordBasedTruncation'];
    function ngTextTruncate(ValidationServices, CharBasedTruncation, WordBasedTruncation) {
        var directive = {
            restrict  : "A",
            scope     : {
                text           : "=ngTextTruncate",
                charsThreshould: "@ngTtCharsThreshold",
                wordsThreshould: "@ngTtWordsThreshold",
                customMoreLabel: "@ngTtMoreLabel",
                customLessLabel: "@ngTtLessLabel"
            },
            controller: ngTextTruncateCtrl,
            link: linkFunc
        };
        return directive;

        function linkFunc($scope, $element) {
            $scope.open = false;

            ValidationServices.failIfWrongThreshouldConfig($scope.charsThreshould, $scope.wordsThreshould);

            var CHARS_THRESHOLD = parseInt($scope.charsThreshould);
            var WORDS_THRESHOLD = parseInt($scope.wordsThreshould);

            $scope.$watch("text", function () {
                $element.empty();

                if (CHARS_THRESHOLD) {
                    if ($scope.text && CharBasedTruncation.truncationApplies($scope, CHARS_THRESHOLD)) {
                        CharBasedTruncation.applyTruncation(CHARS_THRESHOLD, $scope, $element);
                    } else {
                        $element.append($scope.text);
                    }
                } else {
                    if ($scope.text && WordBasedTruncation.truncationApplies($scope, WORDS_THRESHOLD)) {
                        WordBasedTruncation.applyTruncation(WORDS_THRESHOLD, $scope, $element);
                    } else {
                        $element.append($scope.text);
                    }
                }
            });
        }
    }

    ngTextTruncateCtrl.$inject = ['$scope', '$element', '$attrs'];
    function ngTextTruncateCtrl($scope, $element, $attrs) {
        $scope.toggleShow = function () {
            $scope.open = !$scope.open;
        };

        $scope.useToggling = $attrs.ngTtNoToggling === undefined;
    }
})();
