(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('DiagramCtrl', DiagramCtrl);

    DiagramCtrl.$inject = ['$scope', '$compile', '$http','mapviewer', 'lulcLegend'];
    function DiagramCtrl($scope, $compile, $http, mapviewer, lulcLegend) {
        var diagram = this;

        diagram.infoEventKey = null;
        diagram.onclickCreate = onclickCreate;
        diagram.formatValue = formatValue;
        diagram.requestTimeSeries = requestTimeSeries;
     //   diagram.onclickCreateIndicator = onclickCreateIndicator;

        diagram.data = [];
        diagram.options = [];

        diagram.data_vals = "";

        //--------------------------------------------------------------------------------------------------------------

        function add_no_data_level_clc(size, id_name_color_clc) {

            var no_data_color = "#fcfcfc";
            var no_data_text = "";

            var key2;
            for (key2 in size) {

                var key_level_higher = key2.slice(0, -3);
                if (size[key_level_higher]) {
                    size[key_level_higher + "9"] = size[key_level_higher];
                    size[key_level_higher + "99"] = size[key_level_higher];
                    size[key_level_higher + "999"] = size[key_level_higher];

                    id_name_color_clc[key_level_higher + "9"] = [no_data_text, no_data_color];
                    id_name_color_clc[key_level_higher + "99"] = [no_data_text, no_data_color];
                    id_name_color_clc[key_level_higher + "999"] = [no_data_text, no_data_color];
                }

                key_level_higher = key2.slice(0, -2);
                if (size[key_level_higher]) {
                    size[key_level_higher + "9"] = size[key_level_higher];
                    size[key_level_higher + "99"] = size[key_level_higher];

                    id_name_color_clc[key_level_higher + "9"] = [no_data_text, no_data_color];
                    id_name_color_clc[key_level_higher + "99"] = [no_data_text, no_data_color];
                }
                key_level_higher = key2.slice(0, -1);

                if (size[key_level_higher]) {
                    size[key_level_higher + "9"] = size[key_level_higher];

                    id_name_color_clc[key_level_higher + "9"] = [no_data_text, no_data_color];
                }
            }
            return [size, id_name_color_clc];
        }

        function add_no_data_level_10digit(size, data) {

            var no_data_color = "#fff";
            var no_data_text = "";
            var key_level_higher = "";

            var key2;
            var id_name_color_clc = data[0];
            var level = data[1];
            for (key2 in size) {


            if (level[key2] == 2){
                var level_1_key = key2 - key2.slice(-8);
                if (size[level_1_key]){
                     size[(parseInt(level_1_key) + 99000000)] = size[level_1_key];
                     size[(parseInt(level_1_key) + 99990000)] = size[level_1_key];

                     id_name_color_clc[(parseInt(level_1_key) + 99000000)] = [no_data_text, no_data_color];
                     id_name_color_clc[(parseInt(level_1_key) + 99990000)] = [no_data_text, no_data_color];
                }
            }
            if (level[key2] == 3){
                var level_1_key = key2 - key2.slice(-8);
                if (size[level_1_key]){
                     size[(parseInt(level_1_key) + 99000000)] = size[level_1_key];
                     size[(parseInt(level_1_key) + 99990000)] = size[level_1_key];

                     id_name_color_clc[(parseInt(level_1_key) + 99000000)] = [no_data_text, no_data_color];
                     id_name_color_clc[(parseInt(level_1_key) + 99990000)] = [no_data_text, no_data_color];
                }
                var level_2_key = key2 - key2.slice(-6);
                if (size[level_2_key]){
                     size[(parseInt(level_2_key) + 990000)] = size[level_2_key];

                    id_name_color_clc[(parseInt(level_2_key) + 990000)] = [no_data_text, no_data_color];
                }
            }
            if (level[key2] == 4){
                var level_1_key = key2 - key2.slice(-8);
                if (size[level_1_key]){
                     size[(parseInt(level_1_key) + 99000000)] = size[level_1_key];
                     size[(parseInt(level_1_key) + 99990000)] = size[level_1_key];
                     size[(parseInt(level_1_key) + 99999900)] = size[level_1_key];

                     id_name_color_clc[(parseInt(level_1_key) + 99000000)] = [no_data_text, no_data_color];
                     id_name_color_clc[(parseInt(level_1_key) + 99990000)] = [no_data_text, no_data_color];
                     id_name_color_clc[(parseInt(level_1_key) + 99999900)] = [no_data_text, no_data_color];
                }
                var level_2_key = key2 - key2.slice(-6);
                if (size[level_2_key]){
                     size[(parseInt(level_2_key) + 990000)] = size[level_2_key];
                     size[(parseInt(level_2_key) + 999900)] = size[level_2_key];

                    id_name_color_clc[(parseInt(level_2_key) + 990000)] = [no_data_text, no_data_color];
                    id_name_color_clc[(parseInt(level_2_key) + 999900)] = [no_data_text, no_data_color];
                }
                var level_3_key = key2 - key2.slice(-4);
                if (size[level_3_key]){
                     size[(parseInt(level_3_key) + 9900)] = size[level_3_key];

                     id_name_color_clc[(parseInt(level_3_key) + 9900)] = [no_data_text, no_data_color];
                }

            }


            }
            return [size, id_name_color_clc];
        }

        function create_value_legend_10digit(id_name_color_clc, size_arr){
            var data_new, new_key, key;
            var children = [];
            var children_water = [];
            var diagram_data = {};
            var diagram_data_water = {};
            var data_2 = [];
            var data_3 = [];
            var data_4 = [];
            var data_2_size_count = [];
            var data_3_size_count = [];
            var data_4_size_count = [];


            for (key in id_name_color_clc) {
                if (key.slice(-2) == "00" && key.slice(-4) != "0000" ) {
                    new_key = key - key.slice(-4);

                    data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1],
                    };

                    if (!size_arr[key]) {
                        continue;
                    }

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                        data_4_size_count[new_key] = 1;
                    }

                    if (!data_4[new_key]) {
                        data_4[new_key] = [];
                        data_4[new_key].push(data_new);
                    } else {
                        data_4[new_key].push(data_new);
                    }
                    data_new = {};
                }
            }
            for (key in id_name_color_clc) {
                if (key.slice(-4) == "0000" && key.slice(-6) != "000000" ) {
                    new_key = key - key.slice(-6);


                    data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1],
                    };

                        if (!size_arr[key] && !data_4[key]) {
                        continue;
                    }

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                        data_3_size_count[new_key] = 1;
                    }

                    if (data_4[key] && data_4_size_count[key] === 1) {
                        data_new.children = data_4[key];
                    }
                    if (!data_3[new_key]) {
                        data_3[new_key] = [];
                        data_3[new_key].push(data_new);
                    } else {
                        data_3[new_key].push(data_new);
                    }
                    data_new = {};
                }
            }
            for (key in id_name_color_clc) {
                if (key.slice(-6) == "000000" && key.slice(-8) != "00000000"  ) {
                    new_key = key - key.slice(-8);

                    data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1],
                    };

                       if (!size_arr[key] && !data_3[key]) {
                        continue;
                    }

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                        data_2_size_count[new_key] = 1;
                    }

                    if (data_3[key] && data_3_size_count[key] === 1) {
                        data_new.children = data_3[key];
                    }
                    if (!data_2[new_key]) {
                        data_2[new_key] = [];
                        data_2[new_key].push(data_new);
                    } else {
                        data_2[new_key].push(data_new);
                    }
                    data_new = {};
                }
            }
            for (key in id_name_color_clc) {
                if (key.slice(-8) == "00000000") {


                    data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1]
                    };

                    console.log(data_new);

                    if (!size_arr[key] && !data_2[key]) {
                        continue;
                    }

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                    }
                    if (data_2[key]) {
                        data_new.children = data_2[key];
                    }

                    children.push(data_new);


                    data_new = {};
                }
            }
            console.log(data_new);

                        // test.push(data_1);
            diagram_data.name = "Total area";
            diagram_data.color = "white";
            diagram_data.children = children;

            diagram_data_water.name = "Water bodies & Wetlands";
            diagram_data_water.color = "white";
            diagram_data_water.children = children_water;

            return ([[diagram_data], [diagram_data_water]]);
        }

        function reformat(legend){

            var legend_new = {};
            var level = [];

            $.each(legend, function(index, value){
                legend_new[value[0]] = [value[2], value[3]];
                level[value[0]] = value[1]
            });
            return [legend_new, level] ;
        }

        function create_value_legend_clc_data(id_name_color_clc, size_arr) {

            var data = {};
            data["children"] = [];
            var data_2 = [];
            var data_3 = [];
            var data_4 = [];
            var diagram_data = {};
            var diagram_data_water = {};
            var children = [];
            var children_water = [];
            var data_2_size_count = [];
            var data_3_size_count = [];
            var data_4_size_count = [];

            var data_new, new_key, key;

            for (key in id_name_color_clc) {
                if ((key.length === 4 && key.toString().indexOf('10') === -1) || (key.length === 5 && key.toString().indexOf('10') === 0)) {

                    new_key = key.slice(0, -1);
                    if (new_key === 513) {
                        new_key = 512
                    }

                    data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1]
                    };

                    if (!size_arr[key]) {
                        continue;
                    }

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                        data_4_size_count[new_key] = 1;
                    }

                    if (!data_4[new_key]) {
                        data_4[new_key] = [];
                        data_4[new_key].push(data_new);
                    } else {
                        data_4[new_key].push(data_new);
                    }
                    data_new = {};
                }
            }
            for (key in id_name_color_clc) {
                if ((key.length === 3 && key.toString().indexOf('10') === -1) || (key.length === 4 && key.toString().indexOf('10') === 0)) {

                    new_key = key.slice(0, -1);

                    data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1]
                    };

                    if (!size_arr[key] && !data_4[key]) {
                        continue;
                    }

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                        data_3_size_count[new_key] = 1;
                    }

                    if (data_4[key] && data_4_size_count[key] === 1) {
                        data_new.children = data_4[key];
                    }

                    if (!data_3[new_key]) {
                        data_3[new_key] = [];
                        data_3[new_key].push(data_new);
                    } else {
                        data_3[new_key].push(data_new);
                    }
                    data_new = {};
                }
            }
            for (key in id_name_color_clc) {
                if ((key.length === 2 && key.toString().indexOf('10') === -1) || (key.length === 3 && key.toString().indexOf('10') === 0)) {

                    new_key = key.slice(0, -1);

                    data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1]
                    };

                    if (!size_arr[key] && !data_3[key]) {
                        continue;
                    }

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                        data_2_size_count[key] = 1;
                    }

                    for (var key_lower in data_4_size_count) {
                        if (key_lower.slice(0, -1) === key) {
                            var found = true
                        }
                    }

                    if (data_3[key] && (data_3_size_count[key] === 1 || found)) {
                        data_new.children = data_3[key];
                    }

                    if (!data_2[new_key]) {
                        data_2[new_key] = [];
                        data_2[new_key].push(data_new);
                    } else {
                        data_2[new_key].push(data_new);
                    }

                    data_new = {};
                }
                found = false;
            }
            for (key in id_name_color_clc) {
                if ((key.length === 1 && key.toString().indexOf('10') === -1) || (key.length === 2 && key.toString().indexOf('10') === 0)) {

                    data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1]
                    };

                    if (!size_arr[key] && !data_2[key]) {
                        continue;
                    }

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                    }
                    if (data_2[key]) {
                        data_new.children = data_2[key];
                    }

                    children.push(data_new);

                    if (key === 4 || key === 5) {
                        children_water.push(data_new);
                    }

                    data_new = {};
                }
            }


            // test.push(data_1);
            diagram_data.name = "Total area";
            diagram_data.color = "white";
            diagram_data.children = children;

            diagram_data_water.name = "Water bodies & Wetlands";
            diagram_data_water.color = "white";
            diagram_data_water.children = children_water;

            return ([[diagram_data], [diagram_data_water]]);
        }

        function onclickCreate(layer) {
            console.log("Creating diagram");
            var charts = angular.element('#diagram_' + layer.id).find('nvd3');
            if (charts.length > 0) {
                return;
            }
            var value = [];
            var class_id;
            // var myRe = /[0-9]+/;
            // var layer_value_clc = [];

            for (var legend_entries in layer.legend_colors) {
                //class_id = myRe.exec(layer.legend_colors[legend_entries].label);
                class_id = layer.legend_colors[legend_entries].code;
                value[class_id] = layer.legend_colors[legend_entries].size;
            }

            var type;
            var options = {};
            var data = -1;

            if (layer.identifier.includes("CLC") && layer.identifier.includes("LULC_")) {
                data = lulcLegend.CLC;
                data = reformat(data);
                data = add_no_data_level_clc(value, data[0]); // data = add_no_data_level_10digit(value, data);
                data = create_value_legend_clc_data(data[1], data[0])[0]; // data = create_value_legend_10digit(data[1], data[0])[0];
                type = 'sunburstChart';
                options['height'] = 450;
                options['showLabels'] = false;
            }
            if (layer.identifier.includes("MAES") && layer.identifier.includes("LULC_")) {
                data = lulcLegend.MAES;
                data = reformat(data);
                data = add_no_data_level_clc(value, data[0]); // data = add_no_data_level_10digit(value, data);
                data = create_value_legend_clc_data(data[1], data[0])[0]; // data = create_value_legend_10digit(data[1], data[0])[0];
                type = 'sunburstChart';
                options['height'] = 450;
                options['showLabels'] = false;
            }
            if (layer.identifier.includes("LULCC")) {
                //var values = [];
                //Object.assign(values, layer.legend_colors);
                //values.sort(function (a, b) {
                //    return b.size - a.size;
                //});
                data = [{
                    key: 'LULCC',
                  //  values: values
                    values: layer.legend_colors
                }];

                type = 'discreteBarChart';
                options['height'] = 200;
                options['showXAxis'] = false;

                options['x'] = function (d) {
                    //return d.label.split(' - ')[0];
                    return d.label;
                };
                options['yAxis'] = [];
                options['yAxis']['axisLabel'] = "Area in ha";
                options['yAxis']['rotateYLabel'] = false;
                options['margin'] = [];
                options['margin']['top'] = 30;
                options['y'] = function (d) {
                    return d.size;
                };
                options['showLabels'] = false;
                /*options['pie'] = {
                 startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                 endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                 };*/
            }
            if (layer.identifier.includes("SWD_TD")) {
                data = layer.legend_colors;
                type = 'pieChart';
                options['height'] = 450;
                options['x'] = function (d) {
                    return d.label;
                };
                options['y'] = function (d) {
                    return d.size;
                };
                options['showLabels'] = false;
                options['showLegend'] = false;
            }
            if (layer.identifier.includes("SWD_TF")) {
                data = [{
                    key: 'Area',
                    values: layer.legend_colors
                }];
                type = 'multiBarHorizontalChart';
                options['height'] = 400;
                options['width'] = 450;
                options['x'] = function (d) {
                    return d.label;
                };
                options['y'] = function (d) {
                    return d.size;
                };
                options['barColor'] = function (d) {
                    return d.color;
                };
                options['showLabels'] = false;
                options['showLegend'] = false;
                options['showControls'] = false;
            }
            if (data !== -1) {
                $scope.data = data;
                $scope.options = {
                    "chart": {
                        "type": type,
                        "heigth": 200,
                        "width": 600,
                        "mode": 'size',
                        "groupColorByParent": false,
                        /*color: function (d, i) {
                         var d2 = d3.selectAll("path").data().filter(function (d1) {
                         return (d1.name == d)
                         })[0]
                         },*/
                        duration: 250,
                        //"labelFormat":function (d){if(d.size < 5){console.log(d);return d.name}else{return ''}''}
                        "tooltip": {
                            "valueFormatter": function (d) {
                                    return diagram.formatValue(d.toFixed(2)) + ' ha';
                            }
                        }
                    }
                };
                $.extend($scope.options['chart'], options);

                var output = '<div  class="ts_diagram">' +
                    ' ' +
                    '<div id="diagram_' + layer.id +'" style="display:none;">' +
                    '' +
                    '</div>' +

                '</div>';

                var dialog = bootbox.dialog({
                    title: layer.title,
                    message: output,
                    backdrop: false,
                    closeButton: false,
                    buttons: {
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
                var sum = 0;
                for (value in layer.legend_colors){
                    if (layer.legend_colors.hasOwnProperty(value)) {
                        sum += layer.legend_colors[value].size;
                    }
                }

                var template = '<div><uib-tabset justified="true"> <uib-tab heading="Interactive Chart">' +
                    '<div style="text-align: center;"><strong>Absolute area proportions</strong></div><div style="font-size:0.9em;text-align: center;" class="hint">(Move your mouse over or click on the classes for more details)</div>' +
                    '<div style="display: flex;"><nvd3 options="options" data="data" class="with-3d-shadow with-transitions"></nvd3></div></uib-tab><uib-tab heading="Data"><div class="item_legend" style="margin-left:5px;margin-top:5px;" ng-if="layer.legend_url || layer.legend_graphic || layer.legend_colors"> <strong ng-if=layer.legend_colors>Relative area proportions</strong>' +
                    '<table ng-if="layer.legend_colors" style="width:100%;">' +
                    '<tr ng-repeat="item in layer.legend_colors | orderBy : \'-percent\' ">' +
                    '<td class="legend-color" ng-attr-style="background-color:{{item.color}};">&nbsp;</td>' +
                    '<td class="legend-label">{{ item.label }}</td>' +
                    '<td class="legend-percent"><span>{{ item.percent.toFixed(2) }}%</span></td>' +
                    '<td class="legend-percent"><span > {{ diagram.formatValue(item.size) }}&nbsp;ha</span></td>' +
                    '</tr>' +
                     '<tr><td>&nbsp;</td></tr><tr><td></td><td class="legend-label" >Total area:</td><td></td><td class="legend-percent">' + diagram.formatValue(sum) + '&nbsp;ha</td></tr>'
                    '</table>' +
                    '</div></uib-tab></uib-tabset></div>';
                $('#diagram_' + layer.id).show();
                if (layer.identifier.includes("LULC_")) {
                    $('#diagram_' + layer.id + ' .hint').show();
                }
                angular.element('#diagram_' + layer.id).append($compile(template)($scope));
            }
        }



        function formatValue(value){
            return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value);
        }

        function requestTimeSeries(layer) {
            console.log("requestTimeSeries");

            var window_open = false;
            var type;
            var options = {};
            var data = -1;

            var point_count = 0;
            var color = [];
            color[1] = "rgb(255, 127, 14)";
            color[2] = "rgb(33, 165, 35)";
            color[3] = "rgb(33, 125, 165)";
            color[4] = "rgb(174, 199, 232)";
            color[5] = "rgb(124, 33, 165)";
            color[6] = "rgb(165, 33, 60)";
            color[7] = "rgb(247, 246, 42)";
            color[8] = "rgb(48, 142, 49)";
            color[9] = "rgb(106, 197, 175)";
            color[10] = "rgb(39, 93, 232)";

            var unit = "";
            var yaxix_title = "";

            if (layer.title.includes("CDOM")) {
                var str = "-1";
                unit = "m" + str.sup();
                yaxix_title = "CDOM in m^-1";
            }
            if (layer.title.includes("CHL")) {
                unit = "µg/l";
                yaxix_title = "CHL in" + unit;
            }
            if (layer.title.includes("TSM")) {
                unit = "mg/l";
                yaxix_title = "TSM in" + unit;
            }

            var output = '<div  class="ts_diagram">' +
                '<p><strong>Please select a point in the map to create a time series.</strong></p>' +
                '<div id="diagram_wq_window_' + layer.id + '" style="display:none;">' +
                '</div>' +
                '</div>';

            //Add Feature Layer for points to map*/
            mapviewer.pointFeatureLayer("TSrequest","add");

            if (window_open == false) {
                window_open = true;
                var dialog = bootbox.dialog({
                    title: layer.title,
                    message: output,
                    backdrop: false,
                    closeButton: false,
                    buttons: {
                        "Export as CSV": {
                            label: "Export as CSV",
                            className: "btn-default",
                            callback: function () {
                                var csvContent = "";
                                var data_arr = [];
                                var value = "";
                                var header = "#date";

                                $scope.data.forEach(function (series) {
                                    var latlong = series.coordinates;
                                    header = header + "," + series.key + "(" + latlong[0].toFixed(2) + " " + latlong[1].toFixed(2) + ")";
                                    series.values.forEach(function (data) {

                                        if (isNaN(data.y)) {
                                            value = "";
                                        }
                                        else {
                                            value = data.y;
                                        }

                                        var date = d3.time.format("%Y-%m-%d")(new Date(data.x));

                                        if (data_arr[date] == undefined) {
                                            data_arr[date] = [];
                                            data_arr[date].push(value);
                                        }
                                        else {
                                            data_arr[date].push(value);
                                        }
                                    })
                                });
                                csvContent += header + "\n";
                                for (var key in data_arr) {
                                    var dataString = data_arr[key].join(",");
                                    csvContent += key + "," + dataString + "\n";
                                }

                                var blob = new Blob([csvContent], {
                                    "type": "text/csv;charset=utf8;"
                                });
                                var link = document.createElement("a");

                                if (link.download !== undefined) { // feature detection
                                    // Browsers that support HTML5 download attribute
                                    link.setAttribute("href", window.URL.createObjectURL(blob));
                                    var name = layer.title;
                                    link.setAttribute("download", name.replace(" ", "_") + ".csv");
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                } else {
                                    alert('CSV export only works in Chrome, Firefox, and Opera.');
                                }

                                return false;
                            }
                        },
                        cancel: {
                            label: "Close",
                            className: "btn-primary",
                            callback: function () {
                                ol.Observable.unByKey(diagram.infoEventKey);
                                window_open = false;
                                mapviewer.pointFeature("TSrequest",'clear');
                                mapviewer.pointFeatureLayer("TSrequest", 'remove');
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
            }


            diagram.infoEventKey = mapviewer.map.on('singleclick', function (evt) {
                var lonlat = ol.proj.transform(evt.coordinate, mapviewer.map.getView().getProjection(), 'EPSG:4326');

                point_count++;

                var color_pos = point_count;
                if (color_pos > 10) {
                    color_pos = color_pos % 10;
                }

                //Add point to map
                mapviewer.pointFeature("TSrequest", "add", lonlat, color[color_pos], 'Point  ' + point_count);


                // needs to be solved better #todo check if permanently removed
                delete $http.defaults.headers.common.Pragma;
                delete $http.defaults.headers.common["If-Modified-Since"];
                $http.defaults.headers.common["Content-type"] = "application/x-www-form-urlencoded; charset=UTF-8";

                // check if selected point is within extent -> will not work around 0 #todo replace with geometry function
                //if (Math.abs(lonlat[1]) < Math.abs(layer.north) && Math.abs(lonlat[1]) > Math.abs(layer.south) && Math.abs(lonlat[0]) > Math.abs(layer.west) && Math.abs(lonlat[0]) < Math.abs(layer.east)) {
                if ((lonlat[1]) < (layer.north) && (lonlat[1]) > (layer.south) && (lonlat[0]) > (layer.west) && (lonlat[0]) < (layer.east)) {

                    $("#loading-div").show()

                    $http({
                        method: 'POST',
                        url: 'http://artemis.geogr.uni-jena.de/ocpu/library/swos/R/extractWQName/json',

                        data: 'x=' + lonlat[0] + '&y=' + lonlat[1] + '&layer=%22' + layer.identifier + '%22'

                    }).then(function successCallback(response) {

                        var data_value;
                        var data_obj = [];

                        for (var key in response.data.dates) {

                            var format = d3.time.format("%Y-%m-%d");

                            if (response.data.values[key] == "NA") {
                                response.data.values[key] = NaN;
                            }
                            data_value = {
                                "x": parseInt((new Date(response.data.dates[key])).getTime()),
                                "y": response.data.values[key]
                            };
                            data_obj.push(data_value);
                        }
                        if (data_obj) {

                            var new_data = {
                                "key": "Point " + point_count, // + " (" + lonlat[0].toFixed(2) + ', ' + lonlat[1].toFixed(2) + ')',
                                "color": color[color_pos],
                                "coordinates": lonlat,
                                "values": data_obj
                            };
                            if (data.length == undefined) {
                                data = [
                                    {
                                        "key": "Point " + point_count, // + " (" + lonlat[0].toFixed(2) + ', ' + lonlat[1].toFixed(2) + ')',
                                        "color": color[color_pos],
                                        "coordinates": lonlat,
                                        "values": data_obj
                                    }
                                ];
                            } else {
                                data.push(new_data);
                                if (data.length > 10) {
                                    data.shift();
                                }
                            }
                            //type = 'lineWithFocusChart';
                            type = 'lineChart';
                            options['height'] = 400;
                            options['width'] = 570;
                            options['x'] = function (d) {
                                return d.x;
                            };
                            options['y'] = function (d) {
                                return d.y;
                            };


                            if (data !== -1) {
                                $scope.data = data;
                                $scope.options = {
                                    "chart": {
                                        "type": type,
                                        "useInteractiveGuideline": true,
                                        "margin": {
                                            bottom: 60,
                                            right: 30
                                        },
                                        "forceY": ([0]),
                                        "yAxis": {
                                            "axisLabel": yaxix_title
                                        },
                                        "xAxis": {
                                            tickFormat: function (d) {
                                                return d3.time.format("%Y-%m-%d")(new Date(d))
                                            }
                                        },
                                        /*"x2Axis": {
                                         tickFormat: function (d) {
                                         return d3.time.format("%Y-%m-%d")(new Date(d))
                                         }
                                         },*/
                                        duration: 250,
                                        "interactiveLayer": {
                                            "tooltip": {
                                                enabled: true,
                                                contentGenerator: function (d) {
                                                    var header = d3.time.format("%Y-%m-%d")(new Date(parseInt(d.value)));
                                                    var headerhtml = "<thead><tr><td colspan='3'><strong class='x-value'>" + header + "</strong></td></tr></thead>";
                                                    var bodyhtml = "<tbody>";
                                                    var series = d.series;
                                                    series.forEach(function (c) {
                                                        bodyhtml = bodyhtml + "<tr><td class='legend-color-guide'><div style='background-color: " + c.color + ";'></div></td><td class='key'>" + c.key + "</td><td class='value'>" + c.value + " " + unit + "</td></tr>";
                                                    });
                                                    bodyhtml = bodyhtml + "</tbody>";
                                                    return "<table>" + headerhtml + '' + bodyhtml + "</table>";
                                                }
                                            }
                                        }
                                    }
                                };
                                $.extend($scope.options['chart'], options);

                                var template = '<div style="display: flex;border:1px solid grey;"><nvd3 options="options" data="data" class="with-3d-shadow with-transitions" data-points="true"></nvd3></div>';
                                $('#diagram_wq_window_' + layer.id).show();
                                diagram.data[layer.id] = $scope.data;
                                diagram.options[layer.id] = $scope.options;
                                diagram.data_vals = $compile(template)($scope);
                                if (data.length == 1) {
                                    angular.element('#diagram_wq_window_' + layer.id).append($compile(template)($scope));
                                }
                                $("#loading-div").hide();
                            }
                        }
                    }, function errorCallback(response) {
                        bootbox.alert('No data returned.');
                        $("#loading-div").hide();

                        mapviewer.pointFeature("TSrequest","remove");
                        point_count = point_count - 1;
                    })

                }
                else {
                    mapviewer.pointFeature("TSrequest", "remove");
                    point_count = point_count - 1;
                    bootbox.alert('Please select a point within the map extent.');
                }
            });
        }

        // Full Wetland
        // for (var pos in data.data.products) {
        //     var products = data.data.products.pos;
        //     for (var layers in data.data.products[pos]) {
        //         if (typeof data.data.products[pos][layers] == 'object') {
        //             for (var layer in data.data.products[pos][layers]) {
        //                 if (data.data.products[pos][layers][layer].legend_colors) {
        //                     if (data.data.products[pos][layers][layer].identifier.includes("MAES")) {
        //                         layer_legend_color_maes[data.data.products[pos][layers][layer].id] = data.data.products[pos][layers][layer].legend_colors;
        //                     } else if (data.data.products[pos][layers][layer].identifier.includes("CLC")) {
        //                         layer_legend_color_clc[data.data.products[pos][layers][layer].id] = data.data.products[pos][layers][layer].legend_colors;
        //                     } else {
        //                         layer_legend_color_rest[data.data.products[pos][layers][layer].id] = data.data.products[pos][layers][layer].legend_colors;
        //                     }
        //                 }
        //
        //             }
        //         }
        //     }
        // }
        //
        // for (var layer_clc in layer_legend_color_clc) {
        //     for (var legend_entries in layer_legend_color_clc[layer_clc]) {
        //         class_id = myRe.exec(layer_legend_color_clc[layer_clc][legend_entries].label);
        //         value[class_id] = layer_legend_color_clc[layer_clc][legend_entries].size;
        //         //  percent[class_id] = layer_legend_color_clc[layer_clc][legend_entries].percent;
        //     }
        //
        //     data = add_no_data_level_clc(value, id_name_color_clc);
        //     layer_value_clc[layer_clc] = create_value_legend_clc_data(data[1], data[0]);
        //
        //     value = [];
        // }


    }
})();