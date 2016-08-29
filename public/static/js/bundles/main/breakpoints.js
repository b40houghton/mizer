exports.bp = {
	'small': {
		'min': 0,
		'max': 767
	},
	'medium': {
		'min': 768,
		'max': 1024
	},
	'large': {
		'min': 1025,
		'max': 1280
	},
	'xlarge': {
		'min': 1281,
		'max': 1920
	},
	'xxlarge': {
		'min': 1921,
		'max': Number.POSITIVE_INFINITY
	},
	'current':''
};

exports.oldDisplayMode = '';

exports.getLatest = function() {
	var nowWindowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var latest;
	var key;
	var breakpoints = this.bp;

	this.oldDisplayMode = breakpoints.current || '';

	for (key in breakpoints) {
		if (breakpoints.hasOwnProperty(key)) {

			breakpoints.hasOwnProperty(key);

			if (key === 'current') {
				break;
			}

			if (nowWindowWidth >= breakpoints[key].min && nowWindowWidth <= breakpoints[key].max) {
				return key;
			}

			latest = key;
		}
	}

	return latest;
};

exports.init = function () {
	this.bp.current = this.getLatest();
};