define(["jquery"], function($) {

    var $ = jQuery;

    (function() {

        //set up the variables
        var footer          = document.getElementById("footer"),
            footer_wrap     = document.getElementById("footer-wrapper"),
            body            = document.getElementById("body"),
            footer_min      = 120,
            window_h,
            footer_h, 
            footer_wrap_h,
            body_h;
            
        
        //set footer based on current breakpoint
        var setFooter = function(){
            if(dc.breakpoints.current === "desktop"){
                getHeights();
                footer.style.height = footer_wrap_h + "px";
                footer.style.opacity = 1;

                tinyWindow();

            } else{
                footer.style.height = "";    
                footer.style.opacity = 1;
                footer_wrap.style.position = "";

            }
        };

        //detect if browser window is too small. If so, set a minimum
        var tinyWindow = function(){
            if((window_h-80) < footer_wrap_h){
                footer_wrap.style.position = "relative";
            } else{
                footer_wrap.style.position = "";
            }
        }



        //get heights
        var getHeights = function(){
            window_h        = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //IE Fallback
            footer_h        = footer.offsetHeight; 
            footer_wrap_h   = footer_wrap.offsetHeight;
            body_h          = body.offsetHeight;
        };

        //run initially
        setFooter();

        //run on breakpoint change
        $(window).on('breakpointChange',function(){
            setFooter();
        });

    })();

});