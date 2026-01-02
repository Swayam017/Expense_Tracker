let editNoteId = null;
let notesData = [];

// ================= LOAD NOTES =================
async function loadNotes() {
  const res = await fetch("/api/notes", {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
  });

  const data = await res.json();
  notesData = data.notes;

  const notesBody = document.getElementById("notesBody");
  notesBody.innerHTML = "";

  notesData.forEach(note => {
    notesBody.innerHTML += `
      <tr>
        <td>${note.date}</td>
        <td>${note.note}</td>
        <td>
          <button class="edit-btn" data-id="${note.id}" data-note="${note.note}" data-date="${note.date}">Edit</button>
          <button class="delete-btn" data-id="${note.id}">Delete</button>
        </td>
      </tr>
    `;
  });

  bindNoteActions();
}

// ================= BIND BUTTONS =================
function bindNoteActions() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = () => {
      editNote(
        btn.dataset.id,
        btn.dataset.note,
        btn.dataset.date
      );
    };
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = () => deleteNote(btn.dataset.id);
  });
}

// ================= ADD / UPDATE NOTE =================
async function addNote() {
  const note = document.getElementById("noteText").value;
  const date = document.getElementById("noteDate").value;

  if (!note || !date) return alert("Please enter both fields");

  const url = editNoteId ? `/api/notes/${editNoteId}` : `/api/notes`;
  const method = editNoteId ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ note, date })
  });

  editNoteId = null;
  document.getElementById("noteText").value = "";
  document.getElementById("noteDate").value = "";

  loadNotes();
}

// ================= EDIT =================
function editNote(id, note, date) {
  editNoteId = id;
  document.getElementById("noteText").value = note;
  document.getElementById("noteDate").value = date;
}

// ================= DELETE =================
async function deleteNote(id) {
  if (!confirm("Delete this note?")) return;

  await fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
  });

  loadNotes();
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadNotes();
});
