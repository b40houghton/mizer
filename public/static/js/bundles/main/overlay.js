// Uses CommonJS, AMD or browser globals to create a jQuery plugin.
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    'use strict';

	var defaults = {
        "overlayAppendSelector":".base",
        "overlayClassname": "overlay",
        "overlayContainerClassname":"overlay-container",
        "overlayBodyClassname":"overlay-body",
        "activeClassname":"overlay-active",
        "closeClassname":"overlay-close",
        "interstitial": false,
        "interstitialSelector":".interstitial-link",
        "interstitialCancel":".interstitial-cancel",
        "interstitialPopupSelector": "#third-party-overlay"
	};

	function OverlayModal(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this.body = null;
        this.scrollPosition = 0;
        this.init();
    }

	OverlayModal.prototype = {

        /**
         * [init description]
         * @return {[type]} [description]
         */
        init: function () {
            var self = this;
            var $element = $(this.element);
            var $target = (self.settings.interstitial) ? $(self.settings.interstitialPopupSelector) : $($element.data('overlay'));
            var $overlay = $(`.${self.settings.overlayClassname}`);
            var overlayBody =
                `<div class="${self.settings.overlayClassname}">` +
                    `<div class="${self.settings.overlayContainerClassname}">` +
                        `<button class="${self.settings.closeClassname}"><span class="sr-only">Close Overlay</span></button>` +
                        `<div class="${self.settings.overlayBodyClassname}"></div>` +
                    `</div>` +
                `</div>`;

            if(!$overlay.length) $(self.settings.overlayAppendSelector).append(overlayBody);

            $element.click(function (e){
                e.preventDefault();
                if($target) self.open($target, e);

                $(`.${self.settings.closeClassname}`).off('click').on('click', function (e) {
                    self.close();
                });
            });


        },
        open: function (target, event) {
            var self = this;
            var $target = $(event.target);

            self.scrollPosition = $(window).scrollTop();

            self.body = target.html();

            // if interstitial, replace the overlay href with the trigger.
            if(self.settings.interstitial && $target) $(self.settings.interstitialSelector).attr('href', $target.attr('href'));

            $(`.${self.settings.overlayBodyClassname}`).append(target.html());

            // close interstitial on click of button and add cancel functionality
            if(self.settings.interstitial && $target) {
                $(`.${self.settings.overlayBodyClassname}`).on('click.interstitialContinue', self.settings.interstitialSelector, self.close.bind(this));
                $(`.${self.settings.overlayBodyClassname}`).on('click.interstitialCancel', self.settings.interstitialCancel, function (event) {
                    event.preventDefault();
                    self.close();
                });
            }

            $(`body`).addClass(self.settings.activeClassname);
        },
        close: function () {
            var self = this;

            $(`body`).removeClass(self.settings.activeClassname);

            $(window).scrollTop(self.scrollPosition);

            $(`.${self.settings.overlayBodyClassname}`).html('');
        }
    };

    $.fn.overlayModal = function(options) {
    	return this.each(function () {
    		if (!$.data(this, 'plugin_overlay_modal')) {
    			$.data(this, 'plugin_overlay_modal', new OverlayModal(this, options));
    		}
    	});
    };
}));