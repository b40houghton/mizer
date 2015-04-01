// set breakpoints
mzr.breakpoints = {
    "small"     : 767,
    "medium"    :1024,
    "large"     :1280,
    "large"     :1919,
    "xlarge"    :1920,
}

// listen for window resize
window.addEventListener('resize', function(event){
    
    var oldDisplayMode = mzr.breakpoints.current || '',
        nowWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    mzr.breakpoints.current = getCurrentBreakpoint(); 

    if (mzr.breakpoints.current != oldDisplayMode) { 

        // trigger event for jQuery
        if (window.jQuery) $(window).trigger('breakpointChange', mzr.breakpoints.current);
        
        // broadcast event for Angular
        //if (window.Angular) angular.element(document).scope().$broadcast('breakpointChange', mzr.breakpoints.current);
    }

    function getCurrentBreakpoint(){
        var latest;

        for (key in mzr.breakpoints) {
            if (key == "current") break;
            if (nowWindowWidth <= mzr.breakpoints[key]) return key;
            latest = key; 
        }

        return latest;
    }

});