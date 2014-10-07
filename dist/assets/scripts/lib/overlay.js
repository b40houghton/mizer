define(["jquery", "vendor/Modernizr"], function($) {

    // $(".overlay").overlay();

    var $ = jQuery;

    $.fn.overlay = function(options) {
        //Look for data-target on the element

        //
        // default settings
        // 
        var defaults = {
            "data_attr": "video-id",
            "overlay_class": "overlay",
            "overlay_cont_class":"overlay-container",
            "video_width": 640,
            "video_height": 390
        };


        // integrate settings from method variable
        if (options) $.extend(defaults, options);

        //Global
        var overlay_container;

        //create the overlay container
        if(overlay_container === undefined) overlay_container = $("<div class='"+ defaults.overlay_cont_class +"'></div>");

        return this.each(function() {


            var el = $(this),
                el_data = el.data(defaults.data_attr);

            function closeOverlay(){

                el.closest('.module').removeAttr('style');
                overlay_container.remove();
                overlay_container.html("<button class='btn-close'></button>");
            }


            $(el).off('click.overlay').on('click.overlay', function(e){

                e.preventDefault();

                closeOverlay();
                overlay_container.append("<div class='"+ defaults.overlay_class +"'><iframe id='ytplayer' type='text/html' width='"+defaults.video_width+"' height='"+defaults.video_height+"' src='http://www.youtube.com/embed/"+ el_data +"?autoplay=1&fs=1&wmode=transparent' wmode='Opaque' frameborder='0'/>");

                el.closest('.module').append(overlay_container);

                if((overlay_container.height()-100) < $('.overlay').outerHeight()){
                    el.closest('.module').animate({
                        "height": ($('.overlay').outerHeight() + 100)
                    }, 300);
                }     

                


                $("."+defaults.overlay_cont_class+" .btn-close").unbind('click').bind('click');

                // on close, clear and remove from DOM
                $("."+defaults.overlay_cont_class+" .btn-close").off("click.closeOverlay").on("click.closeOverlay", function(){
                    closeOverlay();
                });

                $(document).off('keyup.overlay').on('keyup.overlay', function(e) {
                    //esc
                    if (e.keyCode === 27) closeOverlay();
                });
            });

            

            

        });
    };

    $('.overlay-trigger').overlay();
});