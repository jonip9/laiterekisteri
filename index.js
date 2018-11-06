let express = require('express');
let cons = require('consolidate');
let bodyParser = require('body-parser');
let http = require('http');
let session = require('express-session');
let path = require('path');
const laiterekisteriController = require('./laiterekisteriController');

let app = express();
const hostname = '127.0.0.1';
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

// app.use(express.static('public'));

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  let msg = "Tervetuloa";

  if (req.query.message) {
    msg = req.query.message;
  }

  res.render('login', {
    message: msg,
  });
});

app.post('/login', laiterekisteriController.checkUser);

app.get('client', (req, res) => {
  res.sendFile(path.join(`${__dirname}views/client.html`));
});

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
