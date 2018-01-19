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
        wetlandsFilter.filtered_product_count = true;
        wetlandsFilter.filtered_wetland_type = '';
        wetlandsFilter.setSortOrder = setSortOrder;
        wetlandsFilter.sortByCountryName = true;
        wetlandsFilter.sortOrder = ['country', 'name'];
        wetlandsFilter.wetlands_without_geom = WetlandsService.wetlands_without_geom;
        wetlandsFilter.country_list = WetlandsService.country_list;
        wetlandsFilter.product_count = product_count;
        wetlandsFilter.filterWetlands = filterWetlands;
        wetlandsFilter.check_wetland_type = check_wetland_type;
        wetlandsFilter.check_ecoregion = check_ecoregion;
        wetlandsFilter.check_country = check_country;
        wetlandsFilter.check_product = check_product;
        wetlandsFilter.check_site_type = check_site_type;
        wetlandsFilter.check_scale = check_scale;

        function product_count(){
            if(wetlandsFilter.filtered_product_count == true){
                return 1
            }
            else
            {
                return 0
            }
        }

        function check_wetland_type(item){
            return item.wetland_type === wetlandsFilter.filtered_wetland_type || wetlandsFilter.filtered_wetland_type === '';
        }
        function check_ecoregion(item) {
            return item.ecoregion.includes(wetlandsFilter.filtered_ecoregion)  || wetlandsFilter.filtered_ecoregion === '';
        }
        function check_country(item) {
            return item.country.includes(wetlandsFilter.filtered_country) || wetlandsFilter.filtered_country === '';
        }
        function check_product(item){
            return jQuery.inArray(wetlandsFilter.filtered_products,item.products) > -1 || wetlandsFilter.filteredh_products === '';
        }
        function check_site_type(item) {
            return item.site_type === wetlandsFilter.filtered_site_type || wetlandsFilter.filtered_site_type === '';
        }

        function check_scale(item) {
            if (wetlandsFilter.filtered_geo_scale == 1) {
                return item.size < 20000;
            }
            else if (wetlandsFilter.filtered_geo_scale == 2) {
                return item.size > 20000 && item.size < 50000;
            }
            else if (wetlandsFilter.filtered_geo_scale == 3) {
                return item.size > 50000 && item.size < 500000;
            }
            else if (wetlandsFilter.filtered_geo_scale == 4) {
                return item.size > 500000 ;
            }
            else if (wetlandsFilter.filtered_geo_scale === '') {
                return true;
            }
        }

        function filterWetlands() {
            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = (check_wetland_type(this) && check_ecoregion(this) && check_country(this) && check_product(this) && check_site_type(this) && check_scale(this) && this.products.length >= product_count());
            });

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
