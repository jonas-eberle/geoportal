(function() {
    'use strict';

    angular
        .module('webgisApp.csw')
        .controller('ESSearchResultsModalCtrl', ESSearchResultsModalCtrl);

    ESSearchResultsModalCtrl.$inject = ['csw', 'mapviewer', '$uibModal', 'djangoRequests',  'results', 'title', 'searchData', 'WetlandsService', '$timeout', '$uibModalInstance'];
    function ESSearchResultsModalCtrl(csw, mapviewer, $modal, djangoRequests,  results, title, searchData, WetlandsService, $timeout, $modalInstance) {
        var es_srm = this;

        es_srm.addLayerToMap = addLayerToMap;
        es_srm.close = $modalInstance.close;
        es_srm.results = results;
        es_srm.searchData = searchData;
        es_srm.openWetland = openWetland;
        es_srm.openWetlandExternal = openWetlandExternal;
        es_srm.setFilter = setFilter;
        es_srm.removeFilter = removeFilter;
        es_srm.showMore = showMore;
        es_srm.search_geoss = search_geoss;
        //es_srm.filterKeyword = filterKeyword;
        //es_srm.search = search;
        es_srm.title = title;
        es_srm.layer_list = [];
        es_srm.filterCategory = "";
        es_srm.filterTopiccat = "";
        es_srm.filterIndicatorName = "";
        es_srm.filterContactOrg = "";
        es_srm.filterKeywords = "";
        es_srm.filterContactPerson = "";
        es_srm.filterWetland = "";
        es_srm.filterProductName = "";
        es_srm.filtereEoregion = "";
        es_srm.filteredGroups = [];
        es_srm.displayName = [];
        es_srm.displayNameCategory = [];

        es_srm.displayName["topiccat"] = "Topic category";
        es_srm.displayName["category"] = "Type";
        es_srm.displayName["wetland"] = "Wetland";
        es_srm.displayName["product_name"] = "Product";
        es_srm.displayName["indicator_name"] = "Indicator";
        es_srm.displayName["contact_person"] = "Person";
        es_srm.displayName["contact_org"] = "Organisation";
        es_srm.displayName["ecoregion"] = "Ecoregion";
        es_srm.displayName["keywords"] = "Keywords";

        es_srm.displayNameCategory["product"] = "Product layer";
        es_srm.displayNameCategory["external"] = "External layer";
        es_srm.displayNameCategory["external_db"] = "External database";
        es_srm.displayNameCategory["indicator"] = "Indicator layer";
        es_srm.displayNameCategory["wetland"] = "Wetland";
        //--------------------------------------------------------------------------------------------------------------

        function showMore(class_name){
            $('.' + class_name + '_more').hide();
            $('.' + class_name).show();
        }

        function addLayerToMap(layer_id, type) {

            if (es_srm.layer_list[layer_id]) {
                if (es_srm.layer_list[layer_id].wetland_id != null) {
                    if(WetlandsService.wetland_id != es_srm.layer_list[layer_id].wetland_id) {
                        WetlandsService.loadWetland(es_srm.layer_list[layer_id].wetland_id, function () {
                            $timeout(function () {
                                WetlandsService.selectTab(type);
                                WetlandsService.loadLayer(es_srm.layer_list[layer_id].wetland_id, type, layer_id, "yes");
                            });
                        });
                    }
                    else {
                        $timeout(function () {
                            WetlandsService.selectTab(type);
                            WetlandsService.loadLayer(es_srm.layer_list[layer_id].wetland_id, type, layer_id, "yes");
                        });
                    }
                }
                else {
                    // Check if external layer is visible at the currently open wetland. If yes show on right side, if not only add layer
                    if ($('#layer_vis_div_'+ layer_id).length > 0 && type == "external"){
                        $timeout(function () {
                            WetlandsService.selectTab("externaldb");
                            WetlandsService.loadLayer(WetlandsService.wetland_id, "externaldb", layer_id, "yes");
                        });
                    }
                    else{
                        mapviewer.addLayer(es_srm.layer_list[layer_id].data);
                    }
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
                        // Check if external layer is visible at the currently open wetland. If yes show on right side, if not only add layer
                        if ($('#layer_vis_div_' + layer_id).length > 0 && type == "external") {
                            $timeout(function () {
                                WetlandsService.selectTab("externaldb");
                                WetlandsService.loadLayer(WetlandsService.wetland_id, "externaldb", layer_id, "yes");
                            });
                        }
                        else {
                            mapviewer.addLayer(data.data);
                        }
                    }

                    es_srm.layer_list[layer_id] = data;
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
                    showExternalDataset(ext_db_id);
                })
            }
            else {
                showExternalDataset(ext_db_id);
            }
        }

        function showExternalDataset(ext_db_id) {
            $timeout(function () {
                WetlandsService.selectTab("externaldb");
                WetlandsService.selectExternal(ext_db_id);
            });
        }

        function setFilter(group, name){

            if (group == "category") {
                es_srm.filterCategory = name;
            }
            if (group == "topiccat") {
                es_srm.filterTopiccat = name;
            }
            if (group == "indicator_name") {
                es_srm.filterIndicatorName = name;
            }
            if (group == "contact_org") {
                es_srm.filterContactOrg = name;
            }
            if (group == "contact_person") {
                es_srm.filterContactPerson = name;
            }
            if (group == "keywords") {
                es_srm.filterKeywords = name;
            }
            if (group == "wetland") {
                es_srm.filterWetland = name;
            }
            if (group == "product_name") {
                es_srm.filterProductName = name;
            }
            if (group == "ecoregion") {
                es_srm.filtereEoregion = name;
            }

            es_srm.filteredGroups[group] = 1;

        requestResult()

        }

        function removeFilter(group){

            if (group == "category") {
                es_srm.filterCategory = "";
            }
            if (group == "topiccat") {
                es_srm.filterTopiccat = "";
            }
            if (group == "indicator_name") {
                es_srm.filterIndicatorName = "";
            }
            if (group == "contact_org") {
                es_srm.filterContactOrg = "";
            }
            if (group == "contact_person") {
                es_srm.filterContactPerson = "";
            }
            if (group == "keywords") {
                es_srm.filterKeywords = "";
            }
            if (group == "wetland") {
                es_srm.filterWetland = "";
            }
            if (group == "product_name") {
                es_srm.filterProductName = "";
            }
            if (group == "ecoregion") {
                es_srm.filtereEoregion = "";
            }

            es_srm.filteredGroups[group] = 0;

        requestResult()

        }


        function requestResult() {
            djangoRequests.request({
                url: '/swos/searchresult.json?search_text=' + es_srm.searchData.text + '&category=' + es_srm.filterCategory + '&keywords=' + es_srm.filterKeywords + '&topiccat=' + es_srm.filterTopiccat + '&wetland=' + es_srm.filterWetland + '&product_name=' + es_srm.filterProductName + '&ecoregion=' + es_srm.filtereEoregion + '&contact_person=' + es_srm.filterContactPerson + '&contact_org=' + es_srm.filterContactOrg + '&indicator_name=' + es_srm.filterIndicatorName
                ,
                method: 'GET'
            }).then(function (data) {
                es_srm.results = data;
            });
        }

        /**function filterKeyword(item){
            if (es_srm.filterKeywords == ""){
                return true;
            }
            for (var key in item.keywords) {
                if (item.keywords[key].val === es_srm.filterKeywords){
                    return true;
                }
            }
            return false;
        }**/
       
       function search_geoss() {
           es_srm.close();
           csw.search_geoss(es_srm.searchData.text);
       }

    }
})();