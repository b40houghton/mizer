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