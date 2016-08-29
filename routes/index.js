var requireDir = require('require-directory');
var routes = requireDir(module);
var compression = require('compression');

require('dotenv').config({ silent: true });

exports = module.exports = function (app) {

	// set global locals
	app.use(routes.middleware.globals);

	// include compression on prod
	if (process.env.NODE_ENV === 'production') app.use(compression());

	// 404 error
	app.all('/404', function (req, res ){
		res.render('404', {layout: 'error'});
	});

	app.all('*', routes.middleware.directoryModel, routes.views.pageModel);

};