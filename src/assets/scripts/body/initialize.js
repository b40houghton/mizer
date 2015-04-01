// initialize module
// loop through the mzr.moduleMethodLoad object to load module-specific logic
// 
// usage:
// 
// <div class="row">
//     ...html content
// </div>
// <script>
//     mzr.moduleMethodLoad.push({
//         name    : 'testMethod',
//         options : {}
//     });
// </script>
if (mzr.moduleMethodLoad.length) {

	for (var i = 0, len = mzr.moduleMethodLoad.length; i < len; i++) {

		(function(mzr, index){
			
			var name 	= mzr.moduleMethodLoad[index].name,
				options	= mzr.moduleMethodLoad[index].options || undefined;

			mzr.moduleMethod[name](options);

		})(mzr, i);

	}
}
// load and initialize apps (only larger appications within the site that have lots of code should be handled this way)
 // this solution allows for both css and js scripts to be loaded dynamically
// loop through the mzr.moduleDynamicLoad object to dynamically load module-specific files logic
// 
// usage:
// 
// <div class="row">
//     ...html content
// </div>
// <script>
//     mzr.moduleMethodLoad.push({
//         name    : 'testMethod',
//         options : {}
//     });
// </script>
 if (mzr.appMethodLoad.length) {

 	for (var i = 0, len = mzr.appMethodLoad.length; i < len; i++) {

 		(function(mzr, index){

			var files 	= mzr.appMethodLoad[index].files,
 				options	= mzr.appMethodLoad[index].options || {},
 				appName = options.name || undefined;

 			Modernizr.load([
	  	  		{
		    		load: files,
		    		complete: function() {
		      			// Run this after everything in this group has downloaded
		      			// if the module name is included in options object, run that particular file which should be in the apps directory
		      			if (appName)  mzr.appMethod[appName](options);
		    		}
		  		}
			]);

 		})(mzr, i);

 	}
 }