const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Błąd otwierania bazy danych:', err.message);
    } else {
        console.log('Połączono z bazą danych SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            registration_date TEXT NOT NULL
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            date TEXT NOT NULL
        )`);
    }
});


function addClient(firstName, lastName, phone, address, registrationDate, callback) {
    db.run(
        'INSERT INTO clients (first_name, last_name, phone, address, registration_date) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, phone, address, registrationDate],
        function (err) {
            if (err) return callback(err);
            callback(null, { id: this.lastID });
        }
    );
}

function getClients(callback) {
    db.all(
        'SELECT * FROM clients ORDER BY registration_date DESC',
        (err, rows) => {
            if (err) {
                console.error('Błąd pobierania klientów:', err);
                return callback(err, []);
            }
            callback(null, rows);
        }
    );
}

function deleteClient(id, callback) {
    db.run(
        'DELETE FROM clients WHERE id = ?',
        [id],
        (err) => callback(err)
    );
}

function updateClient(id, firstName, lastName, phone, address, callback) {
    db.run(
        'UPDATE clients SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?',
        [firstName, lastName, phone, address, id],
        (err) => callback(err)
    );
}


function addNote(text, date, callback) {
    db.run(
        'INSERT INTO notes (text, date) VALUES (?, ?)',
        [text, date],
        function (err) {
            if (err) return callback(err);
            callback(null, { id: this.lastID });
        }
    );
}

function getNotes(callback) {
    db.all(
        'SELECT * FROM notes ORDER BY date DESC',
        (err, rows) => {
            if (err) {
                console.error('Błąd pobierania notatek:', err);
                return callback(err, []);
            }
            callback(null, rows);
        }
    );
}

function deleteNote(id, callback) {
    db.run(
        'DELETE FROM notes WHERE id = ?',
        [id],
        (err) => callback(err)
    );
}

module.exports = {
    addClient,
    getClients,
    deleteClient,
    updateClient,
    addNote,
    getNotes,
    deleteNote
};