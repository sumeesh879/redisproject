const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

const port = 3000;

const app = express();

// Setting View Engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

// methodOverride
app.use(methodOverride('_method'));

app.get('/', (req, res, next) => {
    res.render('searchusers');
});

app.listen(port, () => {
    console.log('Server started on : ' + port);
})