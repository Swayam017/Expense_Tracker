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

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
});

// Load all expenses
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

// Add expense
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

// Delete
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

// Edit
function editExpense(id, description, amount, date, category) {
  editId = id;
  document.getElementById("description").value = description;
  document.getElementById("amount").value = amount;
  document.getElementById("date").value = date;
  document.getElementById("category").value = category;

  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
}

// Update
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

// Load initial
loadExpenses();
