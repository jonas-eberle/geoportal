'use strict';

angular.module('webgisApp')

    .controller('WetlandsDiagramCtrl', function (mapviewer, $scope, WetlandsService, $compile){

        // Full Wetland
/*
        for (var pos in data.data.products) {
            var products = data.data.products.pos;
            for (var layers in data.data.products[pos]) {
                if (typeof data.data.products[pos][layers] == 'object') {
                    for (var layer in data.data.products[pos][layers]) {
                        if (data.data.products[pos][layers][layer].legend_colors) {
                            if (data.data.products[pos][layers][layer].identifier.includes("MAES")) {
                                layer_legend_color_maes[data.data.products[pos][layers][layer].id] = data.data.products[pos][layers][layer].legend_colors;
                            }
                            else if (data.data.products[pos][layers][layer].identifier.includes("CLC")) {
                                layer_legend_color_clc[data.data.products[pos][layers][layer].id] = data.data.products[pos][layers][layer].legend_colors;
                            }
                            else {
                                layer_legend_color_rest[data.data.products[pos][layers][layer].id] = data.data.products[pos][layers][layer].legend_colors;
                            }
                        }

                    }
                }
            }
        }

        for (var layer_clc in layer_legend_color_clc) {
            for (var legend_entries in layer_legend_color_clc[layer_clc]) {
                class_id = myRe.exec(layer_legend_color_clc[layer_clc][legend_entries].label);
                value[class_id] = layer_legend_color_clc[layer_clc][legend_entries].size;
                //  percent[class_id] = layer_legend_color_clc[layer_clc][legend_entries].percent;
            }


            data = add_no_data_level_clc(value, id_name_color_clc);
            layer_value_clc[layer_clc] = create_value_legend_clc_data(data[1], data[0]);

            value = [];
        }
        */

        $scope.onclickCreate = function (layer) {
            var charts = angular.element('#diagram_' + layer.id).find('nvd3');
            if (charts.length > 0) {
                return;
            }
            var value = [];
            var class_id;
            var myRe = /[0-9]+/;
            var layer_value_clc = [];

            for (var legend_entries in layer.legend_colors) {
                //class_id = myRe.exec(layer.legend_colors[legend_entries].label);
                class_id = layer.legend_colors[legend_entries].code;
                value[class_id] = layer.legend_colors[legend_entries].size;
            }
            
            var type;
            var options = {};
            var data = -1;
            if (layer.identifier.includes("CLC") && layer.identifier.includes("LULC_")) { 
                data = id_name_color['CLC'];
                data = add_no_data_level_clc(value, data);
                data = create_value_legend_clc_data(data[1], data[0])[0];
                type = 'sunburstChart';
                options['height'] = 300;
                options['showLabels'] = false;
            }
            if (layer.identifier.includes("MAES") && layer.identifier.includes("LULC_")) {
                data = id_name_color['MAES'];
                data = add_no_data_level_clc(value, data);
                data = create_value_legend_clc_data(data[1], data[0])[0];
                type = 'sunburstChart';
                options['height'] = 300;
                options['showLabels'] = false;
            }
            if (layer.identifier.includes("LULCC")) {
                data = [{
                    key: 'LULCC',
                    values: layer.legend_colors
                }];
                type = 'discreteBarChart';
                options['height'] = 200;
                options['showXAxis'] = false;
                options['x'] = function(d){return d.label.split(' - ')[0];};
                options['y'] = function(d){return d.size;};
                options['showLabels'] = false;
                /*options['pie'] = {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                };*/
            }
            if (layer.identifier.includes("SWD_TD")) {
                data = layer.legend_colors;
                type = 'pieChart';
                options['height'] = 200;
                options['x'] = function(d){return d.label;};
                options['y'] = function(d){return d.size;};
                options['showLabels'] = false;
                options['showLegend'] = false;
            }
            if (layer.identifier.includes("SWD_TF")) {
                data = [{
                    key: 'Area',
                    values: layer.legend_colors
                }];
                type = 'multiBarHorizontalChart';
                options['height'] = 200;
                options['width'] = 350;
                options['x'] = function(d){return d.label;};
                options['y'] = function(d){return d.size;};
                options['barColor'] = function(d){return d.color;};
                options['showLabels'] = false;
                options['showLegend'] = false;
                options['showControls'] = false;
            }
            if (data !== -1) {
                $scope.data = data;
                $scope.options = {
                    "chart": {
                        "type": type,
                        "width": 375,
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
                                return d.toFixed(2) + 'ha';
                            }
                        }
                    }
                };
                $.extend($scope.options['chart'], options);

                var template = '<div style="display: flex;border:1px solid grey;"><nvd3 options="options" data="data" class="with-3d-shadow with-transitions"></nvd3></div>'
                $('#diagram_' + layer.id).show();
                if (layer.identifier.includes("LULC_")) {
                    $('#diagram_' + layer.id + ' .hint').show();
                }
                angular.element('#diagram_' + layer.id).append($compile(template)($scope));
            }
        }

        function add_no_data_level_clc(size, id_name_color_clc) {

            var no_data_color = "#fcfcfc";
            var no_date_text = "";

            for (var key2 in size) {
                var key_level_higher = key2.slice(0, -3);
                if (size[key_level_higher]) {
                    size[key_level_higher + "9"] = size[key_level_higher];
                    size[key_level_higher + "99"] = size[key_level_higher];
                    size[key_level_higher + "999"] = size[key_level_higher];

                    id_name_color_clc[key_level_higher + "9"] = [no_date_text, no_data_color];
                    id_name_color_clc[key_level_higher + "99"] = [no_date_text, no_data_color];
                    id_name_color_clc[key_level_higher + "999"] = [no_date_text, no_data_color];
                }
                var key_level_higher = key2.slice(0, -2);
                if (size[key_level_higher]) {
                    size[key_level_higher + "9"] = size[key_level_higher];
                    size[key_level_higher + "99"] = size[key_level_higher];

                    id_name_color_clc[key_level_higher + "9"] = [no_date_text, no_data_color];
                    id_name_color_clc[key_level_higher + "99"] = [no_date_text, no_data_color];
                }
                var key_level_higher = key2.slice(0, -1);
                if (size[key_level_higher]) {
                    size[key_level_higher + "9"] = size[key_level_higher];

                    id_name_color_clc[key_level_higher + "9"] = [no_date_text, no_data_color];
                }
            }
            return [size,id_name_color_clc] ;
        }

        function create_value_legend_clc_data(id_name_color_clc, size_arr) {

            var data = {};
            data["children"] = [];
            var data_4 = [];
            var data_3 = [];
            var data_2 = [];
            var data_1 = [];
            var diagram_data = {};
            var diagram_data_water = {};
            var children = [];
            var children_water = [];
            var data_4_size_count = [];
            var data_3_size_count = [];
            var data_2_size_count = [];

            for (var key in id_name_color_clc) {
                if ((key.length == 4 && key.toString().indexOf('10') === -1) || (key.length == 5 && key.toString().indexOf('10') === 0)) {

                    var new_key = key.slice(0, -1);
                    var data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1],
                    }

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
            for (var key in id_name_color_clc) {
                if ((key.length == 3 && key.toString().indexOf('10') === -1) || (key.length == 4 && key.toString().indexOf('10') === 0)) {

                    var new_key = key.slice(0, -1);

                    var data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1],
                    }

                    if (!size_arr[key] && !data_4[key]) {
                        continue;
					}

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                        data_3_size_count[new_key] = 1;
                    }

                    if (data_4[key] && data_4_size_count[key] == 1) {
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
            for (var key in id_name_color_clc) {
                if ((key.length == 2 && key.toString().indexOf('10') === -1) || (key.length == 3 && key.toString().indexOf('10') === 0)) {

                    var new_key = key.slice(0, -1);

                    var data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1],
                    }

                    if (!size_arr[key] && !data_3[key]) {
                        continue;
					}

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                        data_2_size_count[key] = 1;
                    }

                    for (var key_lower in data_4_size_count){
                        if(key_lower.slice(0, -1) == key){
                            var found = true
                        }
                    }

                    if (data_3[key] && (data_3_size_count[key] == 1 || found)){
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
            for (var key in id_name_color_clc) {
                if ((key.length == 1 && key.toString().indexOf('10') === -1) || (key.length == 2 && key.toString().indexOf('10') === 0)) {

                    var data_new = {
                        "name": id_name_color_clc[key][0],
                        "color": id_name_color_clc[key][1],
                    }

                    if (!size_arr[key] && !data_2[key]) {
                        continue;
					}

                    if (size_arr[key]) {
                        data_new.size = size_arr[key];
                    }
                    if (data_2[key] ) {
                        data_new.children = data_2[key];
                    }

                    children.push(data_new);

                    if (key == 4 || key == 5) {
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
    })
;