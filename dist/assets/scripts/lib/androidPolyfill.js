require(['jquery', 'vendor/modernizr'], function($){

	var $ 		= jQuery,
		svgList = document.getElementsByTagName('use');

	// alert(svgList[0].getAttribute("xlink:href"));

	for(var i = 0; i < svgElements.length; i++){
		var tempHref = svgElements[i].getAttribute("xlink:href");
		
		svgElements[i].setAttribute("xlink:href", "");
		svgElements[i].setAttribute("xlink:href", tempHref);
	}

	//
	//if svg is supported, swap to use an svg, otherwise swap a png.
	//


});