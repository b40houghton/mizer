// loop through the dc.moduleMethodLoad object to load module-specific logic
 if (dc.moduleMethodLoad.length) {

 	for (var i = 0, len = dc.moduleMethodLoad.length; i < len; i++) {

 		var name 	= dc.moduleMethodLoad[i].name,
 			options	= dc.moduleMethodLoad[i].options || undefined;

 		dc.moduleMethod[name](options);

 	}
 }