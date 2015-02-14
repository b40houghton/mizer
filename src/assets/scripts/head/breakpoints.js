var dc = window.dc || {};

// set breakpoints
dc.breakpoints = {
    "small": 767,
    "medium":1024,
    "large":1280,
    "large":1919,
    "xlarge":1920,
    "current":"large"
}

// listen for window resize
window.addEventListener('resize', function(event){
    
    var oldDisplayMode = dc.breakpoints.current || '',
        nowWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    dc.breakpoints.current = getCurrentBreakpoint(); 

    if (dc.breakpoints.current != oldDisplayMode) { 

        // trigger event for jQuery
        if (window.jQuery) $(window).trigger('breakpointChange', dc.breakpoints.current);
        
        // broadcast event for Angular
        //if (window.Angular) $rootScope.$broadcast('breakpointChange', dc.breakpoints.current);
    
    }

    function getCurrentBreakpoint(){
        var latest;

        for (key in dc.breakpoints) {
            if (key == "current") break;
            if (nowWindowWidth <= dc.breakpoints[key]) return key;
            latest = key; 
        }

        return latest;
    }

});