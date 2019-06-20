(function() {
    'use strict';

    angular
        .module('webgisApp.swos')
        .controller('IntroductionTourCtrl', IntroductionTourCtrl);

    IntroductionTourCtrl.$inject = ['$scope', 'mapviewer', 'WetlandsService', 'RegionsService', '$timeout', '$cookies', '$rootScope', 'TrackingService', '$location'];
    function IntroductionTourCtrl($scope, mapviewer, WetlandsService, RegionsService, $timeout, $cookies, $rootScope, TrackingService, $location) {
        var introTour = this;

        introTour.startAnno = startAnno;
        introTour.trackIntroductionTour = trackIntroductionTour;

        var extdb_id = "2551"; // Global Surface Water: Water Occurence (1984-2015)
        var product_id = "3291"; // Camargue:  Land Surface Temperature Trend 2000 to 2016
        var wetland_id = 4; // Camargue
        var step_count = 12;

        //--------------------------------------------------------------------------------------------------------------

        $scope.$on('start_tour', function () {
            return introTour.startAnno();
        });

        //--------------------------------------------------------------------------------------------------------------


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
                $('nav.navbar').css('z-index', '1030');
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

            //$('#closeWetland').click();
            WetlandsService.selectTab(); // Open wetland Catalog

            $('.main').css('position', 'fixed'); // set back to origin
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

                        content: '<div class="anno-step-of">(Step 1 of '+ step_count +')</div><h4>Willkommen </h4><p>Willkommen zur Einführungstour auf dem PhaenOPT-Portal. Wir zeigen Ihnen wie Sie sich auf dem Portal navigieren und bewegen können.</p>' +
                        '<p>Bitte beachten Sie, dass manche Funktionen während der Tour deaktiviert sind. Sie können die Tour immer mit einem Klick auf den halbtransparenten schwarzen Hintergrund oder über den Button <span class="anno-highlight">Exit</span> beenden.</p> ' +
                        '<p>Um die Einführungstour erneut zu starten, klicken Sie bitte auf den "Menü"-Button oben im Header und wählen den Menüpunkt "Einführungstour" aus. Hier finden Sie ebenso Kontaktdaten und weitere Informationen zum Portal.</p>' +
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Catalog', '02');
                            //ensure wetland catalog is shown
                            WetlandsService.selectTab("overview");

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
                        content      : '<div class="anno-step-of">(Step 2 of '+ step_count +')</div><h4>Inhalte und Übersicht</h4><div><p>In diesem Bereich finden Sie alle relevanten Informationen und Karten, die wir zur Verfügung gestellt haben.</p> ' +
                        '<p>Jede dieser Kacheln im Bereich "Verfügbare Daten" spiegelt einen Reiter in der Leiste unterhalb der Übeschrift "Thüringen" wieder. Weitere Texte und Links zum Projekt finden Sie unterhalb der Kacheln.</p>' +
                        '</div>'
                    }, // Wetland Catalog
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '3em',
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Selection', '03');
                            //ensure wetland catalog is shown
                            WetlandsService.selectTab("product");

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
                        content      : '<div class="anno-step-of">(Step 3 of '+ step_count +')</div><h4>Karten</h4><div>' +
                        '<p>Bei den allgemeinen Karten sind topographische Karten, digitale Geländemodelle, Luft- und Satellitenbilder zu finden. Über die Checkbox vor dem Namen der Karte können Sie den Datensatz der interaktiven Karte hinzufügen.</p></div>'
                    },
                    {
                        target       : '.sidebar',
                        position     : {
                            top  : '60px',
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Dataset', '07');
                            //ensure products is shown
                            WetlandsService.selectTab("product");

                            // prevent more than one layer warning
                            $cookies.put('hasNotifiedAboutLayers', true);

                            //add layer (max one layer)
                            //WetlandsService.loadLayer(wetland_id, "product", product_id, "yes", true);
                            RegionsService.loadLayer(1, "product", 10, "yes", true);

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
                        content      : '<div class="anno-step-of">(Step 4 of '+ step_count +')</div><h4>Information und Funktionen zum Datensatz</h4><div><p></p>' +
                        '<p>Sie können die Transparenz für jeden Layer über den Slider ändern. Ebenso stehen folgende Buttons zur Verfügung:' +
                        '<ol style="list-style: disc outside;">' +
                        '<li><p><span class="fa fa-eye fa-lg"></span> Layer ausblenden,</p></li>' +
                        '<li><p><span class="fa fa-list fa-lg"></span> Legende ausblenden,</p></li>' +
                        '<li><p><span class="fa fa-file-text-o fa-lg"></span> Metadaten anzeigen, </p></li>' +
                        '<li><p><span class="fa fa-line-chart fa-lg"></span> Zeitreihe extrahieren* (* wenn verfügbar), </p></li>' +
                        '<li><p><span class="fa fa-search fa-lg"></span> Auf den Layer zoomen,</p></li>' +
                        '</ol></p>' +

                        '</div>'
                    },
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Satellitedata', '08');
                            //ensure products is shown
                            $('.flaticon2-climate a').click();

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
                        content      : '<div class="anno-step-of">(Step 5 of '+ step_count +')</div><h4>Klimakarten</h4><div>' +
                        '<p>Unter dem Reiter Klimakarten sind Niederschlags- und Temperaturdaten hinterlegt, sowohl für einzelne Jahre, als auch für Anomalien innerhalb  von Bezugszeiträumen. Diese Werte beeinflussen maßgeblich das Verhalten von Pflanzen.</p>' +
                        '</div>'
                    }, 
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Satellitedata', '08');
                            //ensure products is shown
                            $('.flaticon2-calendar a').click();

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
                        content      : '<div class="anno-step-of">(Step 6 of '+ step_count +')</div><h4>Phänologiekarten</h4><div>' +
                        '<p>Unter dem Reiter Phänologiekarten sind gemessene und modellierte Ergebnisse zum einsetzen der phänologischen Phasen einzusehen. So kann beispielsweise die Blüte verschiedener Pflanzen vorausgesagt werden. Auch geben uns die verschiedenen Jahre einen Überblick darüber, ob sich die Dauer der Vegetationsperiode verändert hat. Dies kann als Hinweis auf den Klimawandel gesehen werden.</p>' +
                        '</div>'
                    }, 
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('Satellitedata', '08');
                            //ensure products is shown
                            WetlandsService.selectTab("satdata");

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
                        content      : '<div class="anno-step-of">(Step 7 of '+ step_count +')</div><h4>Satellitendaten</h4><div>' +
                        '<p>Satellitendaten ermöglichen die Beobachtung der Erde aus dem All. Neben dem Bereich des sichtbaren Lichtes zeichnen sie beispielsweise auch im nahen Infrarot auf. Dies kann helfen, Aussagen über die Vegetation zu tätigen.  Sie sind besonders nützlich, da sie die zeitaufwendige Messung vor Ort unterstützen können und flächendeckend für ganz Thüringen vorliegen.</p>' +
                        '<p>In diesem Reiter haben wir für Sie Vegetationsdaten basierend auf Satellitendaten sowie weitergehende textliche Informationen bereitgestellt. Zur Visualisierung stehen die Vegetationsdaten des Copernicus Land Dienstes, des NASA MODIS Sensors sowie der europäischen Satelliten Sentinel-2 und Sentinel-3 bereit.</p>' +
                        '<p>Nach Auswahl eines Layers können Sie das Datum der Aufnahme wählen. Angezeigt wird jeweils ein Vegetationsindex (siehe textliche Beschreibung).</p>' +
                        '<p>Eine Übersicht verfügbarer Erdbeobachtungsdaten der Satellitenmissionen Landsat und Sentinel finden Sie ganz unten. </p>' +
                        '</div>'
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow       : function (anno, $target) {
                            introTour.trackIntroductionTour('External1', '09');
                            //ensure products is shown
                            WetlandsService.selectTab("externaldb");

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
                                    //e.stopPropagation();
                                }
                            };
                            $target[0].addEventListener('click', handler, true);
                            return handler;
                        },
                        onHide       : function (anno, $target, $annoElem, handler) {
                            $target[0].removeEventListener('click', handler, true);
                            $('.sidebar').css( 'zIndex', '');
                        },
                        content      : '<div class="anno-step-of">(Step 8 of '+ step_count +')</div><h4>Phänologische In-Situ-Daten des DWD</h4><div>' +
                        '<p>In-Situ Daten sind vor Ort gemessene Daten, welche unter anderem der Deutsche Wetterdienst erhebt. Beobachter des deutschen Wetterdienstes erkunden regelmäßig die Umgebung der Stationen und dokumentieren einzelne Pflanzen.</p>' +
                        '<p>In diesem Reiter können Sie eine Übersicht der phänologischen Stationen des DWD in Thüringen sehen. Ebenso haben wir die In-Situ Daten für Sie aufbereitet: Wählen Sie einfach eine Station aus der Liste und nachfolgend eine Pflanze und ihre Phase aus. Wir zeigen Ihnen den Eintrittstermin dieser Phase über den verfügbaren Zeitraum in einer Grafik.</p>'+
                        '<p>Sie können aber auch die Eintrittstermine aller Pflanzen in Thüringen für eine ausgewählte Phase in einem Histogramm sich ausgeben lassen. Wählen Sie im unteren Teil einfach die gewünschte Phase aus, das Histogramm wird automatisch berechnet.</p>' +
                        '</div>'
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow : function (anno, $target) {
                            introTour.trackIntroductionTour('External2', '10');
                            //ensure products is shown
                            //selectTab("externaldb");
                            $cookies.put('hasNotifiedAboutLayers', true);
                            $('.flaticon2-group a').click();

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
                        content: '<div class="anno-step-of">(Step 9 of '+ step_count +')</div><h4>Citizen Science</h4><div>' +
                        '<p>Bürgerinnen und Bürger können sich selbst an der Sammlung phänologischer Daten beteiligen, indem sie mit mobilen Geräten wie Smartphones oder Tablets nach Pflanzen Ausschau halten und das Stadium der Pflanze dokumentieren. Hier finden Sie Datenbanken mit Fokussierung auf phänlogische Informationen.</p>' +
                        '</div>'
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow : function () {
                            introTour.trackIntroductionTour('ActiveLayers', '11');
                            $cookies.put('hasNotifiedAboutLayers', true);

                            //selectTab("externaldb");
                            //WetlandsService.loadLayer(wetland_id, "externaldb", extdb_id, "yes");

                            open_close_active_layer("open");

                            move_map_elements_higher();
                            $('.map-controls-wrapper').css('z-index', '');

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
                        content: '<div class="anno-step-of">(Step 10 of '+ step_count +')</div><h4>Aktive Layer</h4><div>' +
                        '<p>Alle Layer, die Sie der Karte hinzugefügt haben, werden hier aufgelistet. Sie können einzelne Layer ausblenden, entfernen oder per Drag\'n\'Drop die Reihenfolge der Layer verändern. Ebenso können Sie die Transparenz einzelner Layer ändern und die Metadaten sich anzeigen lassen.</p>' +
                        '</div>'
                    }, // Active Layer
                    {
                        target   : '#map_icons',
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
                                text : 'Weiter',
                                click: function (anno) {
                                    anno.switchToChainNext();
                                }
                            }
                        ],
                        onShow   : function (anno, $target) {
                            introTour.trackIntroductionTour('MapControls', '13');
                            $cookies.put('hasNotifiedAboutLayers', true);

                            move_map_elements_higher();
                            $('#map_icons').css('zIndex', 1078);

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
                        content  : '<div class="anno-step-of">(Step 11 of '+ step_count +')</div><h4>Interaktion mit der Karte</h4><div><p></p>' +
                        '<p>Sie können ' +
                        '<ol style="list-style: disc outside;">' +
                        '<li><p><span class="fa fa-plus fa-lg"></span> in die Karte hineinzoomen,</p></li>' +
                        '<li><p><span class="fa fa-minus fa-lg"></span> aus der Karte herauszoomen, </p></li>' +
                        '<li><p><span class="fa fa-globe fa-lg"></span> den initialen Zoomzustand (Thüringen) wiederherstellen,</p></li>' +
                        '<li><p><span class="fa fa-info fa-lg"></span> &nbsp; und Pixelinformationen für in der Karte sichtbare Layer anfragen. Dafür müssen Sie diesen Button mit einem Klick aktivieren. Danach können Sie in die Karte klicken, die Informationen der in der Karte verfügbaren Layer werden extrahiert und angezeigt.</p></li></ol></p>' +
                        '</div>'
                    }, // Map Control
                    {
                        target  : '#info_help',
                        position: 'right',

                        buttons: [
                            AnnoButton.BackButton,
                            {
                                text : 'Schließen',
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

                            move_map_elements_higher("reset");
                            $('nav.navbar').css('z-index', 1035);
                            $('.map-controls-wrapper').css('z-index', 1036);

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
                        content: '<div class="anno-step-of">(Step 12 of '+ step_count +')</div><h4>Herzlichen Glückwunsch</h4><div><p></p>' +
                        '<p>Sie haben das Ende der Einführungstour erreicht. <strong>Nun sind Sie dran!</strong> Wir entfernen automatisch alle Layer aus der Karte und führen Sie zum Ausgsangspunkt des Portals zurück.</p>'
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
