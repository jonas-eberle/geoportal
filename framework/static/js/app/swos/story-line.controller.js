(function () {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('StoryLineCtrl', StoryLineCtrl);

    StoryLineCtrl.$inject = ['$scope', 'mapviewer', 'WetlandsService', 'djangoRequests', 'TrackingService', '$compile','$timeout', '$cookies', '$routeParams', '$location', '$window'];
    function StoryLineCtrl($scope, mapviewer, WetlandsService, djangoRequests, TrackingService, $compile, $timeout, $cookies, $routeParams, $location, $window) {
        var storyLine = this;
        var cur_story_line_id = "";
        var cur_story_line_title = "";
        var pos_order_map = new Array;
        var prev_story_line_part = false;

        storyLine.show_story_line = show_story_line;
        storyLine.changePart = changePart;
        storyLine.setVisibilityStoryLine = setVisibilityStoryLine;

        $scope.show_story_lines = false;

        //watch change of selected_part (via next/back or selection list)
        $scope.$watch('selected_part', function() {
                changePart()
        });

        $scope.$on('wetlands_loaded', function () {
            if ($routeParams.story_line_id && $routeParams.story_line_part_id){
                show_story_line($routeParams.story_line_id, Number($routeParams.story_line_part_id));
            }
            else if ($routeParams.story_line_id){
                show_story_line($routeParams.story_line_id);
            }
        });

        function setVisibilityStoryLine() {
            $scope.show_story_lines = !$scope.show_story_lines;
        }

        function show_story_line(story_line_id, selected_part) {
            if (typeof(selected_part)==='undefined') selected_part = null;

            // prevent more than one layer warning
            $cookies.put('hasNotifiedAboutLayers', true);

            // Request story line
            if (cur_story_line_id != story_line_id) {
                djangoRequests.request({
                    method: 'GET',
                    url: '/swos/'+ story_line_id +'/storyline.json?'
                }).then(function (data) {

                    data.story_lines = addFirstPart(data);

                    var pos = 0;

                    for (var part = 0; part < data.story_line.length; part++){
                        pos_order_map[pos] = data.story_line[part].order;
                        if (part != 0){
                            var parts = data.story_line[part].story_line_part.description.split("<br>")
                            data.story_line[part].story_line_part.description = parts[0];
                            data.story_line[part].story_line_part.explanation = parts[1];
                        }

                        pos++;
                    }
                    if (selected_part == null) {
                        $scope.selected_part = pos_order_map[0];
                    }
                    else {
                        $scope.selected_part = selected_part;
                    }
                    $scope.story_lines = data.story_line;
                    $scope.story_line_pos = arraySearch(pos_order_map, $scope.selected_part);
                    $scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;


                    cur_story_line_title = data.title;
                    cur_story_line_id = story_line_id;
                    showModal();
                    checkWetland_addLayer_zoom();
                    prev_story_line_part = $scope.story_line_part;
                    trackStoryLine();

                });

            }
            // Apply new position, if already open; use first if no position is given
            else {
                if (selected_part == null) {
                    $scope.selected_part = $scope.selected_part = pos_order_map[0];
                }
                else {
                    $scope.selected_part = selected_part;
                }

                $scope.story_line_pos = arraySearch(pos_order_map, $scope.selected_part);
                $scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;

                showModal();
                checkWetland_addLayer_zoom();
                prev_story_line_part = $scope.story_line_part;
                trackStoryLine();
            }
        }

        function addFirstPart(data){
            var permalink =  $location.protocol() +"://"+ $location.host() + $window.location.pathname + "#/storyline/" + data.id;
            var story_line_part = {"order": -1, "story_line_part": {"title": data.title, "headline": "Overview", "description": data.description, "authors": data.authors, "product_layer": "", "indicator_layer":"", "external_layer":"", "story_line_file_url": data.story_line_file, "story_line_file_name": data.story_line_file_name, "wetland": data.wetland, "permalink": permalink}};

            return data.story_line.unshift(story_line_part);
        }

        function arraySearch(arr, val) {
            for (var i = 0; i < arr.length; i++){
                if (arr[i] === val){
                    return i;
                }
            }
            return false;
        }

        function changePart() {
            if ($scope.selected_part) {
                $scope.story_line_pos = arraySearch(pos_order_map, $scope.selected_part);
                $scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;

                checkWetland_addLayer_zoom();
                prev_story_line_part = $scope.story_line_part;
                trackStoryLine();
            }
        }

        function checkWetland_addLayer_zoom() {

            if (prev_story_line_part.remove_layer == true){
                removeLayer(prev_story_line_part);
            }

            if ($scope.story_line_part.wetland > 0 && WetlandsService.wetland_id != $scope.story_line_part.wetland) {
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

        function removeLayer(story_line_part) {
            for (var key = 0; key < story_line_part.product_layer.length; key++) {
                mapviewer.removeLayerByDjangoID(story_line_part.product_layer[key]);
            }
            for (var key = 0; key < story_line_part.indicator_layer.length; key++) {
                mapviewer.removeLayerByDjangoID(story_line_part.indicator_layer[key]);
            }
            for (var key = 0; key < story_line_part.external_layer.length; key++) {
                mapviewer.removeLayerByDjangoID(story_line_part.external_layer[key]);
            }
        }

        function set_zoom_add_layer() {
            $timeout(function () {
                for (var key1 = 0; key1 < $scope.story_line_part.product_layer.length; key1++) {
                    WetlandsService.selectTab('product');
                    WetlandsService.loadLayer($scope.story_line_part.wetland, 'product', $scope.story_line_part.product_layer[key1], "yes");

                }
                $timeout(function () {
                    for (var key2 = 0; key2 < $scope.story_line_part.indicator_layer.length; key2++) {
                        WetlandsService.selectTab('indicator');
                        WetlandsService.loadLayer($scope.story_line_part.wetland, 'indicator', $scope.story_line_part.indicator_layer[key2], "yes");

                    }
                    $timeout(function () {
                        for (var key3 = 0; key3 < $scope.story_line_part.external_layer.length; key3++) {
                            WetlandsService.selectTab('externaldb');
                            WetlandsService.loadLayer($scope.story_line_part.wetland, 'externaldb', $scope.story_line_part.external_layer[key3], "yes");

                        }
                    });
                });
            });

            zoom_to_extent();
        }

        function showModal(){
            //Check if window is already open
            var story_line_element = angular.element('#story_line').find('div');
            if (story_line_element.length > 0) {
                return;
            }

            var output = '<div  class="story_line" id="story_line">' +
                '</div>';


            var dialog = bootbox.dialog({
                title: "Story line: " + cur_story_line_title,
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
                            $scope.selected_part = pos_order_map[$scope.story_line_pos];
                            //$scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;
                            $scope.$apply();
                            //checkWetland_addLayer_zoom();
                            //prev_story_line_part = $scope.story_line_part;
                            //trackStoryLine();

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
                            $scope.selected_part = pos_order_map[$scope.story_line_pos];
                            //$scope.story_line_part = $scope.story_lines[$scope.story_line_pos].story_line_part;
                            $scope.$apply();
                            //checkWetland_addLayer_zoom();
                            //prev_story_line_part = $scope.story_line_part;
                            //trackStoryLine();

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
                '<h4 ng-if="!story_line_part.title">{{story_line_part.headline}}</h4>' +
                '<h3 ng-if="story_line_part.title">{{story_line_part.title}}</h3>' +
                '<figure ng-if="story_line_part.image_position == \'right\' && story_line_part.image_url_300.length > 2" style="float: right; display: table;";>' +
                '<img  ng-src="{{story_line_part.image_url_300}}"  width: 45%;">' +
                '<figcaption style="display: table-caption; caption-side: bottom ;">{{story_line_part.image_description}} ' +
                '<span ng-if="story_line_part.image_copyright || story_line_part.image_date">(</span> {{story_line_part.image_copyright}}' +
                '<span ng-if="story_line_part.image_copyright && story_line_part.image_date" >,</span> {{story_line_part.image_date}}' +
                '<pan ng-if="story_line_part.image_copyright || story_line_part.image_date" n>)</span></figcaption></figure>' +
                '<div ng-if="story_line_part.authors">Author(s): <span style="font-style: italic;">{{story_line_part.authors}}</span></div>' +
                '<p>{{ story_line_part.description }}</p>' +
                '<p>{{ story_line_part.explanation }}</p>' +
                '<figure ng-if="story_line_part.image_position == \'bottom\' && story_line_part.image_url_600.length > 2" style="display: table;";>' +
                '<img  ng-src="{{story_line_part.image_url_600}}"  width: 100%;">' +
                '<figcaption style="display: table-caption; caption-side: bottom ;">{{story_line_part.image_description}} ' +
                '<span ng-if="story_line_part.image_copyright || story_line_part.image_date">(</span> {{story_line_part.image_copyright}}' +
                '<span ng-if="story_line_part.image_copyright && story_line_part.image_date" >,</span> {{story_line_part.image_date}}' +
                '<pan ng-if="story_line_part.image_copyright || story_line_part.image_date" n>)</span></figcaption></figure>' +
                '<div ng-if="story_line_part.story_line_file_url">Download as pdf: <a href="{{story_line_part.story_line_file_url}}" download="{{story_line_part.story_line_file_name}}">{{story_line_part.story_line_file_name}}</a> </div>' +
                '<div ng-if="story_line_part.permalink">Please use the following link to share the story line: <a href="story_line_part.permalink" target="_blank">{{story_line_part.permalink}}</a></div>' +
                '</div>';

            var template_select = '<div style="margin-bottom: 40px;">' +
                '<select  ng-model="selected_part" ng-options="option.order as option.story_line_part.headline for option in story_lines" style="margin-top: 10px;right: 20px;position: absolute;""></select>' +
                '</div>';

            angular.element('#story_line').append($compile(template)($scope));
            angular.element('.modal-header').after($compile(template_select)($scope))
        }

        function trackStoryLine() {
            TrackingService.trackPageView('/story_line/' + cur_story_line_title + '_' + $scope.story_line_pos + '_' +  $scope.story_line_part.headline.toLowerCase(), 'Story line: ' + cur_story_line_title + ' (' + $scope.story_line_pos + ')');
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