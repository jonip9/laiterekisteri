const express = require('express');
const cons = require('consolidate');
const bodyParser = require('body-parser');
// let http = require('http');
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
  let msg = 'Tervetuloa';

  if (req.query.message) {
    msg = req.query.message;
  }

  res.render('login', {
    message: msg,
  });
});

app.post('/login', laiterekisteriController.checkUser);

app.get('/client', (req, res) => {
  res.sendFile(path.join(`${__dirname}views/client.html`));
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

app.listen(port, hostlocal, () => {
  console.log(`Local server running AT http://${hostlocal}:${port}/`);
});

/* app.listen(port, hostname, () => {
  console.log(`Public server running AT http://${hostname}:${port}/`);
}); */
