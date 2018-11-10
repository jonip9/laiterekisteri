const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'weboht.hopto.org',
  user: 'pma',
  password: 'eta7oht',
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

  registerUser: (req, res) => {
    connection.query('INSERT INTO kayttaja(tunnus, salasana, nimi) VALUES (?, ?, ?)',
      [req.body.tunnus, req.body.salasana, req.body.nimi], (error, results, fields) => {
        if (error) {
          console.log(error.sqlMessage);
          throw error;
        } else {
          res.send(results);
        }
      });
  },

  updateUser: (req, res) => {
    connection.query('UPDATE kayttaja SET salasana = ?, nimi = ? WHERE id = ?',
      [req.body.salasana, req.body.nimi, req.params.id], (error, results, fields) => {
        if (error) {
          console.log(error.sqlMessage);
          throw error;
        } else {
          res.send(results);
        }
      });
  },

  fetchUserData: (req, res) => {
    connection.query('SELECT tunnus, nimi, id FROM kayttaja WHERE tunnus = ?',
      [req.session.username], (error, results, fields) => {
        if (error) {
          console.log(error.sqlMessage);
          throw error;
        } else {
          res.send(results);
        }
      });
  },

  addItem: (req, res) => {
    connection.query('INSERT INTO laite(kategoria, nimi, merkki, malli, omistaja, kuvaus, sijainti) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.body.kategoria, req.body.nimi, req.body.merkki, req.body.malli, req.body.omistaja, req.body.kuvaus, req.body.sijainti],
      (error, results, fields) => {
        if (error) {
          console.log(error.sqlMessage);
          throw error;
        } else {
          res.send(results);
        }
      });
  },

  updateItem: (req, res) => {
    connection.query('UPDATE laite SET kategoria = ?, nimi = ?, merkki = ?, malli = ?, omistaja = ?, kuvaus = ?, sijainti = ? WHERE sarjanro = ?',
      [req.body.kategoria, req.body.nimi, req.body.merkki, req.body.malli, req.body.omistaja, req.body.kuvaus, req.body.sijainti, req.params.id],
      (error, results, fields) => {
        if (error) {
          console.log(error.sqlMessage);
          throw error;
        } else {
          res.send(results);
        }
      });
  },

  deleteItem: (req, res) => {
    connection.query('DELETE FROM laite WHERE sarjanro = ?', [req.params.id], (error, results, fields) => {
      if (error) {
        console.log(error.sqlMessage);
        throw error;
      } else {
        res.send(results);
      }
    });
  },

  fetchAllItems: (req, res) => {
    connection.query('SELECT * FROM laite WHERE sarjanro LIKE ? AND kategoria LIKE ? AND nimi LIKE ? AND merkki LIKE ? AND malli LIKE ? AND omistaja LIKE ? AND sijainti LIKE ?',
      [req.query.sarjanro, req.query.kategoria, `${req.query.nimi}%`, `${req.query.merkki}%`, `${req.query.malli}%`, `${req.query.omistaja}%`, `${req.query.sijainti}%`],
      (error, results, fields) => {
        if (error) {
          console.log(error.sqlMessage);
          throw error;
        } else {
          res.send(results);
        }
      });
  },

  fetchOneItem: (req, res) => {
    connection.query('SELECT * FROM laite WHERE sarjanro = ?', [req.params.id], (error, results, fields) => {
      if (error) {
        console.log(error.sqlMessage);
        throw error;
      } else {
        res.send(results);
      }
    });
  },

  fetchCategory: (req, res) => {
    connection.query('SELECT id, nimi FROM kategoria', (error, results, fields) => {
      if (error) {
        console.log(error.sqlMessage);
        throw error;
      } else {
        res.send(results);
      }
    });
  },

  fetchOwner: (req, res) => {
    connection.query('SELECT id, nimi FROM omistaja', (error, results, fields) => {
      if (error) {
        console.log(error.sqlMessage);
        throw error;
      } else {
        res.send(results);
      }
    });
  },
};
