
    // on DOM ready logic
    $(function(){

        // logic for mimicing a link click
        $('[data-href]').click(function(event){
        
            event.preventDefault();
            
            var elData = $(this).data();
            
            if (elData.hrefNewtab) window.open(elData.href, '_blank'); 
            
            else window.location.href = elData.href;
        
        });
        
        // dynalically add telephone link to the contact us button
        $('.mobile-tel-link').click(function(event){
        
            // cache elements
            var el              = $(this),
                hiddenTelLink   = el.next('.mobile-tel-holder').children('a');
            
            // replace the href if the phone browser made the number into a phone link
            if (hiddenTelLink.length) {
                
                el.attr('href', hiddenTelLink.attr('href'));
                                
            } 
                    
        });

        //polyfill the flexbox
        if (!Modernizr.flexbox) {
            $('.equal-heights').each(function () {
                dc.utilities.getSetTallest($(this).children('[class*="grid-"]').height('auto'), true);
            });
        }
        
    });