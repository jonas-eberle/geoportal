(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .service('Attribution', Attribution);

    Attribution.$inject = ['$rootScope'];
    function Attribution($rootScope) {
        // private variable, as we do not include it in the returned service
        var attributionList = [];

        var service = {
            getList: getList,
            update: update
        };

        return service;

        function getList() {
            return attributionList;
        }

        function update(layers) {
            // get all non-empty attribution strings from all active layers
            var rawAttributionList = [];
            for (var key in layers) {
                var data = layers[key].get('layerObj');
                if (typeof data !== 'undefined' && data.ogc_attribution !== null) {
                    rawAttributionList.push(data.ogc_attribution);
                }
            }

            // deduplicate attribution strings with a cast to type Set and back to Array
            rawAttributionList = Array.from(new Set(rawAttributionList));

            // extract all URLs from attributions and prepare them for the view
            var urlList = rawAttributionList.map(function(attr) {
                // extract the URLs looking like (url, text)
                var urlPatterns = attr.match(/\(https?:\/\/(\w+\.)+\w+[\w\/\-?=&#%]*, ?\w[\w ]+\)/g);

                // if there is no URL, simply return null
                if (!urlPatterns) {
                    return null;
                }

                return urlPatterns.map(function(urlPattern) {
                    // process (url, text) into a javascript object
                    var splitparts = urlPattern.split(", ");
                    return {
                        url: splitparts[0].slice(1),
                        text: splitparts[1].slice(0,splitparts[1].length-1)
                    };
                });
            });

            // build the complete attribution list
            attributionList = [];
            for (var attrIndex = 0; attrIndex < rawAttributionList.length; attrIndex++) {
                // split a complete, raw attribution string at the contained URLs
                var splitparts = rawAttributionList[attrIndex].split(/\(https?:\/\/(?:\w+\.)+\w+[\w\/\-?=&#%]*, ?\w[\w ]+\)/);

                if (splitparts.length === 1) {
                    // there was no URL in the attribution string
                    attributionList.push([{
                        url:  '',
                        text: splitparts[0]
                    }]);
                    continue;
                }

                // there is at least one URL in the attribution:

                // build a temporary list for this attribution item
                var attrTmpList = [];
                // NOTE: iterate only first to last but one element, the index is required again afterwards
                var partIndex = 0;
                for (; partIndex < splitparts.length - 1; partIndex++) {
                    // first, push text-only part into temp. attribution list; skip if empty
                    if (splitparts[partIndex] !== '') {
                        attrTmpList.push({
                            url:  '',
                            text: splitparts[partIndex]
                        });
                    }

                    // second, push url part into temp. attribution list
                    attrTmpList.push(urlList[attrIndex][partIndex]);
                }

                // in case there was a non-empty text-only part at the end, push it to the list, too
                if (splitparts[partIndex] !== '') {
                    attrTmpList.push({
                        url:  '',
                        text: splitparts[partIndex]
                    });
                }

                // add the complete temp. list into the attribution list
                attributionList.push(attrTmpList);
            }

            // NOTE: if there is a way to update attributionList non-destructively, we can remove the broadcast
            $rootScope.$broadcast("attribution_list_new");
        }
    }
})();
