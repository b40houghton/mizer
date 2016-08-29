'use strict';

let url = require('url');
let fs = require('fs');
let path = require('path');
let setLocals = require('set-locals');

// var requireDir = require('require-directory');
// var model = requireDir(module, '../../model');

function removeQueryStrings(reqUrl){
  var obj = url.parse(reqUrl);

  obj.search = obj.query = "";

  return url.format(obj);
}

exports = module.exports = function (req, res) {
	let appDir = path.dirname(require.main.filename);
	let locals = res.locals;
	let cleanUrl = removeQueryStrings(req.url);
	let urlArray = cleanUrl.split('/').filter( n => n !== '');


	fs.access(`${appDir}/views${cleanUrl}`, function (err) {

		if(!err) urlArray.push('index'); // if the current request is a directory, push 'index' to the urlArray

		let viewPathArray = urlArray.slice(0); // create a new instance of the urlArray
		let modelPathArray = urlArray.slice(0); // create a new instance of the urlArray

		modelPathArray.splice(modelPathArray.length - 1, 0, 'views'); // add views to model path array

		let viewRenderPath = urlArray.join('/'); // create the view path
		let modelPath = modelPathArray.join('/'); // create the model path

		// print out the model and view path if debug argument passed
		if(process.argv.indexOf('debug')) {
			console.log('~ Debug Mode ~')
			console.log(`Model Path: ${appDir}/model/${modelPath}.json`);
			console.log(`View Path: ${viewRenderPath}`);
		}

		// set the locals of the current page model and render the view with the callback
		setLocals(`${appDir}/model/${modelPath}.json`, locals, function () {

			res.render(`${viewRenderPath}`, function (err, html) {
				if(err) {
					console.log(err);
					return res.redirect('/404');
				}

				return res.send(html);
			});
		});
	});
};