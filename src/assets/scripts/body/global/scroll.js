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



