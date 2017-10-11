(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('WetlandsSatDataCtrl', WetlandsSatDataCtrl)
        .filter("commaBreak", function () {
            return function ( value ) {
                if( !value.length ) return [];
                return value.split(',');
            }
        })
        .filter('filterData', function() {
          return function(items, datasets, tile, time_start_begin, time_start_end, maxcloudcover, sun_zenith, sun_azimuth, groupBy, group) {
            /*
            if (datasets.length === 0 && tile === '') {
              return items;
            }
            */
            return items.filter(function(element, index, array) {
              return (
                (datasets.length === 0 || jQuery.inArray(element.properties.dataset, datasets) > -1) && 
                (tile === 'All' || element.properties.tile === tile) &&
                (new Date(element.properties.time_start) >= time_start_begin) &&
                (new Date(element.properties.time_start) <= time_start_end) &&
                (element.properties.hasOwnProperty('cloud_cover') === false || element.properties.cloud_cover == "nan" || element.properties.cloud_cover <= maxcloudcover) &&
                (element.properties.hasOwnProperty('sun_zenith_angle_mean') === false || element.properties.sun_zenith_angle_mean == "nan" || (element.properties.sun_zenith_angle_mean >= sun_zenith[0] && element.properties.sun_zenith_angle_mean <= sun_zenith[1])) &&
                (element.properties.hasOwnProperty('sun_azimuth_angle_mean') === false || element.properties.sun_azimuth_angle_mean == "nan" || (element.properties.sun_azimuth_angle_mean >= sun_azimuth[0] && element.properties.sun_azimuth_angle_mean <= sun_azimuth[1])) &&
                (groupBy === '' || element.properties[groupBy] === group)
              );
            });
        
          };
        });

    WetlandsSatDataCtrl.$inject = ['WetlandsService', 'djangoRequests', 'mapviewer', '$uibModal', '$uibModalInstance'];
    function WetlandsSatDataCtrl(WetlandsService, djangoRequests, mapviewer, $modal, $modalInstance) {
        var wsdc = this;

        wsdc.data = {'features':[]};
		wsdc.addMoreLimit = 6;
        wsdc.initialLimit = 9;
		wsdc.limitTo = 9;
		wsdc.addMoreItems = addMoreItems;
		
        wsdc.load = load;
        wsdc.currentVector;
        wsdc.onmouseover = onmouseover;
        wsdc.onmouseleave = onmouseleave;
        wsdc.selectScene = selectScene;
        wsdc.openMetadata = openMetadata;
        
        wsdc.filter_dataset = true;
        wsdc.datasetOptions = [];
        wsdc.tileOptions = [];
        wsdc.filterByDataset = [];
        wsdc.filterByTile = '';
        wsdc.filterByCloud = 100;
        wsdc.filterBySunElevation = [-90,90];
        wsdc.filterBySunZenith = [-90,90];
        wsdc.filterBySunAzimuth = [-180,180];
        wsdc.filter_optical_show = true;
        wsdc.filter_tile_show = true;
        wsdc.filter_sun_elevation_show = true;
        wsdc.filter_sun_zenith_show = true;
        wsdc.changeDatasetFilter = changeDatasetFilter;
        
        wsdc.time_start_begin = new Date();
        wsdc.time_start_end = new Date();
        wsdc.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };
        wsdc.monthOptions = [
            {id:0, label:'January'},
            {id:1, label:'February'},
            {id:2, label:'March'},
            {id:3, label:'April'},
            {id:4, label:'May'},
            {id:5, label:'June'},
            {id:6, label:'July'},
            {id:7, label:'August'},
            {id:8, label:'September'},
            {id:9, label:'October'},
            {id:10, label:'November'},
            {id:11, label:'December'}
        ];
        wsdc.filterByMonths = [];
        
        wsdc.groupBy = '';
        wsdc.groups = ['All'];
        wsdc.changeGroupBy = changeGroupBy;
        wsdc.addWMSLayer = addWMSLayer;
        wsdc.wms_layer_checkbox = {};
        wsdc.wms_layer_openlayers = {};
        wsdc.wms_layer_style = {};
        wsdc.changeWMSLayerStyle = changeWMSLayerStyle;
        wsdc.filterChanged = filterChanged;
        
        wsdc.exportChartAsPNG = exportChartAsPNG;
        wsdc.close = close;
        
        wsdc.chartOptions = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                showControls: false,
                x: function(d){ return d['year']; },
                y: function(d){ return d['count']; },
                clipEdge: true,
                duration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Years',
                    showMaxMin: true
                },
                yAxis: {
                    axisLabel: 'Amount of data',
                    showMaxMin: true,
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                }
            }
        };
        
        load();

        //-------------------------------------------------------------------------------------------------------------

        function load() {
            $('#loading-div').show();
            djangoRequests.request({
                method: 'GET',
                url: '/media/cache/satdata/satdata_all_' + WetlandsService.value.id + '.stats.json'
            }).then(function(data) {
                console.log(data);
                wsdc.datasetOptions = data.datasets;
                wsdc.tileOptions = data.tiles;
                wsdc.time_start_begin = new Date(data.time_start_begin);
                wsdc.time_start_end = new Date(data.time_start_end);
                wsdc.dateOptions['minDate'] = new Date(data.time_start_begin);
                wsdc.dateOptions['maxDate'] = new Date(data.time_start_end);
                /*data.datasets.each(function(){
                    wsdc.data_filtered_stats.append({'key':this, 'values':[]});
                });*/
            });
            djangoRequests.request({
                method: 'GET',
                url: '/media/cache/satdata/satdata_all_' + WetlandsService.value.id + '.small.json'
            }).then(function(data) {
                wsdc.data = data;
                wsdc.filterChanged();
                $('#loading-div').hide();
            });
        }
		
		function addMoreItems() {
			wsdc.limitTo += wsdc.addMoreLimit;
			console.log(wsdc.limitTo);
		}
        
        wsdc.data_filtered = {'features':[]};
        wsdc.data_filtered_stats = [];
        function filterChanged() {
            wsdc.data_filtered_stats = [];
            wsdc.data_filtered = {'features':[]};
            
            var datasets = {};
            var time_min = new Date().getFullYear();
            var time_max = 0;
            $.each(wsdc.data['features'], function(){
                var element = this;
                if (
                    (wsdc.filterByDataset.length === 0 || jQuery.inArray(element.dataset, wsdc.filterByDataset) > -1) && 
                    (wsdc.filterByTile === '' || element.tile === wsdc.filterByTile) &&
                    (new Date(element.time_start) >= wsdc.time_start_begin) &&
                    (new Date(element.time_start) <= wsdc.time_start_end) &&
                    (wsdc.filterByMonths.length === 0 || jQuery.inArray(new Date(element.time_start).getMonth(), wsdc.filterByMonths) > -1) &&
                    (element.hasOwnProperty('cloud_cover') === false || element.cloud_cover == "nan" || element.cloud_cover <= wsdc.filterByCloud) &&
                    (element.hasOwnProperty('sun_elevation') === false || element.sun_elevation == "nan" || (element.sun_elevation >= wsdc.filterBySunElevation[0] && element.sun_elevation <= wsdc.filterBySunElevation[1])) &&
                    (element.hasOwnProperty('sun_zenith_angle_mean') === false || element.sun_zenith_angle_mean == "nan" || (element.sun_zenith_angle_mean >= wsdc.filterBySunZenith[0] && element.sun_zenith_angle_mean <= wsdc.filterBySunZenith[1])) &&
                    (element.hasOwnProperty('sun_azimuth_angle_mean') === false || element.sun_azimuth_angle_mean == "nan" || (element.sun_azimuth_angle_mean >= wsdc.filterBySunAzimuth[0] && element.sun_azimuth_angle_mean <= wsdc.filterBySunAzimuth[1]))
                ) {
                      wsdc.data_filtered.features.push(element);
                      if (element.dataset in datasets) {
                        
                      } else {
                        datasets[element.dataset] = {};
                      }
                      var year = new Date(element.time_start).getFullYear();
                      if (year < time_min) {
                        time_min = year;
                      }
                      if (year > time_max) {
                        time_max = year;
                      }
                      if (year in datasets[element.dataset]) {
                        datasets[element.dataset][year] += 1;
                      } else {
                        datasets[element.dataset][year] = 1;
                      }
                }
            });
            
            wsdc.limitTo = wsdc.initialLimit;
            $("#satellitedata-explorer").animate({ scrollTop: 0 }, "fast");
            
            $.each(datasets, function(key, val){
              var ds = key;
              var dataset = {'key':ds, 'values':[]};
              for(var year=time_min; year<=time_max; year++) {
                if (year in datasets[ds]) {
                    dataset['values'].push({'year':year, 'count':datasets[ds][year]});
                } else {
                    dataset['values'].push({'year':year, 'count':0});
                }
              }
              wsdc.data_filtered_stats.push(dataset);
            });
        }
        
        function changeDatasetFilter() {
            if (wsdc.filterByDataset.length === 0) {
                wsdc.filter_optical_show = true;
                wsdc.filter_tile_show = true;
                wsdc.filter_sun_elevation_show = true;
                wsdc.filter_sun_zenith_show = true;
                return true;
            }
            
            wsdc.filter_optical_show = true;
            wsdc.filter_tile_show = true;
            wsdc.filter_sun_elevation_show = false;
            wsdc.filter_sun_zenith_show = false;            
            
            // Hide tile and optical when only S1 is requested
            if (jQuery.inArray('S1_GRD_IW', wsdc.filterByDataset) > -1 && wsdc.filterByDataset.length === 1) {
                wsdc.filter_optical_show = false;
                wsdc.filter_tile_show = false;
            }
            
            // Show sun azimuth when S2 or L8 are requested
            if (jQuery.inArray('SENTINEL_2A', wsdc.filterByDataset) > -1 || jQuery.inArray('LANDSAT_8', wsdc.filterByDataset) > -1) {
                wsdc.filter_sun_zenith_show = true;
            }
            
            // Show sun elevation when MSS, TM or ETM are requested
            if (jQuery.inArray('LANDSAT_MSS', wsdc.filterByDataset) > -1 || jQuery.inArray('LANDSAT_TM', wsdc.filterByDataset) > -1 || jQuery.inArray('LANDSAT_ETM', wsdc.filterByDataset) > -1) {
                wsdc.filter_sun_elevation_show = true;
            }
        }
        
        function addWMSLayer(scene) {
            var index = scene['id'];
            if (scene['senhub_wms_url'] == 'nan') {
                bootbox.alert('No WMS layer available');
                return false;
            }
            
            var layer = {
                ogc_type: 'WMS',
                ogc_link: scene['senhub_wms_url'].replace('/wfs/', '/wms/'),
                ogc_layer: scene['senhub_wms_layers'].split(',')[0],
                title: scene['dataset'] + ': ' + scene['senhub_wms_time'].split('/')[0],
                layers: scene['senhub_wms_layers'].split(','),
                attribution: '&copy; <a href="http://www.sentinel-hub.com/" target="_blank">Sentinel Hub</a>',
                selectedDate: scene['senhub_wms_time'].split('/')[0],
                source: 'sentinelhub'
            };
            
            mapviewer.addLayer(layer);
            angular.element('#show_active_layer').click();
            
            /*           
            wsdc.wms_layer_openlayers[index] = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    attribution: ,
                    url: scene['senhub_wms_url'].replace('/wfs/', '/wms/'),
                    params: {
                        version: '1.3.0',
                        layers: scene['senhub_wms_layers'].split(',')[0],
                        styles: '',
                        format: 'image/png',
                        transparent: 'true',
                        height: 512,
                        width: 512,
                        
                    }
                })
            });
            mapviewer.map.addLayer(wsdc.wms_layer_openlayers[index]);
            */
            
        }
        
        function changeWMSLayerStyle(scene) {
            var index = scene['id'];
            console.log(wsdc.wms_layer_style[index]);
            wsdc.wms_layer_openlayers[index].getSource().updateParams({'layers': wsdc.wms_layer_style[index]});
        }
        
        function selectScene(scene) {
            console.log(scene);
            if (scene.hasOwnProperty('selected')) {
                if (scene['selected'] === true) {
                    scene['selected'] = false;
                } else {
                    scene['selected'] = true;
                }
            } else {
                scene['selected'] = true;
            }
            
        }
        
        function openMetadata(scene) {
            console.log(scene);
            $('#loading-div').show();
            djangoRequests.request({
                method: 'GET',
                url: '/swos/wetland/' + WetlandsService.value.id + '/satdata/metadata?scene=' + scene.id + '&dataset=' + scene.dataset
            }).then(function(data) {
                $('#loading-div').hide();
                console.log(data);
                bootbox.dialog({
                    title   : 'Scene metadata',
                    message : data,
                    backdrop: true,
                    onEscape: true,
                    buttons : {
                        close  : {label: 'Close'}
                    }
                });
            });
        }
        
        function onmouseover(scene) {
            //console.log(feature);
            var format = new ol.format.WKT();
            var feature = format.readFeature(scene['geometry'], {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            
            
            wsdc.currentVector2 = new ol.layer.Image({
                opacity: 0.75,
                source: new ol.source.ImageStatic({
                    url: scene['browse_url'],
                    //imageSize: [1024, 1016],
                    projection: mapviewer.map.getView().getProjection(),
                    imageExtent: feature.getGeometry().getExtent()
                })
            });
            
            wsdc.currentVector = new ol.layer.Vector({
                source: new ol.source.Vector({
                  features: [feature]
                })
            });
            mapviewer.map.addLayer(wsdc.currentVector);
            mapviewer.map.addLayer(wsdc.currentVector2); 
        }
        
        function onmouseleave() {
            mapviewer.map.removeLayer(wsdc.currentVector);
            mapviewer.map.removeLayer(wsdc.currentVector2);
        }
        
        function changeGroupBy() {
            console.log(wsdc.groupBy);
            switch(wsdc.groupBy) {
                case 'dataset':
                    wsdc.groups = wsdc.datasetOptions
                    break;
                case 'tile':
                    wsdc.groups = wsdc.tileOptions
                    break;
                default:
                    wsdc.groups = ['All']
                    break;
            }
        }
        
        function exportChartAsPNG() {
            saveSvgAsPng(jQuery('#satellitedata-chart svg')[0], "satellitedata-chart.png", {scale: 2, encoderOptions: 1});
        }
        
        function close() {
            $modalInstance.close();
        }
    }
})();
