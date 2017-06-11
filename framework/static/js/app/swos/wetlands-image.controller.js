(function() {
    'use strict';

    angular
        .module('webgisApp')
        .controller('WetlandsImageCtrl', WetlandsImageCtrl);

    WetlandsImageCtrl.$inject = ['WetlandsService', 'djangoRequests', 'mediaConfig'];
    function WetlandsImageCtrl(WetlandsService, djangoRequests, mediaConfig) {
        var wetlandsImage = this;

        wetlandsImage.externalImages = WetlandsService.externalImages;
        wetlandsImage.externalImagesIsOpen = true;
        wetlandsImage.images = WetlandsService.images;
        wetlandsImage.imagesIsOpen = true;
        wetlandsImage.moreImages = moreImages;
        wetlandsImage.moreExternalImages = moreExternalImages;

        //--------------------------------------------------------------------------------------------------------------

        function loadMore(action, isExternal) {
            var key = (isExternal ? 'externalImages' : 'images');
            wetlandsImage[key].currentPage += (action === 'next' ? +1 : -1);

            var start = (wetlandsImage[key].currentPage - 1) * mediaConfig.imagesPerPage;
            var jsonTarget = (isExternal ? '/panoramio.json' : '/images.json');
            djangoRequests.request({
                method: 'GET',
                url: '/swos/wetland/' + WetlandsService.value.id + jsonTarget + '?start=' + start + '&max=' + mediaConfig.imagesPerPage
            }).then(function(data) {
                wetlandsImage[key]['photos'] = data['photos'];
            });
        }

        function moreImages(action) {
            loadMore(action, false);
        }

        function moreExternalImages(action) {
            loadMore(action, true);
        }
    }
})();
