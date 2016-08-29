;(function ($, window, document, undefined) {

    var breakpoints = require('./breakpoints');
    var pluginName = 'responsiveImg',
        defaults = {
            mobileDataAttr: 'mobile-image',
            tabletDataAttr: 'tablet-image',
            desktopDataAttr: 'desktop-image',
            targetSelector:'.body'
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        //setup the obj
        this.images = {
            mobile: '',
            tablet: '',
            desktop: ''
        };

        this.currentBreakpoint = '';

        this.init();
    }

    Plugin.prototype = {

        init: function() {

            var self = this;
            var el = $(self.element);

            //init the breakpoints if needed
            if(!self.currentBreakpoint) self.currentBreakpoint = breakpoints.getLatest();

            //set up the images
            self.images.mobile = (el.data(self.settings.mobileDataAttr)) ? el.data(self.settings.mobileDataAttr) : '';
            self.images.tablet = (el.data(self.settings.tabletDataAttr)) ? el.data(self.settings.tabletDataAttr) : '';
            self.images.desktop = (el.data(self.settings.desktopDataAttr)) ? el.data(self.settings.desktopDataAttr) : '';

            //initialize the source
            self.setSource();

            //set source on breakpoint change
            $(window).on('breakpointChange', function(){
                self.currentBreakpoint = breakpoints.getLatest();
                self.setSource();
            });
        },

        getSource: function () {
            var self = this;

            var bp = {
                small: function() {
                    return (self.images.mobile) ? 'url('+ self.images.mobile +')' : bp.medium;
                },
                medium: function () {
                    return (self.images.tablet) ? 'url('+ self.images.tablet +')' : bp.large;
                },
                large: function () {
                    return (self.images.tablet) ? 'url('+ self.images.desktop +')' : bp.xlarge;
                },
                xlarge: function () {
                    return (self.images.desktop) ? 'url('+ self.images.desktop +')' : bp.xxlarge;
                },
                xxlarge: function () {
                    return (self.images.desktop) ? 'url('+ self.images.desktop +')' : null;
                }
            };

            if(bp[self.currentBreakpoint]()){
                return bp[self.currentBreakpoint]();
            }
        },

        setSource: function() {
            var self = this;
            var $target = $(self.settings.targetSelector);

            $target.css('background-image', self.getSource(self.currentBreakpoint));
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})(jQuery, window, document);