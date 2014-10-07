define(["jquery", "vendor/Modernizr", "lib/onload", "lib/utilities", "lib/overlay"], function($) {

    var $ = jQuery;

    ;(function() {

        $.fn.fancySlider = function(options) {

            //
            // default settings
            // 
            var defaults = {
                "slidesContainerClass": "slides", //slide container class
                "activeSlideClass": "active", //active slide class
                "indicatorsContainerClass": "indicators", //indicators container class
                "indicatorsActiveClass": "current", //indicators active class
                "clickableIndicators":true, // if true, clicking on indicators changes slides
                "prevClass": "prev", //previous slide class
                "nextClass": "next", //next slide class
                "slideTime": 300, //speed of animation
                "slideInterval": 5000, //time between auto slides
                "pauseOnHover": true,
                "autoSlide": true, //if set to true, automatically slides to next slide
                "infiniteSlides": true, //if set to true, slide loop infinitely
                "keyboardControl": true, //if set to true, right and left arrows control 
                "defaultSlide": 0
            };

            // integrate settings from method variable
            if (options) $.extend(defaults, options);

            return this.each(function() {

                var el = $(this),
                    slide_container,
                    slide_container_w,
                    slides,
                    slides_w,
                    slides_count,
                    slides_current,
                    slides_prev,
                    slides_next,
                    slides_position,
                    slides_timer,
                    slides_hover,
                    first_img;

                //once first image loads, initialize the function
                first_img = el.find('li').eq(0).find('.image img');

                //lazy load the first image
                if(first_img.length > -1){
                    first_img.on("load",function(){
                        initSlider(el);
                    }).each(function(){
                        if(this.complete) first_img.load(); //reload if cached
                    });
                }


                //
                //functions
                //
                function initSlider(el) {
                    slide_container = el.find("." + defaults.slidesContainerClass);
                    slides = slide_container.find("li");
                    slides_count = slides.length;
                    slides_current = defaults.defaultSlide;
                    slides_position = slides_current * 100;
                    slide_container_w = slides.length * 100;
                    slides_w = 100 / slides.length;
                    slides_hover;

                    //set widths
                    slide_container.css('width', slide_container_w + '%');
                    slides.css('width', slides_w + '%');
                    slide_container.css({
                        "margin-left": "-" + slides_position + "%"
                    });


                    setIndicators();

                    if(slides_count <= 1){
                        el.addClass('hide-extras');
                    }

                    el.removeClass("loading");
                }

                //slide based on directions
                function slide(direction) {

                    //if autoslide, reset the timer
                    if (defaults.autoSlide) resetTimer();

                    //if direction provided and not hovered
                    if (direction) {

                        slides_current = (direction === "next") ? slides_current + 1 : slides_current - 1;

                        if (slides_current < 0) slides_current = slides_count - 1;
                        if (slides_current > (slides_count - 1)) slides_current = 0;

                        slides_position = slides_current * 100;

                        if (Modernizr.cssanimations) {
                            slide_container.css({
                                "margin-left": "-" + slides_position + "%"
                            });
                        } else {
                            slide_container.stop().animate({
                                "margin-left": "-" + slides_position + "%"
                            });
                        }

                        setIndicators();


                    } else {
                        return;
                    }
                }

                //set indicators
                function setIndicators() {

                    var indicators = el.find('.' + defaults.indicatorsContainerClass)

                    // initialize if doesnt exist
                    if (el.find('.' + defaults.indicatorsContainerClass).length === 0) {

                        var indicatorsContainer = $("<ul class='"+ defaults.indicatorsContainerClass +"'></ul>");

                        if(defaults.clickableIndicators) indicatorsContainer.addClass('clickable');


                        for (var i = 0; i < slides.length; i++) {
                            var indicatorItem = $("<li><span></span></li>");

                            if (slides_current === i) indicatorItem.addClass(defaults.indicatorsActiveClass);

                            indicatorsContainer.append(indicatorItem);

                        }
                        slide_container.parent().append(indicatorsContainer);

                    } else {
                        indicators.children('li').removeAttr("class");
                        indicators.children('li').eq(slides_current).addClass(defaults.indicatorsActiveClass);
                    }
                }

                function resetTimer() {

                    clearInterval(slides_timer);
                    slides_timer = setInterval(function() {
                        //if pauseOnHover, set hover bool
                        // if (defaults.pauseOnHover) slides_hover = el.is(':hover');
                        if (defaults.pauseOnHover) slides_hover = ($(".module-slider:hover").length > 0)? true:false;
                        
                        //also check if overlay is opened
                        if(!slides_hover && !el.siblings('.overlay-container').length) slide("next");
                    }, defaults.slideInterval);

                }

                // arrows control
                el.find('.prev').click(function() {
                    slide("prev");
                });

                el.find('.next').click(function() {
                    slide("next");
                });

                //clickable indicators
                if (defaults.clickableIndicators) {
                    el.find('.indicators li').on('click', function(){
                        var clickedIndicator = $(this);
                        if(!clickedIndicator.hasClass(defaults.indicatorsActiveClass)){

                            slides_current = clickedIndicator.index() - 1;

                            slide('next');
                        } 
                    });
                }

                //swipe events
                el.find('li').swipe({
                    onMove: function() {},
                    onEnd: function(data) {
                        // if the user swipes in opposite direction from the initial movement, return slide to current position 
                        if (data.firstXDirection != data.lastXDirection) {
                            slide("prev");
                        }

                        // if swipe left, go to next slide
                        if (data.lastXDirection === 'left') {
                            slide("next");
                        }

                        // if swipe right, go to previous slide
                        else if (data.lastXDirection === 'right') {
                            slide("prev");
                        }
                    }

                });

                //auto slide
                if (defaults.autoSlide) {
                    slides_timer = setInterval(function() {

                        //if pauseOnHover, set hover bool
                        if (defaults.pauseOnHover) slides_hover = ($(".module-slider:hover").length > 0)? true:false;
                        
                        if(!slides_hover) slide("next");

                    }, defaults.slideInterval);
                }


                // keyboard control
                if (defaults.keyboardControl) {

                    $(document).off('keyup.slider').on('keyup.slider', function(e) {

                        //left arrow
                        if (e.keyCode === 37) slide("prev");

                        //right arrow
                        if (e.keyCode === 39) slide("next");
                    });
                }


            });
        };
    })();
});