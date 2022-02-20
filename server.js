const express = require('express');
const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');

// set up express server
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming data
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'))


// html routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


//api routes
app.get('/api/notes', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    return res.json(notes);
});

// function to  create a new note upon post request
function createNewNote(body) {
    let newNote = body;
    let currentNotes = JSON.parse(
        fs.readFileSync('./db/db.json', 'utf8')
    );
    newNote.id = currentNotes.length.toString();
    currentNotes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(currentNotes));
    return currentNotes;
}

// post route to handle new note creation
app.post('/api/notes', (req, res) => {
    // req.body.id = notes.length.toString();
    let updatedNotes = createNewNote(req.body);
    return res.json(updatedNotes);
});


// function to delete a note by its ID
function deleteNote(id) {
    let currentNotes = JSON.parse(
        fs.readFileSync('./db/db.json', 'utf8')
    );
    let newArray = currentNotes.filter(file => file.id !== id);
    fs.writeFileSync('./db/db.json', JSON.stringify(newArray));
    return newArray;
}

// delete route to handle deleting a specific note
app.delete('/api/notes/:id', (req, res) => {
    let deleted = deleteNote(req.params.id);
    return res.json(deleted)
})

// catch all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


// listener
app.listen(PORT, () => {
    console.log(`API server note listening on port ${PORT}!`);
});