(function () {

	var fs = require('fs');
	var express = require('express');
	var exphbs = require('express-handlebars');
	var hbsHelpers = require('./hbs-helpers');
	var app = express();
	var routes = require('./routes/index')(app);
	var requireDir = require('require-directory');
	var glob = require('glob');
	var mkdirp = require('mkdirp');
	var extend = require('extend');
	var http = require('http');
	var shell = require('shelljs');
	var rmdir = require('rimraf');

	require('dotenv').config({ silent: true });

	// handlebars config
	var hbs = exphbs.create({
	    extname: '.hbs',
	    defaultLayout: 'default',
	    helpers: hbsHelpers
	});

	app.engine('.hbs', hbs.engine);
	app.set('view engine', '.hbs');
	app.use(express.static('public'));

	var server = app.listen(3000);
	var layoutsGlob = `./${hbs.layoutsDir}/*.hbs`;
	var partialsGlob = `./${hbs.partialsDir}/*.hbs`;

	/**
	 * compile hbs files from array using existing routes and data
	 * @param  {Array}   arr [array of hbs files to build]
	 * @param  {Function} cb  [callback function after files built]
	 */
	var compileFiles = (arr, cb) => {
		var processFiles = arr.map((file) => {

			return new Promise((resolve, reject) => {

				var parentDir = '/' + file.split("/")[2];
				var view = '/' + file.split("/")[3].replace(/\.[^/.]+$/, "");
				var pageView = (view === '/index') ? '/' : view;

				parentDir = parentDir.split('_').join('-');

				//change directory based on site
				if(parentDir === '/global') parentDir = '';

				var options = {
				  host: 'localhost',
				  port: '3000',
				  method: 'GET',
				  path: parentDir + pageView
				};

				// http get each page, build page/directory from response
				http.get(options, (res) => {

					var body = '';

					res.setEncoding('utf8');

					// build data
					res.on('data', (data) => body += data);

					res.on('end', (data) => {

						// build directory structure or find existing
						mkdirp('./build/' + parentDir, (err) => {
							if(err) reject(err);

							// build page within site directory, using view data.
							fs.writeFile("./build" + parentDir + view + ".html", body, (err) => {
								if(err) reject(err);
								console.log('Building: ' + parentDir + view + '.html');
								resolve();
							});
						});
					});

				}).on('error', (err) => reject(err) );
			});
		});

		Promise.all(processFiles).then(function() {
			console.log('All files processed.');
			cb();
		}).catch(function (err) {
			console.log(err);
			cb();
		});
	};

	/**
	 * compress the build directory and close the server
	 */
	var finalizeBuild = () => {
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();
		var timestamp = Math.floor(date.getTime() / 1000);
		var dateString = `${month}_${day}_${year}_${timestamp}`;

		shell.exec(`zip -r build_${dateString}.zip build`, () => {
			server.close();
		});
	};

	var removeBuild = (callback) => {
		rmdir('./*.zip', () => {
			rmdir('./build', callback);
		});
	};

	var buildAssets = (callback) => {
		shell.exec('gulp build --node_env=production', callback);
	};

	/**
	 * run the gulp build command with production env to build and move js/css/images to the build directory
	 */
	 removeBuild(function () {
	 	buildAssets();
	 });

	/**
	 * get all hbs files in the views directory and pass to compileFiles(), run finalizeBuild on completion.
	 * @param  {String} glob string
	 * @param  {Object} glob settings
	 * @param  {Function} glob callback
	 */
	glob('./views/**/*.hbs', {
		ignore: ['./views/*.hbs', layoutsGlob, partialsGlob]
	}, (err, data) => {
		if (err) throw err;

		// compile files based on views directory, close server when complete.
		compileFiles(data, function () {
			finalizeBuild();
		});
	});

})();
