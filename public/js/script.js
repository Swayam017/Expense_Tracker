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

let editId = null;

// LOGOUT
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
});

// LOAD ALL EXPENSES
async function loadExpenses() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/expenses", {
    headers: {
      "Authorization": token
    }
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Error:", data.error);
    return;
  }

  expenseList.innerHTML = "";
  let total = 0;

  data.forEach(exp => {
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

  totalElement.textContent = `Total: ₹${total}`;
}

// ADD EXPENSE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;

  const token = localStorage.getItem("token");

  await fetch("http://localhost:3000/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ description, amount, date, category })
  });

  form.reset();
  loadExpenses();
});

// DELETE EXPENSE
async function deleteExpense(id) {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:3000/expenses/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": token
    }
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

  const token = localStorage.getItem("token");

  await fetch(`http://localhost:3000/expenses/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
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

// SHOW LEADERBOARD BUTTON ONLY IF PREMIUM USER
const token2 = localStorage.getItem("token");
if (token2) {
  const payload = JSON.parse(atob(token2.split(".")[1]));

  if (payload.isPremium) {
    document.getElementById("showLeaderboard").style.display = "block";
  }
}

// WHEN USER CLICKS LEADERBOARD BUTTON
document.getElementById("showLeaderboard").addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/premium/leaderboard", {
    headers: { Authorization: token }
  });

  const data = await res.json();
  displayLeaderboard(data.leaderboard);
});

// DISPLAY LEADERBOARD TABLE
function displayLeaderboard(list) {
  let html = `
    <h2>🏆 Leaderboard</h2>
    <table border="1" cellpadding="8" style="width: 100%; margin-top: 20px;">
      <tr>
        <th>Rank</th>
        <th>User</th>
        <th>Total Spent</th>
      </tr>
  `;

  list.forEach((user, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>₹${user.totalSpent || 0}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("leaderboard").innerHTML = html;
}

// LOAD EXPENSES ON PAGE LOAD
loadExpenses();
