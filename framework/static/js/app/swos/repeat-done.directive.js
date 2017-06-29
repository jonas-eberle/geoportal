// (function() {
//     'use strict';
//
//     angular
//         .module('webgisApp.swos')
//         .directive('repeatDone', repeatDone);
//
//     function repeatDone() {
//         return function (scope, element, attrs) {
//             scope.$eval(attrs.repeatDone);
//         }
//     }
// })();

// // copied from http://www.bootply.com/l2ChB4vYmC
// var scrollBarWidths = 40;
//
// var widthOfList = function () {
//     var itemsWidth = 0;
//     $('.list li').each(function () {
//         itemsWidth += $(this).outerWidth();
//     });
//     return itemsWidth;
// };
//
// var widthOfHidden = function () {
//     return (($('.wrapper').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
// };
//
// var getLeftPosi = function () {
//     return $('.list').position().left;
// };
//
// var reAdjust = function () {
//     if (($('.wrapper').outerWidth()) < widthOfList()) {
//         $('.scroller-right').show();
//     } else {
//         $('.scroller-right').hide();
//     }
//
//     if (getLeftPosi() < 0) {
//         $('.scroller-left').show();
//     } else {
//         $('.item').animate({left: "-=" + getLeftPosi() + "px"}, 'slow');
//         $('.scroller-left').hide();
//     }
// };
//
// reAdjust();
//
// $(window).on('resize', function () {
//     reAdjust();
// });
//
// $('.scroller-right').click(function () {
//
//     $('.scroller-left').fadeIn('slow');
//     $('.scroller-right').fadeOut('slow');
//
//     $('.list').animate({left: "+=" + widthOfHidden() + "px"}, 'slow', function () {
//
//     });
// });
//
// $('.scroller-left').click(function () {
//
//     $('.scroller-right').fadeIn('slow');
//     $('.scroller-left').fadeOut('slow');
//
//     $('.list').animate({left: "-=" + getLeftPosi() + "px"}, 'slow', function () {
//
//     });
// });
