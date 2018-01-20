(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('WetlandsFilterCtrl', WetlandsFilterCtrl);

    WetlandsFilterCtrl.$inject = ['WetlandsService', 'mapviewer'];
    function WetlandsFilterCtrl(WetlandsService, mapviewer) {
        var wetlandsFilter = this;

        wetlandsFilter.wetlands_without_geom = WetlandsService.wetlands_without_geom;

        wetlandsFilter.filtered_country = '';
        wetlandsFilter.filtered_ecoregion = '';
        wetlandsFilter.filtered_geo_scale = '';
        wetlandsFilter.filtered_products = '';
        wetlandsFilter.filtered_site_type = '';
        wetlandsFilter.filtered_wetland_type = '';

        wetlandsFilter.setSortOrder = setSortOrder;
        wetlandsFilter.sortByCountryName = true;
        wetlandsFilter.sortOrder = ['country', 'name'];

        wetlandsFilter.filtered_product_count = true;
        wetlandsFilter.product_count = product_count;

        wetlandsFilter.filterWetlands = filterWetlands;
        wetlandsFilter.clearFilter = clearFilter;

        wetlandsFilter.check_country = check_country;
        wetlandsFilter.check_ecoregion = check_ecoregion;
        wetlandsFilter.check_product = check_product;
        wetlandsFilter.check_scale = check_scale;
        wetlandsFilter.check_site_type = check_site_type;
        wetlandsFilter.check_wetland_type = check_wetland_type;

        wetlandsFilter.country_list = [];
        wetlandsFilter.ecoregion_list = ["Boreal Forests/Taiga", "Deserts","Deserts and Xeric Shrublands","Flooded Grasslands and Savannas","Lake", "Mediterranean Forests","Savannas","Savannas and Shrublands","Shrublands","Temperate Broadleaf and Mixed Forests","Temperate Conifer Forests", "Temperate Grasslands","Tropical and Subtropical Grasslands","Tropical and Subtropical Grasslands and Savannas", "Tropical and Subtropical Moist Broadleaf Forests","Tundra","Woodlands and Scrub","Xeric Shrublands"];

        wetlandsFilter.show_ecoregion = [];
        wetlandsFilter.show_product = [];
        wetlandsFilter.show_site_type = [];
        wetlandsFilter.show_size = [];
        wetlandsFilter.show_wetland_type = [];

        function check_country(item) {
            return item.country.includes(wetlandsFilter.filtered_country) || wetlandsFilter.filtered_country === '';
        }
        function check_ecoregion(item) {
            return item.ecoregion.includes(wetlandsFilter.filtered_ecoregion)  || wetlandsFilter.filtered_ecoregion === '';
        }
        function check_product(item){
            return jQuery.inArray(wetlandsFilter.filtered_products,item.products) > -1 || wetlandsFilter.filtered_products === '';
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
        function check_site_type(item) {
            return item.site_type === wetlandsFilter.filtered_site_type || wetlandsFilter.filtered_site_type === '';
        }
        function check_wetland_type(item){
            return item.wetland_type === wetlandsFilter.filtered_wetland_type || wetlandsFilter.filtered_wetland_type === '';
        }
        function product_count(){
            if(wetlandsFilter.filtered_product_count == true){
                return 1; // minimum one product
            }
            else
            {
                return 0;
            }
        }

        function setSortOrder() {
            if (wetlandsFilter.sortByCountryName) {
                wetlandsFilter.sortOrder = ['country', 'name'];
            } else {
                wetlandsFilter.sortOrder = 'name';
            }
        }
        function filterWetlands() {
            wetlandsFilter.country_list = [];
            wetlandsFilter.show_site_type = [];
            wetlandsFilter.show_wetland_type = [];
            wetlandsFilter.show_size = [];
            wetlandsFilter.show_product = [];
            wetlandsFilter.show_ecoregion = [];

            $.each(wetlandsFilter.wetlands_without_geom, function () {
                this['show'] = (check_wetland_type(this) && check_ecoregion(this) && check_country(this) && check_product(this) && check_site_type(this) && check_scale(this) && this.products.length >= product_count());
                if (this['show'] == true) {
                    // adjust site type list
                    wetlandsFilter.show_site_type[this['site_type']] = true;
                    // adjust wetland type list
                    wetlandsFilter.show_wetland_type[this['wetland_type']] = true;
                    // adjust country list
                    if (this["country"].includes("-")) {
                        var country_array = this["country"].split("-");
                        for (var key in country_array) {
                            wetlandsFilter.country_list.push(country_array[key])
                        }
                    } else {
                        wetlandsFilter.country_list.push(this["country"]);
                    }
                    // adjust size list
                    if (this["size"] < 20000) {
                        wetlandsFilter.show_size[1] = true;
                    }
                    else if (this["size"] > 20000 && this["size"] < 50000) {
                        wetlandsFilter.show_size[2] = true;
                    }
                    else if (this["size"] > 50000 && this["size"] < 500000) {
                        wetlandsFilter.show_size[3] = true;
                    }
                    else if (this["size"] > 500000) {
                        wetlandsFilter.show_size[4] = true;
                    }
                    // adjust product list
                    $.each(this["products"], function () {
                        wetlandsFilter.show_product[this] = true;
                    });
                    //adjust ecoregion list
                    var ecoregion = this["ecoregion"];
                    $.each(wetlandsFilter.ecoregion_list, function(){
                        if (ecoregion.includes(this)){
                            wetlandsFilter.show_ecoregion[this] = true;
                        }
                    });

                }
            });
            updateWetlandLayer();
        }
        function clearFilter() {
            wetlandsFilter.filtered_country = '';
            wetlandsFilter.filtered_ecoregion = '';
            wetlandsFilter.filtered_geo_scale = '';
            wetlandsFilter.filtered_products = '';
            wetlandsFilter.filtered_wetland_type = '';

            filterWetlands();
        }

        function updateWetlandLayer(){
            // Assume wetland layer is allways on the second position
            var layer = mapviewer.map.getLayers().getArray()[1];
            layer.getSource().changed();
        }
    }
})();
