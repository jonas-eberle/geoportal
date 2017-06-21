(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('ClimateChartCtrl', ClimateChartCtrl);

    ClimateChartCtrl.$inject = ['$modalInstance', 'djangoRequests', 'mapviewer', 'layer', 'feature', 'title'];
    function ClimateChartCtrl($modalInstance, djangoRequests, mapviewer, layer, feature, title) {
        var cc = this;

        cc.addChart = addChart;
        cc.changeOptions = changeOptions;
        cc.chart = {};
        cc.chartdata = [];
        cc.close = close;
        cc.colors = ['black'];
        cc.dateOptions = {
            startingDay: 1
        };
        cc.download = downloadSOS;
        cc.endDate = '2012-01-01';
        cc.feature = feature;
        cc.labels = ['isodate',cc.feature.get('name')];
        cc.layer = layer;
        cc.maxDate = new Date('2015-03-01');
        cc.minDate = new Date('1970-01-01');
        cc.openedEnd = false;
        cc.openEnd = openEnd;
        cc.openedStart = false;
        cc.openStart = openStart;
        cc.parameter = {};
        cc.parameters = [];
        cc.request_url = '';
        cc.startDate = '2001-01-01';
        cc.title = title;
        cc.ylabel = 'name [unit]';

        function addChart(elem) {

            cc.request_url = '/layers/sos/data?id='+cc.layer.django_id+'&procedure='+cc.feature.get('procedure');

            $('#loading-div').show();
            djangoRequests.request({
                url: cc.request_url,
                method: 'GET'
            }).then(function(data) {
                cc.chartdata = [];
                cc.startDate = data.start;
                cc.endDate = data.end;
                cc.parameters = data.parameters;
                cc.parameter = data.param;
                cc.ylabel = data.param.name+' ['+data.param.uom+']';
                cc.minDate = new Date(data.minDate);
                cc.maxDate = new Date(data.maxDate);

                $.each(data.values, function(){
                    if (parseFloat(this[1]) == -999.9) {
                        this[1] = Number.NaN;
                    } else {
                        this[1] = parseFloat(this[1]);
                    }
                    cc.chartdata.push([new Date(this[0]), this[1]]);
                });

                cc.chart = new Dygraph(
                    elem[0],
                    cc.chartdata,
                    {
                        labels: cc.labels,
                        colors: cc.colors,
                        strokeWidth: 2,
                        legend: 'always',
                        title: '',
                        showRangeSelector: true,
                        rangeSelectorHeight: 30,
                        rangeSelectorPlotStrokeColor: 'black',
                        rangeSelectorPlotFillColor: 'green',
                        labelsDivStyles: {
                            'padding': '4px',
                            'border': '1px solid black',
                            'borderRadius': '3px',
                            'boxShadow': '4px 4px 4px #888',
                            'right': '10px'
                        },
                        labelsDivWidth: "100%",
                        axisLineColor: 'green',
                        axisLabelFontSize: 11,
                        axisLabelWidth: 150,
                        xAxisLabelWidth: 60,
                        highlightCircleSize: 4,
                        ylabel: cc.ylabel,
                        yAxisLabelWidth: 30,
                        axes: {
                            x: {
                                axisLabelFormatter: Dygraph.dateString_,
                                ticker:Dygraph.dateTicker
                            },
                            y: {
                                pixelsPerLabel: 20
                            }
                        },
                        interactionModel : {
                            'mousedown' : downV3,
                            'mousemove' : moveV3,
                            'mouseup' : upV3,
                            'click' : clickV3,
                            'dblclick' : dblClickV3,
                            'mousewheel' : scrollV3
                        }
                    }
                );
                $('#loading-div').hide();

                var modalElem = $(elem).parents('.modal');
                modalElem.removeClass('modal').addClass('mymodal');
                $('.modal-content', modalElem).css('left', $(document).width()/2-300);

                window.setTimeout("angular.element('.ng-isolate-scope').scope().chart.resize();", 500);
            }, function(err){
                $('#loading-div').hide();
                $modalInstance.close();
                bootbox.alert('An error occurred while loading data: '+err.error);
            });
        }

        function changeOptions() {
            var start = (typeof cc.startDate  === 'object') ? cc.startDate.toISOString() : cc.startDate;
            var end = (typeof cc.endDate === 'object') ? cc.endDate.toISOString() : cc.endDate;
            var param = cc.parameter.definition;

            cc.request_url = '/layers/sos/data?id='+cc.layer.django_id+'&procedure='+cc.feature.get('procedure')+'&start='+start+'&end='+end+'&param='+param;

            $('#loading-div').show();
            djangoRequests.request({
                url: cc.request_url,
                method: 'GET'
            }).then(function(data) {
                cc.chartdata = [];
                cc.ylabel = data.param.name+' ['+data.param.uom+']';
                cc.minDate = new Date(data.minDate);
                cc.maxDate = new Date(data.maxDate);
                $.each(data.values, function(){
                    if (parseFloat(this[1]) == -999.9) {
                        this[1] = Number.NaN;
                    } else {
                        this[1] = parseFloat(this[1]);
                    }
                    cc.chartdata.push([new Date(this[0]), this[1]]);
                });
                cc.chart.updateOptions({
                    file: cc.chartdata,
                    valueRange: null,
                    windowRange: null,
                    ylabel: cc.ylabel
                });
                $('#loading-div').hide();
            });

        }

        function close() {
            $modalInstance.close();
            mapviewer.selectInteraction.getFeatures().clear();
        }

        function downloadSOS() {
            var url = subdir+cc.request_url+'&download=true';
            window.open(url, 'download_sos');
        }

        function openEnd($event) {
            $event.preventDefault();
            $event.stopPropagation();

            cc.openedEnd = true;
        }

        function openStart($event) {
            $event.preventDefault();
            $event.stopPropagation();

            cc.openedStart = true;
        }
    }
})();
