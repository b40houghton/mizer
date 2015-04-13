/*global window,Modernizr,mzr */

// set breakpoints
mzr.breakpoints = {
  "small": 767,
  "medium": 1024,
  "large": 1280,
  "xlarge": 1919,
  "xxlarge": 1920,
};

var oldDisplayMode = mzr.breakpoints.current || '',
  nowWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

function getCurrentBreakpoint() {
  var latest;
  var key;

  for (key in mzr.breakpoints) {
    if (mzr.breakpoints.hasOwnProperty(key)) {
      if (key === "current") { break; }
      if (nowWindowWidth <= mzr.breakpoints[key]) { return key; }
      latest = key;
    }
  }

  return latest;
}

mzr.breakpoints.current = getCurrentBreakpoint();

if (mzr.breakpoints.current !== oldDisplayMode) {

  // trigger event for jQuery
  if (window.jQuery) { $(window).trigger('breakpointChange', mzr.breakpoints.current); }

  // broadcast event for Angular
  //if (window.Angular) angular.element(document).scope().$broadcast('breakpointChange', mzr.breakpoints.current);
}

//on dom load, set current breakpointgit 
document.addEventListener("DOMContentLoaded", function () {
  getCurrentBreakpoint();
});

// listen for window resize
window.addEventListener('resize', function () {
  getCurrentBreakpoint();
});