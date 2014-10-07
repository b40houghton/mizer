define(["jquery", "vendor/Modernizr", ], function($) {

    !function(window){
        var images,
            images_src;

        images = document.getElementsByClassName('lazy');
        images_src = [];

        for(var i = 0; i < images.length; i++){
            images_src.push(images[i].dataset.src)
        }

    }(this);

});