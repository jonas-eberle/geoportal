(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('WetlandsVideoCtrl', WetlandsVideoCtrl);

    WetlandsVideoCtrl.$inject = ['WetlandsService', 'djangoRequests', 'mediaConfig'];
    function WetlandsVideoCtrl(WetlandsService, djangoRequests, mediaConfig) {
        var wetlandsVideo = this;

        wetlandsVideo.loadMoreVideos = loadMoreVideos;
        wetlandsVideo.videos = WetlandsService.videos;

        //--------------------------------------------------------------------------------------------------------------

        function loadMoreVideos() {
            wetlandsVideo.videos.currentPage++;
            var start = (wetlandsVideo.videos.currentPage - 1) * mediaConfig.videosPerPage;
            djangoRequests.request({
                'method': "GET",
                'url'   : '/swos/wetland/' + WetlandsService.value.id + '/youtube.json?start=' + start + '&max=' + mediaConfig.videosPerPage
            }).then(function (data) {
                // if not for IE, we could use: wetlandsVideo.videos.videos.push(...data)
                Array.prototype.push.apply(wetlandsVideo.videos.videos, data);
            });
        }
    }
})();
