define(["jquery", "main"], function($) {

    var $ = jQuery;

    $.fn.shareContent = function(options) {

        //set defaults
        var defaults = {
            "facebook"  : false,
            "twitter"   : false,
            "linkedIn"  : false,
            "youtube"   : false,
            "googlePlus": false,
            "shareClass": "share-slide",
            "openClass" : "open",
            "slideSpeed": 200,
            "closeBtnClass": "share-close"
        };

        // integrate options from method variable
        if (options) $.extend(defaults, options);

        //variables
        var element         = $(this),
            shareElement    = $("<div><span class='heading-4'>Share: </span></div>"),
            closeBtn        = $("<button class='"+ defaults.closeBtnClass +"'>close</button>"),
            linkedInShare   = "<script src='//platform.linkedin.com/in.js' type='text/javascript'>lang: en_US</script><script type='IN/Share'></script>",
            twitterShare    = "<a href='https://twitter.com/share' class='twitter-share-button' data-count='none' data-dnt='true'>Tweet</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>";


        shareElement.addClass(defaults.shareClass).append(closeBtn);

        if(defaults.linkedIn) shareElement.append("<div class='linkedIn'>"+linkedInShare+"</div>");
        if(defaults.twitter) shareElement.append("<div class='twitter'>"+ twitterShare +"</div>");

        //functions
        function slideShare(){

            if($("." + defaults.shareClass).length > 0){
                if(shareElement.hasClass(defaults.openClass)){
                    closeShare();
                } else{
                    openShare();
                }
            }else{
                element.append(shareElement);
                openShare();
            }

        };

        //open the share
        function openShare(){
            shareElement.addClass(defaults.openClass).animate({
                "left": "100%",
            },defaults.slideSpeed);
        }

        //close the share
        function closeShare(){
            shareElement.removeClass(defaults.openClass).animate({
                "left": "-300px"
            },defaults.slideSpeed, function(){
                shareElement.removeAttr("style");
            });
        }



        //events
        element.off("click.share").on("click.share", function(e){

            e.preventDefault();

            slideShare();
        });

        $(window).off("throttledScroll.share").on("throttledScroll.share", function(){
            if(shareElement.hasClass(defaults.openClass)){
                closeShare();
            };
        });

        $(document).mouseup(function(e){
            if(!element.is(e.target) && element.has(e.target).length === 0){
                closeShare();
            }
        });
    };

});