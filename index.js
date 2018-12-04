const express = require('express');
const cons = require('consolidate');
const bodyParser = require('body-parser');
const http = require('http');
const session = require('express-session');
const path = require('path');
const laiterekisteriController = require('./laiterekisteriController');

const app = express();
const hostlocal = 'localhost';
const hostname = '192.168.1.102';
const port = process.env.PORT || 3000;

app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static('public'));
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    if (!req.session.user) {
        let msg = '';

        if (req.session.error) {
            msg = req.session.error;
            req.session.error = '';
        }

        if (req.session.success) {
            msg = req.session.success;
            req.session.success = '';
        }

        res.render('login', {
            message: msg,
        });
    } else {
        res.redirect('/client');
    }
});

app.post('/login', laiterekisteriController.checkUser);

app.get('/client', (req, res) => {
    if (req.session.user) {
        if (req.session.user === 'admin') {
            res.render('client', {
                isAdmin: 'true',
            });
        } else {
            res.render('client', {
                isAdmin: 'false',
            });
        }
    } else {
        res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
        } else {
            res.redirect('/');
        }
    });
});

app.route('/kayttaja')
    .get(laiterekisteriController.fetchUserData)
    .post(laiterekisteriController.registerUser);

app.route('/kayttaja/:id')
    .put(laiterekisteriController.updateUser);

app.route('/laite')
    .get(laiterekisteriController.fetchAllItems)
    .post(laiterekisteriController.addItem);

app.route('/laite/:id')
    .get(laiterekisteriController.fetchOneItem)
    .put(laiterekisteriController.updateItem)
    .delete(laiterekisteriController.deleteItem);

app.route('/kategoria')
    .get(laiterekisteriController.fetchCategory);

app.route('/omistaja')
    .get(laiterekisteriController.fetchOwner);

app.route('/varaus')
    .get(laiterekisteriController.fetchAllBookings);

app.route('/laina')
    .get(laiterekisteriController.fetchAllLoans);

app.route('/laitteenvaraus')
    .post(laiterekisteriController.addBookedDates);

app.route('/laitteenvaraus/:id')
    .get(laiterekisteriController.fetchOneBookedDate)
    .put(laiterekisteriController.updateBookingDates)
    .delete(laiterekisteriController.deleteBooking);

app.route('/laitteenvaraukset/:id')
    .get(laiterekisteriController.fetchBookedDates)
    .put(laiterekisteriController.updateBookingStatus);

app.route('/vanhatlaitteenvaraukset/:id')
    .get(laiterekisteriController.fetchOldBookedDates);

app.route('/laitteenvaraukset/:sarjanro/:id')
    .get(laiterekisteriController.fetchBookedDates2);

app.listen(port, hostlocal, () => {
    console.log(`Local server running AT http://${hostlocal}:${port}/`);
});

/* app.listen(port, hostname, () => {
  console.log(`Public server running AT http://${hostname}:${port}/`);
}); */
