define(["jquery", "main"], function($) {
        
    var $ = jQuery;

    var dc = window.dc || '';

    function getWindowWidth(){
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    function breakpointControl(){

        var oldDisplayMode = dc.breakpoints.current || '';

        var nowWindowWidth = getWindowWidth();

        if (nowWindowWidth <= dc.breakpoints.mobile) displayMode = dc.breakpoints.current = 'mobile';
        else if (nowWindowWidth <= dc.breakpoints.tablet) displayMode = dc.breakpoints.current = 'tablet';
        else if (nowWindowWidth > 1024) displayMode = dc.breakpoints.current = 'desktop';
        else dc.breakpoints.current = dc.breakpoints.tablet;    

        document.documentElement.id = dc.breakpoints.current;
        if (dc.breakpoints.current !== undefined && dc.breakpoints.current != oldDisplayMode) $(window).trigger('breakpointChange', dc.breakpoints.current);
    }

    
    
    breakpointControl();

    $(window).off('resize.breakpoints').on('resize.breakpoints', function(){

        breakpointControl();

    });

    


}); 