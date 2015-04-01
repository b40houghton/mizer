// place the user agen into a data attribut in the html tag - useful for some css polyfilling and workarounds
document.documentElement.setAttribute('data-useragent', navigator.userAgent);

// set up the mzr object
//      - this object keeps site logic scoped and protected from interfering with anythign in the window object
var mzr = {};


//
// Running logic from already loaded methods
// 

// the module method object is where module specific logic is declared in ../body/modules. For instance, slider
// logic could be placed as mzr.moduleMethod.slider == function(options){...} in the modules directory.
mzr.moduleMethod = {};

// the moduleMethLoad array - populated during page load by passing data through a .push(...). Once the dom is
// ready, there is an initializing function that loops through this array and initializes the methods it references
// it is likely that for smaller projects, this stays empty 
mzr.moduleMethodLoad = [];


//
// Running logic from dynamically loaded methods
// 

// this solution should only be necessary for large applications
// the module method object is where module specifi logic is stored. For instance, slider login could be place 
// in mzr.moduleMethod.slider
mzr.appMethod = {};

// moduleMethodLoader array - similar to the 
mzr.appMethodLoad = [];