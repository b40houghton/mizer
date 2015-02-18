dc.moduleMethod.dynamicLoad = function(options){

	(function(options){
    	
    	Modernizr.load([
  	  		{
	    		load : options.files,
	    		complete : function () {
	      			// Run this after everything in this group has downloaded
	      			// and executed, as well everything in all previous groups
	      			dc.appMethod[options.name](options);
	    		}
	  		}
		]);

    })(options);
};