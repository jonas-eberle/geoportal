(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('IntroductionTourCtrl', IntroductionTourCtrl);

    IntroductionTourCtrl.$inject = ['$scope', 'mapviewer', 'WetlandsService', '$timeout', '$cookies', '$rootScope', 'TrackingService', '$location'];
    function IntroductionTourCtrl($scope, mapviewer, WetlandsService, $timeout, $cookies, $rootScope, TrackingService, $location) {
        var introTour = this;

        introTour.startAnno = startAnno;
        introTour.trackIntroductionTour = trackIntroductionTour;

        var extdb_id = "2551"; // Global Surface Water: Water Occurence (1984-2015)
        var product_id = "3001"; // Camargue:  Land Surface Temperature Trend 2000 to 2016
        var wetland_id = 4; // Camargue
        var step_count = 14;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('start_tour', function () {
            return introTour.startAnno();
        });

        //--------------------------------------------------------------------------------------------------------------

        function load_and_show_layer(wetland_id, type_name, layer_id, load_layer) {

            var layer_is_new = "true";

            //check if layer was already added to avoid "layer already exist error" (e.g. important for "back")
            for (var key in mapviewer.layersMeta) {
                if (mapviewer.layersMeta[key].django_id == layer_id) {
                    layer_is_new = false;
                }
            }

            //only load a new layer, if the the layer is not already added
            if (layer_id && layer_is_new) {

                // add layer to map only if wanted, if not: only open everything around
                if (load_layer === "yes") {
                    $("#layer_vis_" + layer_id).attr('checked', 'checked');
                    angular.element("#layer_vis_" + layer_id).triggerHandler('click'); // add layer to map
                }

                var layer_id_ = "#layer_vis_" + layer_id;

                //open menu according to the last layer id
                if (type_name === "product") {

                    $location.path('/wetland/' + wetland_id + '/product/' + layer_id);

                    if ($(layer_id_).closest('.panel').find('i')[0].className.includes("glyphicon-chevron-right")) {
                        $(layer_id_).closest('.panel').find('a').trigger('click'); // find headline and open accordion
                    }

                    $timeout(function () {  //scroll page down
                        $(".tab-content").animate({
                            scrollTop: $("#layer_vis_div_" + layer_id).offset().top - 200
                        }, 2000);
                    });
                }
                if (type_name === "externaldb") {
                    $location.path('/wetland/' + wetland_id + '/externaldb/' + layer_id);

                    if ($(layer_id_).closest('.panel').parents().eq(4).find('i')[0].className.includes("glyphicon-chevron-right")) {
                        $(layer_id_).closest('.panel').parents().eq(4).find('a').trigger('click'); //open parent accordion
                    }
                    if ($(layer_id_).closest('.panel').find('i')[0].className.includes("glyphicon-chevron-right")) {
                        $(layer_id_).closest('.panel').find('a').trigger('click'); // find headline and open accordion
                    }
                    $timeout(function () {  //scroll page down
                        $(".tab-content").animate({
                            scrollTop: $("#layer_vis_div_" + layer_id).offset().top - 500
                        }, 2000);
                    });
                }
            }
        }

        function move_map_elements_higher(action) {
            if (!action) {
                $('#current').css('z-index', '1041');
                $('#active_layer').css('z-index', '1042');
                $("#gmap").css('z-index', '1038');
                $('.map-controls-wrapper').css('z-index', '1040');
                $('.ol-viewport').css('z-index', '1039');
            } else if (action === "reset") {
                $('#current').css('z-index', '');
                $('#active_layer').css('z-index', '');
                $("#gmap").css('z-index', '');
                $('.map-controls-wrapper').css('z-index', '');
                $('.ol-viewport').css('z-index', '');
            }
        }

        function only_load_wetland(wetland_id) {

            var current_wetland_id = "";

            if (mapviewer.currentFeature) {
                current_wetland_id = mapviewer.currentFeature.get('id');
            }
            if (wetland_id !== current_wetland_id) {
                WetlandsService.selectWetlandFromId(wetland_id)
            } else {
                $timeout(function () {
                    if ($("#link_wetland_list").parents().hasClass("active")) {
                        try {
                            $("#link_wetland_opened")[0].click(); // open catalog tab
                        } catch (e) { }
                    }
                }, 0, false);

                WetlandsService.selectFeature(current_wetland_id);
            }
        }

        function open_close_active_layer(action) {
            var activeLayer = $('#active_layer');
            if (!activeLayer.attr("class").includes("expanded") && action === "open") {
                $('#show_active_layer').click();
                $(".item_catalog").find('.glyphicon-chevron-down').first().click();
            } else if (activeLayer.attr("class").includes("expanded") && action === "close") {
                $('#show_active_layer').click();
            }
        }

        function reset() {
            // #todo replace remove and zoom once the function is available via service / move back to start URL

            $('li.flaticon-bars a').click(); // activate overview

            while (mapviewer.layersMeta.length > 0) {
                var layer = mapviewer.layersMeta[0];
                if (layer) {
                    mapviewer.removeLayer(layer.id, 0);
                }
                var checkbox = undefined;
                if (layer["django_id"] !== undefined
                    && layer.django_id !== null
                    && (checkbox = document.getElementById("layer_vis_" + layer.django_id))
                ) {
                    checkbox.checked = "";
                }
            }

            $(".modal-footer").children().trigger("click");

            $rootScope.$broadcast("mapviewer.alllayersremoved");

            mapviewer.map.getView().fit(
                ol.proj.transformExtent(mapviewer.maxExtent, 'EPSG:4326', mapviewer.displayProjection),
                {size: mapviewer.map.getSize()}
            );

            select_tab(); // Open wetland Catalog

            $('.main').css('position', 'fixed'); // set back to origin
        }

        function select_tab(type_name) {
            var target = ""; //default tab

            // open wetland tab
            if (type_name) {
                switch (type_name) {
                    case "overview":
                        target = 'li.flaticon-bars a';
                        break;
                    case "product":
                        target = 'li.flaticon-layers a';
                        break;
                    case "indicator":
                        target = 'li.flaticon-business a';
                        break;
                    case "satdata":
                        target = 'li.flaticon-space-satellite-station a';
                        break;
                    case "images":
                        target = 'li.flaticon-technology-1 a';
                        break;
                    case "video":
                        target = 'li.flaticon-technology a';
                        break;
                    case "externaldb":
                        target = 'li.flaticon-technology-2 a';
                        break;
                }

                try {
                    $(target).click(); // open tab
                } catch (e) { }
            } else {
                //open wetland catalog
                $timeout(function () {
                    var linkWetlandList = $('#link_wetland_list');
                    if (!linkWetlandList.parents().hasClass("active")) {
                        try {
                            linkWetlandList[0].click(); // open catalog tab
                        } catch (e) { }
                    }
                }, 0, false);
            }
        }

        /* function show_metadata(action){

         // Open Metadata
         if(action === "open"){
         $("#layer_vis_2972").closest("div").find("i.fa-file-text-o").parents(0).trigger("click")

         $timeout(function (){
         $(".anno-overlay").css('z-index', '1032');
         });

         }
         // Close Metadata
         else if (action === "hide"){
         $(".modal-footer").children().trigger("click");

         $timeout(function (){
         $(".anno-overlay").css('z-index', '');
         });

         }
         }*/

        function startAnno() {

            $rootScope.$broadcast("StopLoadingWetlandFromURL"); // prevent loading from URL

            $('.main').css('position', 'absolute'); // set back on reset()

            var annoOverlay = $('.anno-overlay');
            var anno1 = new Anno([
                    {
                        target   : '#info_help',
                        className: 'anno-width-500',
                        position : 'bottom',
                        buttons  : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            {
                                text : 'Start',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow   : function (anno, $target) {
                            introTour.trackIntroductionTour('Welcome', '01');
                            // updating the reference to element with anno-overlay class
                            annoOverlay = $('.anno-overlay');

                            // change overlay to avoid changing z-index of all nav elements
                            annoOverlay.css('z-index', '1029');

                            annoOverlay.on("click", function () {
                                reset();
                            });

                            // prevent all click events
                            var handler = function (e) {
                                e.stopPropagation();
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide   : function (anno, $target, $annoElem, handler) {
                            annoOverlay.css('z-index', '');
                            $target[0].removeEventListener('click', handler, true)
                        },

                        content: '<div class="anno-step-of">(Step 1 of '+ step_count +')</div><h4>Welcome </h4><p>Welcome to the introduction tour of the <strong>SWOS and GEO-Wetlands Community Portal</strong>. We will show you how to navigate and find the information you might be interested in.</p>' +
                        '<p>Please notice that certain functions are deactivated during the tour. If you would like to do the tour in a more interactive way you can try it by following the <strong>next step</strong> information on each card.</p> ' +
                        '<p>You can always stop the tour with a click on the semi-transparent black area. To <strong>start</strong> the <strong>tour again </strong>go <strong>Info & Help</strong> on the top. Here you will also find information on how to contact us.</p>' +
                        '</div>'
                    }, // Welcome
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '3em',
                            right: '420px'
                        },
                        className    : 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons      : [
                             {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Catalog', '02');
                            //ensure wetland catalog is shown
                            select_tab();

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {
                                console.log(e);
                                if (e.target.htmlFor === "cb_testmapping" || e.target.id === "cb_testmapping" || e.target.htmlFor === "cb_groupbycountry" || e.target.id === "cb_groupbycountry" || e.target.id === "link_wetland_list") {
                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true)
                        },
                        content      : '<div class="anno-step-of">(Step 2 of '+ step_count +')</div><h4>Wetlands catalog</h4><div><p>All wetland sites of the <strong>SWOS project</strong> are listed here.</p> ' +
                        '<p>The preselected wetlands already have products developed within the project.</p>' +
                        '<p>To see the full list of wetlands of the SWOS project please unselect the checkbox <span class="anno-highlight">Show only wetlands with products</span> or use the provided filter to search for wetlands.</p>' +
                        '</div>'
                    }, // Wetland Catalog
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '15em',
                            right: '420px'
                        },
                        className    : 'anno-width-400',
                        arrowPosition: 'center-right',
                        buttons      : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Selection', '03');
                            //ensure wetland catalog is shown
                            select_tab();

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            // prevent all click events (except of Wetland selection)
                            var handler = function (e) {
                                if (e.target.htmlFor === "cb_testmapping" || e.target.id === "cb_testmapping" || e.target.htmlFor === "cb_groupbycountry" || e.target.id === "cb_groupbycountry" || e.target.id === "link_wetland_list" || e.target.innerText === "Camargue") {
                                    if (e.target.innerText === "Camargue") {
                                        anno.switchToChainNext();
                                    }
                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $('.sidebar').css( 'zIndex', '');
                        },
                        content      : '<div class="anno-step-of">(Step 3 of '+ step_count +')</div><h4>Wetland selection</h4><div><p>To get more information about a wetland you can select it on the <strong>map</strong> or from the <strong>list</strong>.</p>' +
                        '<p>In the <strong>next step</strong> we will use the <span class="anno-highlight">Camargue</span> wetland in France.</p></div>'
                    }, // Wetland selection
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '6em',
                            right: '420px'
                        },
                        className    : 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons      : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Wetland', '04');
                            //Load wetland (id 4 - Camargue)
                            only_load_wetland(4);

                            //ensure overview of wetland is shown
                            select_tab("overview");

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products
                                if (e.target.id === "link_wetland_opened" || e.target.className === "flaticon-layers" || e.target.parentElement.className.includes("flaticon-layers")) {
                                    if (e.target.className === "flaticon-layers" || e.target.parentElement.className.includes("flaticon-layers")) {
                                        anno.switchToChainNext(); // switch to next step, if the user click on "products"
                                    }
                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $('.sidebar').css( 'zIndex', '');
                        },
                        content      : '<div class="anno-step-of">(Step 4 of '+ step_count +')</div><h4>Overview of selected wetland</h4><div><p>For each wetland SWOS provides several data and information:</p>' +
                        '<ol style="list-style:disc outside;">' +
                        '<li><strong>Indicators: </strong>Wetland indicators derived on the basis of satellite data and SWOS products.</li>' +
                        '<li><strong>Products: </strong>Maps produced with the SWOS software toolbox.</li>' +
                        '<li><strong>Satellite data: </strong>Overview on free available satellite data.</li>' +
                        '<li><strong>Photos: </strong>Uploaded and linked (source: Panoramio) photos.</li>' +
                        '<li><strong>Videos: </strong>Uploaded and linked (source: Youtube) videos.</li>' +
                        '<li><strong>External databases: </strong>Compilation of other external data sources (e.g. databases, maps, websites).</li></ol>' +
                        '<p></p><p>In the <strong>next step</strong> we will have a closer look at <span class="anno-highlight">Products</span> <span class="flaticon-layers"><a style="text-decoration: none;"></a></span>.</p></div>'
                    }, // Wetland overview
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '6em',
                            right: '420px'
                        },
                        className    : 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons      : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Products', '05');
                            //ensure products is shown
                            select_tab("product");

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            // prevent all click events (except of ...)
                            var handler = function (e) {

                                // Allow preselection of product tab; allow accordion; allow layer selection
                                if (e.target.className === "accordion-toggle" || e.target.parentElement.className === "accordion-toggle" || e.target.id === "link_wetland_opened" || e.target.className === "flaticon-layers") {

                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $('.sidebar').css( 'zIndex', '');
                        },
                        content      : '<div class="anno-step-of">(Step 5 of '+ step_count +')</div><h4>Products of selected wetland</h4><div><p>On the basis of satellite data the <span class="anno-highlight">SWOS software toolbox</span> can be used to derive geospatial maps. Within SWOS the following products are provided: </p>' +
                        '<ol style="list-style:disc outside;">' +
                        '<li>Water Quality</li>' +
                        '<li>Land Surface Temperature Trend</li>' +
                        '<li>Surface Water Dynamics</li>' +
                        '<li>Flood Regulation</li>' +
                        '<li>Potential Wetland areas</li>' +
                        '<li>Land Use Land Cover</li>' +
                        '<li>Land Use Land Cover Change</li>' +
                        '<li>Surface Soil Moisture</li>' +
                        '</ol>' +

                        '<p>(Please keep in mind that not all products can and will be derived for each wetland.)</p>' +

                        '<p></p>In the <strong>next step</strong> we will select the product <span class="anno-highlight">Land Surface Temperature Trend</span>.</p></div>'
                    }, // Wetland Product
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '300px',
                            right: '420px'
                        },
                        className    : 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons      : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Product', '06');
                            //ensure products is shown
                            select_tab("product");

                            // prevent more than one layer warning
                            $cookies.put('hasNotifiedAboutLayers', true);

                            //add layer (max one layer)
                            load_and_show_layer(wetland_id, "product", product_id, "no");

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            // prevent all click events (except of ... )
                            var handler = function (e) {
                                // Allow preselection of overview tab; allow selection of products
                                if (e.target.className === "accordion-toggle" || e.target.parentElement.className === "accordion-toggle" || e.target.id === "layer_vis_" + product_id) {
                                    if (e.target.id === "layer_vis_" + product_id) {
                                        anno.switchToChainNext();
                                    }
                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $cookies.remove('hasNotifiedAboutLayers');
                            $('.sidebar').css( 'zIndex', '');

                        },
                        content      : '<div class="anno-step-of">(Step 6 of '+ step_count +')</div><h4>Detailed product information</h4><div><p></p>' +
                        '<p>All available datasets of a product are listed here below a short description of the product. Each dataset can be added to the map using the checkbox in front of the dataset name.</p>' +

                        '<p></p><p>In the <strong>next step</strong> we will add the <span class="anno-highlight">Land Surface Temperature Trend 2000 to 2016</span> dataset to the map.</p></div>'
                    }, // Show product layer
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '300px',
                            right: '420px'
                        },
                        className    : 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons      : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Dataset', '07');
                            //ensure products is shown
                            select_tab("product");

                            // prevent more than one layer warning
                            $cookies.put('hasNotifiedAboutLayers', true);

                            //add layer (max one layer)
                            load_and_show_layer(wetland_id, "product", product_id, "yes");

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            // prevent all click events (except of ... )
                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products // || e.target.className.includes("fa-file")
                                if (e.target.className === "accordion-toggle" || e.target.parentElement.className === "accordion-toggle" || e.target.className.includes("flaticon-space-satellite-station") || e.target.parentElement.className.includes("flaticon-space-satellite-station")) {
                                    if (e.target.className.includes("flaticon-space-satellite-station") || e.target.parentElement.className.includes("flaticon-space-satellite-station")) {
                                        anno.switchToChainNext();
                                    }
                                } else if ((e.target.className === 'btn btn-default ng-scope' && e.target.parentElement.className === 'item_icon') || (e.target.className.includes('fa') && e.target.parentElement.parentElement.className === 'item_icon')) {

                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $cookies.remove('hasNotifiedAboutLayers');
                            $('.sidebar').css( 'zIndex', '');
                        },
                        content      : '<div class="anno-step-of">(Step 7 of '+ step_count +')</div><h4>Dataset information and tools</h4><div><p></p>' +
                        '<p>You can change the transparency for each layer (slider) and:' +
                        '<ol style="list-style: disc outside;">' +
                        '<li><p><span class="fa fa-eye fa-lg"></span> hide your layer,</p></li>' +
                        '<li><p><span class="fa fa-list fa-lg"></span> hide the legend,</p></li>' +
                        '<li><p><span class="fa fa-file-text-o fa-lg"></span> view metadata, </p></li>' +
                        '<li><p><span class="fa fa-line-chart fa-lg"></span> view statistics* / create time series* (* if available), </p></li>' +
                        '<li><p><span class="fa fa-search fa-lg"></span> zoom to your layer,</p></li>' +
                        '<li><p><span class="fa fa-share-alt fa-lg"></span> and create a permanent link to share it.</p></li></ol></p>' +

                        '<p></p><p>In the <strong>next step</strong> we will move to <span class="anno-highlight">Satellite data</span> <span class="flaticon-space-satellite-station"><a style="text-decoration: none;"></a></span>.</p></div>'
                    }, // Load product layer
                    /*  {
                     target: '.sidebar',
                     position: {
                     top: '300px',
                     right: '420px'
                     },
                     className: 'anno-width-500',
                     arrowPosition: 'center-right',
                     buttons: [
                     AnnoButton.BackButton,
                     {
                     text: 'Next',
                     click: function (anno, evt) {
                     anno.switchToChainNext();
                     }
                     }
                     ],
                     onShow: function (anno, $target, $annoElem) {

                     //open metadata
                     show_metadata("open");


                     // prevent all click events (except of ... )
                     var handler = function (e) {
                     console.log(e);
                     // Allow preselection of overview tab; allow selection of products
                     if (e.target.className === "accordion-toggle" || e.target.parentElement.className === "accordion-toggle" || e.target.className.includes("fa-file")) {

                     } else {
                     e.stopPropagation();
                     }
                     }
                     $target[0].addEventListener('click', handler, true);
                     return handler;
                     },
                     onHide: function (anno, $target, $annoElem, handler) {
                     $target[0].removeEventListener('click', handler, true);
                     show_metadata("hide");


                     },
                     content: '<h4>Wetland product dataset metadata</h4><div><p></p>' +
                     '<p>Here you find more information about the map (e.g. about its lineage)' +
                     '</p>' +

                     '<p></p><p>In the <strong>next step</strong> we will close the metadata info box and move to satellite data.</p></div>'
                     }, // Show Metadata for Product */
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '6em',
                            right: '420px'
                        },
                        className    : 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons      : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Satellitedata', '08');
                            //ensure products is shown
                            select_tab("satdata");

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products
                                if (e.target.className === "accordion-toggle" || e.target.parentElement.className === "accordion-toggle" || e.target.className.includes("flaticon-technology-2") || e.target.className.includes("fancybox") || e.target.parentElement.className.includes("flaticon-technology-2") || e.target.nodeName === "IMG") {
                                    if (e.target.className.includes("flaticon-technology-2") || e.target.parentElement.className.includes("flaticon-technology-2")) {
                                        anno.switchToChainNext();
                                    }
                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $('.sidebar').css( 'zIndex', '');
                        },
                        content      : '<div class="anno-step-of">(Step 8 of '+ step_count +')</div><h4>Satellite data</h4><div>' +
                        '<p>An overview about free available satellite data (Landsat and Sentinel) covering the wetland area is given here. Please click on the <span class="anno-highlight">Yearly coverage by sensor</span> image to enlarge it. You will also find the total amount of data by sensor as a table below. </p>' +
                        '<p>In the <strong>future</strong> it will be also possible to download<strong> pre-processed satellite data</strong> clipped to the wetland area.</p>' +
                        '<p></p><p>In the <strong>next step</strong> we will move to the <span class="anno-highlight">External databases</span> tab <span class="flaticon-technology-2"><a style="text-decoration: none;"></a></span>.</p></div>'
                    }, // Satellite data ,
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '6em',
                            right: '420px'
                        },
                        className    : 'anno-width-500',
                        arrowPosition: 'center-right',
                        buttons      : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('External1', '09');
                            //ensure products is shown
                            select_tab("externaldb");

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            // prevent all click events (except of checkboxes)
                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products
                                if (e.target.className === "accordion-toggle" || e.target.parentElement.className === "accordion-toggle" || e.target.className.includes("flaticon-layers") || e.target.id === "only_layer" || e.target.id === "layer_vis_" + extdb_id) {
                                    if (e.target.id === "layer_vis_" + extdb_id) {
                                        anno.switchToChainNext();
                                    }
                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $('.sidebar').css( 'zIndex', '');
                        },
                        content      : '<div class="anno-step-of">(Step 9 of '+ step_count +')</div><h4>External databases</h4><div>' +
                        '<p>In this tab external databases and information sources related to the selected wetland on the regional, country, continental and global level are shown. To search for external layers that can be visualized in the map use the <span class="anno-highlight"><span class="flaticon-layers"><a style="text-decoration: none;"></a></span> Filter by maps</span> checkbox. You can add those layers in the same way as the product maps.</p>' +
                        '<p></p><p>In the <strong>next step</strong> we will discover and add one of the Global Surface Water maps from JRC/Google as an external global resource to the map (<span class="anno-highlight">Global</span> -> <span class="anno-highlight">Global Surface Water</span>).</p></div>'
                    }, // External DB
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '100px',
                            right: '420px'
                        },
                        arrowPosition: 'center-right',
                        className    : 'anno-width-500',

                        buttons: [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow : function (anno, $target) {
                            introTour.trackIntroductionTour('External2', '10');
                            //ensure products is shown
                            //select_tab("externaldb");
                            $cookies.put('hasNotifiedAboutLayers', true);
                            load_and_show_layer(wetland_id, "externaldb", extdb_id, "yes");

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            $('.sidebar').css( 'zIndex', '1501');

                            var handler = function (e) {

                                // Allow preselection of overview tab; allow selection of products
                                if (e.target.className === "accordion-toggle" || e.target.parentElement.className === "accordion-toggle" || e.target.className.includes("flaticon-layers") || e.target.id === "only_layer" || e.target.id.includes("layer_vis_")) {

                                } else if ((e.target.className === 'btn btn-default ng-scope' && e.target.parentElement.className === 'item_icon') || (e.target.className.includes('fa') && e.target.parentElement.parentElement.className === 'item_icon')) {

                                } else {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;

                        },
                        onHide : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $cookies.remove('hasNotifiedAboutLayers');
                            $('.sidebar').css( 'zIndex', '');
                        },
                        content: '<div class="anno-step-of">(Step 10 of '+ step_count +')</div><h4>Information and tools on selected resource</h4><div>' +
                        '<p>For each external resource some descriptions, links and datasets are provided. Please use the checkbox in front of the dataset name (e.g., Water Occurrence) to add the external layer to the map. </p>' +
                        '<p></p> In the <strong>next step</strong> we will show you how the change to order of the selected layers.</p></div>'
                    }, // Select external Layer
                    {
                        target   : '#active_layer',
                        position : {
                            top : '100px',
                            left: '400px'
                        },
                        className: 'anno-width-500',

                        buttons: [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow : function () {
                            introTour.trackIntroductionTour('ActiveLayers', '11');
                            $cookies.put('hasNotifiedAboutLayers', true);

                            //select_tab("externaldb");
                            load_and_show_layer(wetland_id, "externaldb", extdb_id, "yes");

                            open_close_active_layer("open");

                            move_map_elements_higher();

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            var el = document.getElementsByClassName("map-controls-wrapper");
                            var handler = function (e) {
                                // prevent info tool selection
                                if (e.target.className.includes("fa-info") || e.target.firstChild.className.includes("fa-info") || e.target.className.includes("fa-file") || e.target.firstChild.className.includes("fa-file")) {
                                    e.stopPropagation();
                                }
                            };
                            el[0].addEventListener('click', handler, true);

                            // var el2 = document.getElementsByClassName("item_icon");
                            // var handler = function (e) {
                            // prevent metadata show
                            /*    if (e.target.className.includes("fa-file") || e.target.firstChild.className.includes("fa-file")) {
                             e.stopPropagation();
                             }
                             }
                             el2[0].addEventListener('click', handler, true);
                             return handler; */

                        },
                        onHide : function (anno, $target, $annoElem, handler) {
                            open_close_active_layer("close");
                            move_map_elements_higher("reset");
                            var el = document.getElementsByClassName("map-controls-wrapper");
                            el[0].addEventListener('click', handler, true);
                            var el2 = document.getElementsByClassName("item_icon");
                            el2[0].addEventListener('click', handler, true);
                            $cookies.remove('hasNotifiedAboutLayers');
                        },
                        content: '<div class="anno-step-of">(Step 11 of '+ step_count +')</div><h4>Active layers</h4><div>' +
                        '<p>All layers activated and added to the map are listed in the <span class="anno-highlight">Active layer</span> box on the left. You can hide, remove or change the order of the layers. In addition you can do the same actions as on the right side (e.g. view the metadata, change the transparency, show legend).</p>' +
                        '<p></p><p>In the <strong>next step </strong> we will show the general map functions.</p></div>'
                    }, // Active Layer
                    {
                        target  : '.map-controls-wrapper',
                        position: 'bottom',
                        buttons : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow  : function (anno, $target) {
                            introTour.trackIntroductionTour('WetlandSites', '12');
                            $cookies.put('hasNotifiedAboutLayers', true);

                            move_map_elements_higher();

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            var handler = function (e) {
                                // prevent info tool selection
                                if (e.target.className.includes("fa-info") || e.target.innerHTML.includes("fa-info")) {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;

                        },
                        onHide  : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            move_map_elements_higher("reset");
                            $cookies.remove('hasNotifiedAboutLayers');
                        },
                        content : '<div class="anno-step-of">(Step 12 of '+ step_count +')</div><h4>Wetland sites</h4><div>' +
                        '<p>Unselect <span class="anno-highlight">Show Wetland sites</span> to hide the wetland boundaries in the map.</p>' +
                        '<p>In the <strong>next step</strong> we show you the general map control elements.</p>' +
                        '</div>'
                    }, // Wetland sites
                    {
                        target   : '.map-controls-wrapper',
                        position : 'center-bottom',
                        className: 'anno-width-500',
                        buttons  : [
                            {
                                text: 'Exit',
                                className: 'anno-btn-low-importance anno-exit-left',
                                click: function (anno) {
                                    reset();
                                    anno.hide();
                                }
                            },
                            AnnoButton.BackButton,
                            {
                                text : 'Next',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow   : function (anno, $target) {
                            introTour.trackIntroductionTour('MapControls', '13');
                            $cookies.put('hasNotifiedAboutLayers', true);

                            move_map_elements_higher();

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });

                            var handler = function (e) {
                                // prevent info tool selection
                                if (e.target.className.includes("fa-info") || e.target.innerHTML.includes("fa-info")) {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide   : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            move_map_elements_higher("reset");
                            $cookies.remove('hasNotifiedAboutLayers');
                        },
                        content  : '<div class="anno-step-of">(Step 13 of '+ step_count +')</div><h4>Map control</h4><div><p></p>' +
                        '<p>You can' +
                        '<ol style="list-style: disc outside;">' +
                        '<li><p><span class="fa fa-plus fa-lg"></span> zoom into the map,</p></li>' +
                        '<li><p><span class="fa fa-minus fa-lg"></span> zoom out of the map, </p></li>' +
                        '<li><p><span class="fa fa-globe fa-lg"></span> zoom to the maximal SWOS extent,</p></li>' +
                        '<li><p><span class="fa fa-info fa-lg"></span> &nbsp; and request information on visible layers. You need to activate this tool by clicking on the button. Afterwards you can click in the map. A window shows the responses from the visible WMS/WMTS layers.</p></li></ol></p>' +
                        '<p></p><p>In the <strong>next step </strong> we will show you the search function.</p></div>'
                    }, // Map Control
                    {
                        target  : '.map-controls-wrapper',
                        position: 'right',

                        buttons: [
                            AnnoButton.BackButton,
                            {
                                text : 'Close',
                                click: function (anno) {
                                    introTour.trackIntroductionTour('Close', '15');
                                    reset();
                                    anno.hide();
                                }
                            }
                        ],
                        onShow : function (anno, $target) {
                            introTour.trackIntroductionTour('Search', '14');
                            $cookies.put('hasNotifiedAboutLayers', true);

                            move_map_elements_higher();

                            //reset on close Anno
                            annoOverlay.on("click", function () {
                                reset();
                            });
                            var handler = function (e) {
                                // prevent info tool selection
                                if (e.target.className.includes("fa-info") || e.target.innerHTML.includes("fa-info")) {
                                    e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            move_map_elements_higher("reset");
                            $cookies.remove('hasNotifiedAboutLayers');
                        },
                        content: '<div class="anno-step-of">(Step 14 of '+ step_count +')</div><h4>Search</h4><div><p></p>' +
                        '<p>Using this text field you can search for our datasets. Requests will be send to the SWOS Catalog Services for Web (CSW). In the <strong>future</strong> it will contain all datasets from the SWOS project as well as datasets from <a href="http://www.geoportal.org" target="_blank">GEOSS</a>. The service will be also available for external applications.</p>' +
                        '<p></p><p></p>' +
                        '<p><strong>Congratulations</strong>, you reached the end of the tour. <strong>Now it\'s your turn!</strong> We will remove all added layer and guide you back to the start page.</p>'
                    } // Search
                ]
            );
            anno1.show();
        }

        function trackIntroductionTour(title, step) {
            TrackingService.trackPageView('/introduction/' + step + '_' + title.toLowerCase(), 'Introduction Tour: ' + title + ' (' + step + ')');
        }
    }
})();
