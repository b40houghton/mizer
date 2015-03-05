/**
 * [slider description]
 * @param  {[object]} - taken from dc.moduleMethodLoad.push(..) in the module, or page
 * @return NA
 */
dc.moduleMethod.slider = function(options){

	/**
	 * slider constructor function
	 * @param  {[object]} - taken from dc.moduleMethodLoad.push(..) in the module, or page
	 * @return NA - called with "new slider(options)";
	 */
    function slider(options){

    	this.browserTransitionEvents 	= 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'; // collection of all the browser specific CSS transition conplete events
    	this.id 						= options.id; // unique id value of the slider element
    	this.el 						= $('#' + this.id); // get the slidepane element by id
    	this.slideEls 					= this.el.children(); // get the slides elements
    	this.slideElsLength 			= this.slideEls.length; // get the slides elements
		this.options					= $.extend({

			continuousLoop				: false,
			preloadImages				: this.slideElsLength // number of images to preload prior to making the slider visible

		}, options);

    }

    /**
     * initialize the slider functionality
     * @return {[object]} "this"
     */
    slider.prototype.init = function(){

    	//if 

    	// attach the js listening even to the CSS transition element
    	this.el.on(this.browserTransitionEvents, this.gotoNextSlide);

    	// first, attach the js listening even to the CSS transition element
    	$('#' + this.id).on(this.browserTransitionEvents, function(){
    		console.log('css event done');
    	});

    	return this;
    }















    console.log('dddtt');


    if (!dc.sliders) dc.sliders = {}

	dc.sliders[options.id] = new slider(options);

	dc.sliders[options.id].init();



};