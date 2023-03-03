const express = require("express");
const app = express();
const path = require("path");
const fs = require('fs');
const util = require('util');


// Promise version of fs.readFile

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/public/js', { "Content-Type": "application/javascript" }));
app.use('/css', express.static(__dirname + '/public/css', { "Content-Type": "text/css" }));


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


const PORT = 5002;

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});



app.get('/api/notes', (req, res) =>{
res.render('notes.ejs');
});

app.get('/db', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

app.post('/addNote', (req, res) => {
  let note = req.body;
  let notesPath = path.join(__dirname, 'db', 'db.json');
  let notes = JSON.parse(fs.readFileSync(notesPath));
  notes.push(note);
  fs.writeFileSync(notesPath, JSON.stringify(notes));
  res.send('Note added successfully!');
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id);
  let notesPath = path.join(__dirname, 'db', 'db.json');
  fs.readFile(notesPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading notes file');
    } else {
      let notes = JSON.parse(data);
      let noteToDelete = notes.find(request=> request.id === req.params.id);
      console.log(notes);
      let index = notes.indexOf(noteToDelete);
      notes.splice(index, 1);
      fs.writeFile(notesPath, JSON.stringify(notes), err => {
        if (err) {
          console.error(err);
          res.status(500).send('Error writing notes file');
        } else {
          res.send('Note deleted successfully!');
        }
      });
    }
  });
});

  app.listen(process.env.PORT || 5002);

module.exports = app;