'use strict';

angular.module('webgisApp')
	.controller('WetlandsCtrl', function($scope, $compile, mapviewer, djangoRequests, $modal, $rootScope, $cookies, Attribution){
        $scope.wetlands = [];
		$scope.wetlands_map = {};
        $scope.$on('mapviewer.catalog_loaded', function ($broadCast, data) {
            djangoRequests.request({
                'method': "GET",
                'url': '/swos/wetlands.geojson'
            }).then(function(data){
				//$scope.wetlands = data.features;
				$scope.wetlands = [];
				var vectorSource = new ol.source.Vector();
				var features = (new ol.format.GeoJSON()).readFeatures(data);

                $.each(features, function(){
					var centroid = ol.extent.getCenter(this.getGeometry().getExtent());
					this.getGeometry().transform('EPSG:4326', mapviewer.displayProjection);
					var prop = this.getProperties();
					
					$scope.filtered_testmapping = true;
					if (prop['id'] <= 9) {
						prop['show'] = true;
					} else {
						prop['show'] = false;
					}
					$scope.wetlands.push(prop);
                });
				
                vectorSource.addFeatures(features);
                $scope.olLayer = new ol.layer.Vector({
                    name: 'Wetlands',
                    source: vectorSource
                });
				mapviewer.map.addLayer($scope.olLayer);
            }, function(error) {
                bootbox.alert('<h1>Error while loading wetlands</h1>');
            })
        });
		
		$scope.data_count = {};
		$scope.videosCurrentPage = 1;
		$scope.allVideos = false;
		$scope.videosMaxPage = 9;
		$scope.loadMoreVideos = function() {
			$scope.videosCurrentPage += 1;
			var start = $scope.videosCurrentPage*$scope.videosMaxPage - $scope.videosMaxPage;
			console.log('start = '+start);
			djangoRequests.request({
				'method': "GET",
				'url': '/swos/wetland/'+$scope.value.id+'/youtube.json?start='+start+'&max='+$scope.videosMaxPage
			}).then(function(data){
				//$scope.value['videos'] = data;
				$scope.value['videos'].push.apply($scope.value['videos'], data);
				if (data.length < $scope.videosMaxPage) {
					$scope.allVideos = true;
				}
			})
		}
		$scope.pictures_is_open = true
		$scope.external_pictures_is_open = true
		$scope.imagesCurrentPage = 1;
		$scope.imagesCurrentPage_external = 1;
		$scope.allImages = false;
		$scope.allImages_external = false;
		$scope.imagesMaxPage = 24;
		$scope.loadMoreImages = function() {
			$scope.imagesCurrentPage += 1;
			var start = $scope.imagesCurrentPage*$scope.imagesMaxPage - $scope.imagesMaxPage;
			djangoRequests.request({
				'method': "GET",
				'url': '/swos/wetland/'+$scope.value.id+'/images.json?start='+start+'&max='+$scope.imagesMaxPage
			}).then(function(data){
				$scope.value['pictures']['photos'].push.apply($scope.value['pictures']['photos'], data['photos']);
				if (data['photos'].length < $scope.imagesMaxPage) {
					$scope.allImages = true;
				}
			})
		}
		$scope.loadMoreImages_external = function() {
			$scope.imagesCurrentPage_external += 1;
			var start = $scope.imagesCurrentPage_external*$scope.imagesMaxPage - $scope.imagesMaxPage;
			djangoRequests.request({
				'method': "GET",
				'url': '/swos/wetland/'+$scope.value.id+'/panoramio.json?start='+start+'&max='+$scope.imagesMaxPage
			}).then(function(data){
				$scope.value['external_pictures']['photos'].push.apply($scope.value['external_pictures']['photos'], data['photos']);
				if (data['photos'].length < $scope.imagesMaxPage) {
					$scope.allImages_external = true;
				}
			})
		}
		$scope.moreImages_external = function(action) {
			if (action == 'prev') {
				$scope.imagesCurrentPage_external -= 1;
			} else {
				$scope.imagesCurrentPage_external += 1;
			}
			var start = $scope.imagesCurrentPage_external*$scope.imagesMaxPage - $scope.imagesMaxPage;
			djangoRequests.request({
				'method': "GET",
				'url': '/swos/wetland/'+$scope.value.id+'/panoramio.json?start='+start+'&max='+$scope.imagesMaxPage
			}).then(function(data){
				$scope.value['external_pictures']['photos'] = data['photos'];
				if (data['photos'].length < $scope.imagesMaxPage) {
					$scope.allImages_external = true;
				} else {
					$scope.allImages_external = false;
				}
			})
			
		}
		$scope.moreImages = function(action) {
			if (action == 'prev') {
				$scope.imagesCurrentPage -= 1;
			} else {
				$scope.imagesCurrentPage += 1;
			}
			var start = $scope.imagesCurrentPage*$scope.imagesMaxPage - $scope.imagesMaxPage;
			djangoRequests.request({
				'method': "GET",
				'url': '/swos/wetland/'+$scope.value.id+'/panoramio.json?start='+start+'&max='+$scope.imagesMaxPage
			}).then(function(data){
				$scope.value['pictures']['photos'] = data['photos'];
				if (data['photos'].length < $scope.imagesMaxPage) {
					$scope.allImages = true;
				} else {
					$scope.allImages = false;
				}
			})

		}
		$scope.showFoto = function(picture) {
			console.log(picture);
			return false;
		}				
		
		$scope.filtered_country = '';
		$scope.filtered_geo_scale = '';
		$scope.filtered_testmapping = false;
		$scope.countries = ['Spain', 'Greece', 'Sweden', 'France', 'Jordan', 'Tanzania', 'United Arab Emirates', 'Iraq', 'Latvia', 'Bosnia and Herzegovina', 'Algeria', 'Tunisia', 'Estonia', 'Lithuania', 'Senegal', 'Egypt', 'Slovenia', 'Montenegro-Albania', 'Italy', 'Finland', 'Morocco'];
		$scope.countries.sort();
		$scope.geo_scale = ['Small Wetland Site', 'Large Wetland Site', 'Medium Wetland Site', 'River Basin'];
		
		$scope.filterCountry = function() {
			$scope.filtered_testmapping = false;
			$.each($scope.wetlands, function(){
				if (this['country'] == $scope.filtered_country) {
					this['show'] = true;
				} else {
					this['show'] = false;
				}
			})
			$scope.filtered_geo_scale = '';
			console.log($scope.filtered_country);
			if ($scope.filtered_country == null) {
				$scope.filterReset();
			}
		}
		
		$scope.filterScale = function() {
			$scope.filtered_testmapping = false;
			$.each($scope.wetlands, function(){
				if (this['geo_scale'] == $scope.filtered_geo_scale) {
					this['show'] = true;
				} else {
					this['show'] = false;
				}
			})
			$scope.filtered_country = '';
			if ($scope.filtered_geo_scale == null) {
				$scope.filterReset();
			}
		}
		
		$scope.filterTestmapping = function() {
			$scope.filtered_country = '';
			$scope.filtered_geo_scale = '';
			if ($scope.filtered_testmapping == false) {
				$scope.filterReset();
			} else {
				$.each($scope.wetlands, function(){
					if (this['id'] <= 9) {
						this['show'] = true;
					} else {
						this['show'] = false;
					}
				})
			}
		}
		
		$scope.filterReset = function() {
			$.each($scope.wetlands, function(){
				this['show'] = true;
			})
		}
		
		$scope.wetlands_opened = {}
		$scope.activeTab = -1;
		
		$scope.$on('mapviewer.wetland_selected', function ($broadCast, id) {
			$scope.selectWetlandFromId(id);
		});
		
		$scope.selectWetlandFromId = function(id) {
			$.each($scope.wetlands, function() {
				if (this['id'] == id) {
					$scope.selectWetland(this);
				}
			});
		}
		
		$scope.value = null;
		$scope.satdata_table = false;
		$scope.satdata_image = true;

		$scope.externaldb_search = {'searchText':  "", 'layer_exist': ""}

		$scope.trackWetlandTab = function(type) {
			try {
				_paq.push(['setCustomUrl', '/wetland/'+$scope.value.name+'/'+type]);
				_paq.push(['setDocumentTitle', $scope.value.name+'/'+type]);
				_paq.push(['trackPageView']);
			} catch (err) {}
		}
		
		$scope.trackProduct = function(product, open) {
			if (open) {
				try {
					_paq.push(['setCustomUrl', '/wetland/'+$scope.value.name+'/products/'+product]);
					_paq.push(['setDocumentTitle', $scope.value.name+'/products/'+product]);
					_paq.push(['trackPageView']);
				} catch (err) {}
			}
		}
		
		$scope.trackAddLayer = function(layer) {
			try {
				_paq.push(['setCustomUrl', '/wetland/'+$scope.value.name+'/products/'+layer.product_name+'/'+layer.alternate_title]);
				_paq.push(['setDocumentTitle', 'Map: '+layer.title]);
				_paq.push(['trackPageView']);
			} catch (err) {}
		}
		
		$scope.trackShowSatdataImage = function(image) {
			try {
				_paq.push(['trackEvent', 'Show Satdata Image', $scope.value.name, image]);
			} catch (err) {}
		}
		
		$scope.trackShowImage = function(url, title) {
			try {
				_paq.push(['trackEvent', 'Show Photo', $scope.value.name, url]);
			} catch (err) {}
		}
		
		$scope.trackShowVideo = function(url) {
			try {
				_paq.push(['trackEvent', 'Show Video', $scope.value.name, url]);
			} catch (err) {}
		}

        $scope.selectFeature = function(wetland) {
            var extent = wetland.geometry.getExtent();
            //pan = ol.animation.pan({duration: 500, source: mapviewer.map.getView().getCenter()})
            //zoom = ol.animation.zoom({duration: 500, resolution: mapviewer.map.getView().getResolution()})
            //mapviewer.map.beforeRender(pan, zoom)
            mapviewer.map.getView().fitExtent(extent, mapviewer.map.getSize());

            var wetlandFeature = $scope.olLayer.getSource().getFeatureById(wetland.id);
            wetlandFeature.setStyle(new ol.style.Style({
                fill  : new ol.style.Fill({
                    color: 'rgba(255,255,255,0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: "#4B94B6",
                    width: 5
                })
            }));

            // get selectInteraction from map
            var selectInteraction = mapviewer.map.getInteractions().getArray().filter(function (interaction) {
                return interaction instanceof ol.interaction.Select;
            });
            selectInteraction[0].getFeatures().clear();
            selectInteraction[0].getFeatures().push(wetlandFeature);

            // reset style of previously selected feature
            if (mapviewer.currentFeature !== null) {
                mapviewer.currentFeature.setStyle(null);
            }
            // save the currently selected feature
            mapviewer.currentFeature = wetlandFeature;
        };

        $scope.selectWetland = function(wetland) {
			/*
			try {
				_paq.push(['setCustomUrl', '/wetland/'+wetland.name]);
				_paq.push(['setDocumentTitle', wetland.name]);
				_paq.push(['trackPageView']);
			} catch (err) {}
			*/
			$scope.activeTab = 1; //wetland.id;
			//$('#sidebar-tabs li').removeClass('active');
			//$('#sidebar .tab-content .tab-pane').removeClass('active');
			
			//if (!(wetland.id in $scope.wetlands_opened)) {
			
				djangoRequests.request({
	                'method': "GET",
	                'url': '/swos/wetland/'+wetland.id
	            }).then(function(data){
					wetland['data'] = data;
					//$scope.wetlands_opened[wetland.id] = wetland;
					$scope.value = wetland;
					$scope.data_count = data['count'];
					console.log($scope.data_count);
					
					$scope.videosCurrentPage = 1;
					$scope.imagesCurrentPage = 1;
					$scope.allVideos = false;
					$scope.allImages = false;
					$scope.allImages_external = false;

					djangoRequests.request({
						'method': "GET",
						'url': '/swos/wetland/'+wetland.id+'/images.json?start=0&max=24'
					}).then(function(data){
						//$scope.wetlands_opened[wetland.id]['pictures'] = data;
						$scope.value['pictures'] = data;
						if (data['photos'].length < $scope.imagesMaxPage) {
							$scope.allImages = true;
						}
					})


					djangoRequests.request({
						'method': "GET",
						'url': '/swos/wetland/'+wetland.id+'/panoramio.json?start=0&max=24'
					}).then(function(data){
						//$scope.wetlands_opened[wetland.id]['pictures'] = data;
						$scope.value['external_pictures'] = data;
						if (data['photos'].length < $scope.imagesMaxPage) {
							$scope.allImages_external = true;
						}
					})				
					
					djangoRequests.request({
						'method': "GET",
						'url': '/swos/wetland/'+wetland.id+'/youtube.json?start=0&max=9'
					}).then(function(data){
						//$scope.wetlands_opened[wetland.id]['videos'] = data;
						$scope.value['videos'] = data;
						if (data.length < $scope.videosMaxPage) {
							$scope.allVideos = true;
						}
					})
					
					djangoRequests.request({
						'method': "GET",
						'url': '/swos/wetland/'+wetland.id+'/satdata.json'
					}).then(function(data){
						//$scope.wetlands_opened[wetland.id]['satdata'] = data;
						$scope.value['satdata'] = data;
					})
					
	            }, function(error) {
	                bootbox.alert('<h1>Error while loading wetland details</h1>');
	            });
			
			/*} else {
				$('.scroller-right').click();
				$('#link_wetland_'+wetland.id).click();	
			}*/

            $scope.selectFeature(wetland);
		};
		
		$scope.foo = function(id) {
			console.log('foo');
			reAdjust();
			$('.scroller-right').click();
			//$('#sidebar-tabs a:last').tab('show')
		}
		
		$scope.closeWetland = function(id) {
			$('#link_wetland_'+id).remove();
			$('#wetland_'+id).remove();
			delete $scope.wetlands_opened[id];
			$('.scroller-left').click();
			$('#link_wetland_list').click();
		}
		
		$scope.addLayer = function(product) {
			if (product.layers.length > 0) {
				mapviewer.addLayer(product.layers[0]);
			} else {
				alert('No layer found');
			}
		}

        // we need a mapping between the django_id and the hash-like id of a layer to access it in mapviewer.layers
        $scope.layerIdMap = {};
        $scope.layers = mapviewer.layers;
		$scope.addLayerToMap = function(layer, $event) {
			var checkbox = $event.target;
            if (checkbox.checked) {
				$scope.trackAddLayer(layer);
				var layerObj = mapviewer.addLayer(layer).get("layerObj");
                // store the mapping between django_id and hash-like id
                $scope.layerIdMap[layerObj.django_id] = layerObj.id;
				
				// check intersection, if no, please zoom to the new layer!
				var mapExtent = mapviewer.map.getView().calculateExtent(mapviewer.map.getSize());
				var mapExtent = ol.proj.transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
				var mapJSON = {
				  "type": "Feature",
				  "properties": {"fill":"#fff"},
				  "geometry": {
				    "type": "Polygon",
				    "coordinates": [[
				      [mapExtent[0], mapExtent[1]],
				      [mapExtent[0], mapExtent[3]],
					  [mapExtent[2], mapExtent[3]],
					  [mapExtent[2], mapExtent[1]],
				      [mapExtent[0], mapExtent[1]]
				    ]]
				  }
				};
				

	            var layerJSON = {
				  "type": "Feature",
				  "properties": {"fill":"#fff"},
				  "geometry": {
				    "type": "Polygon",
				    "coordinates": [[
				      [layer.west, layer.south],
				      [layer.west, layer.north],
					  [layer.east, layer.north],
					  [layer.east, layer.south],
				      [layer.west, layer.south]
				    ]]
				  }
				};
				
				var intersection = turf.intersect(mapJSON, layerJSON);
				//Zoom to extent except of global extent
				if (typeof(intersection) == 'undefined' && !(layer.west == -180 && layer.south == -90 && layer.east == 180 && layer.north == 90)) {

					// zoom to new layer
					var layerExtent = [layer.west, layer.south, layer.east, layer.north];
					if (layer.epsg > 0) {

		                cosole.log(layerExtent);
						layerExtent = ol.proj.transformExtent(layerExtent, 'EPSG:'+layer.epsg, mapviewer.map.getView().getProjection().getCode());
		            }
					mapviewer.map.getView().fitExtent(layerExtent, mapviewer.map.getSize());
				}

                // if this the first time the user added a second layer to map, notify them
                // about it. using cookies to prevent the dialog from popping up everytime.
                if (mapviewer.layersMeta.length > 1 && ! $cookies.hasNotifiedAboutLayers) {
                    bootbox.dialog({
                        title: "Warning",
                        message: "More than one layer has been added to the map. This means " +
                        "that layers are visualized in combination, i.e. the layer added most " +
                        "recently is displayed on top.",
                        closeButton: false,
                        buttons: {
                            "Do not show again": function() {
                                $cookies.hasNotifiedAboutLayers = true;
                            },
                            cancel: {
                                label: "Close"
                            }
                        }
                    });
                }
            } else {
				var layers = mapviewer.map.getLayers().getArray();
                // NOTE: iterating over an array here whilst deleting elements from this array!
				$.each(layers, function(){
					if (layer.title == this.get('name')) {
						var layerId = this.get('layerObj').id;
						console.log('LayerId: '+layerId);
						var index = mapviewer.getIndexFromLayer(layer.title);
						console.log('index: '+index);
						mapviewer.removeLayer(layerId, index);
						//this.setVisible(false);

                        // stop iterating over all the layers
                        return false;
					}
				});
            }
            $scope.attributionList();
		};

		$scope.attributionList = function() {
			var layers = mapviewer.map.getLayers().getArray();
			var attribution_arr = [];
			$.each(layers, function() {
					var layer = this.get('layerObj');

					if(typeof(layer) !== 'undefined') {
                        if (attribution_arr.indexOf(layer.ogc_attribution) == -1  ) {
                                if(layer.ogc_attribution != 'null') {
                                    attribution_arr.push(layer.ogc_attribution);
                                }
                        }
                    }
                });
				var attr_list = attribution_arr.join(' | \u00A9 ');
				Attribution.setList(attr_list);
		}

		$scope.removeAllLayers = function () {
            while (mapviewer.layersMeta.length > 0) {
                var layer = mapviewer.layersMeta[0];
                mapviewer.removeLayer(layer.id, 0);
                var checkbox = undefined;
                if (layer["django_id"] !== undefined
                    && layer.django_id !== null
                    && (checkbox = document.getElementById("layer_vis_"+layer.django_id))
                ) {
                    checkbox.checked = "";
                }
            }
            $scope.layerIdMap = {};

        };

        $scope.removeLayersByWetland = function(wetlandId) {
            // get layers of opened wetland
            var layersToRemove = mapviewer.layersMeta.filter(function(layer) {
                return layer.wetland_id === wetlandId;
            });

            // remove layers of opened wetland
            // NOTE: never iterate over layersMeta while manipulating layersMeta
            $.each(layersToRemove, function() {
                var layersMetaIndex = mapviewer.getIndexFromLayer(this.title);
                mapviewer.removeLayer(this.id, layersMetaIndex);
            });

        };

        $scope.$on("mapviewer.alllayersremoved", function () {
            $scope.layerIdMap = {};
            $scope.attributionList()

        });

        $scope.$on("mapviewer.layerremoved", function($broadcast, id) {
            if (id !== undefined && id !== null) {
                $scope.layerIdMap[id] = undefined;
                $scope.attributionList()
            }

        });
	})
	.directive('repeatDone', function() {
      return function(scope, element, attrs) {
        scope.$eval(attrs.repeatDone);
      }
    })
    .directive('swosLayerControls', function(){
        return {
            restrict: "E",
            scope: {
                olLayer: "=olLayer"
            },
            transclude: true,
            controller: function($scope) {
                // unveil our layer object (as we actually get handed over an ol3 layer object)
                $scope.layer = $scope.olLayer.get("layerObj");
                $scope.mcl = $scope.$parent.$parent;
            },
            templateUrl: "../../static/includes/swos-layer-controls.html"
        }
    });



// copied from http://www.bootply.com/l2ChB4vYmC
var hidWidth;
var scrollBarWidths = 40;

var widthOfList = function(){
  var itemsWidth = 0;
  $('.list li').each(function(){
    var itemWidth = $(this).outerWidth();
    itemsWidth+=itemWidth;
  });
  return itemsWidth;
};

var widthOfHidden = function(){
  return (($('.wrapper').outerWidth())-widthOfList()-getLeftPosi())-scrollBarWidths;
};

var getLeftPosi = function(){
  return $('.list').position().left;
};

var reAdjust = function(){
  if (($('.wrapper').outerWidth()) < widthOfList()) {
    $('.scroller-right').show();
  }
  else {
    $('.scroller-right').hide();
  }
  
  if (getLeftPosi()<0) {
    $('.scroller-left').show();
  }
  else {
    $('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
  	$('.scroller-left').hide();
  }
}

reAdjust();

$(window).on('resize',function(e){  
  	reAdjust();
});

$('.scroller-right').click(function() {
  
  $('.scroller-left').fadeIn('slow');
  $('.scroller-right').fadeOut('slow');
  
  $('.list').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){

  });
});

$('.scroller-left').click(function() {
  
	$('.scroller-right').fadeIn('slow');
	$('.scroller-left').fadeOut('slow');
  
  	$('.list').animate({left:"-="+getLeftPosi()+"px"},'slow',function(){
  	
  	});
});    

$(document).ready(function() {
	$(".fancybox").fancybox({
		openEffect	: 'none',
		closeEffect	: 'none'
	});
	bootbox.dialog({
		title:'Welcome to the SWOS Geoportal', 
		message: $('#welcome_text').html(), 
		backdrop: true, 
		onEscape:true, 
		buttons: {close:{label:'Close'}}
	});
});
