{
	let $ = global.jQuery = require('jquery');

	//jquery helper functions
	let debounce = require('./main/debounce');
	let breakpoints = require('./main/breakpoints');

	//imported plugins/modules
	require('./main/overlay')($);
	require('./main/responsive-image');

	// Array.prototype.find polyfill
	require('./main/array-find-polyfill');

	// ClassList polyfill
	require('./main/classlist-polyfill');

	let getParameterByName = (name) => {
	    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}

	let getInternetExplorerVersion = () => {
		let rv = -1;

		if (navigator.appName == 'Microsoft Internet Explorer') {
			let ua = navigator.userAgent;
			let re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

			if (re.exec(ua) != null) rv = parseFloat( RegExp.$1 );

		} else if (navigator.appName == 'Netscape') {
			let ua = navigator.userAgent;
			let re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");

			if (re.exec(ua) != null) rv = parseFloat( RegExp.$1 );
		}

		return rv;
	}

	$(function () {

		// set IE class if needed
		let ieVersion = getInternetExplorerVersion();

		if(ieVersion !== -1) $('html').addClass(`ie-${ieVersion}`);

		// initialize responsive background image
		$('.background-image').responsiveImg({
			"targetSelector":".base"
		});

		// initialize overlay trigger
		$('.overlay-trigger').overlayModal();

		$('.third-party-link').overlayModal({ interstitial: true });

		// disable hover on scroll to increase performance.
		window.addEventListener('scroll', function () {
			clearTimeout(scrollTimer);
			if(!document.body.classList.contains('disable-hover')) {
				document.body.classList.add('disable-hover');
			}

			scrollTimer = setTimeout(function () {
				document.body.classList.remove('disable-hover');
			}, 500);

		});

		//close mobile nav on breakpoint change
		$(window).on('breakpointChange', function () {
			var bodyEl = $('.body');

			if(breakpoints.bp.current !== 'small' && bodyEl.hasClass('open-nav')){
				bodyEl.removeClass('open-nav');

			}
		});
	});


	window.addEventListener('resize', debounce(function() {
		breakpoints.bp.current = breakpoints.getLatest();
		if (breakpoints.bp.current !== breakpoints.oldDisplayMode) {
			$(window).trigger('breakpointChange', breakpoints.current);
		}
	}));
}