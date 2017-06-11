(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('WetlandsFilterCtrl', WetlandsFilterCtrl);

    WetlandsFilterCtrl.$inject = ['WetlandsService'];
    function WetlandsFilterCtrl(WetlandsService) {
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

        function filterCountry() {
            wetlandsFilter.filtered_testmapping = false;
            wetlandsFilter.sortByCountryName = false;
            $.each(wetlandsFilter.wetlands_without_geom, function(){
                this['show'] = ((this['country'] === wetlandsFilter.filtered_country) || wetlandsFilter.filtered_country === '');
            });

            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_ecoregion = '';
            wetlandsFilter.filtered_wetland_type = '';
            wetlandsFilter.filtered_site_type = '';
            wetlandsFilter.filtered_products = '';
            if (wetlandsFilter.filtered_country === null) {
                wetlandsFilter.filterReset();
            }
        }

        function filterEcoregion() {
            wetlandsFilter.filtered_testmapping = false;
            wetlandsFilter.sortByCountryName = false;
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = ((this['ecoregion'] === wetlandsFilter.filtered_ecoregion) || (wetlandsFilter.filtered_ecoregion === ''));
            });
            wetlandsFilter.filtered_country = '';
            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_wetland_type = '';
            wetlandsFilter.filtered_site_type = '';
            wetlandsFilter.filtered_products = '';
            if (wetlandsFilter.filtered_ecoregion === null) {
                wetlandsFilter.filterReset();
            }
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
        }

        function filterReset() {
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = true;
            })
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
        }

        function setSortOrder() {
            if (wetlandsFilter.sortByCountryName) {
                wetlandsFilter.sortOrder = ['country', 'name'];
            } else {
                wetlandsFilter.sortOrder = 'name';
            }
        }
    }
})();
