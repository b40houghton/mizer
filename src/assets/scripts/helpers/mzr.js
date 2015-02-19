module.exports = function(moduleName, options){

    var fs = require('fs');
    var hbs = require('hbs');
    var registrar = require('handlebars-registrar');

    registrar(hbs, { helpers: 'src/assets/scripts/helpers/*.js'
    })

	function simpleExtend (male, female) {
	    for (var key in male) {
	        female[key] = male[key];
	    }
	    return female;
	}

    var templateFileContent = fs.readFileSync('./src/views/modules/' + moduleName + '.hbs', 'utf8'),
        moduleTemplate      = hbs.compile(templateFileContent),
        moduleModel         = JSON.parse(fs.readFileSync('./src/models/modules/' + moduleName + '.json', 'utf8')) || {},
        tempObject          = simpleExtend(moduleModel, {});
    
    tempObject = simpleExtend(options.hash, tempObject);



    var newHtml = moduleTemplate(tempObject);
    
    return new hbs.handlebars.SafeString(newHtml);
};