'use strict';

angular.module('webgisApp')
.controller('WetlandsCtrl', function($scope, $compile, mapviewer, djangoRequests) {
    $scope.wetlands = [];
    $scope.$on('mapviewer.catalog_loaded', function() {
        djangoRequests.request({
            'method': "GET",
            'url'   : '/swos/wetlands.geojson'
        }).then(function(data) {
            $scope.wetlands = [];

            $scope.olLayer = L.geoJson(data, {
                style: function() {
                    return {
                        fillOpacity: 0.5,
                        fillColor  : "#ccc"
                    }
                },
                onEachFeature: function(feature, layer) {
                    var prop = feature.properties;
                    prop['show'] = true;
                    prop['bounds'] = layer.getBounds();
                    $scope.wetlands.push(prop);

                    layer.on("click", function(event) {
                        var clickedLayer = event.target;

                        // remove highlighting from all features
                        $scope.olLayer.setStyle({stroke: true});
                        // highlight the clicked feature
                        clickedLayer.setStyle({
                            stroke: false
                        });

                        $scope.selectWetlandFromId(clickedLayer.feature.id);
                    });
                }
            });
            L.extend($scope.olLayer, {
                name: "Wetlands"
            });

            mapviewer.layers[$scope.olLayer.name] = $scope.olLayer;
            mapviewer.map.addLayer($scope.olLayer);
        }, function() {
            bootbox.alert('<h1>Error while loading wetlands</h1>');
        })
    });

    $scope.filtered_country = '';
    $scope.filtered_geo_scale = '';
    $scope.filtered_testmapping = false;
    $scope.countries = ['Spain', 'Greece', 'Sweden', 'France', 'Jordan', 'Tanzania', 'United Arab Emirates', 'Iraq', 'Latvia', 'Bosnia and Herzegovina', 'Algeria', 'Tunisia', 'Estonia', 'Lithuania', 'Senegal', 'Egypt', 'Slovenia', 'Montenegro-Albania', 'Italy', 'Finland', 'Morocco'];
    $scope.countries.sort();
    $scope.geo_scale = ['Small Wetland Site', 'Large Wetland Site', 'Medium Wetland Site', 'River Basin'];

    $scope.filterCountry = function() {
        $scope.filtered_testmapping = false;
        $.each($scope.wetlands, function() {
            // the result of the comparison is boolean; this['show'] is boolean, too
            this['show'] = (this['country'] == $scope.filtered_country);
        });
        $scope.filtered_geo_scale = '';
        if ($scope.filtered_country == null) {
            $scope.filterReset();
        }
    };

    $scope.filterScale = function() {
        $scope.filtered_testmapping = false;
        $.each($scope.wetlands, function() {
            // the result of the comparison is boolean; this['show'] is boolean, too
            this['show'] = (this['geo_scale'] == $scope.filtered_geo_scale);
        });
        $scope.filtered_country = '';
        if ($scope.filtered_geo_scale == null) {
            $scope.filterReset();
        }
    };

    $scope.filterTestmapping = function() {
        $scope.filtered_country = '';
        $scope.filtered_geo_scale = '';
        if ($scope.filtered_testmapping == false) {
            $scope.filterReset();
        } else {
            $.each($scope.wetlands, function() {
                // the result of the comparison is boolean; this['show'] is boolean, too
                this['show'] = (this['id'] <= 9);
            });
        }
    };

    $scope.filterReset = function() {
        $.each($scope.wetlands, function() {
            this['show'] = true;
        })
    };

    $scope.wetlands_opened = {};
    $scope.activeTab = -1;

    $scope.$on('mapviewer.wetland_selected', function($broadCast, id) {
        $scope.selectWetlandFromId(id);
    });

    $scope.selectWetlandFromId = function(id) {
        $.each($scope.wetlands, function() {
            if (this['id'] == id) {
                $scope.selectWetland(this);
            }
        });
    };

    $scope.value = null;

    $scope.selectWetland = function(wetland) {
        $scope.activeTab = 1; //wetland.id;

        if ($scope.selectedWetlandId === undefined || $scope.selectedWetlandId !== wetland.id) {
            $scope.selectedWetlandId = wetland.id;

            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/wetland/' + wetland.id
            }).then(function(data) {
                var products = data['products'];
                if (typeof products !== 'undefined') {
                    products.forEach(function(product) {
                        if (typeof product['layers'] !== 'undefined') {
                            product['layers'].map(function(layer) {
                                if (typeof(layer.django_id) === 'undefined') {
                                    layer.django_id = layer.id;
                                    layer.id = Math.random().toString(36).substring(2, 15);
                                }
                            });
                        }
                    });
                }
                wetland['data'] = data;
                //$scope.wetlands_opened[wetland.id] = wetland;

                $scope.value = wetland;

                djangoRequests.request({
                    'method': "GET",
                    'url'   : '/swos/wetland/' + wetland.id + '/panoramio.json'
                }).then(function(data) {
                    //$scope.wetlands_opened[wetland.id]['pictures'] = data;
                    $scope.value['pictures'] = data;
                });

                djangoRequests.request({
                    'method': "GET",
                    'url'   : '/swos/wetland/' + wetland.id + '/youtube.json'
                }).then(function(data) {
                    //$scope.wetlands_opened[wetland.id]['videos'] = data;
                    $scope.value['videos'] = data;
                });

                djangoRequests.request({
                    'method': "GET",
                    'url'   : '/swos/wetland/' + wetland.id + '/satdata.json'
                }).then(function(data) {
                    //$scope.wetlands_opened[wetland.id]['satdata'] = data;
                    $scope.value['satdata'] = data;
                })

            }, function() {
                bootbox.alert('<h1>Error while loading wetland details</h1>');
            });

            mapviewer.map.fitBounds(wetland["bounds"]);
        }
    };

    $scope.foo = function() {
        console.log('foo');
        reAdjust();
        $('.scroller-right').click();
        //$('#sidebar-tabs a:last').tab('show')
    };

    $scope.closeWetland = function(id) {
        $('#link_wetland_' + id).remove();
        $('#wetland_' + id).remove();
        delete $scope.wetlands_opened[id];
        $('.scroller-left').click();
        $('#link_wetland_list').click();
    };

    $scope.changeVisibility = function($event, layer) {
        if ($event.target.checked) {
            mapviewer.addLayer(layer);
        } else {
            mapviewer.removeLayer(layer.id);
        }
    }
})
.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        scope.$eval(attrs.repeatDone);
    }
});


// copied from http://www.bootply.com/l2ChB4vYmC
var scrollBarWidths = 40;

var widthOfList = function() {
    var itemsWidth = 0;
    $('.list li').each(function() {
        itemsWidth += $(this).outerWidth();
    });
    return itemsWidth;
};

var widthOfHidden = function() {
    return (($('.wrapper').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
};

var getLeftPosi = function() {
    return $('.list').position().left;
};

var reAdjust = function() {
    if (($('.wrapper').outerWidth()) < widthOfList()) {
        $('.scroller-right').show();
    } else {
        $('.scroller-right').hide();
    }

    if (getLeftPosi() < 0) {
        $('.scroller-left').show();
    } else {
        $('.item').animate({left: "-=" + getLeftPosi() + "px"}, 'slow');
        $('.scroller-left').hide();
    }
};

reAdjust();

$(window).on('resize', function() {
    reAdjust();
});

$('.scroller-right').click(function() {
    $('.scroller-left').fadeIn('slow');
    $('.scroller-right').fadeOut('slow');
    $('.list').animate({left: "+=" + widthOfHidden() + "px"}, 'slow', function() { });
});

$('.scroller-left').click(function() {
    $('.scroller-right').fadeIn('slow');
    $('.scroller-left').fadeOut('slow');
    $('.list').animate({left: "-=" + getLeftPosi() + "px"}, 'slow', function() { });
});