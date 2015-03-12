(function(){

	if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(val) {
        if (!jQuery in window) return console.log('jQuery is required for this polyfill to work properly');
        return jQuery.inArray(val, this);
    };
}

})();

