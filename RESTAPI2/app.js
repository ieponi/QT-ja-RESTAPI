const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json())

// Yhdistä MySQL-tietokantaan
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'seppohauki',
    database: 'tietokanta',
    port: 3306
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL yhdistetty...');
});

// Luo kirja (CREATE)
app.post('/books', (req, res) => {
    const { name, author, isbn } = req.body;
    const query = 'INSERT INTO book (name, author, isbn) VALUES (?, ?, ?)';
    db.query(query, [name, author, isbn], (err, result) => {
        if (err) throw err;
        res.status(201).send(`kirja lisätty id:llä: ${result.insertId}`);
    });
});

// Hae kaikki kirjat (READ)
app.get('/books', (req, res) => {
    const query = 'SELECT * FROM book';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Hae yksi kirja ID:llä (READ)
app.get('/books/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM book WHERE id_book = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('kirjaa ei löytynyt');
        } else {
            res.json(result[0]);
        }
    });
});

// Päivitä kirja ID:llä (UPDATE)
app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { name, author, isbn } = req.body;
    const query = 'UPDATE book SET name = ?, author = ?, isbn = ? WHERE id_book = ?';
    db.query(query, [name, author, isbn, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send('kirjaa ei löytynyt');
        } else {
            res.send('kirjan tiedot päivitetty');
        }
    });
});

// Poista kirja ID:llä (DELETE)
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM book WHERE id_book = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send('kirjaa ei löytynyt');
        } else {
            res.send('kirja poistettu');
        }
    });
});
app.delete('/books', (req, res) => {
    const sql = 'DELETE FROM book';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('kaikki kirjat on poistettu');
    });
});

// Luo auto (CREATE)
app.post('/cars', (req, res) => {
    const { branch, model } = req.body;
    const query = 'INSERT INTO car (branch, model) VALUES (?, ?)';
    db.query(query, [branch, model], (err, result) => {
        if (err) throw err;
        res.status(201).send(`Auto lisätty ID:llä: ${result.insertId}`);
    });
});

// Hae kaikki autot (READ)
app.get('/cars', (req, res) => {
    const query = 'SELECT * FROM car';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Hae yksi auto ID:llä (READ)
app.get('/cars/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM car WHERE id_car = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.status(404).send('Autoa ei löytynyt');
        } else {
            res.json(result[0]);
        }
    });
});

// Päivitä auto ID:llä (UPDATE)
app.put('/cars/:id', (req, res) => {
    const { id } = req.params;
    const { branch, model } = req.body;
    const query = 'UPDATE car SET branch = ?, model = ? WHERE id_car = ?';
    db.query(query, [branch, model, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send('Autoa ei löytynyt');
        } else {
            res.send('Auton tiedot päivitetty');
        }
    });
});

// Poista auto ID:llä (DELETE)
app.delete('/cars/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM car WHERE id_car = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
            res.status(404).send('Autoa ei löytynyt');
        } else {
            res.send('Auto poistettu');
        }
    });
});

// Poista kaikki autot (DELETE)
app.delete('/cars', (req, res) => {
    const sql = 'DELETE FROM car';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('Kaikki autot on poistettu');
    });
});

// Käynnistä palvelin
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveri käynnissä portissa ${PORT}`);
});
