'use strict';

let path = require('path');
let setLocals = require('set-locals');
let fs = require('fs');
let async = require('async');
var url = require('url');

function removeQueryStrings(reqUrl){
	var obj = url.parse(reqUrl);

	obj.search = obj.query = "";

	return url.format(obj);
}

// recursivly loop through array of directories and set local json data
function multipleSetLocals(directoryArray, locals, callback) {
	let remaining = directoryArray.length;

	function recursiveLoop() {
		if(remaining) {
			remaining -= 1;
			setLocals(directoryArray[remaining] + '*.json', locals, recursiveLoop);
		} else {
			callback();
		}
	}

	recursiveLoop();
}

// build array or urls based on current url. used to recursivly set locals
function buildUrlArray (url) {
	let cleanUrl = removeQueryStrings(url);
	let urlArray = cleanUrl.split('/').filter( n => n !== "" && n !== "index");
	let appDir = path.dirname(require.main.filename);
	let returnArray = [];
	let returnString = `${appDir}/model/`

	for (var i = 0; i < urlArray.length; i++) {
		returnString += urlArray[i] + '/';
		returnArray.push(returnString);
	}

	return returnArray.reverse();
}

function setRecursiveLocals (url, locals, next) {
	let appDir = path.dirname(require.main.filename);
	let urls = buildUrlArray(url);

	// returns array of existing files
	async.filter(urls, function(filePath, callback) {
	    fs.access(filePath, function(err) {
	        callback(null, !err)
    	});
	}, function(err, results) {

		// if no errors, set locals of results
		if(!err) {
			return multipleSetLocals(results, locals, next);
		} else {
			return next(err);
		}
	});
}

exports.globals = function (req, res, next) {
	let locals = res.locals;
	let appDir = path.dirname(require.main.filename);

	setLocals(`${appDir}/model/*.json`, locals, next);
};

exports.directoryModel = function (req, res, next) {

	setRecursiveLocals(req.url, res.locals, next)
}
