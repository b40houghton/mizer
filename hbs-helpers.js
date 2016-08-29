
var hbsMethods = {
	ifNotOnlyChild: function (arr, options) {
		if(arr.length > 1) return options.fn(this);
	}
};

module.exports = exports = hbsMethods;
