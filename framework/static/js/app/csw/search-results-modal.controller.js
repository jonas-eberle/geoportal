(function() {
    'use strict';

    angular
        .module('webgisApp.csw')
        .controller('SearchResultsModalCtrl', SearchResultsModalCtrl);

    SearchResultsModalCtrl.$inject = ['csw', 'mapviewer', '$uibModal', 'djangoRequests',  'results', 'title', 'searchData', 'WetlandsService', '$timeout', '$uibModalInstance'];
    function SearchResultsModalCtrl(csw, mapviewer, $modal, djangoRequests,  results, title, searchData, WetlandsService, $timeout, $modalInstance) {
        var srm = this;

        srm.addLayerToMap = addLayerToMap;
        srm.close = $modalInstance.close;
        srm.results = results;
        srm.searchData = searchData;
        srm.openWetland = openWetland;
        srm.openWetlandExternal = openWetlandExternal;
        srm.setFilter = setFilter;
        srm.removeFilter = removeFilter;
        srm.showMore = showMore;
        //srm.filterKeyword = filterKeyword;
        //srm.search = search;
        srm.title = title;
        srm.layer_list = [];
        srm.filterCategory = "";
        srm.filterTopiccat = "";
        srm.filterIndicatorName = "";
        srm.filterContactOrg = "";
        srm.filterKeywords = "";
        srm.filterContactPerson = "";
        srm.filterWetland = "";
        srm.filterProductName = "";
        srm.filtereEoregion = "";
        srm.filteredGroups = [];
        srm.displayName = [];
        srm.displayNameCategory = [];

        srm.displayName["topiccat"] = "Topic category";
        srm.displayName["category"] = "Type";
        srm.displayName["wetland"] = "Wetland";
        srm.displayName["product_name"] = "Product";
        srm.displayName["indicator_name"] = "Indicator";
        srm.displayName["contact_person"] = "Person";
        srm.displayName["contact_org"] = "Organisation";
        srm.displayName["ecoregion"] = "Ecoregion";
        srm.displayName["keywords"] = "Keywords";

        srm.displayNameCategory["product"] = "Product layer";
        srm.displayNameCategory["external"] = "External layer";
        srm.displayNameCategory["external_db"] = "External database";
        srm.displayNameCategory["indicator"] = "Indicator layer";
        srm.displayNameCategory["wetland"] = "Wetland";
        //--------------------------------------------------------------------------------------------------------------

        function showMore(class_name){
            $('.' + class_name + '_more').hide();
            $('.' + class_name).show();
        }

        function addLayerToMap(layer_id, type) {

            if (srm.layer_list[layer_id]) {
                if (srm.layer_list[layer_id].wetland_id != null) {
                    if(WetlandsService.wetland_id != srm.layer_list[layer_id].wetland_id) {
                        WetlandsService.loadWetland(srm.layer_list[layer_id].wetland_id, function () {
                            $timeout(function () {
                                WetlandsService.selectTab(type);
                                WetlandsService.loadLayer(srm.layer_list[layer_id].wetland_id, type, layer_id, "yes");
                            });
                        });
                    }
                    else {
                        $timeout(function () {
                            WetlandsService.selectTab(type);
                            WetlandsService.loadLayer(srm.layer_list[layer_id].wetland_id, type, layer_id, "yes");
                        });
                    }
                }
                else {
                    mapviewer.addLayer(srm.layer_list[layer_id].data);
                }
            }
            else {
                djangoRequests.request({
                    url: '/swos/layer.json?layer_id=' + layer_id + '&type=' + type,
                    method: 'GET'
                }).then(function (data) {
                    if (data.wetland_id != null) {
                         if(WetlandsService.wetland_id != data.wetland_id) {
                             WetlandsService.loadWetland(data.wetland_id, function () {
                                 $timeout(function () {
                                     WetlandsService.selectTab(type);
                                     WetlandsService.loadLayer(data.wetland_id, type, layer_id, "yes");
                                 });
                             });
                         }
                         else{
                              $timeout(function () {
                                  WetlandsService.selectTab(type);
                                  WetlandsService.loadLayer(data.wetland_id, type, layer_id, "yes");
                              });
                         }
                    }
                    else {
                        mapviewer.addLayer(data.data);
                    }

                    srm.layer_list[layer_id] = data;
                });
            }
        }

        function openWetland(wetland_id){
            WetlandsService.loadWetland(wetland_id);
            $timeout(function () {
                WetlandsService.selectTab("overview")
            })
        }

        function openWetlandExternal(wetland_id, ext_db_id) {
            if (WetlandsService.wetland_id != wetland_id) {
                WetlandsService.loadWetland(wetland_id, function () {
                    $timeout(function () {
                        WetlandsService.selectTab("externaldb");
                        WetlandsService.selectExternal(ext_db_id);
                    })
                })
            }
            else {
                $timeout(function () {
                    WetlandsService.selectTab("externaldb");
                    WetlandsService.selectExternal(ext_db_id);

                });
            }
        }

        function setFilter(group, name){

            if (group == "category") {
                srm.filterCategory = name;
            }
            if (group == "topiccat") {
                srm.filterTopiccat = name;
            }
            if (group == "indicator_name") {
                srm.filterIndicatorName = name;
            }
            if (group == "contact_org") {
                srm.filterContactOrg = name;
            }
            if (group == "contact_person") {
                srm.filterContactPerson = name;
            }
            if (group == "keywords") {
                srm.filterKeywords = name;
            }
            if (group == "wetland") {
                srm.filterWetland = name;
            }
            if (group == "product_name") {
                srm.filterProductName = name;
            }
            if (group == "ecoregion") {
                srm.filtereEoregion = name;
            }

            srm.filteredGroups[group] = 1;

        requestResult()

        }

        function removeFilter(group){

            if (group == "category") {
                srm.filterCategory = "";
            }
            if (group == "topiccat") {
                srm.filterTopiccat = "";
            }
            if (group == "indicator_name") {
                srm.filterIndicatorName = "";
            }
            if (group == "contact_org") {
                srm.filterContactOrg = "";
            }
            if (group == "contact_person") {
                srm.filterContactPerson = "";
            }
            if (group == "keywords") {
                srm.filterKeywords = "";
            }
            if (group == "wetland") {
                srm.filterWetland = "";
            }
            if (group == "product_name") {
                srm.filterProductName = "";
            }
            if (group == "ecoregion") {
                srm.filtereEoregion = "";
            }

            srm.filteredGroups[group] = 0;

        requestResult()

        }


        function requestResult() {
            djangoRequests.request({
                url: '/swos/searchresult.json?search_text=' + srm.searchData.text + '&category=' + srm.filterCategory + '&keywords=' + srm.filterKeywords + '&topiccat=' + srm.filterTopiccat + '&wetland=' + srm.filterWetland + '&product_name=' + srm.filterProductName + '&ecoregion=' + srm.filtereEoregion + '&contact_person=' + srm.filterContactPerson + '&contact_org=' + srm.filterContactOrg + '&indicator_name=' + srm.filterIndicatorName
                ,
                method: 'GET'
            }).then(function (data) {
                srm.results = data;
            });
        }

        /**function filterKeyword(item){
            if (srm.filterKeywords == ""){
                return true;
            }
            for (var key in item.keywords) {
                if (item.keywords[key].val === srm.filterKeywords){
                    return true;
                }
            }
            return false;
        }**/

    }
})();