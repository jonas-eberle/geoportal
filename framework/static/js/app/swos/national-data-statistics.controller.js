(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('NationalDataStatisticsCtrl', NationalDataStatisticsCtrl);

    NationalDataStatisticsCtrl.$inject = ['WetlandsService', 'djangoRequests', 'mapviewer', '$uibModal', '$uibModalInstance', '$compile', 'Attribution', '$timeout', 'data', 'title'];
    function NationalDataStatisticsCtrl(WetlandsService, djangoRequests, mapviewer, $modal, $modalInstance, $compile, Attribution, $timeout, data, title) {
        var wsdc = this;

        wsdc.data = [];
        
        wsdc.load = load;
        wsdc.exportChartAsPNG = exportChartAsPNG;
        wsdc.close = close;
		wsdc.init_chart = init_chart;
		wsdc.values_passed = data;
		wsdc.title  = title;
        
        wsdc.chartOptions = {
            chart: {
                type: 'multiBarChart',
                height: 550,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 75,
                    left: 75
                },
                showControls: false,
                x: function(d){ return d['class']; },
                y: function(d){ return d['size']; },
                //clipEdge: true,
                //duration: 500,
                stacked: false,
				//rotateLabels: -45,
				//staggerLabels: true,
                wrapLabels: true,
				reduceXTicks: false,
                xAxis: {
                    axisLabel: ''
                },
                yAxis: {
                    axisLabel: 'Size (ha)',
                    showMaxMin: true,
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
				legendPosition: 'bottom',
				noData: 0
            }
        };
        
        load();

        //-------------------------------------------------------------------------------------------------------------

        function load() {
            $('#loading-div').show();
            console.log(wsdc.values_passed);
            djangoRequests.request({
                method: 'GET',
                url: '/swos/nationaldata/statistics.json?&country='+wsdc.values_passed.country+'&clc='+wsdc.values_passed.clc+'&year='+wsdc.values_passed.date
            }).then(function(data) {
                wsdc.data = data;
				$('#loading-div').hide();
                if (data.length == 0) {
                    wsdc.close();
                    bootbox.alert("No data found");
                }
            });
        }
		
		function init_chart(scope, element) {
			$timeout(function(){
				console.log('init chart');
				//$('#national-data-chart g.nv-legendWrap g.nv-series').each(function(){this.dispatchEvent(new Event('click'))});
			}, 250);
			
		}
        
        function exportChartAsPNG() {
            saveSvgAsPng(jQuery('#national-data-chart svg')[0], "national-data-chart.png", {scale: 2, encoderOptions: 1});
        }
        
        function close() {
            $modalInstance.close();
        }
    }
})();