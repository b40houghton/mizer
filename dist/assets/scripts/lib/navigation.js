define(["jquery", "main", "lib/breakpoints"], function($) {

    ;(function($, window, document, undefined) {


        $.fn.fancyNavigation = function(options) {

            //
            // default settings
            // 
            var defaults = {
                "mainNavigationId": "main-nav",
                "mobileHeaderId": "mobile-header",
                "mobileNavBtnId": "mobile-nav-trigger",
                "mobileNavBtnActive": "open",
                "exNavId": "expandable-nav",
                "exNavActiveClass": "open",
                "dataTargetName": "target",
                "tabClassName": "tab",
                "dataTarget": "target",
                "navActiveClass": "active",
                "tabActiveClass": "active",
                "scrollThreshold": 75,
                "utilityNavId": "utility-nav",
                "tabColumnLimit": 6,
                "tabColumnClass": null,
                "headerId": "header",
                "pageWrapperClass": "wrapper",
                "pageWrapperActive": "open"
            };

            // integrate settings from method variable
            if (options) $.extend(defaults, options);

            //global variables
            var old_scroll = 0,
                utility_hidden = false,
                utility_nav = $(document.getElementById(defaults.utilityNavId)),
                mobileNav = $(document.getElementById(defaults.mobileNavBtnId)),
                mainNav = $(document.getElementById(defaults.mainNavigationId)),
                mobileHeader = $(document.getElementById(defaults.mobileHeaderId)),
                wrapper = $("." + defaults.pageWrapperClass),
                expandable_nav = $("#" + defaults.exNavId),
                header = $(document.getElementById(defaults.headerId)),
                header_h = header.height(),
                tabElements = $('.' + defaults.tabClassName),
                logo_img = header.find(".logo"),
                isDesktop = (dc.breakpoints.current === "desktop") ? true : false;
                isIE8 = $("html").hasClass("ie8");
            
            //
            //close navigation
            //
            function closeNav() {

                //remove any set heights
                expandable_nav.removeAttr("style");
                mainNav.removeAttr("style");


                //remove active class for the wrapper if not on desktop
                if(!isDesktop){

                    wrapper.removeClass(defaults.pageWrapperActive); //remove wrapper active class
                    mobileNav.removeClass(defaults.mobileNavBtnActive); //remove mobile btn active

                    //expandable nav resets
                    expandable_nav.css("display","none");
                    expandable_nav.removeClass(defaults.exNavActiveClass);

                    tabElements.removeClass(defaults.tabActiveClass);
                    $("header ." + defaults.navActiveClass).removeClass(defaults.navActiveClass);

                    $("#footer-wrapper").css("opacity", 1);

                } else{

                    $("#body").removeAttr("style");

                    //if the expandable-nav is open, close with style
                    if (expandable_nav.hasClass(defaults.exNavActiveClass)) {

                        expandable_nav.slideUp(200, function() {
                            $("header ." + defaults.navActiveClass).removeClass(defaults.navActiveClass);
                            tabElements.removeClass(defaults.tabActiveClass);
                        });

                        $("html, body").scrollTop(0);
                        $("#footer-wrapper").css("opacity", 1);

                        expandable_nav.removeClass(defaults.exNavActiveClass);


                    }
                }

                
            };

            function closeExpandable(){
                expandable_nav.css("display","none");
                expandable_nav.removeClass(defaults.exNavActiveClass);
                $("header ." + defaults.navActiveClass).removeClass(defaults.navActiveClass);
            }

            //
            //open navigation
            //
            function openNav(target) {



                if(isDesktop){
                    $(window).scrollTop(0);
                    $("#footer-wrapper").css("opacity", 0);
                    $("#body").css("padding-top", "2em");
                }
                

                var targetTab = $("#" + target);

                targetTab.addClass(defaults.tabActiveClass);

                if (!expandable_nav.hasClass(defaults.exNavActiveClass)) {
                    if(isDesktop){
                        expandable_nav.slideDown(300, function() {
                            expandable_nav.addClass(defaults.exNavActiveClass);

                        });
                    } else{
                        expandable_nav.addClass(defaults.exNavActiveClass).css("display","block");
                    }
                }
                
                
            };

            function mobileSetHeights(){
                var mobileNav_h = ($("html").innerHeight() - mobileHeader.height());

                mainNav.innerHeight(mobileNav_h);

                expandable_nav.innerHeight(mobileNav_h);

            }

            function columnizeTab(target) {
                //console.log(defaults.columnLimit);
            }

            //
            //on close btn click
            //
            $('.btn-close').off('click.close').on('click.close', function() {
                closeNav();
            });

            //on back btn click
            $('.btn-back').off('click.back').on('click.back', function(){
                closeExpandable();
            });

            $(window).off('resize.nav').on('resize.nav', function(){

                // $(window).scrollTop(0);

                $(window).trigger('throttledScroll.nav');

                if(!isIE8){
                    closeNav();
                }

                isDesktop = (dc.breakpoints.current === "desktop") ? true : false;
            });

            //
            //scroll close
            //
            //
            $(window).off('throttledScroll.nav').on('throttledScroll.nav', function() {

                //check to make sure on desktop
                if (isDesktop && !isIE8) {

                    var current_scroll = $(window).scrollTop(),
                        scroll_delta = current_scroll - old_scroll,
                        scroll_threshold = defaults.scrollThreshold,
                        scrolling = 0;

                    //
                    // if the threshold or end of expandable nav
                    // is reached, close the nav
                    // 
                    if (scroll_delta >= scroll_threshold || current_scroll >= expandable_nav.height()) {
                        closeNav();
                    }

                    // shrink/expand the desktop
                    if (current_scroll > 0) {
                        header.addClass("header-small");
                    } else {
                        header.removeClass("header-small");
                    }

                    old_scroll = current_scroll;

                } else{
                    return;
                }
            });

            //mobile nav trigger
            mobileNav.off('click.mobileNav').on('click.mobileNav', function() {
                if(!isDesktop){

                    utility_nav.removeAttr("style");

                    $(window).trigger('reloadSVG');

                    //close
                    if (wrapper.hasClass(defaults.pageWrapperActive)) {

                        closeNav();
                    } else {
                        wrapper.addClass(defaults.pageWrapperActive);
                        mobileNav.addClass(defaults.mobileNavBtnActive);
                    }


                    mobileSetHeights();

                } else{
                    return;
                }
            });

            //Expand Collapse Nested Navigation
            $('.collapsed span').off('click.span').on('click.span', function(){
                var el = $(this);
                if(el.siblings('ul').hasClass('expanded')){
                    el.text("+"); 
                    el.siblings('ul').removeClass('expanded');
                }else{
                    el.text("–");
                    el.siblings('ul').addClass('expanded');
                }
            });

            return this.each(function() {
                var elements = $(this);

                elements.off('click.nav').on('click.nav', function() {
                    var clickedEl = $(this),
                        clickedElTarget = clickedEl.data(defaults.dataTarget);

                    //check if already opened and active
                    if (clickedEl.hasClass(defaults.navActiveClass)) {
                        closeNav();
                    } else {
                        
                        $('header .'+ defaults.navActiveClass).removeClass(defaults.navActiveClass);
                        expandable_nav.find("." + defaults.navActiveClass).removeClass(defaults.navActiveClass);

                        clickedEl.addClass(defaults.navActiveClass);
                        openNav(clickedElTarget);
                    }
                });

            });


        };

    })(jQuery, window, document);
});