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

    

    //add useragent to data-useragent
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);

    

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
(function(window, jQuery, Angular){

    // configure the throttler by setting the amount of delay forced between scrolls
    var delayTime = 40;

    // function called when the scroll event fires
    var scrollThrottler = function(){ 

    // trigger custom action
    fireScroll();

    // remove the scroll event
    window.removeEventListener('scroll', scrollThrottler, false);  

        // reinitialize the scroll event after 
        setTimeout(function(){ 
            
            // add listener after timeout is complete
            window.addEventListener('scroll', scrollThrottler, false);

        }, delayTime);
    };
   
    // fires custom throttled scroll event to jQuery and Angular if needed, passing the scrollTop information
    function fireScroll(){

        // get amount scrolled from the top od the browser window
        var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        // trigger event for jQuery
        if (window.jQuery) $(window).trigger('throttledScroll', scrollTop);
        
        // broadcast event for Angular
        //if (window.Angular) angular.element(document).scope().$broadcast('throttledScroll', scrollTop);

    }

    // begin listening to scroll behavior
    window.addEventListener('scroll', scrollThrottler, false);


})(window, jQuery, window.Angular || undefined);




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
dc.moduleMethod.testMethod = function(options){

    console.log('this ia a test');
    console.log(options);
};
// loop through the dc.moduleMethodLoad object to load module-specific logic
 if (dc.moduleMethodLoad.length) {

 	for (var i = 0, len = dc.moduleMethodLoad.length; i < len; i++) {

 		var name 	= dc.moduleMethodLoad[i].name,
 			options	= dc.moduleMethodLoad[i].options || undefined;

 		dc.moduleMethod[name](options);

 	}
 }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxLXN3aXBlLmpzIiwib25sb2FkLmpzIiwic2Nyb2xsLmpzIiwidXRpbGl0aWVzLmpzIiwiX3Rlc3RNZXRob2QuanMiLCJpbml0aWFsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJib2R5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU1dJUEUgUExVR0lOIEZPUiBUT1VDSCBERVZJQ0VTXG4kLmZuLnN3aXBlID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcblxuICAgIC8vIGRlZmF1bHQgc2V0dGluZ3NcbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBcImRyYWdFbGVtZW50XCIgICAgICAgICAgIDogXCJob3Jpem9udGFsXCIsXG4gICAgICAgIFwiYWRkU2xpZGVDbGFzc0VsXCIgICAgICAgOiBmYWxzZSxcbiAgICAgICAgXCJ4VHJpZ2dlclRocmVzaG9sZFwiICAgICA6IDMwXG4gICAgfTtcblxuICAgIC8vIGludGVncmF0ZSBzZXR0aW5ncyBmcm9tIG1ldGhvZCB2YXJpYWJsZVxuICAgIGlmIChzZXR0aW5ncykgJC5leHRlbmQoY29uZmlnLCBzZXR0aW5ncyk7XG5cbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBlbCA9ICQodGhpcyk7XG4gICAgICAgIHZhciBkYXRhID0ge307XG5cbiAgICAgICAgaWYgKCFjb25maWcuYWRkU2xpZGVDbGFzc0VsKSBjb25maWcuYWRkU2xpZGVDbGFzc0VsID0gZWw7XG5cbiAgICAgICAgdmFyIHRvdWNoU3RhcnQgPSAndG91Y2hzdGFydC5zd2lwZSc7XG4gICAgICAgIHZhciB0b3VjaE1vdmUgPSAndG91Y2htb3ZlLnN3aXBlJztcbiAgICAgICAgdmFyIHRvdWNoRW5kID0gJ3RvdWNoZW5kLnN3aXBlJztcblxuICAgICAgICB2YXIgaXNQb2ludGVyRGF0YSA9IGZhbHNlOyAvLyB0cnVlIHdoZW4gaW5zaWRlIHBvaW50ZXIgZXZlbnQgZGF0YVxuXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgfHwgd2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCkge1xuICAgICAgICAgICAgaXNQb2ludGVyRGF0YSA9IHRydWU7XG4gICAgICAgICAgICB0b3VjaFN0YXJ0ID0gKCF3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpID8gJ3BvaW50ZXJkb3duLnN3aXBlJyA6ICdNU1BvaW50ZXJEb3duJztcbiAgICAgICAgICAgIHRvdWNoTW92ZSA9ICghd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSA/ICdwb2ludGVybW92ZS5zd2lwZScgOiAnTVNQb2ludGVyTW92ZSc7XG4gICAgICAgICAgICB0b3VjaEVuZCA9ICghd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSA/ICdwb2ludGVydXAuc3dpcGUnIDogJ01TUG9pbnRlclVwJztcbiAgICAgICAgfVxuXG4gICAgICAgIGVsLm9mZih0b3VjaFN0YXJ0KS5vbih0b3VjaFN0YXJ0LCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgIGNvbmZpZy5hZGRTbGlkZUNsYXNzRWwuYWRkQ2xhc3MoJ3RvdWNoaW5nJyk7XG5cbiAgICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGRhdGEuYmVnaW5YID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcblxuICAgICAgICAgICAgZGF0YS5iZWdpblggPSAoaXNQb2ludGVyRGF0YSkgPyBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WCA6IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9uQmVnaW4gPT0gJ2Z1bmN0aW9uJykgY29uZmlnLm9uQmVnaW4oZGF0YSk7XG5cbiAgICAgICAgfSkub2ZmKHRvdWNoTW92ZSkub24odG91Y2hNb3ZlLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgIGRhdGEuZGVsdGFYUHJldmlvdXMgPSBkYXRhLmRlbHRhWCB8fCAnbm9uZSc7XG5cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudFggPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICAgICAgZGF0YS5jdXJyZW50WCA9IChpc1BvaW50ZXJEYXRhKSA/IGUub3JpZ2luYWxFdmVudC5jbGllbnRYIDogZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICAgIGRhdGEuZGVsdGFYID0gZGF0YS5jdXJyZW50WCAtIGRhdGEuYmVnaW5YO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5kZWx0YVggPiAyMCB8fCBkYXRhLmRlbHRhWCA8IC0yMCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5kZWx0YVhQcmV2aW91cyA9PSAnbm9uZScpIHtcblxuICAgICAgICAgICAgICAgIGRhdGEuZmlyc3RYRGlyZWN0aW9uID0gKGRhdGEuZGVsdGFYID4gMCkgPyAncmlnaHQnIDogJ2xlZnQnO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgZGF0YS5sYXN0WERpcmVjdGlvbiA9IChkYXRhLmRlbHRhWCA+IGRhdGEuZGVsdGFYUHJldmlvdXMpID8gJ3JpZ2h0JyA6ICdsZWZ0JztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29uZmlnLm9uTW92ZSAmJiBkYXRhLmRlbHRhWCA+IDIwIHx8IGRhdGEuZGVsdGFYIDwgLTIwKSBjb25maWcub25Nb3ZlKGRhdGEpO1xuXG4gICAgICAgICAgICBkYXRhLmRlbHRhUHJldmlvdXMgPSBkYXRhLmRlbHRhWDtcblxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgZGF0YS5jdXJyZW50WCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRYID0gKGlzUG9pbnRlckRhdGEpID8gZS5vcmlnaW5hbEV2ZW50LmNsaWVudFggOiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuXG4gICAgICAgIH0pLm9mZih0b3VjaEVuZCkub24odG91Y2hFbmQsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgY29uZmlnLmFkZFNsaWRlQ2xhc3NFbC5yZW1vdmVDbGFzcygndG91Y2hpbmcnKTtcblxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRW5kID09ICdmdW5jdGlvbicgJiYgXG4gICAgICAgICAgICAgICAgY29uZmlnLnhUcmlnZ2VyVGhyZXNob2xkICYmIFxuICAgICAgICAgICAgICAgIGRhdGEuZGVsdGFYICYmXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGF0YS5kZWx0YVgpID4gY29uZmlnLnhUcmlnZ2VyVGhyZXNob2xkKSB7IFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25maWcub25FbmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH0pO1xufTsiLCJcbiAgICBcblxuICAgIC8vYWRkIHVzZXJhZ2VudCB0byBkYXRhLXVzZXJhZ2VudFxuICAgIHZhciBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgZG9jLnNldEF0dHJpYnV0ZSgnZGF0YS11c2VyYWdlbnQnLCBuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuICAgIFxuXG4gICAgLy9zdmcgcmVsb2FkIGZ1bmN0aW9uXG4gICAgZnVuY3Rpb24gc3ZnUmVsb2FkKCkge1xuXG4gICAgICAgIHZhciBzdmdFbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1c2UnKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN2Z0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdGVtcEhyZWYgPSBzdmdFbGVtZW50c1tpXS5nZXRBdHRyaWJ1dGUoXCJ4bGluazpocmVmXCIpO1xuXG4gICAgICAgICAgICBzdmdFbGVtZW50c1tpXS5zZXRBdHRyaWJ1dGUoXCJ4bGluazpocmVmXCIsIFwiXCIpO1xuICAgICAgICAgICAgc3ZnRWxlbWVudHNbaV0uc2V0QXR0cmlidXRlKFwieGxpbms6aHJlZlwiLCB0ZW1wSHJlZik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTV0lQRSBQTFVHSU4gRk9SIFRPVUNIIERFVklDRVNcblxuICAgICQuZm4uc3dpcGUgPSBmdW5jdGlvbihzZXR0aW5ncykge1xuXG4gICAgICAgIC8vIGRlZmF1bHQgc2V0dGluZ3NcbiAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgIFwiZHJhZ0VsZW1lbnRcIiAgICAgICAgICAgOiBcImhvcml6b250YWxcIixcbiAgICAgICAgICAgIFwiYWRkU2xpZGVDbGFzc0VsXCIgICAgICAgOiBmYWxzZSxcbiAgICAgICAgICAgIFwieFRyaWdnZXJUaHJlc2hvbGRcIiAgICAgOiAzMFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGludGVncmF0ZSBzZXR0aW5ncyBmcm9tIG1ldGhvZCB2YXJpYWJsZVxuICAgICAgICBpZiAoc2V0dGluZ3MpICQuZXh0ZW5kKGNvbmZpZywgc2V0dGluZ3MpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBlbCA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICBpZiAoIWNvbmZpZy5hZGRTbGlkZUNsYXNzRWwpIGNvbmZpZy5hZGRTbGlkZUNsYXNzRWwgPSBlbDtcblxuICAgICAgICAgICAgdmFyIHRvdWNoU3RhcnQgPSAndG91Y2hzdGFydC5zd2lwZSc7XG4gICAgICAgICAgICB2YXIgdG91Y2hNb3ZlID0gJ3RvdWNobW92ZS5zd2lwZSc7XG4gICAgICAgICAgICB2YXIgdG91Y2hFbmQgPSAndG91Y2hlbmQuc3dpcGUnO1xuXG4gICAgICAgICAgICB2YXIgaXNQb2ludGVyRGF0YSA9IGZhbHNlOyAvLyB0cnVlIHdoZW4gaW5zaWRlIHBvaW50ZXIgZXZlbnQgZGF0YVxuXG4gICAgICAgICAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkIHx8IHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBpc1BvaW50ZXJEYXRhID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0b3VjaFN0YXJ0ID0gKCF3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpID8gJ3BvaW50ZXJkb3duLnN3aXBlJyA6ICdNU1BvaW50ZXJEb3duJztcbiAgICAgICAgICAgICAgICB0b3VjaE1vdmUgPSAoIXdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCkgPyAncG9pbnRlcm1vdmUuc3dpcGUnIDogJ01TUG9pbnRlck1vdmUnO1xuICAgICAgICAgICAgICAgIHRvdWNoRW5kID0gKCF3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpID8gJ3BvaW50ZXJ1cC5zd2lwZScgOiAnTVNQb2ludGVyVXAnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbC5vZmYodG91Y2hTdGFydCkub24odG91Y2hTdGFydCwgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgY29uZmlnLmFkZFNsaWRlQ2xhc3NFbC5hZGRDbGFzcygndG91Y2hpbmcnKTtcblxuICAgICAgICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBkYXRhLmJlZ2luWCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG5cbiAgICAgICAgICAgICAgICBkYXRhLmJlZ2luWCA9IChpc1BvaW50ZXJEYXRhKSA/IGUub3JpZ2luYWxFdmVudC5jbGllbnRYIDogZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9uQmVnaW4gPT0gJ2Z1bmN0aW9uJykgY29uZmlnLm9uQmVnaW4oZGF0YSk7XG5cbiAgICAgICAgICAgIH0pLm9mZih0b3VjaE1vdmUpLm9uKHRvdWNoTW92ZSwgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAgICAgZGF0YS5kZWx0YVhQcmV2aW91cyA9IGRhdGEuZGVsdGFYIHx8ICdub25lJztcblxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudFggPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudFggPSAoaXNQb2ludGVyRGF0YSkgPyBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WCA6IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgICAgICAgICAgZGF0YS5kZWx0YVggPSBkYXRhLmN1cnJlbnRYIC0gZGF0YS5iZWdpblg7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5kZWx0YVggPiAyMCB8fCBkYXRhLmRlbHRhWCA8IC0yMCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZGVsdGFYUHJldmlvdXMgPT0gJ25vbmUnKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YS5maXJzdFhEaXJlY3Rpb24gPSAoZGF0YS5kZWx0YVggPiAwKSA/ICdyaWdodCcgOiAnbGVmdCc7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGEubGFzdFhEaXJlY3Rpb24gPSAoZGF0YS5kZWx0YVggPiBkYXRhLmRlbHRhWFByZXZpb3VzKSA/ICdyaWdodCcgOiAnbGVmdCc7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLm9uTW92ZSAmJiBkYXRhLmRlbHRhWCA+IDIwIHx8IGRhdGEuZGVsdGFYIDwgLTIwKSBjb25maWcub25Nb3ZlKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgZGF0YS5kZWx0YVByZXZpb3VzID0gZGF0YS5kZWx0YVg7XG5cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBkYXRhLmN1cnJlbnRYID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICAgICAgICBkYXRhLmN1cnJlbnRYID0gKGlzUG9pbnRlckRhdGEpID8gZS5vcmlnaW5hbEV2ZW50LmNsaWVudFggOiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuXG4gICAgICAgICAgICB9KS5vZmYodG91Y2hFbmQpLm9uKHRvdWNoRW5kLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgICAgICBjb25maWcuYWRkU2xpZGVDbGFzc0VsLnJlbW92ZUNsYXNzKCd0b3VjaGluZycpO1xuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcub25FbmQgPT0gJ2Z1bmN0aW9uJyAmJiBcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnhUcmlnZ2VyVGhyZXNob2xkICYmIFxuICAgICAgICAgICAgICAgICAgICBkYXRhLmRlbHRhWCAmJlxuICAgICAgICAgICAgICAgICAgICBNYXRoLmFicyhkYXRhLmRlbHRhWCkgPiBjb25maWcueFRyaWdnZXJUaHJlc2hvbGQpIHsgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLm9uRW5kKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvL2N1c3RvbSBldmVudCByZWxvYWRTVkdcbiAgICAkKHdpbmRvdykub2ZmKCdyZWxvYWRTVkcnKS5vbigncmVsb2FkU1ZHJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHN2Z1JlbG9hZCgpO1xuICAgIH0pO1xuXG4gICAgJCh3aW5kb3cpLm9mZignb25CcmVha3BvaW50Q2hhbmdlJykub24oJ29uQnJlYWtwb2ludENoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHdpbmRvdykudHJpZ2dlcihcInJlbG9hZFNWR1wiKTtcbiAgICB9KTtcblxuICAgIFxuICAgIC8vIG9uIERPTSByZWFkeSBsb2dpY1xuICAgICQoZnVuY3Rpb24oKXtcblxuICAgICAgICAvLyBsb2dpYyBmb3IgbWltaWNpbmcgYSBsaW5rIGNsaWNrXG4gICAgICAgICQoJ1tkYXRhLWhyZWZdJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBlbERhdGEgPSAkKHRoaXMpLmRhdGEoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGVsRGF0YS5ocmVmTmV3dGFiKSB3aW5kb3cub3BlbihlbERhdGEuaHJlZiwgJ19ibGFuaycpOyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxzZSB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGVsRGF0YS5ocmVmO1xuICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBkeW5hbGljYWxseSBhZGQgdGVsZXBob25lIGxpbmsgdG8gdGhlIGNvbnRhY3QgdXMgYnV0dG9uXG4gICAgICAgICQoJy5tb2JpbGUtdGVsLWxpbmsnKS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gY2FjaGUgZWxlbWVudHNcbiAgICAgICAgICAgIHZhciBlbCAgICAgICAgICAgICAgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGhpZGRlblRlbExpbmsgICA9IGVsLm5leHQoJy5tb2JpbGUtdGVsLWhvbGRlcicpLmNoaWxkcmVuKCdhJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGhyZWYgaWYgdGhlIHBob25lIGJyb3dzZXIgbWFkZSB0aGUgbnVtYmVyIGludG8gYSBwaG9uZSBsaW5rXG4gICAgICAgICAgICBpZiAoaGlkZGVuVGVsTGluay5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBlbC5hdHRyKCdocmVmJywgaGlkZGVuVGVsTGluay5hdHRyKCdocmVmJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuICAgICAgICAvL3BvbHlmaWxsIHRoZSBmbGV4Ym94XG4gICAgICAgIGlmICghTW9kZXJuaXpyLmZsZXhib3gpIHtcbiAgICAgICAgICAgICQoJy5lcXVhbC1oZWlnaHRzJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGMudXRpbGl0aWVzLmdldFNldFRhbGxlc3QoJCh0aGlzKS5jaGlsZHJlbignW2NsYXNzKj1cImdyaWQtXCJdJykuaGVpZ2h0KCdhdXRvJyksIHRydWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSk7IiwiKGZ1bmN0aW9uKHdpbmRvdywgalF1ZXJ5LCBBbmd1bGFyKXtcblxuICAgIC8vIGNvbmZpZ3VyZSB0aGUgdGhyb3R0bGVyIGJ5IHNldHRpbmcgdGhlIGFtb3VudCBvZiBkZWxheSBmb3JjZWQgYmV0d2VlbiBzY3JvbGxzXG4gICAgdmFyIGRlbGF5VGltZSA9IDQwO1xuXG4gICAgLy8gZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIHNjcm9sbCBldmVudCBmaXJlc1xuICAgIHZhciBzY3JvbGxUaHJvdHRsZXIgPSBmdW5jdGlvbigpeyBcblxuICAgIC8vIHRyaWdnZXIgY3VzdG9tIGFjdGlvblxuICAgIGZpcmVTY3JvbGwoKTtcblxuICAgIC8vIHJlbW92ZSB0aGUgc2Nyb2xsIGV2ZW50XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbFRocm90dGxlciwgZmFsc2UpOyAgXG5cbiAgICAgICAgLy8gcmVpbml0aWFsaXplIHRoZSBzY3JvbGwgZXZlbnQgYWZ0ZXIgXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGFkZCBsaXN0ZW5lciBhZnRlciB0aW1lb3V0IGlzIGNvbXBsZXRlXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2Nyb2xsVGhyb3R0bGVyLCBmYWxzZSk7XG5cbiAgICAgICAgfSwgZGVsYXlUaW1lKTtcbiAgICB9O1xuICAgXG4gICAgLy8gZmlyZXMgY3VzdG9tIHRocm90dGxlZCBzY3JvbGwgZXZlbnQgdG8galF1ZXJ5IGFuZCBBbmd1bGFyIGlmIG5lZWRlZCwgcGFzc2luZyB0aGUgc2Nyb2xsVG9wIGluZm9ybWF0aW9uXG4gICAgZnVuY3Rpb24gZmlyZVNjcm9sbCgpe1xuXG4gICAgICAgIC8vIGdldCBhbW91bnQgc2Nyb2xsZWQgZnJvbSB0aGUgdG9wIG9kIHRoZSBicm93c2VyIHdpbmRvd1xuICAgICAgICB2YXIgc2Nyb2xsVG9wID0gKHdpbmRvdy5wYWdlWU9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IHdpbmRvdy5wYWdlWU9mZnNldCA6IChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlIHx8IGRvY3VtZW50LmJvZHkpLnNjcm9sbFRvcDtcblxuICAgICAgICAvLyB0cmlnZ2VyIGV2ZW50IGZvciBqUXVlcnlcbiAgICAgICAgaWYgKHdpbmRvdy5qUXVlcnkpICQod2luZG93KS50cmlnZ2VyKCd0aHJvdHRsZWRTY3JvbGwnLCBzY3JvbGxUb3ApO1xuICAgICAgICBcbiAgICAgICAgLy8gYnJvYWRjYXN0IGV2ZW50IGZvciBBbmd1bGFyXG4gICAgICAgIC8vaWYgKHdpbmRvdy5Bbmd1bGFyKSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnNjb3BlKCkuJGJyb2FkY2FzdCgndGhyb3R0bGVkU2Nyb2xsJywgc2Nyb2xsVG9wKTtcblxuICAgIH1cblxuICAgIC8vIGJlZ2luIGxpc3RlbmluZyB0byBzY3JvbGwgYmVoYXZpb3JcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgc2Nyb2xsVGhyb3R0bGVyLCBmYWxzZSk7XG5cblxufSkod2luZG93LCBqUXVlcnksIHdpbmRvdy5Bbmd1bGFyIHx8IHVuZGVmaW5lZCk7XG5cblxuXG4iLCJkYy51dGlsaXRpZXMgPSB7XG5cbiAgICAvLyByZWNlaXZlIGEgc3RyaW5nIGFuZCBjb252ZXJ0IGl0IHRvIGEgalF1ZXJ5IG9iamVjdC4gaWYgJ3NlbGVjdG9yJyBpcyBhbHJlYWR5IGEgalF1ZXJ5IERPTSBvYmplY3QsIGl0IGlzIHNpbXBseSBwYXNzZWQgdGhyb3VnaCBcbiAgICByZXR1cm5TdHJpbmdBc0pxT2JqZWN0IDogZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBzZWxlY3RvciA9PSAnc3RyaW5nJykgPyAkKHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuICAgIH0sXG5cbiAgICAvLyBjaGVjayBpZiBlbGVtZW50IGV4aXN0cyBvbiBwYWdlLiBpZiBzbywgcnVuIGNhbGxiYWNrIGZ1bmN0aW9uIHdpdGggZWxlbWVudCBwYXNzZWQgdGhyb3VnaFxuICAgICAgICAvLyBzZWxlY3RvciA6IGpRdWVyeSBzdHJpbmcgc2VsZWN0b3Igb3IgalF1ZXJ5IGRvbSBvYmplY3RcbiAgICAgICAgLy8gY2FsbGJhY2sgOiBmdW5jdGlvbiBjYWxsZWQgd2l0aCB0aGUganF1ZXJ5IG9iamVjdCBwYXNzZWQgdGhyb3VnaFxuICAgIHJ1bklmRWxMZW5ndGggOiBmdW5jdGlvbihzZWxlY3RvciwgY2FsbGJhY2spe1xuICAgICAgICB2YXIgX2VsID0gZGMudXRpbGl0aWVzLnJldHVyblN0cmluZ0FzSnFPYmplY3Qoc2VsZWN0b3IpO1xuICAgICAgICBpZiAoX2VsLmxlbmd0aCkgY2FsbGJhY2soX2VsKTtcbiAgICB9LFxuXG4gICAgLy8gY29tcGFyZSBoZWlnaHRzIG9mIGFsbCBlbGVtZW50cyBhbmQgcmV0dXJuIGVpdGhlciBhbiBpbnRlcmdlciBvciB0aGUgb2JqZWN0IHRoYXQgaXMgdGhlIHRhbGxlc3QuXG4gICAgICAgIC8vIHNlbGVjdG9yICAgICA6IGpRdWVyeSBzdHJpbmcgc2VsZWN0b3Igb3IgalF1ZXJ5IGRvbSBvYmplY3RcbiAgICAgICAgLy8gcmV0dXJuVHlwZSAgIDogc3RyaW5nIC0gJ251bScgb3IgJ29iaidcbiAgICAgICAgLy8gc2V0SGVpZ2h0cyAgIDogYm9vbGVhbiAtIGluZGljYXRlZCB3aGV0aGVyIG9yIG5vdCB0byBzZXQgdGhlIG9iamVjdHMgdG8gYmUgdGhlIHNhbWUgaGVpZ2h0XG4gICAgZ2V0U2V0VGFsbGVzdCA6IGZ1bmN0aW9uKHNlbGVjdG9yLCBzZXRIZWlnaHRzKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfZWwgICAgICAgICA9IGRjLnV0aWxpdGllcy5yZXR1cm5TdHJpbmdBc0pxT2JqZWN0KHNlbGVjdG9yKSxcbiAgICAgICAgICAgIHRhbGxlc3QgICAgID0gMDtcbiAgICAgICAgXG4gICAgICAgIF9lbC5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBuZXdIZWlnaHQgPSAkKHRoaXMpLmhlaWdodCgpO1xuICAgICAgICAgICAgaWYgKHRhbGxlc3QgPCBuZXdIZWlnaHQpIHRhbGxlc3QgPSBuZXdIZWlnaHQ7XG5cbiAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKHNldEhlaWdodHMpIF9lbC5oZWlnaHQodGFsbGVzdCk7XG5cbiAgICAgICAgcmV0dXJuIHRhbGxlc3Q7XG5cbiAgICB9XG59OyIsImRjLm1vZHVsZU1ldGhvZC50ZXN0TWV0aG9kID0gZnVuY3Rpb24ob3B0aW9ucyl7XG5cbiAgICBjb25zb2xlLmxvZygndGhpcyBpYSBhIHRlc3QnKTtcbiAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbn07IiwiLy8gbG9vcCB0aHJvdWdoIHRoZSBkYy5tb2R1bGVNZXRob2RMb2FkIG9iamVjdCB0byBsb2FkIG1vZHVsZS1zcGVjaWZpYyBsb2dpY1xuIGlmIChkYy5tb2R1bGVNZXRob2RMb2FkLmxlbmd0aCkge1xuXG4gXHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGMubW9kdWxlTWV0aG9kTG9hZC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gXHRcdHZhciBuYW1lIFx0PSBkYy5tb2R1bGVNZXRob2RMb2FkW2ldLm5hbWUsXG4gXHRcdFx0b3B0aW9uc1x0PSBkYy5tb2R1bGVNZXRob2RMb2FkW2ldLm9wdGlvbnMgfHwgdW5kZWZpbmVkO1xuXG4gXHRcdGRjLm1vZHVsZU1ldGhvZFtuYW1lXShvcHRpb25zKTtcblxuIFx0fVxuIH0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=