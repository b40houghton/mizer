var cookieMethods = {
	get: function (cookieName) {
	    cookieName = cookieName.toLowerCase();
	    var cookies = document.cookie.split(';');

	    for(var i=0; i<cookies.length;i++) {
	        var cookie = cookies[i].split('=');
	        var cookieKey = decodeURIComponent(cookie[0].trim().toLowerCase());
	        var cookieValue = cookie.length>1?cookie[1]:'';

	        if(cookieKey == cookieName) return decodeURIComponent(cookieValue);
    	}

    	return '';
	},
	create: function(cookieName,cookieValue) {
	    var currentDate = new Date();
	    	currentDate.setYear(currentDate.getFullYear()+1);

	    var cookie = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue) + ';expires=' + currentDate.toGMTString() + ';path=/';
	    document.cookie= cookie;
	},
	delete: function(cookieName) {
	    this.create(cookieName,'');
	}
};

module.exports = exports = cookieMethods;