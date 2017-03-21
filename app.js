const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

const port = 3000;

const app = express();

const client = redis.createClient();
client.on('connect', ()=> {
    console.log('Connected to Redis');
})

// Setting View Engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

// methodOverride
app.use(methodOverride('_method'));

// Search Page
app.get('/', (req, res, next) => {
    res.render('searchusers');
});

// Add User Page
app.get('/user/add', (req, res, next) => {
    res.render('addUser');
});

// Add user to redis
app.post('/user/add', (req, res, next) => {
    let id = req.body.id;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let phone = req.body.phone;

    client.hmset(id, [
        'firstname', firstname,
        'lastname', lastname,
        'email', email,
        'phone', phone
    ], (err, reply) => {
        if(err) {
            throw err;
        } 
        console.log(reply);
        res.redirect('/');
    })
})

// Search Processing
app.post('/user/search', (req, res, next) => {
    let id = req.body.id;
    client.hgetall(id, (err, obj) => {
        if(err) {
            throw err;
        } else if(!obj) {
            res.render('searchusers', {
                error: 'User does not exist'
            });
        } else {
            obj.id = id;
            res.render('details', {
                user: obj
            });
        }
    })
});

//Delete User
app.delete('/user/delete/:id', (req, res, next) => {
    let id = req.params.id;
    client.del(id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log('Server started on : ' + port);
})