module.exports = function (submodule, options) {

    var fs = require('fs');
    var hbs = require('hbs');

	function simpleExtend(male, female) {
	    for (var key in male) {
	        female[key] = male[key];
	    }
	    return female;
	}
    
    var templateFileContent = fs.readFileSync('./src/views/submodules/' + submodule + '.hbs', 'utf8'),
        submoduleTemplate   = hbs.compile(templateFileContent),
        submoduleModel      = JSON.parse(fs.readFileSync('./src/models/submodules/' + submodule + '.json', 'utf8')) || {},
        tempObject          = simpleExtend(submoduleModel, {});

    tempObject = simpleExtend(options.hash, tempObject);
    
    return new hbs.handlebars.SafeString(submoduleTemplate(tempObject));
};