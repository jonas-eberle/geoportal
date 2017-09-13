(function () {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('StoryLineCtrl', StoryLineCtrl);

    StoryLineCtrl.$inject = ['$scope', 'mapviewer', 'WetlandsService', 'djangoRequests', 'TrackingService', '$compile','$timeout'];
    function StoryLineCtrl($scope, mapviewer, WetlandsService, djangoRequests, TrackingService, $compile, $timeout) {
        var storyLine = this;
        var cur_story_line_id = "";
        var order_pos_map = new Array;
        var story_line_title = "";

        storyLine.show_story_line = show_story_line;
        storyLine.changePart = changePart;

        function show_story_line(story_line_id, selected_part = null) {

            // Request story line
            if (cur_story_line_id != story_line_id) {
                djangoRequests.request({
                    method: 'GET',
                    url: '/swos/'+ story_line_id +'/storyline.json?'
                }).then(function (data) {

                    var pos = 0;
                    for (var part in data.story_line) {
                        order_pos_map[data.story_line[part].order] = pos;
                        pos++;
                    }
                    if (selected_part == null) {
                        $scope.selected_part = arraySearch(order_pos_map, 0);
                    }
                    else {
                        $scope.selected_part = selected_part;
                    }
                    $scope.story_lines = data.story_line;
                    $scope.story_line_pos = order_pos_map[$scope.selected_part];
                    $scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;

                    checkWetland_addLayer_zoom();
                    cur_story_line_id = story_line_id;
                });

            }
            // Apply new position, if already open; use first if no position is given
            else {
                if (selected_part == null) {
                    $scope.selected_part = $scope.selected_part = arraySearch(order_pos_map, 0);
                }
                else {
                    $scope.selected_part = selected_part;
                }
                $scope.story_line_pos = order_pos_map[$scope.selected_part];
                $scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;

                checkWetland_addLayer_zoom();
            }

            // Search for title: Only works, if one linked wetland is loaded!!! #todo needs solution from start
            for (var key in WetlandsService.value.data.story_lines){
                if (WetlandsService.value.data.story_lines[key].story_line == story_line_id){
                    story_line_title = WetlandsService.value.data.story_lines[key].title;
                    break;
                }
            }

            //Check if window is already open
            var story_line_element = angular.element('#story_line').find('div');
            if (story_line_element.length > 0) {
                return;
            }

            var output = '<div  class="story_line" id="story_line">' +
                '</div>';


            var dialog = bootbox.dialog({
                title: "Story line: " + story_line_title ,
                message: output,
                backdrop: false,
                closeButton: false,
                buttons: {
                    "back": {
                        label: "Back",
                        className: "btn-default",
                        callback: function () {
                            if ($scope.story_line_pos > 0) {
                                $scope.story_line_pos = $scope.story_line_pos - 1;
                            }
                            else {
                                $scope.story_line_pos = $scope.story_lines.length - 1
                            }
                            $scope.selected_part = arraySearch(order_pos_map, $scope.story_line_pos);
                            $scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;
                            $scope.$apply();
                            checkWetland_addLayer_zoom();

                            return false;
                        }
                    },
                    "next": {
                        label: "Next",
                        className: "btn-default",
                        callback: function () {
                            if ($scope.story_line_pos < $scope.story_lines.length - 1) {
                                $scope.story_line_pos = $scope.story_line_pos + 1;
                            }
                            else {
                                $scope.story_line_pos = 0;
                            }
                            $scope.selected_part = arraySearch(order_pos_map, $scope.story_line_pos);
                            $scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;
                            $scope.$apply();
                            checkWetland_addLayer_zoom();

                            return false;
                        }
                    },
                    cancel: {
                        label: "Close",
                        className: "btn-primary",
                        callback: function () {

                        }
                    }
                }
            });

            dialog.removeClass('modal').addClass('mymodal').drags({handle: '.modal-header'});
            var width = $(document).width() / 2 - 300;
            if (width < 0) {
                width = '2%';
            }
            $('.modal-content', dialog).css('left', width);
            $('#loading-div').removeClass('nobg').hide();


            var template = '<div >' +
                '<h3>{{story_line_part.headline}}</h3>' +
                '<img ng-if="story_line_part.image_position == \'right\'" ng-src="{{story_line_part.image_url_300}}" style="float: right; width: 45%;">' +
                '<p>{{ story_line_part.description }}</p>' +
                '<img ng-if="story_line_part.image_position == \'bottom\'" ng-src="{{story_line_part.image_url_600}}" style="width: 100%;">' +
                '</div>';

            var template_select = '<div style="margin-bottom: 40px;">' +
                ' <select  ng-model="selected_part" ng-change="storyline.changePart()" ng-options="option.order as option.story_line_part.headline for option in story_lines" style="margin-top: 10px;right: 20px;position: absolute;""></select>' +
                '</div>';

            angular.element('#story_line').append($compile(template)($scope));
            angular.element('.modal-header').after($compile(template_select)($scope))
        }

        function arraySearch(arr, val) {
            for (var i = 0; i < arr.length; i++)
                if (arr[i] === val)
                    return i;
            return false;
        }

        function changePart() {
            $scope.story_line_pos = order_pos_map[$scope.selected_part];
            $scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;
        }

        function checkWetland_addLayer_zoom() {
            if (WetlandsService.wetland_id != $scope.story_line_part.wetland) {
                WetlandsService.loadWetland($scope.story_line_part.wetland, function () {
                    $timeout(function () {
                        set_zoom_add_layer();
                    });
                });
            }
            else{
                set_zoom_add_layer();
            }
        }

        function set_zoom_add_layer() {
            for (var key in $scope.story_line_part.wetland_layer) {
                WetlandsService.loadLayer($scope.story_line_part.wetland, 'product', $scope.story_line_part.wetland_layer[key], "yes");
            }
            zoom_to_extent();
        }

        function zoom_to_extent() {
            if ($scope.story_line_part.west) {
                var extent = [$scope.story_line_part.west, $scope.story_line_part.south, $scope.story_line_part.east, $scope.story_line_part.north].map(parseFloat);
                extent = ol.proj.transformExtent(extent, 'EPSG:4326', mapviewer.map.getView().getProjection().getCode());
            }
            else{
                extent = WetlandsService.wetlandList[WetlandsService.wetland_id].geometry.getExtent();
            }
            mapviewer.map.getView().fit(extent);
        }

    }
})();