var express = require('express');
var exphbs = require('express-handlebars');
var hbsHelpers = require('./hbs-helpers');
var app = express();
var favicon = require('serve-favicon');
var routes = require('./routes/index');

require('dotenv').config({ silent: true });

// handlebars config
var hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'default',
    helpers: hbsHelpers
});

// on prod, set expire headers
var staticOptions = (process.env.NODE_ENV === 'production') ? {maxAge: 259200000} : {};

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.use(express.static('public', staticOptions));
app.use(favicon(__dirname + '/public/static/favicon.ico'));

routes(app);

app.listen(3000, function() {
    console.log('Listening on port 3000');
});
