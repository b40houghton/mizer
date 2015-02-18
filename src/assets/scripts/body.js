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




//svg reload function
function svgReload() {

    var svgElements = document.getElementsByTagName('use');

    for (var i = 0; i < svgElements.length; i++) {
        var tempHref = svgElements[i].getAttribute("xlink:href");

        svgElements[i].setAttribute("xlink:href", "");
        svgElements[i].setAttribute("xlink:href", tempHref);
    }
}

//custom event reloadSVG
$(window).off('reloadSVG').on('reloadSVG', function() {
    svgReload();
});

$(window).off('onBreakpointChange').on('onBreakpointChange', function() {
    $(window).trigger("reloadSVG");
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
dc.moduleMethod.testMethod = function(options){

    console.log('this ia a test');
    console.log(options);
};
dc.moduleMethod.dynamicLoad = function(options){

	(function(options){
    	
    	Modernizr.load([
  	  		{
	    		load : options.files,
	    		complete : function () {
	      			// Run this after everything in this group has downloaded
	      			// and executed, as well everything in all previous groups
	      			dc.appMethod[options.name](options);
	    		}
	  		}
		]);

    })(options);
};

// add useragent to data-useragent
var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);


// loop through the dc.moduleMethodLoad object to load module-specific logic
 if (dc.moduleMethodLoad.length) {

 	for (var i = 0, len = dc.moduleMethodLoad.length; i < len; i++) {

 		(function(dc){
 			
 			var name 	= dc.moduleMethodLoad[i].name,
 			options	= dc.moduleMethodLoad[i].options || undefined;

 			dc.moduleMethod[name](options);

 		})(dc)----;

 	}
 }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxLXN3aXBlLmpzIiwib25yZWFkeS5qcyIsInNjcm9sbC5qcyIsInN2Zy1yZWxvYWQuanMiLCJ1dGlsaXRpZXMuanMiLCJfdGVzdE1ldGhvZC5qcyIsImR5bmFtaWMtbG9hZC5qcyIsImluaXRpYWxpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJib2R5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU1dJUEUgUExVR0lOIEZPUiBUT1VDSCBERVZJQ0VTXG4kLmZuLnN3aXBlID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcblxuICAgIC8vIGRlZmF1bHQgc2V0dGluZ3NcbiAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICBcImRyYWdFbGVtZW50XCIgICAgICAgICAgIDogXCJob3Jpem9udGFsXCIsXG4gICAgICAgIFwiYWRkU2xpZGVDbGFzc0VsXCIgICAgICAgOiBmYWxzZSxcbiAgICAgICAgXCJ4VHJpZ2dlclRocmVzaG9sZFwiICAgICA6IDMwXG4gICAgfTtcblxuICAgIC8vIGludGVncmF0ZSBzZXR0aW5ncyBmcm9tIG1ldGhvZCB2YXJpYWJsZVxuICAgIGlmIChzZXR0aW5ncykgJC5leHRlbmQoY29uZmlnLCBzZXR0aW5ncyk7XG5cbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBlbCA9ICQodGhpcyk7XG4gICAgICAgIHZhciBkYXRhID0ge307XG5cbiAgICAgICAgaWYgKCFjb25maWcuYWRkU2xpZGVDbGFzc0VsKSBjb25maWcuYWRkU2xpZGVDbGFzc0VsID0gZWw7XG5cbiAgICAgICAgdmFyIHRvdWNoU3RhcnQgPSAndG91Y2hzdGFydC5zd2lwZSc7XG4gICAgICAgIHZhciB0b3VjaE1vdmUgPSAndG91Y2htb3ZlLnN3aXBlJztcbiAgICAgICAgdmFyIHRvdWNoRW5kID0gJ3RvdWNoZW5kLnN3aXBlJztcblxuICAgICAgICB2YXIgaXNQb2ludGVyRGF0YSA9IGZhbHNlOyAvLyB0cnVlIHdoZW4gaW5zaWRlIHBvaW50ZXIgZXZlbnQgZGF0YVxuXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgfHwgd2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCkge1xuICAgICAgICAgICAgaXNQb2ludGVyRGF0YSA9IHRydWU7XG4gICAgICAgICAgICB0b3VjaFN0YXJ0ID0gKCF3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpID8gJ3BvaW50ZXJkb3duLnN3aXBlJyA6ICdNU1BvaW50ZXJEb3duJztcbiAgICAgICAgICAgIHRvdWNoTW92ZSA9ICghd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSA/ICdwb2ludGVybW92ZS5zd2lwZScgOiAnTVNQb2ludGVyTW92ZSc7XG4gICAgICAgICAgICB0b3VjaEVuZCA9ICghd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkKSA/ICdwb2ludGVydXAuc3dpcGUnIDogJ01TUG9pbnRlclVwJztcbiAgICAgICAgfVxuXG4gICAgICAgIGVsLm9mZih0b3VjaFN0YXJ0KS5vbih0b3VjaFN0YXJ0LCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgIGNvbmZpZy5hZGRTbGlkZUNsYXNzRWwuYWRkQ2xhc3MoJ3RvdWNoaW5nJyk7XG5cbiAgICAgICAgICAgIGRhdGEgPSB7fTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGRhdGEuYmVnaW5YID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcblxuICAgICAgICAgICAgZGF0YS5iZWdpblggPSAoaXNQb2ludGVyRGF0YSkgPyBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WCA6IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9uQmVnaW4gPT0gJ2Z1bmN0aW9uJykgY29uZmlnLm9uQmVnaW4oZGF0YSk7XG5cbiAgICAgICAgfSkub2ZmKHRvdWNoTW92ZSkub24odG91Y2hNb3ZlLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgIGRhdGEuZGVsdGFYUHJldmlvdXMgPSBkYXRhLmRlbHRhWCB8fCAnbm9uZSc7XG5cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIGRhdGEuY3VycmVudFggPSBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICAgICAgZGF0YS5jdXJyZW50WCA9IChpc1BvaW50ZXJEYXRhKSA/IGUub3JpZ2luYWxFdmVudC5jbGllbnRYIDogZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICAgIGRhdGEuZGVsdGFYID0gZGF0YS5jdXJyZW50WCAtIGRhdGEuYmVnaW5YO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5kZWx0YVggPiAyMCB8fCBkYXRhLmRlbHRhWCA8IC0yMCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5kZWx0YVhQcmV2aW91cyA9PSAnbm9uZScpIHtcblxuICAgICAgICAgICAgICAgIGRhdGEuZmlyc3RYRGlyZWN0aW9uID0gKGRhdGEuZGVsdGFYID4gMCkgPyAncmlnaHQnIDogJ2xlZnQnO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgZGF0YS5sYXN0WERpcmVjdGlvbiA9IChkYXRhLmRlbHRhWCA+IGRhdGEuZGVsdGFYUHJldmlvdXMpID8gJ3JpZ2h0JyA6ICdsZWZ0JztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29uZmlnLm9uTW92ZSAmJiBkYXRhLmRlbHRhWCA+IDIwIHx8IGRhdGEuZGVsdGFYIDwgLTIwKSBjb25maWcub25Nb3ZlKGRhdGEpO1xuXG4gICAgICAgICAgICBkYXRhLmRlbHRhUHJldmlvdXMgPSBkYXRhLmRlbHRhWDtcblxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgZGF0YS5jdXJyZW50WCA9IGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgICAgICBkYXRhLmN1cnJlbnRYID0gKGlzUG9pbnRlckRhdGEpID8gZS5vcmlnaW5hbEV2ZW50LmNsaWVudFggOiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuXG4gICAgICAgIH0pLm9mZih0b3VjaEVuZCkub24odG91Y2hFbmQsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgY29uZmlnLmFkZFNsaWRlQ2xhc3NFbC5yZW1vdmVDbGFzcygndG91Y2hpbmcnKTtcblxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm9uRW5kID09ICdmdW5jdGlvbicgJiYgXG4gICAgICAgICAgICAgICAgY29uZmlnLnhUcmlnZ2VyVGhyZXNob2xkICYmIFxuICAgICAgICAgICAgICAgIGRhdGEuZGVsdGFYICYmXG4gICAgICAgICAgICAgICAgTWF0aC5hYnMoZGF0YS5kZWx0YVgpID4gY29uZmlnLnhUcmlnZ2VyVGhyZXNob2xkKSB7IFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBjb25maWcub25FbmQoZGF0YSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuICAgIH0pO1xufTsiLCJcbiAgICAvLyBvbiBET00gcmVhZHkgbG9naWNcbiAgICAkKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy8gbG9naWMgZm9yIG1pbWljaW5nIGEgbGluayBjbGlja1xuICAgICAgICAkKCdbZGF0YS1ocmVmXScpLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZWxEYXRhID0gJCh0aGlzKS5kYXRhKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChlbERhdGEuaHJlZk5ld3RhYikgd2luZG93Lm9wZW4oZWxEYXRhLmhyZWYsICdfYmxhbmsnKTsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGVsc2Ugd2luZG93LmxvY2F0aW9uLmhyZWYgPSBlbERhdGEuaHJlZjtcbiAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gZHluYWxpY2FsbHkgYWRkIHRlbGVwaG9uZSBsaW5rIHRvIHRoZSBjb250YWN0IHVzIGJ1dHRvblxuICAgICAgICAkKCcubW9iaWxlLXRlbC1saW5rJykuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGNhY2hlIGVsZW1lbnRzXG4gICAgICAgICAgICB2YXIgZWwgICAgICAgICAgICAgID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBoaWRkZW5UZWxMaW5rICAgPSBlbC5uZXh0KCcubW9iaWxlLXRlbC1ob2xkZXInKS5jaGlsZHJlbignYScpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyByZXBsYWNlIHRoZSBocmVmIGlmIHRoZSBwaG9uZSBicm93c2VyIG1hZGUgdGhlIG51bWJlciBpbnRvIGEgcGhvbmUgbGlua1xuICAgICAgICAgICAgaWYgKGhpZGRlblRlbExpbmsubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZWwuYXR0cignaHJlZicsIGhpZGRlblRlbExpbmsuYXR0cignaHJlZicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9wb2x5ZmlsbCB0aGUgZmxleGJveFxuICAgICAgICBpZiAoIU1vZGVybml6ci5mbGV4Ym94KSB7XG4gICAgICAgICAgICAkKCcuZXF1YWwtaGVpZ2h0cycpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRjLnV0aWxpdGllcy5nZXRTZXRUYWxsZXN0KCQodGhpcykuY2hpbGRyZW4oJ1tjbGFzcyo9XCJncmlkLVwiXScpLmhlaWdodCgnYXV0bycpLCB0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0pOyIsIihmdW5jdGlvbih3aW5kb3csIGpRdWVyeSwgQW5ndWxhcil7XG5cbiAgICAvLyBjb25maWd1cmUgdGhlIHRocm90dGxlciBieSBzZXR0aW5nIHRoZSBhbW91bnQgb2YgZGVsYXkgZm9yY2VkIGJldHdlZW4gc2Nyb2xsc1xuICAgIHZhciBkZWxheVRpbWUgPSA0MDtcblxuICAgIC8vIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBzY3JvbGwgZXZlbnQgZmlyZXNcbiAgICB2YXIgc2Nyb2xsVGhyb3R0bGVyID0gZnVuY3Rpb24oKXsgXG5cbiAgICAvLyB0cmlnZ2VyIGN1c3RvbSBhY3Rpb25cbiAgICBmaXJlU2Nyb2xsKCk7XG5cbiAgICAvLyByZW1vdmUgdGhlIHNjcm9sbCBldmVudFxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxUaHJvdHRsZXIsIGZhbHNlKTsgIFxuXG4gICAgICAgIC8vIHJlaW5pdGlhbGl6ZSB0aGUgc2Nyb2xsIGV2ZW50IGFmdGVyIFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBhZGQgbGlzdGVuZXIgYWZ0ZXIgdGltZW91dCBpcyBjb21wbGV0ZVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbFRocm90dGxlciwgZmFsc2UpO1xuXG4gICAgICAgIH0sIGRlbGF5VGltZSk7XG4gICAgfTtcbiAgIFxuICAgIC8vIGZpcmVzIGN1c3RvbSB0aHJvdHRsZWQgc2Nyb2xsIGV2ZW50IHRvIGpRdWVyeSBhbmQgQW5ndWxhciBpZiBuZWVkZWQsIHBhc3NpbmcgdGhlIHNjcm9sbFRvcCBpbmZvcm1hdGlvblxuICAgIGZ1bmN0aW9uIGZpcmVTY3JvbGwoKXtcblxuICAgICAgICAvLyBnZXQgYW1vdW50IHNjcm9sbGVkIGZyb20gdGhlIHRvcCBvZCB0aGUgYnJvd3NlciB3aW5kb3dcbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICh3aW5kb3cucGFnZVlPZmZzZXQgIT09IHVuZGVmaW5lZCkgPyB3aW5kb3cucGFnZVlPZmZzZXQgOiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZSB8fCBkb2N1bWVudC5ib2R5KS5zY3JvbGxUb3A7XG5cbiAgICAgICAgLy8gdHJpZ2dlciBldmVudCBmb3IgalF1ZXJ5XG4gICAgICAgIGlmICh3aW5kb3cualF1ZXJ5KSAkKHdpbmRvdykudHJpZ2dlcigndGhyb3R0bGVkU2Nyb2xsJywgc2Nyb2xsVG9wKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGJyb2FkY2FzdCBldmVudCBmb3IgQW5ndWxhclxuICAgICAgICAvL2lmICh3aW5kb3cuQW5ndWxhcikgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5zY29wZSgpLiRicm9hZGNhc3QoJ3Rocm90dGxlZFNjcm9sbCcsIHNjcm9sbFRvcCk7XG5cbiAgICB9XG5cbiAgICAvLyBiZWdpbiBsaXN0ZW5pbmcgdG8gc2Nyb2xsIGJlaGF2aW9yXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbFRocm90dGxlciwgZmFsc2UpO1xuXG5cbn0pKHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuQW5ndWxhciB8fCB1bmRlZmluZWQpO1xuXG5cblxuIiwiLy9zdmcgcmVsb2FkIGZ1bmN0aW9uXG5mdW5jdGlvbiBzdmdSZWxvYWQoKSB7XG5cbiAgICB2YXIgc3ZnRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndXNlJyk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN2Z0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0ZW1wSHJlZiA9IHN2Z0VsZW1lbnRzW2ldLmdldEF0dHJpYnV0ZShcInhsaW5rOmhyZWZcIik7XG5cbiAgICAgICAgc3ZnRWxlbWVudHNbaV0uc2V0QXR0cmlidXRlKFwieGxpbms6aHJlZlwiLCBcIlwiKTtcbiAgICAgICAgc3ZnRWxlbWVudHNbaV0uc2V0QXR0cmlidXRlKFwieGxpbms6aHJlZlwiLCB0ZW1wSHJlZik7XG4gICAgfVxufVxuXG4vL2N1c3RvbSBldmVudCByZWxvYWRTVkdcbiQod2luZG93KS5vZmYoJ3JlbG9hZFNWRycpLm9uKCdyZWxvYWRTVkcnLCBmdW5jdGlvbigpIHtcbiAgICBzdmdSZWxvYWQoKTtcbn0pO1xuXG4kKHdpbmRvdykub2ZmKCdvbkJyZWFrcG9pbnRDaGFuZ2UnKS5vbignb25CcmVha3BvaW50Q2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgJCh3aW5kb3cpLnRyaWdnZXIoXCJyZWxvYWRTVkdcIik7XG59KTsiLCJkYy51dGlsaXRpZXMgPSB7XG5cbiAgICAvLyByZWNlaXZlIGEgc3RyaW5nIGFuZCBjb252ZXJ0IGl0IHRvIGEgalF1ZXJ5IG9iamVjdC4gaWYgJ3NlbGVjdG9yJyBpcyBhbHJlYWR5IGEgalF1ZXJ5IERPTSBvYmplY3QsIGl0IGlzIHNpbXBseSBwYXNzZWQgdGhyb3VnaCBcbiAgICByZXR1cm5TdHJpbmdBc0pxT2JqZWN0IDogZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBzZWxlY3RvciA9PSAnc3RyaW5nJykgPyAkKHNlbGVjdG9yKSA6IHNlbGVjdG9yO1xuICAgIH0sXG5cbiAgICAvLyBjaGVjayBpZiBlbGVtZW50IGV4aXN0cyBvbiBwYWdlLiBpZiBzbywgcnVuIGNhbGxiYWNrIGZ1bmN0aW9uIHdpdGggZWxlbWVudCBwYXNzZWQgdGhyb3VnaFxuICAgICAgICAvLyBzZWxlY3RvciA6IGpRdWVyeSBzdHJpbmcgc2VsZWN0b3Igb3IgalF1ZXJ5IGRvbSBvYmplY3RcbiAgICAgICAgLy8gY2FsbGJhY2sgOiBmdW5jdGlvbiBjYWxsZWQgd2l0aCB0aGUganF1ZXJ5IG9iamVjdCBwYXNzZWQgdGhyb3VnaFxuICAgIHJ1bklmRWxMZW5ndGggOiBmdW5jdGlvbihzZWxlY3RvciwgY2FsbGJhY2spe1xuICAgICAgICB2YXIgX2VsID0gZGMudXRpbGl0aWVzLnJldHVyblN0cmluZ0FzSnFPYmplY3Qoc2VsZWN0b3IpO1xuICAgICAgICBpZiAoX2VsLmxlbmd0aCkgY2FsbGJhY2soX2VsKTtcbiAgICB9LFxuXG4gICAgLy8gY29tcGFyZSBoZWlnaHRzIG9mIGFsbCBlbGVtZW50cyBhbmQgcmV0dXJuIGVpdGhlciBhbiBpbnRlcmdlciBvciB0aGUgb2JqZWN0IHRoYXQgaXMgdGhlIHRhbGxlc3QuXG4gICAgICAgIC8vIHNlbGVjdG9yICAgICA6IGpRdWVyeSBzdHJpbmcgc2VsZWN0b3Igb3IgalF1ZXJ5IGRvbSBvYmplY3RcbiAgICAgICAgLy8gcmV0dXJuVHlwZSAgIDogc3RyaW5nIC0gJ251bScgb3IgJ29iaidcbiAgICAgICAgLy8gc2V0SGVpZ2h0cyAgIDogYm9vbGVhbiAtIGluZGljYXRlZCB3aGV0aGVyIG9yIG5vdCB0byBzZXQgdGhlIG9iamVjdHMgdG8gYmUgdGhlIHNhbWUgaGVpZ2h0XG4gICAgZ2V0U2V0VGFsbGVzdCA6IGZ1bmN0aW9uKHNlbGVjdG9yLCBzZXRIZWlnaHRzKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfZWwgICAgICAgICA9IGRjLnV0aWxpdGllcy5yZXR1cm5TdHJpbmdBc0pxT2JqZWN0KHNlbGVjdG9yKSxcbiAgICAgICAgICAgIHRhbGxlc3QgICAgID0gMDtcbiAgICAgICAgXG4gICAgICAgIF9lbC5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBuZXdIZWlnaHQgPSAkKHRoaXMpLmhlaWdodCgpO1xuICAgICAgICAgICAgaWYgKHRhbGxlc3QgPCBuZXdIZWlnaHQpIHRhbGxlc3QgPSBuZXdIZWlnaHQ7XG5cbiAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgKHNldEhlaWdodHMpIF9lbC5oZWlnaHQodGFsbGVzdCk7XG5cbiAgICAgICAgcmV0dXJuIHRhbGxlc3Q7XG5cbiAgICB9XG59OyIsImRjLm1vZHVsZU1ldGhvZC50ZXN0TWV0aG9kID0gZnVuY3Rpb24ob3B0aW9ucyl7XG5cbiAgICBjb25zb2xlLmxvZygndGhpcyBpYSBhIHRlc3QnKTtcbiAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbn07IiwiZGMubW9kdWxlTWV0aG9kLmR5bmFtaWNMb2FkID0gZnVuY3Rpb24ob3B0aW9ucyl7XG5cblx0KGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIFx0XG4gICAgXHRNb2Rlcm5penIubG9hZChbXG4gIFx0ICBcdFx0e1xuXHQgICAgXHRcdGxvYWQgOiBvcHRpb25zLmZpbGVzLFxuXHQgICAgXHRcdGNvbXBsZXRlIDogZnVuY3Rpb24gKCkge1xuXHQgICAgICBcdFx0XHQvLyBSdW4gdGhpcyBhZnRlciBldmVyeXRoaW5nIGluIHRoaXMgZ3JvdXAgaGFzIGRvd25sb2FkZWRcblx0ICAgICAgXHRcdFx0Ly8gYW5kIGV4ZWN1dGVkLCBhcyB3ZWxsIGV2ZXJ5dGhpbmcgaW4gYWxsIHByZXZpb3VzIGdyb3Vwc1xuXHQgICAgICBcdFx0XHRkYy5hcHBNZXRob2Rbb3B0aW9ucy5uYW1lXShvcHRpb25zKTtcblx0ICAgIFx0XHR9XG5cdCAgXHRcdH1cblx0XHRdKTtcblxuICAgIH0pKG9wdGlvbnMpO1xufTsiLCJcbi8vIGFkZCB1c2VyYWdlbnQgdG8gZGF0YS11c2VyYWdlbnRcbnZhciBkb2MgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5kb2Muc2V0QXR0cmlidXRlKCdkYXRhLXVzZXJhZ2VudCcsIG5hdmlnYXRvci51c2VyQWdlbnQpO1xuXG5cbi8vIGxvb3AgdGhyb3VnaCB0aGUgZGMubW9kdWxlTWV0aG9kTG9hZCBvYmplY3QgdG8gbG9hZCBtb2R1bGUtc3BlY2lmaWMgbG9naWNcbiBpZiAoZGMubW9kdWxlTWV0aG9kTG9hZC5sZW5ndGgpIHtcblxuIFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRjLm1vZHVsZU1ldGhvZExvYWQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuIFx0XHQoZnVuY3Rpb24oZGMpe1xuIFx0XHRcdFxuIFx0XHRcdHZhciBuYW1lIFx0PSBkYy5tb2R1bGVNZXRob2RMb2FkW2ldLm5hbWUsXG4gXHRcdFx0b3B0aW9uc1x0PSBkYy5tb2R1bGVNZXRob2RMb2FkW2ldLm9wdGlvbnMgfHwgdW5kZWZpbmVkO1xuXG4gXHRcdFx0ZGMubW9kdWxlTWV0aG9kW25hbWVdKG9wdGlvbnMpO1xuXG4gXHRcdH0pKGRjKS0tLS07XG5cbiBcdH1cbiB9Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9