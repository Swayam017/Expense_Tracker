// Redirect to login if no token
if (!localStorage.getItem("token")) {
  window.location.href = "/login.html";
}

const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalElement = document.getElementById('total');
const addBtn = document.getElementById('add-btn');
const updateBtn = document.getElementById('update-btn');
const logoutBtn = document.getElementById('logoutBtn');
const buyPremiumBtn = document.getElementById("buyPremiumBtn");
const leaderboardBtn = document.getElementById("showLeaderboard");

let editId = null;

// LOGOUT
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
});

// Helper to get Bearer token
function getAuthHeader() {
  return { "Authorization": "Bearer " + localStorage.getItem("token") };
}


// ADD EXPENSE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  //const category = document.getElementById("category").value;

  await fetch("http://localhost:3000/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ description, amount, date })
  });

  form.reset();
  loadExpenses();
});

// DELETE EXPENSE
async function deleteExpense(id) {
  await fetch(`http://localhost:3000/expenses/${id}`, {
    method: "DELETE",
    headers: getAuthHeader()
  });

  loadExpenses();
}

// EDIT EXPENSE
function editExpense(id, description, amount, date, category) {
  editId = id;
  document.getElementById("description").value = description;
  document.getElementById("amount").value = amount;
  document.getElementById("date").value = date;
  document.getElementById("category").value = category;

  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
}

// UPDATE EXPENSE
updateBtn.addEventListener("click", async () => {
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;


  await fetch(`http://localhost:3000/expenses/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ description, amount, date, category })
  });

  form.reset();
  updateBtn.style.display = "none";
  addBtn.style.display = "inline-block";
  editId = null;

  loadExpenses();
});

// ---------------- PREMIUM LOGIC ----------------

function applyPremiumUI() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const premiumSection = document.querySelector(".premium-section");

  if (payload.isPremium) {
    buyPremiumBtn.style.display = "none";       // HIDE BUY BUTTON
    premiumSection.style.display = "block";     // SHOW LEADERBOARD
  } else {
    buyPremiumBtn.style.display = "block";
    premiumSection.style.display = "none";
  }
}

// Apply premium UI on load
applyPremiumUI();


// LOAD EXPENSES WITH PAGINATION
let pageSize = parseInt(localStorage.getItem("pageSize")) || 10;
let currentPage = 1;
const limit = 3;

document.getElementById("pageSizeSelect").value = pageSize;

document.getElementById("pageSizeSelect").addEventListener("change", (e) => {
  pageSize = parseInt(e.target.value);
  localStorage.setItem("pageSize", pageSize);
  currentPage = 1; // reset page
  loadExpenses(currentPage);
});


// LOAD EXPENSES WITH PAGINATION
async function loadExpenses(page = 1) {
  const res = await fetch(
    `http://localhost:3000/expenses?page=${page}&limit=${pageSize}`,
    { headers: getAuthHeader() }
  );

  const data = await res.json();
  if (!data.success) return;

  expenseList.innerHTML = "";
  let total = 0;

  data.expenses.forEach(exp => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${exp.description}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>
        <button onclick="editExpense(${exp.id}, '${exp.description}', '${exp.amount}', '${exp.date}', '${exp.category}')">Edit</button>
        <button onclick="deleteExpense(${exp.id})">Delete</button>
      </td>
    `;
    expenseList.appendChild(tr);
    total += Number(exp.amount);
  });

  document.getElementById("total").innerText = `Total: ₹${total}`;

  renderPagination(data.currentPage, data.totalPages);
}

// RENDER PAGE BUTTONS
function renderPagination(current, totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  let start = Math.max(1, current - 1);
  let end = Math.min(totalPages, current + 1);

  // Ensure always 3 buttons if possible
  if (current === 1) end = Math.min(3, totalPages);
  if (current === totalPages) start = Math.max(1, totalPages - 2);

  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = "page-btn";

    if (i === current) btn.classList.add("active");

    btn.onclick = () => loadExpenses(i);
    pagination.appendChild(btn);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  loadNotes();
  loadExpenses(1);
});




