const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'weboht.hopto.org',
    user: 'pma',
    password: 'eta7oht',
    database: 'laiterekisteri',
});

module.exports = {
 feature-addNewReservation
    checkUser: (req, res) => {
        const username = req.body.tunnus;
        const password = req.body.salasana;
        console.log('Käyttäjä: ' + username + ', Salasana: ' + password);

        connection.query('SELECT * FROM kayttaja WHERE tunnus = ?', [username], (error, results, fields) => {
            if (error) {
                return res.json({ status: false, message: 'Virhe' });
            }
            if (results.length > 0) {
                if (password === results[0].salasana) {
                    req.session.user = username;
                    req.session.userid = results[0].id;
                    console.log('Session user: ' + req.session.user + 'session userid: ' + req.session.userid);
                    return res.redirect('/client');
                }
                req.session.error = 'Virheellinen salasana.';
                return res.redirect('/');
            }
            req.session.error = 'Virheellinen käyttäjätunnus.';
            return res.redirect('/');
        });
    },

    registerUser: (req, res) => {
        connection.query('INSERT INTO kayttaja(tunnus, salasana, nimi) VALUES (?, ?, ?)',
            [req.body.tunnus, req.body.salasana, req.body.nimi], (error, results, fields) => {
                if (error) {
                    console.log(error.sqlMessage);
                    throw error;
                } else {
                    req.session.success = 'Käyttäjä luotu onnistuneesti.';
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
        connection.query('SELECT tunnus, salasana, nimi, id FROM kayttaja WHERE tunnus = ?',
            [req.session.user], (error, results, fields) => {
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
            [`${req.query.sarjanro}%`, `${req.query.kategoria}%`, `${req.query.nimi}%`, `${req.query.merkki}%`, `${req.query.malli}%`, `${req.query.omistaja}%`, `${req.query.sijainti}%`],
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

    fetchAllBookings: (req, res) => {
        connection.query('SELECT * FROM varaus WHERE kayttaja_id = ? AND status = Varattu', [req.session.userid], (error, results, fields) => {
            if (error) {
                console.log(error.sqlMessage);
                throw error;
            } else {
                res.send(results);
            }
        });
    },

    deleteBooking: (req, res) => {
        connection.query('DELETE FROM varaus WHERE kayttaja_id = ?', [req.session.userid], (error, results, fields) => {
            if (error) {
                console.log(error.sqlMessage);
                throw error;
            } else {
                res.send(results);
            }
        });
    },

    fetchAllLoans: (req, res) => {
        connection.query('SELECT * FROM varaus WHERE kayttaja_id = ? AND status = Lainattu', [req.session.userid], (error, results, fields) => {
            if (error) {
                console.log(error.sqlMessage);
                throw error;
            } else {
                res.send(results);
            }
        });
    },

    fetchBookedDates: (req, res) => {                               //toimiiko tämä ja muuta format-> SELECT DATE_FORMAT(NOW(),'%Y%m%d%H%i')
        connection.query('SELECT * FROM varaus WHERE laite_id = ? AND loppupvm > NOW()', [req.params.id], (error, results, fields) => {
            if (error) {
                console.log(error.sqlMessage);
                throw error;
            } else {
                res.send(results);
            }
        });
    },

    addBookedDates: (req, res) => {
        connection.query('INSERT INTO varaus(laite_id, alkupvm, loppupvm, status, kayttaja_id) VALUES (?, ?, ?, ?, ?)',
            [req.body.laite_id, req.body.alkupvm, req.body.loppupvm, req.body.status, req.session.userid],
            (error, results, fields) => {
                if (error) {
                    console.log(error.sqlMessage);
                    throw error;
                } else {
                    res.send(results);
                }
            });
    },

    updateBooking: (req, res) => {
        connection.query('UPDATE varaus SET status = IF(status = Varattu, Lainattu IF(status = Lainattu, Palautettu)) WHERE sarjanro = ?',
            [req.params.id], (error, results, fields) => {
                if (error) {
                    console.log(error.sqlMessage);
                    throw error;
                } else {
                    res.send(results);
                }
            });
    },
};
