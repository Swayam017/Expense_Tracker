const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalElement = document.getElementById('total');
const addBtn = document.getElementById('add-btn');
const updateBtn = document.getElementById('update-btn');

let editId = null;

// Fetch expenses
async function loadExpenses() {
  const res = await fetch("http://localhost:3000/expenses");
  const expenses = await res.json();

  expenseList.innerHTML = "";
  let total = 0;

  expenses.forEach(exp => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${exp.description}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.date}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editExpense(${exp.id}, '${exp.description}', '${exp.amount}', '${exp.date}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
      </td>
    `;

    expenseList.appendChild(tr);
    total += parseFloat(exp.amount);
  });

  totalElement.textContent = `Total: ₹${total}`;
}

// Add expense
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  await fetch("http://localhost:3000/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, amount, date })
  });

  form.reset();
  loadExpenses();
});

// Delete
async function deleteExpense(id) {
  await fetch(`http://localhost:3000/expenses/${id}`, { method: "DELETE" });
  loadExpenses();
}

// Edit
function editExpense(id, description, amount, date) {
  editId = id;
  document.getElementById("description").value = description;
  document.getElementById("amount").value = amount;
  document.getElementById("date").value = date;

  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
}

// Update
updateBtn.addEventListener("click", async () => {
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  await fetch(`http://localhost:3000/expenses/${editId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, amount, date })
  });

  form.reset();
  updateBtn.style.display = "none";
  addBtn.style.display = "inline-block";
  editId = null;

  loadExpenses();
});

// Load initial data
loadExpenses();
