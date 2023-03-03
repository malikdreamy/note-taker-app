let noteTitle = document.querySelector(".note-title");
let noteText = document.querySelector(".note-textarea");
let saveBtn = document.querySelector(".save-note");
let newNote = document.querySelector(".new-note");
//let deleteBtns = document.querySelectorAll(".deleteBtn");
// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};
// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};
// activeNote is used to keep track of the note in the textarea
let activeNote = {};
const getNotes = () => {
fetch('/db').then(response => response.json())
.then(data => {
let notesHTML = '';
data.forEach(note => {

notesHTML += `<div data-id="${note.id}" class="note">
<h3> ${note.title}</h3>
<p>${note.text}<p>
<ul class="list-group"></ul>
<button class="viewNote">View & Edit</button>
<button class="deleteBtn">Delete Note</button>
</div>`;
});
notesContainer = document.getElementById('list-container');
notesContainer.innerHTML = notesHTML;
const viewBtns = document.querySelectorAll(".viewNote");
viewBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
  viewNote (e);
  });
});
const deleteBtns = document.querySelectorAll(".deleteBtn");
deleteBtns.forEach(btn => {
btn.addEventListener('click', (e) => {
deleteNote (e);
});
});
})
.catch(error => {
console.error(error);
});
}
getNotes();

class Note {
  constructor(id, title, text) {
    this.id = new Date().getTime().toString(); // generate a unique id
    this.title = title;
    this.text = text;
  }
  completeNote() {
    let note = document.createElement('div');
    
    note.dataset.id = this.id; // set the note's id
    note.class = 'note';
    note.innerHTML = `
    <div data-id="${this.id}" class="note">
      <h3>${this.title}</h3>
      <p>${this.text}</p>
      <ul class="list-group"></ul>
      <button class="viewNote">View & Edit</button>
      <button class="deleteBtn">Delete Note</button>`;
    return note;
  }
}

const saveNotes = () => {
  if (noteTitle.value == "" || noteText.value == "") {
    alert("Please Enter a Title & Text before Saving");
  } else {
    let newNoteTitle = noteTitle.value;
    let newNoteText = noteText.value;
    let newId = new Date().getTime().toString();
    let newNote = new Note(newId, newNoteTitle, newNoteText);
    notesContainer.appendChild(newNote.completeNote());
    const viewBtns = document.querySelectorAll(".viewNote");
  viewBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
  viewNote(e);
  });
});

    const deleteBtns = document.querySelectorAll(".deleteBtn");
      deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
      deleteNote (e);
      });
      });
    // Clear the input fields
    noteTitle.value = "";
    noteText.value = "";
    fetch('/addNote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: newId, title: newNote.title, text: newNote.text})

    })
    .then(response => response.text())
    .catch(error => console.error(error));
    
  }
}
saveBtn.addEventListener("click", saveNotes);

async function viewNote(e){
  const noteViewed = await e.target.closest('.note');
document.querySelector(".note-title").value = noteViewed.childNodes[1].innerText;
document.querySelector(".note-textarea").value = noteViewed.childNodes[3].innerText;

}

const getViewBtns = () =>{
  setTimeout(() => {
    let viewBtns = document.querySelectorAll(".viewNote");
    //console.log(viewBtns);
    viewBtns.forEach(btn => {
      btn.addEventListener("click", (e) =>{
        viewNote(e);
      });
    });
  }, 500); // .5 second delay so button successfully loads
}

// Call the function immediately without waiting for DOMContentLoaded
getViewBtns();
async function deleteNote (e) {
  const noteContainer = e.target.closest('.note');
  const id = noteContainer.dataset.id;
  try {
    const response = await fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      // Note was successfully deleted, so remove it from the DOM
      noteContainer.remove();
    } else {
      throw new Error('Failed to delete note');
    }
  } catch (error) {
    console.error(error);
  }
}

//let deleteBtns = document.querySelectorAll(".deleteBtn");
const getDeleteButtons = async () => {
  await new Promise(resolve => setTimeout(resolve, 0)); // wait for the next event loop iteration
  let deleteBtns = document.querySelectorAll(".deleteBtn");
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      deleteNote (e);
    });
  });
};

getDeleteButtons();



