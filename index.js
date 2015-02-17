
//node modules and global configs
var express = require('express'),
    http = require('http'),
    hbs = require('hbs'),
    fs = require('fs'),
    events = require('events'),
    globalConfig = require('./src/models/global'),
    mizr = require('./src/models/mizr.json'),
    app = express(),
    gulp = require('gulp'),
    open = require('open'),
    mkdirp = require('mkdirp'),

    //views
    viewPages = __dirname + '/src/views/pages',
    viewPartials = __dirname + '/src/views/partials',
    viewModules = __dirname + '/src/views/modules',
    viewSubModules = __dirname + '/src/views/submodules',
    
    // models 
    modelPages = __dirname + '/src/models/pages',
    modelPartials = __dirname + '/src/models/partials',
    modelModules     = __dirname + '/src/models/modules',
    modelSubModules  = __dirname + '/src/models/submodules';

// app.set('port', process.env.PORT || 3000);
app.set('views', viewPages);

// 'hbs' is the default extension of template files
app.set('view engine', 'hbs');
hbs.registerPartials(viewPartials);

// global variable to persist the current page url accross the overall app
var currentPage;


/* render any requested assets */
app.use(express.static(__dirname + '/src'));

app.get('*', function(req, res){
    
    var requestedBaseUrlStr = req._parsedUrl.pathname;
    
    //console.log(requestedBaseUrlStr.replace('/pages/', '') + '.hbs');

    currentPage = requestedBaseUrlStr;
    

    if (requestedBaseUrlStr == '/') res.render('index');
    else res.render(requestedBaseUrlStr.substr(1) + '.hbs');
    
});

app.get('/build', function(req, res){

    //buildToDistribution(req, res);
    
    var newBuild = new distributionBuilder(req, res);
    
    newBuild.init();

});






////
////
////  BUILD TO HTML
////
////

/* ================================================================================
	Build to distribution url
        req    : request - callback parameter from express .get()
        res    : response -- callback parameter from express .get()
=================================================================================== */

var distributionBuilder = function(req, res){

    this.req = req;
    this.res = res;
    
    var self = this;
    
    
    //
    // private functions
    //
    function convertUrlString(urlStr){        
        
        if (!urlStr) return console.log('convertUrlString needs a parameter');
        
        var urlObj = {};
        
        // replace added dev directories with distribution directory
        urlObj.renderUrl = urlStr.replace(viewPages + '/', '');
                
        // replace .hbs with .html
        urlObj.distUrl = urlStr.replace('/src/views/pages', '/dist').replace('.hbs', '.html');
                        
        return urlObj;
    
    }
    
    function writeToFile(pathObj){

        app.render(pathObj.renderUrl, function(err, html){

            var newRenderUrl = pathObj.renderUrl.replace('.hbs', '');

            html = treatHtml(pathObj.renderUrl, html);

            var distUrlArr = pathObj.distUrl.split('/');
                distUrlArr.pop();

            mkdirp(distUrlArr.join('/'), function (err) {
                if (err) console.error(err)

                fs.writeFile(pathObj.distUrl, html, function(err){

                    if (err) return console.log('Error: ' + err);

                    else return console.log('File written to ' + pathObj.distUrl);

                });

            });
        });
    }

    function treatHtml(urlPath, html){

        // count the number of directories given in the pages template path
        var directoryCount = urlPath.split('/').length - 1;

        // convert all absolute asset paths to reletive
        html = html.split('"/assets/').join('"' + '../'.repeat(directoryCount) + 'assets/');

        return html;

    }
    
    return {
        
        createDistriutionUrl : function(url){
                        
            if (!url) return console.log('writeToDistributionUrl needs a parameter');
    
            // if url is an array, convert in a loop
            if (typeof url === 'object' ) {

                var arrLength = url.length;

                for (var i = 0; i < arrLength; i++) {

                    url = convertUrlString(url[i]);

                    writeToFile(url);

                }

            // if url is a string, convert
            } else {

                url = convertUrlString(url);

                writeToFile(url);

            }    
        
        },
        
        init : function(){
            
            var initSelf = this;
            
            walk(viewPages, function(err, data){

                if (err) return console.log('Error crawling directory');

                for(var i = 0, len = data.length; i < len; i++){
                    
                    initSelf.createDistriutionUrl(data[i]);

                }

                var firstUrlInBuild = convertUrlString(data[0]).distUrl;

                open(firstUrlInBuild);

                self.res.end("Files processed: \n\n" + JSON.stringify(data) + '\n\n Redirecting to ' + firstUrlInBuild);

            });
            
        }
        
    }
    
}


////
////
////  HANDLEBARS HELPERS
////
////


/* ================================================================================
	Custom Mizr Module * - A module will process the following options:
        id      : id applied to containing div
        name    : applied with class list to the div
        classes : list of additonal classes to be applied to the containing div.
=================================================================================== */

hbs.registerHelper('mzr-module', function(options){
    var hash            = options.hash,
        name            = (hash.name)? hash.name : "",
        grid 			= (hash.grid)? hash.grid: " grid-12",
        mobile          = (hash.mobileGrid)? " m-grid-" + hash.mobileGrid: "";
        tablet          = (hash.tabletGrid)? " t-grid-" + hash.tabletGrid: "";
        id              = (hash.id)?" id='"+ hash.id +"'": "",
        classes         = (hash.classes)? " "+hash.classes : "",
        classList       = 'class="' + name + classes + grid + mobile + tablet +'"',
        configList		= classList + id;

    return "<div " + configList + ">" + options.fn(this) + "</div>";
});


/* ================================================================================
	Defined Mizr Module * - A module will process the following options:
        id      : id applied to containing div
        name    : applied with class list to the div
        classes : list of additonal classes to be applied to the containing div. 
================================================================================*/

hbs.registerHelper('mzr', function(moduleName, options){
    var templateFileContent = fs.readFileSync(viewModules + '/' + moduleName + '.hbs', 'utf8'),
        moduleTemplate      = hbs.compile(templateFileContent),
        moduleModel         = require(modelModules + '/' + moduleName + '.json') || {},
        tempObject          = simpleExtend(moduleModel, {});
    
    tempObject = simpleExtend(options.hash, tempObject);

    var newHtml = moduleTemplate(tempObject);
    
    return new hbs.handlebars.SafeString(newHtml);
});

/* ==============================================================================
	Mizr SubModule * - A submodule will process the following options:
        id      : id applied to containing div
        name    : applied with class list to the div
        grid    : also applied to the class list to the div, default is a grid-12
        classes : list of additonal classes to be applied to the containing div. 
================================================================================*/

hbs.registerHelper('$', function(submodule, options){
    
    var templateFileContent = fs.readFileSync(viewSubModules + '/' + submodule + '.hbs', 'utf8'),
        submoduleTemplate   = hbs.compile(templateFileContent),
        submoduleModel      = require(modelSubModules + '/' + submodule + '.json') || {},
        tempObject          = simpleExtend(submoduleModel, {});
    
    tempObject = simpleExtend(options.hash, tempObject);
    
    var newHtml = submoduleTemplate(tempObject);

    return new hbs.handlebars.SafeString(newHtml);
});


/* iterate helper */
hbs.registerHelper('iterate',function(options){
    var ret = "";
    for(i = 0; i < options.hash.count; i++){
        ret = ret + options.fn(this);
    }
    return ret;
});

/* list helper */
hbs.registerHelper('list', function(num, options){
    var ret = "";
    for(i = 0; i < num; i++){
        ret = ret + "<li>" + options.fn(this) + "</li>";
    }

    return ret;
});

/* equals helper */
hbs.registerHelper('equals', function(param1, param2, options){
	if(param1 === param2){
		return options.fn(this);
	} else{
		return options.inverse(this);
	}
});



app.listen(process.env.PORT || 3000, function(){});




////
////
//// UTILITY FUNCTIONS
////
////


/* ==============================================================================
	walk - recursively crawl a directory
        dir     : the directory to crawl
        done    : callback function - sends to parameters
            err     : indicates what went wrong - ("null" when success)
            results : array of directories
            
        returns callback function (see done above)
================================================================================*/

function walk(dir, done) {
    var results = [];
        fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

/* ==============================================================================
	simpleExtend - merge one object into another (NOT RECURSIVE)
        male     : the giving object
        female   : the receiving object
        
        returns the newly merged object
================================================================================*/

function simpleExtend(male, female) {
    for (var key in male) {
        female[key] = male[key];
    }
    return female;
}

/* ==============================================================================
	Prototype - Repeat string based on indes
        times     : number of times to repeat string
        
        EX: '../'.repeat(2)     = '../../'
            'test'.repeat(0)    = ''
================================================================================*/

String.prototype.repeat = function(times) {
   return (new Array(times + 1)).join(this);
};
    

