let mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'laiterekisteri',
});

module.exports = {
  checkUser: (req, res) => {
    const username = req.body.tunnus;
    const password = req.body.salasana;

    connection.query('SELECT * FROM kayttaja WHERE tunnus = ?', [username], (error, results, fields) => {
      if (error) {
        res.json({ status: false, message: 'Virhe' });
      } else if (results.length > 0) {
        if (password == results[0].salasana) {
          res.json({ status: true, message: 'OK' });
          req.session.username = username;
          res.redirect('/client');
        } else {
          res.json({ status: false, message: 'Väärä' });
          res.redirect('/?message=Virheellinen käyttäjätunnus tai salasana');
        }
      } else {
        res.json({ status: false, message: 'Väärä' });
        res.redirect('/?message=Virheellinen käyttäjätunnus tai salasana');
      }
    });
  },
};
