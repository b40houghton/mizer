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
		this.currentSlide               = 1;
        this.pauseSlider                = false;
        this.options					= $.extend({
            autoSlide                   : true, // run slider on continuous loop
			continuousLoop				: false, // make the slider appear to keep going in the same direction forever
			preloadImages				: this.slideElsLength, // number of images to preload prior to making the slider visible
			loaderClass 				: 'loader loader-layer-over', // loader class(es) to be removed after preload 
			breakpoints 				: ['768'] // breakpoint divide for background image loading
		}, options);

    }

    /**
     * initialize the slider functionality
     * @return {[object]} "this"
     */
    slider.prototype.init = function(){

    	var self = this;

    	var loadedQue = this.preloadInit();

    	loadedQue.done(function(data){

    		// once the proper number of images have been preloaded, check to see if the client is a modern browser
    		// if not, call in the polyfill script to run the boring way with setTimout's, etc.
    		if (!Modernizr.csstransitions && !csstransforms && dcSliderPolyFill) window.dcSliderPolyFill(slider);

    		if (self.options.continuousLoop) self.setContinuous();
            
    		// fade in elements & remove the prealoding classes
    		self.reveal(function(){

                self.autoSlide();

            });

                


    		
    	});	

    }


	slider.prototype.autoSlide = function(){

        var self = this;

        this.el.off(this.browserTransitionEvents).on(this.browserTransitionEvents, function(){

            // add 1 to the current slide count
            self.gotoSlide(self.currentSlide + 1);

        });

        // add 1 to the current slide count
        this.gotoSlide(this.currentSlide + 1);

	}

    slider.prototype.run = function(){
    
    }

    slider.prototype.gotoSlide = function(index){
        // remove the current position class 
        this.el.removeClass('current-' + this.currentSlide);

        //console.log('current-' + this.currentSlide);

        this.currentSlide = index;
        // adjust if the new value is to high or too low 
        
        // STARTUP - finish index 'corrector'
        if (this.currentSlide < 1) this.currentSlide = this.slideElsLength;
        if (this.currentSlide > this.slideElsLength) this.currentSlide = 1;

        //console.log(this.currentSlide);

        this.el.addClass('current-' + this.currentSlide);

    }

	slider.prototype.reveal = function(callback){
		
        var self = this;

        this.slideEls.eq(0).on(this.browserTransitionEvents, function(){

            // remove the css transition event upon fade in
            self.slideEls.eq(0).off(self.browserTransitionEvents);

            // remove all the loading classes after animation
            self.parentEl.removeClass('off ' + self.options.loaderClass);

            self.el.addClass('init-animation');

            if (callback) callback();

        });

        this.parentEl.addClass('off');

        
	}

	slider.prototype.transitionEvent = function(){
		// attach the js listening even to the CSS transition element
    	this.slideEls.eq(0).on(this.browserTransitionEvents, this.gotoNextSlide);
	}
	
	slider.prototype.placeImages = function(){

		this.slideElsImg.each(function(i){

			var bgUrl = this.getAttribute('data-sliderbglarge');

			this.style.backgroundImage = 'url(' + bgUrl + ')';

		});
	}

    slider.prototype.preloadInit = function(){

    	var deferred = new $.Deferred(),
    		self = this;

		var srcArr = this.makeArrFromDataAttrs();

		dc.utilities.preloadImages(srcArr, this.preloadImageStep, function(data){

			self.placeImages();

			deferred.resolve(data);

		});

    	return deferred.promise();
    }

    slider.prototype.preloadImageStep = function(data){

    	//console.log(data);
    }

    slider.prototype.preloadImageComplete = function(data){

    	console.log(data);
    }

    slider.prototype.makeArrFromDataAttrs = function(){
    	return $.map(this.slideElsImg, function(el){
    		//console.log(el.dataset.sliderbgsmall);
    		return (dc.breakpoints.current == 'small') ? el.dataset.sliderbgsmall : el.dataset.sliderbglarge;
    	});
    }




    if (!dc.sliders) dc.sliders = {}

	dc.sliders[options.id] = new slider(options);

	dc.sliders[options.id].init();



};