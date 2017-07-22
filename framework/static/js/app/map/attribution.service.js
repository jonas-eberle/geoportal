(function() {
    'use strict';

    angular
        .module('webgisApp.map')
        .service('Attribution', Attribution);

    Attribution.$inject = ['$rootScope'];
    function Attribution($rootScope) {
        var list = "";
        var getList = function(){
            return list;
        };
        var setList = function(newList) {
            list = newList;
            $rootScope.$broadcast("attribution_list_new")
        };
        
        var refreshDisplay = function(layers) {
            var attribution_arr = [];
            $.each(layers, function () {
                var layer = this.get('layerObj');

                if (typeof layer !== 'undefined') {
                    if (attribution_arr.indexOf(layer.ogc_attribution) === -1) {
                        if (layer.ogc_attribution != 'null') {
                            attribution_arr.push(layer.ogc_attribution);
                        }
                    }
                }
            });
            var attr_list = attribution_arr.join(' | \u00A9 ');

            var www_list = attr_list.match(/\((http)s?:\/\/(\w+\.){1,}\w+[\w./?=&#%]*, ?[\w ]+\)/g);
            if (www_list) {
                $.each(www_list, function () {
                    var new_ = '<a href="' + this.substr(1, this.indexOf(',')-1) + '" target = "_blank" style="text-decoration-line: underline; color: #d6d6d6;">' + this.substr(this.indexOf(',') + 1, this.substr(this.indexOf(',') + 1).length - 1) + "</a>";
                    attr_list = attr_list.replace(this, new_);
                });
            }

            if (attr_list.length > 0) {
                $('.map-controls-wrapper').css('height', '82px');
            } else {
                $('.map-controls-wrapper').css('height', '53px');
            }
            $("#wetland_attribution_list").remove();
            $("#wetland_attribution").append('<div id="wetland_attribution_list">' + attr_list + '</div>');

            //Attribution.setList(attr_list);
        }

        return {
            getList: getList,
            setList: setList,
            refreshDisplay: refreshDisplay
        };
    }
})();
