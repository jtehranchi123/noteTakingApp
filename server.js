const express = require('express');
let notes = require('./db/db.json');
const app = express();
const fs = require('fs');
const path = require('path');
const {uid} = require('uid');
const { listen } = require('express/lib/application');
const { listenerCount } = require('stream');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uid(10),
    }
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
        if (err) { console.log(err)}
        res.json(newNote);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter(note => note.id !== req.params.id);
    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
        if (err) { console.log(err)}
        res.sendStatus(200);
    });
});





app.listen(process.env.PORT || 3000);