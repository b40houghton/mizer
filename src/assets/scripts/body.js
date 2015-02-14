
    var allowScroll = true;

    //add useragent to data-useragent
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);

    //scroll throttle function
    function scollThrottle() {
        if (allowScroll === false) return;
        else {
            allowScroll = false;
            setTimeout(function() {
                $('body').trigger('throttledScroll', $(window).scrollTop());
                allowScroll = true;
            }, 30);
        }
    };

    //svg reload function
    function svgReload() {

        var svgElements = document.getElementsByTagName('use');

        for (var i = 0; i < svgElements.length; i++) {
            var tempHref = svgElements[i].getAttribute("xlink:href");

            svgElements[i].setAttribute("xlink:href", "");
            svgElements[i].setAttribute("xlink:href", tempHref);
        }
    }

    // SWIPE PLUGIN FOR TOUCH DEVICES

    $.fn.swipe = function(settings) {

        // default settings
        var config = {
            "dragElement"           : "horizontal",
            "addSlideClassEl"       : false,
            "xTriggerThreshold"     : 30
        };

        // integrate settings from method variable
        if (settings) $.extend(config, settings);

        return this.each(function() {

            var el = $(this);
            var data = {};

            if (!config.addSlideClassEl) config.addSlideClassEl = el;

            var touchStart = 'touchstart.swipe';
            var touchMove = 'touchmove.swipe';
            var touchEnd = 'touchend.swipe';

            var isPointerData = false; // true when inside pointer event data

            if (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) {
                isPointerData = true;
                touchStart = (!window.navigator.msPointerEnabled) ? 'pointerdown.swipe' : 'MSPointerDown';
                touchMove = (!window.navigator.msPointerEnabled) ? 'pointermove.swipe' : 'MSPointerMove';
                touchEnd = (!window.navigator.msPointerEnabled) ? 'pointerup.swipe' : 'MSPointerUp';
            }

            el.off(touchStart).on(touchStart, function(e) {

                config.addSlideClassEl.addClass('touching');

                data = {};
                //                data.beginX = e.originalEvent.touches[0].clientX;

                data.beginX = (isPointerData) ? e.originalEvent.clientX : e.originalEvent.touches[0].clientX;

                if (typeof config.onBegin == 'function') config.onBegin(data);

            }).off(touchMove).on(touchMove, function(e) {

                data.deltaXPrevious = data.deltaX || 'none';

                //                data.currentX = e.originalEvent.touches[0].clientX;
                data.currentX = (isPointerData) ? e.originalEvent.clientX : e.originalEvent.touches[0].clientX;
                data.deltaX = data.currentX - data.beginX;

                if (data.deltaX > 20 || data.deltaX < -20) e.preventDefault();

                if (data.deltaXPrevious == 'none') {

                    data.firstXDirection = (data.deltaX > 0) ? 'right' : 'left';

                } else {

                    data.lastXDirection = (data.deltaX > data.deltaXPrevious) ? 'right' : 'left';

                }

                if (config.onMove && data.deltaX > 20 || data.deltaX < -20) config.onMove(data);

                data.deltaPrevious = data.deltaX;

                //                data.currentX = e.originalEvent.touches[0].clientX;
                data.currentX = (isPointerData) ? e.originalEvent.clientX : e.originalEvent.touches[0].clientX;

            }).off(touchEnd).on(touchEnd, function(e) {

                config.addSlideClassEl.removeClass('touching');

                
                
                if (typeof config.onEnd == 'function' && 
                    config.xTriggerThreshold && 
                    data.deltaX &&
                    Math.abs(data.deltaX) > config.xTriggerThreshold) { 
                    
                        config.onEnd(data);
                    
                    }   
                
            });
        });
    };

    //custom event reloadSVG
    $(window).off('reloadSVG').on('reloadSVG', function() {
        svgReload();
    });

    $(window).off('onBreakpointChange').on('onBreakpointChange', function() {
        $(window).trigger("reloadSVG");
    });

    //pass off scroll to scroll throttle
    $(window).off('scroll').on('scroll', function(e) {
        if (allowScroll) scollThrottle();
    });
    
    // on DOM ready logic
    $(function(){

        // logic for mimicing a link click
        $('[data-href]').click(function(event){
        
            event.preventDefault();
            
            var elData = $(this).data();
            
            if (elData.hrefNewtab) window.open(elData.href, '_blank'); 
            
            else window.location.href = elData.href;
        
        });
        
        // dynalically add telephone link to the contact us button
        $('.mobile-tel-link').click(function(event){
        
            // cache elements
            var el              = $(this),
                hiddenTelLink   = el.next('.mobile-tel-holder').children('a');
            
            // replace the href if the phone browser made the number into a phone link
            if (hiddenTelLink.length) {
                
                el.attr('href', hiddenTelLink.attr('href'));
                                
            } 
                    
        });

        //polyfill the flexbox
        if (!Modernizr.flexbox) {
            $('.equal-heights').each(function () {
                dc.utilities.getSetTallest($(this).children('[class*="grid-"]').height('auto'), true);
            });
        }
        
    });
dc.utilities = {

    // receive a string and convert it to a jQuery object. if 'selector' is already a jQuery DOM object, it is simply passed through 
    returnStringAsJqObject : function(selector){
        return (typeof selector == 'string') ? $(selector) : selector;
    },

    // check if element exists on page. if so, run callback function with element passed through
        // selector : jQuery string selector or jQuery dom object
        // callback : function called with the jquery object passed through
    runIfElLength : function(selector, callback){
        var _el = dc.utilities.returnStringAsJqObject(selector);
        if (_el.length) callback(_el);
    },

    // compare heights of all elements and return either an interger or the object that is the tallest.
        // selector     : jQuery string selector or jQuery dom object
        // returnType   : string - 'num' or 'obj'
        // setHeights   : boolean - indicated whether or not to set the objects to be the same height
    getSetTallest : function(selector, setHeights){
        
        var _el         = dc.utilities.returnStringAsJqObject(selector),
            tallest     = 0;
        
        _el.each(function(){
            
            var newHeight = $(this).height();
            if (tallest < newHeight) tallest = newHeight;

        });
                                    
        if (setHeights) _el.height(tallest);

        return tallest;

    }
};