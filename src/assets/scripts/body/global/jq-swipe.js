// Usage:
// [jq element].swipe({
//     addSlideClassEl: [name of element], // figure out what this does
//     onBegin: function(data) {
//
//         [all the thing to do when touch begins]
//
//     },
//     onMove: function(data) {
//        
//         [all the things to do while touch is moving]
//
//     },
//     onEnd: function(data) {
//
//         [all the things to do while touch ends]
//     }
// });


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