const { ipcRenderer } = require('electron');

const showFormBtn = document.getElementById('show-form-btn');
const clientModal = document.getElementById('client-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const clientForm = document.getElementById('client-form');
const cancelFormBtn = document.getElementById('cancel-form-btn');
const modalTitle = document.getElementById('modal-title');
const clientList = document.getElementById('client-list');
const messageDiv = document.getElementById('message');
const searchInput = document.getElementById('search-client');
const searchBtn = document.getElementById('search-btn');

const addNoteBtn = document.getElementById('add-note-btn');
const notesList = document.getElementById('notes-list');
const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const cancelNoteBtn = document.getElementById('cancel-note-btn');

const customMessage = document.getElementById('custom-message');
const customMessageText = document.getElementById('custom-message-text');
const customMessageCloseBtn = document.getElementById('custom-message-close');

let editMode = false;
let editClientId = null;
let allClients = [];

function openModal(edit = false) {
    clientModal.classList.add('show');
    clientModal.classList.remove('hidden');
    modalTitle.textContent = edit ? "Edytuj klienta" : "Dodaj klienta";
    messageDiv.textContent = '';
    enableForm();
}

function closeModal() {
    if (!clientModal.classList.contains('hidden')) {
        clientModal.classList.remove('show');
        clientModal.classList.add('hidden');
        resetForm();
    }
}

showFormBtn.addEventListener('click', () => {
    resetForm();
    openModal(false);
});

closeModalBtn.addEventListener('click', closeModal);
cancelFormBtn.addEventListener('click', closeModal);

function validateForm(firstName, lastName, phone, address) {
    const phonePattern = /^(?:\d{3}-\d{3}-\d{3}|\d{9})$/;
    if (!firstName || !lastName || !phone || !address) {
        return 'Wszystkie pola są wymagane.';
    }
    if (!phonePattern.test(phone)) {
        return 'Numer telefonu musi mieć format 000-000-000 lub 000000000.';
    }
    return null;
}

function resetForm() {
    clientForm.reset();
    editMode = false;
    editClientId = null;
    clientForm.querySelector('button[type="submit"]').textContent = "Zapisz";
    enableForm();
}

function enableForm() {
    Array.from(clientForm.elements).forEach(el => {
        el.disabled = false;
        el.readOnly = false;
    });
}

clientForm.addEventListener('submit', (event) => {
    event.preventDefault();
    enableForm();

    const firstName = clientForm.elements['first-name'].value;
    const lastName = clientForm.elements['last-name'].value;
    const phone = clientForm.elements['phone'].value;
    const address = clientForm.elements['address'].value;

    const validationError = validateForm(firstName, lastName, phone, address);
    if (validationError) {
        messageDiv.textContent = validationError;
        messageDiv.style.color = '#dc3545';
        return;
    }

    if (editMode && editClientId !== null) {
        ipcRenderer.send('update-client', {
            id: editClientId,
            firstName,
            lastName,
            phone,
            address
        });
    } else {
        ipcRenderer.send('add-client', {
            firstName,
            lastName,
            phone,
            address,
            registrationDate: new Date().toISOString()
        });
    }
});

ipcRenderer.on('client-added', () => {
    closeModal();
    loadClients();
});

ipcRenderer.on('client-updated', () => {
    closeModal();
    loadClients();
});

ipcRenderer.on('client-deleted', (event, message) => {
    showCustomMessage(message);
    loadClients();
});

ipcRenderer.on('clients-loaded', (event, clients) => {
    allClients = clients;
    renderClients(clients);
});

function doSearch() {
    const val = searchInput.value.trim().toLowerCase();
    if (!val) {
        renderClients(allClients);
        return;
    }
    const filtered = allClients.filter(c =>
        (c.first_name && c.first_name.toLowerCase().includes(val)) ||
        (c.last_name && c.last_name.toLowerCase().includes(val)) ||
        (c.phone && c.phone.toLowerCase().includes(val)) ||
        (c.address && c.address.toLowerCase().includes(val))
    );
    renderClients(filtered);
}

searchInput.addEventListener('input', doSearch);
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        doSearch();
    }
});

function renderClients(clients) {
    clientList.innerHTML = '';
    clients.forEach((client) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.first_name}</td>
            <td>${client.last_name}</td>
            <td>${client.phone}</td>
            <td>${client.address}</td>
            <td>${new Date(client.registration_date).toLocaleDateString()}</td>
            <td>
                <button class="action-btn edit-btn">Edytuj</button>
                <button class="action-btn delete-btn">Usuń</button>
            </td>
        `;
        clientList.appendChild(row);
    });
}

clientList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const row = e.target.closest('tr');
        const id = row.cells[0].textContent;
        ipcRenderer.send('delete-client', id);
    }

    if (e.target.classList.contains('edit-btn')) {
        const row = e.target.closest('tr');
        editClientId = row.cells[0].textContent;
        clientForm.elements['first-name'].value = row.cells[1].textContent;
        clientForm.elements['last-name'].value = row.cells[2].textContent;
        clientForm.elements['phone'].value = row.cells[3].textContent;
        clientForm.elements['address'].value = row.cells[4].textContent;
        editMode = true;
        openModal(true);
    }
});

function renderNotes(notes = []) {
    notesList.innerHTML = '';
    notes.forEach((note) => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.dataset.id = note.id; 
        noteDiv.innerHTML = `
            <span>${note.text} (${new Date(note.date).toLocaleDateString()})</span>
            <button class="note-remove">&times;</button>
        `;
        notesList.appendChild(noteDiv);
    });
}

function loadClients() {
    ipcRenderer.send('load-clients');
}

function loadNotes() {
    ipcRenderer.send('load-notes');
}

ipcRenderer.on('notes-loaded', (event, notes) => {
    renderNotes(notes);
});

ipcRenderer.on('note-added', () => {
    loadNotes();
});

ipcRenderer.on('note-deleted', (event, message) => {
    showCustomMessage(message);
    loadNotes();
});

addNoteBtn.addEventListener('click', () => {
    noteForm.classList.remove('hidden');
    addNoteBtn.style.display = 'none';
    noteInput.value = '';
    noteInput.focus();
    enableNoteForm();
});

cancelNoteBtn.addEventListener('click', () => {
    noteForm.classList.add('hidden');
    addNoteBtn.style.display = 'inline-block';
    noteInput.value = '';
    enableNoteForm();
});

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    enableNoteForm();
    const text = noteInput.value.trim();
    if (text) {
        ipcRenderer.send('add-note', {
            text,
            date: new Date().toISOString()
        });
    }
    noteForm.classList.add('hidden');
    addNoteBtn.style.display = 'inline-block';
    noteInput.value = '';
    enableNoteForm();
});

notesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('note-remove')) {
        const noteDiv = e.target.closest('.note');
        const noteId = noteDiv.dataset.id; 
        ipcRenderer.send('delete-note', noteId);
    }
});

function enableNoteForm() {
    Array.from(noteForm.elements).forEach(el => {
        el.disabled = false;
        el.readOnly = false;
    });
}

function showCustomMessage(message) {
    customMessageText.textContent = message;
    customMessage.classList.remove('hidden');

 
    customMessageCloseBtn.addEventListener('click', () => {
        customMessage.classList.add('hidden');
    }, { once: true });
}

loadClients();
loadNotes();