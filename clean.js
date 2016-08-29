var rmdir = require('rimraf');
var buildDirectoryGlob = './build';
var buildFileGlob = './*.zip';

function removeBuildDirectory() {
	rmdir(buildDirectoryGlob, function () {
		console.log('Build removed');
	});
}

function removeBuildFile(callback) {
	rmdir(buildFileGlob, function () {
		return callback();
	});
}

removeBuildFile(removeBuildDirectory);