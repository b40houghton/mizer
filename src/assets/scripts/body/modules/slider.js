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
    	this.parentEl 					= this.el.parent(); // get the parent (slider wrapper)
    	this.slideEls 					= this.el.children(); // get the slides elements
    	this.slideElsImg 				= this.slideEls.find('.slide-image'); // find the elements that will host the slide images
    	this.slideElsLength 			= this.slideEls.length; // get the slides elements
		this.options					= $.extend({

			continuousLoop				: false,
			preloadImages				: this.slideElsLength, // number of images to preload prior to making the slider visible
			loaderClass 				: 'loader loader-layer-over' // loader class(es) to be removed after preload 

		}, options),

		console.log(this.slideElsImg);

    }

    /**
     * initialize the slider functionality
     * @return {[object]} "this"
     */
    slider.prototype.init = function(){

    	var self = this;

    	// attach the js listening even to the CSS transition element
    	this.el.on(this.browserTransitionEvents, this.gotoNextSlide);

    	this.preload();

    	return this;
    }



    slider.prototype.preload = function(){
    	

    	var deferred = new $.Deferred(),
    		self = this;

		var srcArr = this.makeArrFromDataAttr();

    	// var test = map(this.slideElsImg.toArray(), function(val){
    	// 	console.log(val);
    	// })

    	console.log(srcArr);


    // 	var getLocation = function() {
    // var deferred = new $.Deferred();

    // navigator.geolocation.getCurrentPosition(function( position ){
    //     // Stuff with geolocation
    //     deferred.resolve(position);
    // });

    // return promise so that outside code cannot reject/resolve the deferred
    //return deferred.promise();

    }

    slider.prototype.makeArrFromDataAttr = function(){
    	return $.map(this.slideElsImg, function(el){
    		//console.log(el.dataset.sliderbgsmall);
    		return (dc.breakpoints.current == 'small') ? el.dataset.sliderbgsmall : el.dataset.sliderbglarge;
    	});
    }




    if (!dc.sliders) dc.sliders = {}

	dc.sliders[options.id] = new slider(options);

	dc.sliders[options.id].init();



};