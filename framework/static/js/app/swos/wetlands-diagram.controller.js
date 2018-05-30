(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('DiagramCtrl', DiagramCtrl);

    DiagramCtrl.$inject = ['$scope', '$compile', '$http', 'mapviewer', 'lulcLegend', 'WetlandsService', '$timeout', '$rootScope'];
    function DiagramCtrl($scope, $compile, $http, mapviewer, lulcLegend, WetlandsService, $timeout, $rootScope ) {
        var diagram = this;

        diagram.infoEventKey = null;
        diagram.onclickCreate = onclickCreate;
        diagram.formatValue = formatValue;
        diagram.requestTimeSeries = requestTimeSeries;
        diagram.set_data_options_year = set_data_options_year;
        diagram.set_data_options_over_time = set_data_options_over_time;
        diagram.set_legend_type = set_legend_type;
        diagram.set_style_legend = set_style_legend;
        diagram.addLayerToMap = addLayerToMap;
        diagram.init = init;
        diagram.updateChords =updateChords;
        diagram.options_years = [];

        diagram.data = [];
        diagram.options = [];
        diagram.layers = [];
        diagram.legend_type_lulc = [];
        diagram.window_id = 0;

        diagram.data_vals = "";

        diagram.ind_name = [];
        diagram.ind_name['100'] = 'Wetland';
        diagram.ind_name['101'] = 'Wetland / vegetated ';
        diagram.ind_name['102'] = 'Wetland / water bodies';
        diagram.ind_name['103'] = 'Wetland / river bodies';
        diagram.ind_name['110'] = 'Natural wetland';
        diagram.ind_name['111'] = 'Natural wetland / vegetated ';
        diagram.ind_name['112'] = 'Natural wetland / water bodies';
        diagram.ind_name['113'] = 'Natural wetland / rivers bodies';
        diagram.ind_name['120'] = 'Artificial wetland';
        diagram.ind_name['121'] = 'Artificial wetland / vegetated ';
        diagram.ind_name['122'] = 'Artificial wetland / water bodies';
        diagram.ind_name['123'] = 'Artificial wetland / rivers bodies';
        diagram.ind_name['200'] = 'Urban';
        diagram.ind_name['300'] = 'Agriculture';
        diagram.ind_name['400'] = 'Natural habitat not wetland';
        diagram.ind_name['900'] = 'Rice fields';

        diagram.ind_color = [];
        diagram.ind_color['100'] = '#0930f1';
        diagram.ind_color['101'] = '#4662ea';
        diagram.ind_color['102'] = '#8192e6';
        diagram.ind_color['103'] = '#9eabec';
        diagram.ind_color['110'] = '#09bbf1';
        diagram.ind_color['111'] = '#0986f1';
        diagram.ind_color['112'] = '#096cc1';
        diagram.ind_color['113'] = '#054b88';
        diagram.ind_color['120'] = '#09f1d1';
        diagram.ind_color['121'] = '#08c7ad';
        diagram.ind_color['122'] = '#06a08b';
        diagram.ind_color['123'] = '#057566';
        diagram.ind_color['200'] = '#f14909';
        diagram.ind_color['300'] = '#f1ea09';
        diagram.ind_color['400'] = '#09f13b';
        diagram.ind_color['900'] = '#8d09f1';



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


                if (level[key2] == 2) {
                    var level_1_key = key2 - key2.slice(-8);
                    if (size[level_1_key]) {
                        size[(parseInt(level_1_key) + 99000000)] = size[level_1_key];
                        size[(parseInt(level_1_key) + 99990000)] = size[level_1_key];

                        id_name_color_clc[(parseInt(level_1_key) + 99000000)] = [no_data_text, no_data_color];
                        id_name_color_clc[(parseInt(level_1_key) + 99990000)] = [no_data_text, no_data_color];
                    }
                }
                if (level[key2] == 3) {
                    var level_1_key = key2 - key2.slice(-8);
                    if (size[level_1_key]) {
                        size[(parseInt(level_1_key) + 99000000)] = size[level_1_key];
                        size[(parseInt(level_1_key) + 99990000)] = size[level_1_key];

                        id_name_color_clc[(parseInt(level_1_key) + 99000000)] = [no_data_text, no_data_color];
                        id_name_color_clc[(parseInt(level_1_key) + 99990000)] = [no_data_text, no_data_color];
                    }
                    var level_2_key = key2 - key2.slice(-6);
                    if (size[level_2_key]) {
                        size[(parseInt(level_2_key) + 990000)] = size[level_2_key];

                        id_name_color_clc[(parseInt(level_2_key) + 990000)] = [no_data_text, no_data_color];
                    }
                }
                if (level[key2] == 4) {
                    var level_1_key = key2 - key2.slice(-8);
                    if (size[level_1_key]) {
                        size[(parseInt(level_1_key) + 99000000)] = size[level_1_key];
                        size[(parseInt(level_1_key) + 99990000)] = size[level_1_key];
                        size[(parseInt(level_1_key) + 99999900)] = size[level_1_key];

                        id_name_color_clc[(parseInt(level_1_key) + 99000000)] = [no_data_text, no_data_color];
                        id_name_color_clc[(parseInt(level_1_key) + 99990000)] = [no_data_text, no_data_color];
                        id_name_color_clc[(parseInt(level_1_key) + 99999900)] = [no_data_text, no_data_color];
                    }
                    var level_2_key = key2 - key2.slice(-6);
                    if (size[level_2_key]) {
                        size[(parseInt(level_2_key) + 990000)] = size[level_2_key];
                        size[(parseInt(level_2_key) + 999900)] = size[level_2_key];

                        id_name_color_clc[(parseInt(level_2_key) + 990000)] = [no_data_text, no_data_color];
                        id_name_color_clc[(parseInt(level_2_key) + 999900)] = [no_data_text, no_data_color];
                    }
                    var level_3_key = key2 - key2.slice(-4);
                    if (size[level_3_key]) {
                        size[(parseInt(level_3_key) + 9900)] = size[level_3_key];

                        id_name_color_clc[(parseInt(level_3_key) + 9900)] = [no_data_text, no_data_color];
                    }

                }


            }
            return [size, id_name_color_clc];
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
                    //todo
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

        function create_value_legend_10digit(id_name_color_clc, size_arr) {
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
                if (key.slice(-2) == "00" && key.slice(-4) != "0000") {
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
                if (key.slice(-4) == "0000" && key.slice(-6) != "000000") {
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
                if (key.slice(-6) == "000000" && key.slice(-8) != "00000000") {
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

        //reformat legend to access via code
        function reformat_legend(legend) {

            var legend_new = {};
            var level = [];

            $.each(legend, function (index, value) {
                legend_new[value[0]] = [value[2], value[3]];
                level[value[0]] = value[1]
            });
            return [legend_new, level];
        }

        //set data and options for line chart over time todo replace year ; change table data
        function set_data_options_over_time(legend_type_lulc) {
            var class_id;
            var class_list = [];
            var data = [];
            var data_plot = [];
            var data_all_id;
            var data_all = [];
            var color_list = [];
            var label_list = [];
            var product_layers = diagram.layers[legend_type_lulc];
            console.log( product_layers)
            for (var p_layer in product_layers) {
                    data[product_layers[p_layer].key] = [];
                    for (var legend_entries in product_layers[p_layer].layer.legend_colors) {
                        class_id = product_layers[p_layer].layer.legend_colors[legend_entries].code;
                        class_list[class_id] = 1;
                        data[product_layers[p_layer].key][class_id] = product_layers[p_layer].layer.legend_colors[legend_entries].size;
                        color_list[class_id] = product_layers[p_layer].layer.legend_colors[legend_entries].color;
                        label_list[class_id] = product_layers[p_layer].layer.legend_colors[legend_entries].label;
                        // if (data[product_layers[p_layer].identifier.slice(-4)][class_id] == "undefined") {
                        //     data[product_layers[p_layer].identifier.slice(-4)][class_id] = 0;
                        //}
                    }
            }
            console.log(data);
            //if (legend_type_lulc == "LULC_RAMSAR-CLC") {
            //    var legend = lulcLegend.CLC;
            //}
            //else if (legend_type_lulc == "LULC_MAES") {
            //    var legend = lulcLegend.MAES;
            //}
            //else if (legend_type_lulc == "LULC_LCCS") {
            //    var legend = lulcLegend.LCCS;
            //}
            //legend = reformat_legend(legend);
console.log(label_list)
            var i = 1;
            for (var id in class_list) {
                data_plot[id] = [];
                for (var year in data) {
                    data_plot[id].push([year.split("_")[0], data[year][id]]);
                    i++;
                }
                data_all_id = {
                    "key": label_list[id],
                    "values": data_plot[id],
                    "color": color_list[id]
                };
                data_all.push(data_all_id);
            }
            console.log(data_all);

            var options = [];

            options["type"] = 'lineChart';
            options['height'] = 400;
            options['width'] = 450;
            options['x'] = function (d) {
                return d[0];
            };
            options['y'] = function (d) {
                return d[1];
            };
            //options['xAxis'] = [];
            //options['xAxis']['tickValues']  = ['Label 1','Label 2','Label 3','Label 4','Label 5','Label 6','Label 7','Label 8'];


            //todo add label ha contentGenerator
            options['useInteractiveGuideline'] = true;

            $scope.options['chart'] = options;
            $scope.data = data_all;
            $scope.active_layer = "";
        }

        //set data and options for all types
        function set_data_options_year(layer) {



            var data = -1;
            var value = [];
            var class_id;

            if (layer.identifier.includes("LULC_")) {
                for (var legend_entries in layer.legend_colors) {
                    //class_id = myRe.exec(layer.legend_colors[legend_entries].label);
                    class_id = layer.legend_colors[legend_entries].code;
                    value[class_id] = layer.legend_colors[legend_entries].size;
                }

                if (layer.identifier.includes("CLC")) {
                    data = lulcLegend.CLC;
                }
                else if (layer.identifier.includes("MAES")) {
                    data = lulcLegend.MAES;
                }
                data = reformat_legend(data);
                data = add_no_data_level_clc(value, data[0]); // data = add_no_data_level_10digit(value, data);
                data = create_value_legend_clc_data(data[1], data[0])[0]; // data = create_value_legend_10digit(data[1], data[0])[0];
            }
            else if (layer.identifier.includes("LULCC")) {
                data = [{
                    key: 'LULCC',
                    //  values: values
                    values: layer.legend_colors
                }];
            }
            else if (layer.identifier.includes("SWD_TD")) {
                data = layer.legend_colors;
            }
            else if (layer.identifier.includes("SWD_TF")) {
                data = [{
                    key: 'Area',
                    values: layer.legend_colors
                }];
            }
            else if (layer.identifier.includes("IND")) {
                data = [{
                    key: 'Area',
                    values: layer.legend_colors
                }];
            }
            else {
                 data = [{
                    key: 'Area',
                    values: layer.legend_colors
                }];
            }
            var sum = 0;
            for (value in layer.legend_colors) {
                if (layer.legend_colors.hasOwnProperty(value)) {
                    sum += layer.legend_colors[value].size;
                }
            }

            set_options_year(layer);
            console.log("set active layer")
            $scope.active_layer = layer;
            $scope.data = data;
            $scope.sum = sum;
        }

        //set options for all types
        function set_options_year(layer) {
            var type;
            var options = {};
            var data = -1;

            if (layer.identifier.includes("LULC_")) {
                type = 'sunburstChart';
                options['height'] = 450;
                options['showLabels'] = false;
            }
            else if (layer.identifier.includes("LULCC")) {
                type = 'discreteBarChart';
                options['height'] = 200;
                options['showXAxis'] = false;
                options['x'] = function (d) {
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
            }
            else if (layer.identifier.includes("IND")) {
                type = 'discreteBarChart';
                options['height'] = 200;
                options['showXAxis'] = false;
                options['x'] = function (d) {
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
            }
            else if (layer.identifier.includes("SWD_TD")) {
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
            else if (layer.identifier.includes("SWD_TF")) {
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
            else {
                type = 'discreteBarChart';
                options['height'] = 200;
                options['showXAxis'] = false;
                options['x'] = function (d) {
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
            }

            $scope.options = {
                "chart": {
                    "type": type,
                    "heigth": 200,
                    "width": 600,
                    "mode": 'size',
                    "groupColorByParent": false,
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
        }

        // set legend type
        function set_legend_type(legend_type_lulc) {
            console.log(legend_type_lulc)

            if ($scope.active_layer == "" ) {
                set_data_options_over_time(legend_type_lulc);
                $scope.legend_type_lulc = legend_type_lulc;

                set_category_name(diagram.layers[legend_type_lulc][0].layer);
            }
            else {
                $scope.legend_type_lulc = legend_type_lulc;

                var layer = diagram.layers[legend_type_lulc][0].layer; // set by default to first element

                for (var key in diagram.layers[legend_type_lulc]) {
                    console.log(key, diagram.layers[legend_type_lulc][key])
                    if (diagram.layers[legend_type_lulc][key].layer.identifier.split("_").slice(-1)[0] == $scope.active_layer.identifier.split("_").slice(-1)[0]) {
                        var layer = diagram.layers[legend_type_lulc][key].layer;
                    }
                }
                set_data_options_year(layer); // set to first element

                set_category_name(diagram.layers[legend_type_lulc][0].layer);
            }
        }

        function set_category_name(layer) {
            console.log(layer)
            console.log("set category");
            $scope.category_name = get_catagory_name(layer)[0]
        }

        function get_catagory_name(layer) {
            if (layer.product_name != undefined) {
                return [layer.product_name, "Product"];
            }
            else if (layer.indicator_name != undefined) {
                return [layer.indicator_name, "Indicator"];
            }
        }

        //mark active legend type
        function set_style_legend(legend_type_lulc, active_legend_type) {
            if (legend_type_lulc == active_legend_type) {
                return {
                    "font-weight": "bold"
                }
            }
        }

        function download_csv(category_name) {
            var stats = [];
            var header_list = [];
            var max_count = [];
            var c;
            try {
                c = WetlandsService.value.data.products.concat(WetlandsService.value.data.indicators);   
            } catch(e) {
                c = WetlandsService.national_products;
            }

            for (var product in c) {
                var product_layers = c[product].layers;

                console.log(product_layers);
                var i = 0;
                var j = 1;
                var k = 2;

                var set_allways_header = false;
                for (var p_layer in product_layers) {
                    if (category_name == undefined || (product_layers[p_layer].indicator_name == category_name || product_layers[p_layer].product_name == category_name)) {

                        var name;
                        if (product_layers[p_layer].indicator_name) {
                            name = product_layers[p_layer].indicator_name;
                        }
                        else {
                            name = product_layers[p_layer].product_name;
                        }

                        var legend = product_layers[p_layer].legend_colors;

                        var header_year_type = product_layers[p_layer].identifier.split("_").slice(2)[0] + " " + product_layers[p_layer].identifier.split("_").slice(3)[0] + " " + product_layers[p_layer].identifier.split("_").slice(-1)[0];
                        if (!header_list[name]) {
                            header_list[name] = "";
                        }
                        header_list[name] += header_year_type + " in ha," + header_year_type + " in %, diff prev year " + header_year_type + " ,";

                        for (var entry in legend) {
                            if (!stats[name]) {
                                stats[name] = [];
                            }
                            if (!stats[name][legend[entry].label]) {
                                stats[name][legend[entry].label] = [];
                            }
                            stats[name][legend[entry].label][i] = legend[entry].size;
                            stats[name][legend[entry].label][j] = legend[entry].percent;
                            stats[name][legend[entry].label][k] = (legend[entry].size - stats[name][legend[entry].label][i - 3]).toFixed(2);
                        }
                        max_count[name] = k;
                        i = i + 3;
                        j = j + 3;
                        k = k + 3;
                    }
                }


            }
            //console.log(stats);
            //console.log(header_list);
            var csvContent = "";

            for (var product in stats) {
                // set header
                csvContent += "Category, Subcategory, " + header_list[product] + "\n";

                for (var label in stats[product]) {
                    var datastring = product + "," + label + ",";

                    for (var i = 0; i <= max_count[product]; i++) {
                        if (stats[product][label][i]) {
                            datastring += stats[product][label][i] + ",";
                        }
                        else {
                            datastring += "0" + ",";
                        }
                    }
                    csvContent += datastring + "\n";
                }
                csvContent += "\n";
            }
            return csvContent;
        }

        function copy_and_insert_new_layer(layer){
            console.log("add layer")
            console.log(WetlandsService.value.data.indicators[0].layers);
            layer.id = layer.id + 123456;
            layer.style = "IND";
            layer.ogc_type = "WMS";
            layer.env = "attr:MAES_L1";
            layer.ogc_link = "http://artemis.geogr.uni-jena.de/geoserver/wms";
            layer.identifier = "SWOS_WET-EXT-MAES_" + layer.identifier.split('_').slice(-2)[0] + "_2090";
            layer.alternativ_title = "test";
            WetlandsService.value.data.indicators[0].layers.push(layer);
            console.log(WetlandsService.value.data.indicators[0].layers);
             // $rootScope.$broadcast('test');

        }
        $scope.$watch("legend_type_lulc", function() {
            var title = $scope.category_name;
            console.log(title)
            try {
                title = WetlandsService.wetlandList[WetlandsService.wetland_id].name + " - " + $scope.category_name;
            } catch(e) {}
            console.log('#diagram_'+$scope.window_id)
            name = '#diagram_'+$scope.window_id;
            console.log(title)
            angular.element(name).parent().parent().parent().parent().prev().children().text(title);
        }, true);

        function onclickCreate(layer_id, show_type) {

            // todo replace CLC with RAMSAR-CLC
            var group_list = [];
            diagram.layers["LULC_MAES"] = [];
            diagram.layers["LULC_RAMSAR-CLC"] = [];
            group_list.push(["LULC_MAES","LULC_RAMSAR-CLC"]);

            diagram.layers["LULCC_L"] = [];
            diagram.layers["LULCC_S"] = [];
            diagram.layers["SWD_TD_OP"] = [];
            diagram.layers["SWD_TD_SAR"] = [];
            diagram.layers["SWD_TF_OP"] = [];
            diagram.layers["SWD_TF_SAR"] = [];
            diagram.layers["InvDel_OP"] = [];
            diagram.layers["InvDel_TOPO"] = [];

            diagram.layers["IND_RAMSAR-CLC"] = [];
            diagram.layers["IND_MAES"] = [];
            group_list.push(["IND_MAES","IND_RAMSAR-CLC"]);

            diagram.layers["WET-THREATS_RAMSAR-CLC"] = [];
            diagram.layers["WET-THREATS_MAES"] = [];
            group_list.push(["WET-THREATS_MAES","WET-THREATS_RAMSAR-CLC"]);

            diagram.layers["OPEN-W-EXT_RAMSAR-CLC"] = [];
            diagram.layers["OPEN-W-EXT_MAES"] = [];
            group_list.push(["OPEN-W-EXT_MAES","OPEN-W-EXT_RAMSAR-CLC"]);

            diagram.layers["WET-EXT-NA_RAMSAR-CLC"] = [];
            diagram.layers["WET-EXT-NA_MAES"] = [];
            group_list.push(["WET-EXT-NA_MAES","WET-EXT-NA_RAMSAR-CLC"]);

            diagram.layers["WET-EXT-VWR_RAMSAR-CLC"] = [];
            diagram.layers["WET-EXT-VWR_MAES"] = [];
            group_list.push(["WET-EXT-VWR_MAES","WET-EXT-VWR_RAMSAR-CLC"]);

            diagram.layers["WET-EXT_RAMSAR-CLC"] = [];
            diagram.layers["WET-EXT_MAES"] = [];
            group_list.push(["WET-EXT_MAES","WET-EXT_RAMSAR-CLC"]);

            diagram.layers["WET-CHANGE_RAMSAR-CLC"] = [];
            diagram.layers["WET-CHANGE_MAES"] = [];
            group_list.push(["WET-CHANGE_MAES", "WET-CHANGE_RAMSAR-CLC"]);

            diagram.layers["WET-RESTORE_RAMSAR-CLC"] = [];
            diagram.layers["WET-RESTORE_MAES"] = [];
            group_list.push(["WET-RESTORE_MAES", "WET-RESTORE_RAMSAR-CLC"]);

            diagram.layers["WET-ART_RAMSAR-CLC"] = [];
            diagram.layers["WET-ART_MAES"] = [];
            group_list.push(["WET-ART_MAES", "WET-ART_RAMSAR-CLC"]);

            diagram.layers["IND-URB_RAMSAR-CLC"] = [];
            diagram.layers["IND-URB_MAES"] = [];
            group_list.push(["IND-URB_MAES", "IND-URB_RAMSAR-CLC"]);

            diagram.layers["IND-ALL_RAMSAR-CLC"] = [];
            diagram.layers["IND-ALL_MAES"] = [];
            group_list.push(["IND-ALL_MAES", "IND-ALL_RAMSAR-CLC"]);
            
            var layer_arr;
            var c;
            if ($('.national_data').is(":visible")) {
                layer_arr = WetlandsService.national_products;
                c = layer_arr;   
            } else {
                layer_arr = WetlandsService.value.data.products;
                c = WetlandsService.value.data.products.concat(WetlandsService.value.data.indicators);
            }

            for (var product in c) {
                //console.log(product)
                var product_layers = c[product].layers;
                //console.log(product_layers)
                for (var p_layer in product_layers) {

                    if (product_layers[p_layer].id == layer_id) {
                        var layer = product_layers[p_layer];
                        console.log("layer found")
                        for (var key in diagram.layers) {
                            if (product_layers[p_layer].identifier.includes(key)) {
                                console.log("legend type set")
                                $scope.legend_type_lulc = key;
                                break;
                            }
                        }
                    }
                    for (var key in diagram.layers) {
                        if (product_layers[p_layer].identifier.includes(key) && product_layers[p_layer].legend_colors && (product_layers[p_layer].legend_colors[0].size || product_layers[p_layer].legend_colors[0].size == 0 )) {
                            diagram.layers[key].push({
                                key:  product_layers[p_layer].identifier.split("_").slice(-1)[0] + "_" + product_layers[p_layer].identifier.split("_").slice(3)[0],
                                name: product_layers[p_layer].identifier.split("_").slice(-1)[0],
                                title: product_layers[p_layer].identifier.split("_").slice(2)[0] + " " + product_layers[p_layer].identifier.split("_").slice(3)[0] + " " + product_layers[p_layer].identifier.split("_").slice(-1)[0],
                                layer: product_layers[p_layer]
                            });
                        }
                        else if (product_layers[p_layer].identifier.includes(key) && product_layers[p_layer].identifier.includes("IND-ALL")) {

                            for (var key2 in  product_layers[p_layer].meta_file_info.columns)
                                for (var i = parseInt(key2) + 1; i <= product_layers[p_layer].meta_file_info.columns.length - 1; i++) {
                                    var new_layer = angular.copy(product_layers[p_layer]);
                                    for (var key3 in product_layers[p_layer].meta_file_info.stat) {
                                        if (new_layer.meta_file_info.stat[key3].year_1 == product_layers[p_layer].meta_file_info.columns[key2].year + "_" + product_layers[p_layer].meta_file_info.columns[key2].sensor && product_layers[p_layer].meta_file_info.stat[key3].year_2 == product_layers[p_layer].meta_file_info.columns[i].year + "_" + product_layers[p_layer].meta_file_info.columns[i].sensor) {
                                            new_layer.stat = product_layers[p_layer].meta_file_info.stat[key3];
                                        }
                                    }
                                    new_layer.columns = [product_layers[p_layer].meta_file_info.columns[key2], product_layers[p_layer].meta_file_info.columns[i]],
                                        new_layer.id = product_layers[p_layer].id + 1000 + (parseInt(i) + 10)  + (parseInt(key2) * 2);
                                        if (product_layers[p_layer].meta_file_info.columns[key2].year.length == 8){
                                            var name_year1 = [product_layers[p_layer].meta_file_info.columns[key2].year.slice(0, 4), product_layers[p_layer].meta_file_info.columns[key2].year.slice(4, 6),product_layers[p_layer].meta_file_info.columns[key2].year.slice(6)].join('/');
                                            var name_year2 = [product_layers[p_layer].meta_file_info.columns[i].year.slice(0, 4), product_layers[p_layer].meta_file_info.columns[i].year.slice(4, 6),product_layers[p_layer].meta_file_info.columns[i].year.slice(6)].join('/');
                                        }
                                        else {
                                            var name_year1 = product_layers[p_layer].meta_file_info.columns[key2].year;
                                            var name_year2 = product_layers[p_layer].meta_file_info.columns[i].year;
                                        }
                                    diagram.layers[key].push({
                                        type: "change",
                                        key:  product_layers[p_layer].identifier.split("_").slice(-1)[0] + "_" + product_layers[p_layer].identifier.split("_").slice(3)[0],
                                        name:name_year1 + "-" + name_year2,
                                        title: product_layers[p_layer].identifier.split("_").slice(2)[0] + " " + product_layers[p_layer].meta_file_info.columns[key2].sensor + " " + product_layers[p_layer].meta_file_info.columns[key2].year + "-" + product_layers[p_layer].meta_file_info.columns[i].year,
                                        layer: new_layer
                                    });
                                }
                            console.log(diagram.layers[key])
                        }
                    }
                }
            }

            if (layer_id == 0 && show_type == "state") {
                if (diagram.layers["IND_RAMSAR-CLC"][0]) {
                    $scope.legend_type_lulc = "IND_RAMSAR-CLC";
                }
                else if (diagram.layers["IND_MAES"][0]) {
                    $scope.legend_type_lulc = "IND_MAES";
                }
            }
            else if(layer_id == 0 && show_type == "change") {
                if (diagram.layers["IND-ALL_RAMSAR-CLC"][0]) {
                    $scope.legend_type_lulc = "IND-ALL_RAMSAR-CLC";
                }
                else if (diagram.layers["IND-ALL_MAES"][0]) {
                    $scope.legend_type_lulc = "IND-ALL_MAES";
                }
            }

            //console.log(diagram.layers);
            console.log("Creating diagram");

            if (layer == undefined){
                layer = diagram.layers[$scope.legend_type_lulc][0].layer
            }
            var charts = angular.element('#diagram_' + layer.id).find('nvd3');
            if (charts.length > 0) {
                return;
            }

            var value = [];
            var class_id;
            for (var legend_entries in layer.legend_colors) {
                //class_id = myRe.exec(layer.legend_colors[legend_entries].label);
                class_id = layer.legend_colors[legend_entries].code;
                value[class_id] = layer.legend_colors[legend_entries].size;
            }

            //set year overview as default for indicator
            if (show_type == "all" && !diagram.layers[$scope.legend_type_lulc][0].name.includes("-") || show_type == 'state' ){
                console.log("Set over time")
                console.log($scope.legend_type_lulc)
                set_data_options_year(layer);
                set_data_options_over_time($scope.legend_type_lulc );
            }
            else{
                set_data_options_year(layer);
            }



            if ($scope.data !== -1) {
                var output = '<div  class="ts_diagram">' +
                    ' ' +
                    '<div id="diagram_' + layer.id + '" style="display:none;">' +
                    '' +
                    '</div>' +

                    '</div>';

                set_category_name(layer);
                $scope.window_id= Math.floor(Math.random() * 1000);
                var title = $scope.category_name;
                try {
                    title = WetlandsService.wetlandList[WetlandsService.wetland_id].name + " - " + $scope.category_name;
                } catch(e) {}

                var dialog = bootbox.dialog({
                    title: title,
                    message: output,
                    backdrop: false,
                    closeButton: false,
                    buttons: {
                        "Export as CSV": {
                            label: "Export as CSV",
                            className: "btn-default",
                            callback: function () {

                                var data = download_csv($scope.category_name);
                                var blob = new Blob([data], {
                                    "type": "text/csv;charset=utf8;"
                                });
                                var link = document.createElement("a");

                                if (link.download !== undefined) { // feature detection
                                    // Browsers that support HTML5 download attribute
                                    link.setAttribute("href", window.URL.createObjectURL(blob));
                                    var name = layer.title;
                                    link.setAttribute("download", "indicator" + ".csv");
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                } else {
                                    alert('CSV export only works in Chrome, Firefox, and Opera.');
                                }
                                return false;
                            }
                        },
                        "Export all as CSV": {
                            label: "Export all as CSV",
                            className: "btn-default",
                            callback: function () {

                                var data = download_csv();
                                var blob = new Blob([data], {
                                    "type": "text/csv;charset=utf8;"
                                });
                                var link = document.createElement("a");

                                if (link.download !== undefined) { // feature detection
                                    // Browsers that support HTML5 download attribute
                                    link.setAttribute("href", window.URL.createObjectURL(blob));
                                    var name = layer.title;
                                    link.setAttribute("download", "indicator" + ".csv");
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

                var maes_clc = "";

                for (var ident in group_list){
                     maes_clc = maes_clc + '<div ng-if="diagram.layers[\'' + group_list[ident][0] + '\'][0] && diagram.layers[\'' + group_list[ident][1] + '\'][0] && (legend_type_lulc == \'' + group_list[ident][0] + '\' || legend_type_lulc == \'' + group_list[ident][1] + '\')" style="display: inline-block;padding-right: 20px; padding-top: 14px;padding-bottom: 10px;">' +
                    '<button ng-click="diagram.set_legend_type(\'' + group_list[ident][0] + '\');diagram.updateChords(active_layer.stat)" ng-style="diagram.set_style_legend(\'' + group_list[ident][0] + '\', legend_type_lulc)">MAES</button>' +
                    '<button ng-click="diagram.set_legend_type(\'' + group_list[ident][1] + '\');diagram.updateChords(active_layer.stat)" ng-style="diagram.set_style_legend(\'' + group_list[ident][1] + '\', legend_type_lulc)">   CLC</button>' +
                    '</div>'
                }

                $scope.select_list = [];
                var found = [];
                for (var key in diagram.layers){
                    if (diagram.layers[key][0]) {
                        var name = get_catagory_name(diagram.layers[key][0].layer);

                        if ( key.split("_").slice(0)[0] != "SWD"){
                         //   found[key.split("_").slice(0)[0]] = 1;
                            $scope.select_list.push({name: name[1] + ": "+ name[0] + " (" + key.split("_").slice(1)[0] + ")", key: key})
                        }
                        else if (key.split("_").slice(0)[0] == "SWD"){
                            $scope.select_list.push({name: name[1] + ": "+ name[0] + " " + key.split("_").slice(1)[0] + " " + key.split("_").slice(2)[0] , key: key})
                        }

                    }
                }



                console.log(diagram.layers)
                console.log($scope.active_layer)
                //copy_and_insert_new_layer(WetlandsService.value.data.indicators[1].layers[0]);

                var template =
                    '<div id="diagram_{{window_id}}"><select ng-change=diagram.set_legend_type(legend_type_lulc) ng-model="legend_type_lulc" ng-options="option.key as option.name for option in select_list" style="margin-top: -10px;right: 15px;position: absolute;""></select></div>' +

                    maes_clc +

                    '<div ng-if="diagram.layers[\'SWD_TD_OP\'][0] && (legend_type_lulc == \'SWD_TD_OP\' || legend_type_lulc == \'SWD_TD_SAR\')" style="display: inline-block;padding-right: 20px;;padding-top: 14px;padding-bottom: 10px;">' +
                    '<button ng-click="diagram.set_legend_type(\'SWD_TD_OP\')" ng-style="diagram.set_style_legend(\'SWD_TD_OP\', legend_type_lulc)">OP</button>' +
                    '<button ng-click="diagram.set_legend_type(\'SWD_TD_SAR\')" ng-style="diagram.set_style_legend(\'SWD_TD_SAR\', legend_type_lulc)">   SAR</button>' +
                    '</div>' +
                    '<div ng-if="diagram.layers[\'SWD_TF_OP\'][0] && (legend_type_lulc == \'SWD_TF_OP\' || legend_type_lulc == \'SWD_TF_SAR\')" style="display: inline-block;padding-right: 20px;padding-top: 14px;padding-bottom: 10px;">' +
                    '<button ng-click="diagram.set_legend_type(\'SWD_TF_OP\')" ng-style="diagram.set_style_legend(\'SWD_TF_OP\', legend_type_lulc)">OP</button>' +
                    '<button ng-click="diagram.set_legend_type(\'SWD_TF_SAR\')" ng-style="diagram.set_style_legend(\'SWD_TF_SAR\', legend_type_lulc)">   SAR</button>' +
                    '</div>' +
                    '<div style="display: inline-block;padding-right: 20px;"><button ng-if="diagram.layers[legend_type_lulc].length > 1 && !diagram.layers[legend_type_lulc][0].name.includes(\'-\')" ng-click="diagram.set_data_options_over_time(legend_type_lulc)" uib-tooltip="Show all years" tooltip-append-to-body="true" ><i class="fa fa-line-chart fa-lg"></i></button></div>' +
                    '<div ng-repeat="layer in diagram.layers[legend_type_lulc] track by $index" style="display: inline-block;padding-top: 14px;" ">' +
                    '<button ng-if="layer.layer.id == active_layer.id" ng-click="diagram.set_data_options_year(layer.layer); diagram.updateChords(active_layer.stat)" style="font-weight: bold;" uib-tooltip="{{ layer.title }}" tooltip-append-to-body="true" >{{ layer.name }}</button>' +
                    '<button ng-if="layer.layer.id != active_layer.id" ng-click="diagram.set_data_options_year(layer.layer);diagram.updateChords(active_layer.stat)" uib-tooltip="{{ layer.title }}" tooltip-append-to-body="true" >{{ layer.name }}</button>' +
                    '</div >' +
                    '<div ng-if="active_layer" style="display: inline-block;float: right;padding-top: 14px;"> <button  ng-click="diagram.addLayerToMap(active_layer)" type="button" class="btn btn-default btn-xs" aria-label="Left Align"><i class="fa fa-plus fa-lg " uib-tooltip="Add layer to map" tooltip-append-to-body="true"></i></button>' +
                    '</div>' +
                    '</div>' +
                    
                    '<uib-tabset justified="true"> <uib-tab heading="Data">' +

                    '<div class="item_legend" style="margin-left:5px;margin-top:5px;" ng-if="active_layer.legend_url || active_layer.legend_graphic || active_layer.legend_colors"> <strong ng-if=active_layer.legend_colors>Relative area proportions</strong></div>' +
                    '<table ng-if="active_layer.legend_colors" style="width:100%;">' +
                    '<tr ng-repeat="item in active_layer.legend_colors | orderBy : \'-percent\' ">' +
                    '<td class="legend-color" ng-attr-style="background-color:{{item.color}};">&nbsp;</td>' +
                    '<td class="legend-label">{{ item.label }}</td>' +
                    '<td class="legend-percent"><span>{{ item.percent.toFixed(2) }}%</span></td>' +
                    '<td class="legend-percent"><span > {{ diagram.formatValue(item.size) }}&nbsp;ha</span></td>' +
                    '</tr>' +
                    '<tr><td>&nbsp;</td></tr><tr><td></td><td class="legend-label" >Total area:</td><td></td><td class="legend-percent">{{  diagram.formatValue(sum) }}&nbsp;ha</td></tr>' +
                    '</table>' +
                    '<table ng-if="active_layer.stat" style="width:100%;">' +
                    '<tr ng-repeat="item in active_layer.stat.stat ">' +
                    '<td class="legend-color" ng-attr-style="background-color:{{diagram.ind_color[item[1]] }};">&nbsp;</td>' +
                    '<td class="legend-label">{{ diagram.ind_name[item[1]] }}</td>' +
                    '<td class="legend-label">to </td>' +
                    '<td class="legend-color" ng-attr-style="background-color:{{diagram.ind_color[item[2]] }};">&nbsp;</td>' +
                    '<td class="legend-label">{{ diagram.ind_name[item[2]] }}</td>' +
                    '<td class="legend-percent"><span>{{ (item[0]/10000).toFixed(2) }} ha</span></td>' +
                    '</tr>' +
                    '</table>' +
                    '<table class="chart_time_series" ng-if="!active_layer.legend_colors && !active_layer.identifier.split(\'_\')[3].includes(\'-\')" style="width:100%;">' +
                    '<tr class="border">'+
                    '<th>&nbsp;</th>'+
                    '<th>Class</th>'+
                    '<th style="text-align: right" ng-repeat="val in data[0].values">{{val[0]}}</th>'+
                    '</tr>'+
                    '<tr class="border" ng-repeat="item in data | orderBy : \'-key\' ">' +
                    '<td class="legend-color" ng-attr-style="background-color:{{item.color}};">&nbsp;</td>' +
                    '<td class="legend-label">{{ item.key }}</td>' +
                    '<td ng-repeat="val in item.values" class="legend-percent"><span>{{ val[1].toFixed(2) }} ha</span></td>' +
                    '</tr>' +
                    '<tr><td>&nbsp;</td></tr><tr><td></td><td class="legend-label" >Total area:</td><td></td><td class="legend-percent">{{  diagram.formatValue(sum) }}&nbsp;ha</td></tr>'+
                '</table>' +
                    
                    '</uib-tab><uib-tab heading="Interactive Chart">' +
                    
                    '<div style="text-align: center;"><strong>Absolute area proportions</strong></div><div style="font-size:0.9em;text-align: center;" class="hint">(Move your mouse over or click on the classes for more details)</div>' +
                    '<div ng-if="!active_layer.stat" style="display: flex;"><nvd3 options="options" data="data" class="with-3d-shadow with-transitions"></nvd3></div>' +
                    '<div ng-if="active_layer.stat" id="chart_placeholder" ng-init="diagram.init();diagram.updateChords(active_layer.stat)"></div>' +
          
                '</div></uib-tab></uib-tabset></div>';
                $('#diagram_' + layer.id).show();
                if (layer.identifier.includes("LULC_")) {
                    $('#diagram_' + layer.id + ' .hint').show();
                }
                angular.element('#diagram_' + layer.id).append($compile(template)($scope));

            }
        }

        function addLayerToMap(layer) {
            $timeout(function () {
                WetlandsService.selectTab("product");
                WetlandsService.loadLayer(WetlandsService.wetland_id, "product", layer.id, "yes");
            });
        }

        function formatValue(value) {
            return new Intl.NumberFormat('en-US', {minimumFractionDigits: 2}).format(value);
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
            mapviewer.pointFeatureLayer("TSrequest", "add");

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
                                mapviewer.pointFeature("TSrequest", 'clear');
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

                            if (response.data.values[key] == "NA" || response.data.values[key] == "-Inf") {
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

                        mapviewer.pointFeature("TSrequest", "remove");
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


        var g;
        var formatPercent;
        var numberWithCommas;
        var landuse;
        var last_layout;
        var arc;
        var path;
        var width;
        var height;
        var outerRadius;
        var innerRadius;

        function init() {
            console.log("init")
            jQuery(window).trigger('resize');
            /*** Define parameters and tools ***/
            width = 500;
            height = 500;
            outerRadius = Math.min(width, height) / 2 - 40;//100,
            innerRadius = outerRadius - 10;


            //create number formatting functions
            formatPercent = d3.format("%");
            numberWithCommas = d3.format("0,f");

            //create the arc path data generator for the groups
            arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

            //create the chord path data generator for the chords
            path = d3.svg.chord()
                .radius(innerRadius - 4);// subtracted 4 to separate the ribbon

            //define the default chord layout parameters
            //within a function that returns a new layout object;
            //that way, you can create multiple chord layouts
            //that are the same except for the data.

            // var last_layout; //store layout between updates
            //    var landuse; //store neighbourhood data outside data-reading function

            /*** Initialize the visualization ***/
            g = d3.select("#chart_placeholder").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("id", "circle")
                .attr("transform",
                    "translate(" + width / 2 + "," + height / 2 + ")");
            //the entire graphic will be drawn within this <g> element,
            //so all coordinates will be relative to the center of the circle
            //console.log(g)
            g.append("circle")
                .attr("r", outerRadius);
            //this circle is set in CSS to be transparent but to respond to mouse events
            //It will ensure that the <g> responds to all mouse events within
            //the area, even after chords are faded out.
        }


        // Chord diagram
        function getDefaultLayout() {
            return d3.layout.chord()
                .padding(0.03)
                .sortSubgroups(d3.descending)
                .sortChords(d3.ascending);
        }

        /* Create OR update a chord layout from a data matrix */
        function updateChords(stat) {
            if (stat) {
                console.log(stat);
                console.log(angular.element('#chart_placeholder').length)
                if (angular.element('#chart_placeholder').length == 0) {
                    init()
                }

                var all_classes = [];
                for (var key in stat.stat) {
                    all_classes[stat.stat[key][1]] = 1;
                    all_classes[stat.stat[key][2]] = 1;
                }
                console.log(all_classes);
                var landuse = [];
                for (var key in diagram.ind_name) {
                    landuse.push({name: diagram.ind_name[key], color: diagram.ind_color[key]})
                }
                console.log(landuse)
                //var landuse = [{name: "Wettland", color: "rgb(0,169,230)"},{name: "Wet. ext (nat.)", color: "rgb(0,100,230)"},  {name: "Wetland(art.)", color: "rgb(0,200,230)"},  {name: "Urban", color: "rgb(255,66,66)"},  {name: "Argiculture", color: "rgb(255,255,100)"}, {name: "Other", color: "rgb(0,168,132)"},  {name: "Rice", color: "rgb(0,168,132)"}];
                //console.log(landuse)
                var data = [];
                var data_line = [];
                for (var key in diagram.ind_name) {
                    for (var key2 in diagram.ind_name) {
                        var val = 0;

                        for (var key3 in stat.stat) {
                            if (stat.stat[key3][1] == key && stat.stat[key3][2] == key2) {
                                val = stat.stat[key3][0];
                                break;
                            }
                        }
                        data_line.push(val)

                    }
                    data.push(data_line)
                    var data_line = [];
                }
                console.log(data);
                var matrix = data;
                //  d3.json(datasetURL, function(error, matrix) {

                //  if (error) {alert("Error reading file: ", error.statusText); return; }

                //var matrix = JSON.parse( d3.select(datasetURL).text() );
                // instead of d3.json

                /* Compute chord layout. */
                var layout = getDefaultLayout(); //create a new layout object
                layout.matrix(matrix);

                /* Create/update "group" elements */
                var groupG = g.selectAll("g.group")
                    .data(layout.groups(), function (d) {
                        return d.index;
                        //use a key function in case the
                        //groups are sorted differently
                    });

                groupG.exit()
                    .transition()
                    .duration(1500)
                    .attr("opacity", 0)
                    .remove(); //remove after transitions are complete

                var newGroups = groupG.enter().append("g")
                    .attr("class", "group");
                //the enter selection is stored in a variable so we can
                //enter the <path>, <text>, and <title> elements as well


                //Create the title tooltip for the new groups
                newGroups.append("title");

                //Update the (tooltip) title text based on the data
                groupG.select("title")
                    .text(function (d, i) {
                        return numberWithCommas(d.value)
                            + " ha total area of "
                            + landuse[i].name;
                    });

                //create the arc paths and set the constant attributes
                //(those based on the group index, not on the value)
                newGroups.append("path")
                    .attr("id", function (d) {
                        return "group" + d.index;
                        //using d.index and not i to maintain consistency
                        //even if groups are sorted
                    })
                    .style("fill", function (d) {
                        return landuse[d.index].color;
                    });

                //update the paths to match the layout
                groupG.select("path")
                    .transition()
                    .duration(1500)
                    //.attr("opacity", 0.5) //optional, just to observe the transition////////////
                    .attrTween("d", arcTween(last_layout))
                // .transition().duration(100).attr("opacity", 1) //reset opacity//////////////
                ;

                //create the group labels
                newGroups.append("svg:text")
                    .attr("xlink:href", function (d) {
                        return "#group" + d.index;
                    })
                    .attr("dy", ".35em")
                    .attr("color", "#fff")
                    .text(function (d) {
                        //  return landuse[d.index].name;
                    });

                //position group labels to match layout
                groupG.select("text")
                    .transition()
                    .duration(1500)
                    .attr("transform", function (d) {
                        d.angle = (d.startAngle + d.endAngle) / 2;
                        //store the midpoint angle in the data object

                        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                            " translate(" + (innerRadius + 26) + ")" +
                            (d.angle > Math.PI ? " rotate(180)" : " rotate(0)");
                        //include the rotate zero so that transforms can be interpolated
                    })
                    .attr("text-anchor", function (d) {
                        return d.angle > Math.PI ? "end" : "begin";
                    });


                /* Create/update the chord paths */
                var chordPaths = g.selectAll("path.chord")
                    .data(layout.chords(), chordKey);
                //specify a key function to match chords
                //between updates


                //create the new chord paths
                var newChords = chordPaths.enter()
                    .append("path")
                    .attr("class", "chord");

                // Add title tooltip for each new chord.
                newChords.append("title");

                // Update all chord title texts
                chordPaths.select("title")
                    .text(function (d) {
                        if (landuse[d.target.index].name !== landuse[d.source.index].name) {
                            return [numberWithCommas(d.source.value),
                                " ha change from ",
                                landuse[d.source.index].name,
                                " to ",
                                landuse[d.target.index].name,
                                "\n",
                                numberWithCommas(d.target.value),
                                "  ha change from ",
                                landuse[d.target.index].name,
                                " to ",
                                landuse[d.source.index].name
                            ].join("");
                            //joining an array of many strings is faster than
                            //repeated calls to the '+' operator,
                            //and makes for neater code!
                        }
                        else { //source and target are the same
                            return numberWithCommas(d.source.value)
                                + " ha no change in "
                                + landuse[d.source.index].name;
                        }
                    });

                //handle exiting paths:
                chordPaths.exit().transition()
                    .duration(1500)
                    .attr("opacity", 0)
                    .remove();

                //update the path shape
                chordPaths.transition()
                    .duration(1500)
                    //.attr("opacity", 0.5) //optional, just to observe the transition
                    .style("fill", function (d) {
                        return landuse[d.source.index].color;
                    })
                    .attrTween("d", chordTween(last_layout))
                //.transition().duration(100).attr("opacity", 1) //reset opacity
                ;

                //add the mouseover/fade out behaviour to the groups
                //this is reset on every update, so it will use the latest
                //chordPaths selection
                groupG.on("mouseover", function (d) {
                    chordPaths.classed("fade", function (p) {
                        //returns true if *neither* the source or target of the chord
                        //matches the group that has been moused-over
                        return ((p.source.index != d.index) && (p.target.index != d.index));
                    });
                });
                //the "unfade" is handled with CSS :hover class on g#circle
                //you could also do it using a mouseout event:
                /*
                 g.on("mouseout", function() {
                 if (this == g.node() )
                 //only respond to mouseout of the entire circle
                 //not mouseout events for sub-components
                 chordPaths.classed("fade", false);
                 });
                 */

                last_layout = layout; //save for next update

                //}); //end of d3.json
            }
        }

        function arcTween(oldLayout) {
            //this function will be called once per update cycle

            //Create a key:value version of the old layout's groups array
            //so we can easily find the matching group
            //even if the group index values don't match the array index
            //(because of sorting)
            var oldGroups = {};
            if (oldLayout) {
                oldLayout.groups().forEach(function (groupData) {
                    oldGroups[groupData.index] = groupData;
                });
            }

            return function (d, i) {
                var tween;
                var old = oldGroups[d.index];
                if (old) { //there's a matching old group
                    tween = d3.interpolate(old, d);
                }
                else {
                    //create a zero-width arc object
                    var emptyArc = {
                        startAngle: d.startAngle,
                        endAngle: d.startAngle
                    };
                    tween = d3.interpolate(emptyArc, d);
                }

                return function (t) {
                    return arc(tween(t));
                };
            };
        }

        function chordKey(data) {
            return (data.source.index < data.target.index) ?
                data.source.index + "-" + data.target.index :
                data.target.index + "-" + data.source.index;

            //create a key that will represent the relationship
            //between these two groups *regardless*
            //of which group is called 'source' and which 'target'
        }

        function chordTween(oldLayout) {
            //this function will be called once per update cycle

            //Create a key:value version of the old layout's chords array
            //so we can easily find the matching chord
            //(which may not have a matching index)

            var oldChords = {};

            if (oldLayout) {
                oldLayout.chords().forEach( function(chordData) {
                    oldChords[ chordKey(chordData) ] = chordData;
                });
            }

            return function (d, i) {
                //this function will be called for each active chord

                var tween;
                var old = oldChords[ chordKey(d) ];
                if (old) {
                    //old is not undefined, i.e.
                    //there is a matching old chord value

                    //check whether source and target have been switched:
                    if (d.source.index != old.source.index ){
                        //swap source and target to match the new data
                        old = {
                            source: old.target,
                            target: old.source
                        };
                    }

                    tween = d3.interpolate(old, d);
                }
                else {
                    //create a zero-width chord object
        ///////////////////////////////////////////////////////////in the copy ////////////////
                    if (oldLayout) {
                        var oldGroups = oldLayout.groups().filter(function(group) {
                                return ( (group.index == d.source.index) ||
                                         (group.index == d.target.index) )
                            });
                        old = {source:oldGroups[0],
                                   target:oldGroups[1] || oldGroups[0] };
                            //the OR in target is in case source and target are equal
                            //in the data, in which case only one group will pass the
                            //filter function

                        if (d.source.index != old.source.index ){
                            //swap source and target to match the new data
                            old = {
                                source: old.target,
                                target: old.source
                            };
                        }
                    }
                    else old = d;
         /////////////////////////////////////////////////////////////////
                    var emptyChord = {
                        source: { startAngle: old.source.startAngle,
                                 endAngle: old.source.startAngle},
                        target: { startAngle: old.target.startAngle,
                                 endAngle: old.target.startAngle}
                    };
                    tween = d3.interpolate( emptyChord, d );
                }

                return function (t) {
                    //this function calculates the intermediary shapes
                    return path(tween(t));
                };
            };
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
