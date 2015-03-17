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
     * @srcArr  - array 
     * @eachLoaded  - callback function, fires every time one of the images is finished loading
     * @allLoaded  - callback function, fires every time one of the images is finished loading
     * @return NA - use callbacks
     *              - eachLoaded callback object properties:
     *                  - index : the index value of image loaded from the src array,
     *                  - src   : the image loaded src value
     *                  - arr   : the original array passed to preloadImages function
     *              - allLoaded callback object properties:
     *                  - index : the index value of image loaded from the src array,
     *                  - src   : the image loaded src value
     *                  - arr   : the original array passed to preloadImages function
     */
    preloadImages : function(srcArr, eachLoaded, allLoaded){
        
        var totalImages = srcArr.length,
            currentImgCount = 0,
            //img = new Image(),
            currentSrc;

        function imgsDone(){
            if (allLoaded) return allLoaded(srcArr);
        }

        function newImageCount(data){
            // trigger eachLoaded callback, passing the 
            eachLoaded(data);

            // add to the image total loaded count for when the next image loads
            currentImgCount++;
            if (currentImgCount == totalImages && allLoaded) imgsDone(data);
        }
        
        for (var i = 0; i < totalImages; i++) {    
            
            currentSrc = srcArr[i];

            // put loop into self executing function to scope the index 
            (function(src, index){
                var img = new Image();
                img.addEventListener('load', function(){
                    // call the callback function, passing the image src, the array, and the index
                    newImageCount({
                        index   : index,
                        src     : img.src,
                        arr     : srcArr 
                    });
                    // remove the event afer calling the new image loaded function
                    img.removeEventListener('load');
                });
                img.src = currentSrc;
            })(currentSrc, i);     
        }

    }
};