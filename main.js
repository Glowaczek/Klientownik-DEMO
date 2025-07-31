const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database.js');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 1000,
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    mainWindow.maximize();
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

// --- Klienci ---
ipcMain.on('add-client', (event, data) => {
    db.addClient(data.firstName, data.lastName, data.phone, data.address, data.registrationDate, (err, doc) => {
        if (err) event.reply('client-added', 'Błąd dodawania klienta!');
        else event.reply('client-added', 'Dodano klienta pomyślnie');
    });
});
ipcMain.on('load-clients', (event) => {
    db.getClients((err, docs) => {
        console.log('getClients zwrócił:', docs);
        if (err) {
            console.error('Błąd pobierania klientów:', err);
            event.reply('clients-loaded', []);
        } else {
            event.reply('clients-loaded', docs);
        }
    });
});
ipcMain.on('delete-client', (event, id) => {
    db.deleteClient(id, (err) => {
        if (err) event.reply('client-deleted', 'Błąd usuwania klienta!');
        else event.reply('client-deleted', 'Usunięto klienta');
    });
});
ipcMain.on('update-client', (event, data) => {
    db.updateClient(data.id, data.firstName, data.lastName, data.phone, data.address, (err) => {
        if (err) event.reply('client-updated', 'Błąd edycji klienta!');
        else event.reply('client-updated', 'Zaktualizowano dane klienta');
    });
});

// --- Notatki ---
ipcMain.on('add-note', (event, data) => {
    db.addNote(data.text, data.date, (err, doc) => {
        if (err) event.reply('note-added', 'Błąd dodawania notatki!');
        else event.reply('note-added', 'Dodano notatkę');
    });
});
ipcMain.on('load-notes', (event) => {
    db.getNotes((err, docs) => {
        console.log('getNotes zwrócił:', docs);
        if (err) {
            console.error('Błąd pobierania notatek:', err);
            event.reply('notes-loaded', []);
        } else {
            event.reply('notes-loaded', docs);
        }
    });
});
ipcMain.on('delete-note', (event, id) => {
    db.deleteNote(id, (err) => {
        if (err) event.reply('note-deleted', 'Błąd usuwania notatki!');
        else event.reply('note-deleted', 'Usunięto notatkę');
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});