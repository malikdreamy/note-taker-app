const notesPage = () => {
    window.location.href = '/api/notes';
  };
const startBtn = document.getElementById("startBtn")
startBtn.addEventListener("click", notesPage);