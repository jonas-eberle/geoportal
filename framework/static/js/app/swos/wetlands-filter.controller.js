(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('WetlandsFilterCtrl', WetlandsFilterCtrl);

    WetlandsFilterCtrl.$inject = ['WetlandsService', 'mapviewer'];
    function WetlandsFilterCtrl(WetlandsService, mapviewer) {
        var wetlandsFilter = this;

        wetlandsFilter.filtered_country = '';
        wetlandsFilter.filtered_ecoregion = '';
        wetlandsFilter.filtered_geo_scale = '';
        wetlandsFilter.filtered_products = '';
        wetlandsFilter.filtered_site_type = '';
        wetlandsFilter.filtered_testmapping = true;
        wetlandsFilter.filtered_wetland_type = '';
        wetlandsFilter.filterCountry = filterCountry;
        wetlandsFilter.filterEcoregion = filterEcoregion;
        wetlandsFilter.filterProduct = filterProduct;
        wetlandsFilter.filterReset = filterReset;
        wetlandsFilter.filterScale = filterScale;
        wetlandsFilter.filterSiteType = filterSiteType;
        wetlandsFilter.filterTestmapping = filterTestmapping;
        wetlandsFilter.filterWetlandType = filterWetlandType;
        wetlandsFilter.setSortOrder = setSortOrder;
        wetlandsFilter.sortByCountryName = false;
        wetlandsFilter.sortOrder = 'name';
        wetlandsFilter.wetlands_without_geom = WetlandsService.wetlands_without_geom;
        wetlandsFilter.country_list = WetlandsService.country_list;

        function filterCountry() {
            wetlandsFilter.filtered_testmapping = false;
            wetlandsFilter.sortByCountryName = false;
            $.each(wetlandsFilter.wetlands_without_geom, function(){
                this['show'] = ((this['country'].includes(wetlandsFilter.filtered_country) || wetlandsFilter.filtered_country === ''));
            });

            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_ecoregion = '';
            wetlandsFilter.filtered_wetland_type = '';
            wetlandsFilter.filtered_site_type = '';
            wetlandsFilter.filtered_products = '';
            if (wetlandsFilter.filtered_country === null) {
                wetlandsFilter.filterReset();
            }

            updateWetlandLayer();
        }

        function filterEcoregion() {
            wetlandsFilter.filtered_testmapping = false;
            wetlandsFilter.sortByCountryName = false;
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = ((this['ecoregion'].includes(wetlandsFilter.filtered_ecoregion) || (wetlandsFilter.filtered_ecoregion === '')));
            });
            wetlandsFilter.filtered_country = '';
            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_wetland_type = '';
            wetlandsFilter.filtered_site_type = '';
            wetlandsFilter.filtered_products = '';
            if (wetlandsFilter.filtered_ecoregion === null) {
                wetlandsFilter.filterReset();
            }

            updateWetlandLayer();
        }

        function filterProduct() {
            wetlandsFilter.filtered_testmapping = false;
            wetlandsFilter.sortByCountryName = false;
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = ((jQuery.inArray(wetlandsFilter.filtered_products, this['products']) > -1) || (wetlandsFilter.filtered_products === ''));
            });
            wetlandsFilter.filtered_country = '';
            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_ecoregion = '';
            wetlandsFilter.filtered_wetland_type = '';
            wetlandsFilter.filtered_site_type = '';
            if (wetlandsFilter.filtered_products === null) {
                wetlandsFilter.filterReset();
            }

            updateWetlandLayer();
        }

        function filterReset() {
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = true;
            });

            updateWetlandLayer();
        }

        function filterScale() {
            wetlandsFilter.filtered_testmapping = false;
            wetlandsFilter.sortByCountryName = false;
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = ((this['geo_scale'] === wetlandsFilter.filtered_geo_scale) || (wetlandsFilter.filtered_geo_scale === ''));
            });
            wetlandsFilter.filtered_country = '';
            wetlandsFilter.filtered_ecoregion = '';
            wetlandsFilter.filtered_wetland_type = '';
            wetlandsFilter.filtered_site_type = '';
            wetlandsFilter.filtered_products = '';
            if (wetlandsFilter.filtered_geo_scale === null) {
                wetlandsFilter.filterReset();
            }

            updateWetlandLayer();
        }

        function filterSiteType() {
            wetlandsFilter.filtered_testmapping = false;
            wetlandsFilter.sortByCountryName = false;
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = ((this['site_type'] === wetlandsFilter.filtered_site_type) || (wetlandsFilter.filtered_site_type === ''));
            });
            wetlandsFilter.filtered_country = '';
            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_ecoregion = '';
            wetlandsFilter.filtered_wetland_type = '';
            wetlandsFilter.filtered_products = '';
            if (wetlandsFilter.filtered_site_type === null) {
                wetlandsFilter.filterReset();
            }

            updateWetlandLayer();
        }

        function filterTestmapping() {
            wetlandsFilter.filtered_country = '';
            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_ecoregion = '';
            wetlandsFilter.filtered_wetland_type = '';
            wetlandsFilter.filtered_site_type = '';
            wetlandsFilter.filtered_products = '';

            if (wetlandsFilter.filtered_testmapping === false) {
                wetlandsFilter.filterReset();
            } else {
                $.each(wetlandsFilter.wetlands_without_geom, function () {
                    //this['show'] = (this['id'] <= 9);
                    this['show'] = (this['products'].length > 0);
                })
            }

            updateWetlandLayer();
        }

        function filterWetlandType() {
            wetlandsFilter.filtered_testmapping = false;
            wetlandsFilter.sortByCountryName = false;
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = ((this['wetland_type'] === wetlandsFilter.filtered_wetland_type) || (wetlandsFilter.filtered_wetland_type === ''));
            });
            wetlandsFilter.filtered_country = '';
            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_ecoregion = '';
            wetlandsFilter.filtered_site_type = '';
            wetlandsFilter.filtered_products = '';
            if (wetlandsFilter.filtered_wetland_type === null) {
                wetlandsFilter.filterReset();
            }

            updateWetlandLayer();
        }

        function setSortOrder() {
            if (wetlandsFilter.sortByCountryName) {
                wetlandsFilter.sortOrder = ['country', 'name'];
            } else {
                wetlandsFilter.sortOrder = 'name';
            }
        }

        function updateWetlandLayer(){
            // Assume wetland layer is allways on the second position
            var layer = mapviewer.map.getLayers().getArray()[1];
            layer.getSource().changed();
        }
    }
})();
