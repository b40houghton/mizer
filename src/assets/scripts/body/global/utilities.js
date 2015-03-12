dc.utilities = {

    // receive a string and convert it to a jQuery object. if 'selector' is already a jQuery DOM object, it is simply passed through 
    returnStringAsJqObject : function(selector){
        return (typeof selector == 'string') ? $(selector) : selector;
    },

    // check if element exists on page. if so, run callback function with element passed through
        // selector : jQuery string selector or jQuery dom object
        // callback : function called with the jquery object passed through
    runIfElLength : function(selector, callback){
        var _el = dc.utilities.returnStringAsJqObject(selector);
        if (_el.length) callback(_el);
    },

    // compare heights of all elements and return either an interger or the object that is the tallest.
        // selector     : jQuery string selector or jQuery dom object
        // returnType   : string - 'num' or 'obj'
        // setHeights   : boolean - indicated whether or not to set the objects to be the same height
    getSetTallest : function(selector, setHeights){
        
        var _el         = dc.utilities.returnStringAsJqObject(selector),
            tallest     = 0;
        
        _el.each(function(){
            
            var newHeight = $(this).height();
            if (tallest < newHeight) tallest = newHeight;

        });
                                    
        if (setHeights) _el.height(tallest);

        return tallest;

    },

    /**
     * preload img src's in an array
     * @param  srcArr  - array - required
     * @param  eachLoaded  - array
     * @param  allLoaded  - array
     * @return NA - use callbacks
     */
    preloadImages : function(srcArr, eachLoaded, allLoaded){
        
        var totalImages = srcArr.length;
        var currentImgCount = 0;
        
        function imgsDone(){
            if (allLoaded) return allLoaded(srcArr);
        }

        function newImageCount(event){
            // trigger eachLoaded callback, passing the 
            console.log(event);
            currentImgCount++;
            if (currentImgCount == totalImages && allLoaded) imgsDone();
        }
        
        for (var i = 0; i < totalImages; i++) {    
            // put loop into self executing function to scope the index 
            (function(index){
                img =  new Image();
                img.src = srcArr[index];
                img.addEventListener('load', newImageCount);
            })(srcArr, i)     
        }

    }







};