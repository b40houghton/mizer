# Getting Started

Pull down the repo into you local directory and checkout the `env/dev` branch.
Once inside the `env/dev` branch, run `npm install` to install the dependencies.

> `npm install`

Install `gulp` globally by running `npm install gulp-cli -g` or following the install guide on http://gulpjs.com/.

# Spin up the site

> `node server.js`

To run the site, open a terminal window and run the command `node server.js`.
This will spin up the site with the port specified in the `deployment.json` file.

# Compile css and js

> `gulp` or `gulp watch`

To compile the sass and bundle the js files, run `gulp`. To watch files and build files as they are edited, run `gulp watch`.

Be sure to have `gulp` install globally on your machine prior to running the above commands, otherwise you will see an error.


**Gulp Documentation:** https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

# File Structure

## Model

The model is a collection of `.json` files used to share data between views and populate view data. `json` files at the root of the model directory are global data and can be accessed within all views. `.json` files within `view` directories should be named after the associated view. For example, an `about.hbs` file would use the `models/views/about.json` data to populate the view.

Additional sub directories can be added within `./model/` to represent sub views. For example, a `./model/subDirectory/` directory can be added along with `./model/subDirectory/views/` to populate data to views within `./views/subDirectory/`. Files at the root of the `subDirectory` folder, will overwrite global data and act as `subDirectory` global data.

```
.
+-- model/
|	|
|   +-- views/
|	|
|	+-- subDirectory/
|	|	|
|	|	+-- views/
|	|	|	|
|	|	|	+-- index.json
|	|	|
|	|	+-- footer.json
|	|
|   +-- header.json
|	|
|	+-- footer.json
```

## Public

The public directory is where all the images, css and js live.

---

### CSS
CSS is compiled using gulp and sass. All `.scss` files are found within `modules/`, `partials/`, or `submodules/`.

---

### JS
JS is compiled using browserify, babel and gulp. All JS files at the root of `bundle/` are treated as entry files and will be compiled as `<FILENAME>.bundle.js`.

---


```
+-- public/static/
|	|
|   +-- css/
|	|	|
|	|	+-- scss/
|	|	|	|
|	|	|	+-- modules/*.scss
|	|	|	|
|	|	|	+-- partials/*.scss
|	|	|	|
|	|	|	+-- submodules/*.scss
|	|	|
|	|	+-- main.css //compiled
|	|
|	+-- js/
|	|	|
|	|	+-- bundles/
|	|	|	|
|	|	|	+-- main/
|	|	|	|
|	|	|	+-- main.js
|	|	|
|	|	+-- main.bundle.js // compiled
|	|
|	+-- images/
```

## Routes

All routing is handled through the `routes/index.js` file. A wildcard is used to capture all requests and the model data is set within `routes/middleware.js` and `routes/views/pageModel.js`.


```
+-- routes/
|	|
|   +-- views/
|	|	|
|	|	+-- pageModel.js
|	|
|   +-- index.js
|	|
|   +-- middleware.js
```

## Views

Views are written as handlebars templates and use the defualt layout, based on a TridionCMS implementation. All partials are contained within the partials directory. Sub directories can be added to create nested views, such as `views/subDirectory/`.

```
+-- views/
|	|
|   +-- layouts/
|	|	|
|	|	+-- default.hbs
|	|	|
|	|	+-- error.hbs
|	|
|   +-- partials/
|	|
|	+-- subDirectory/
|	|	|
|	|	+-- index.hbs
|	|
|   +-- index.hbs
```
