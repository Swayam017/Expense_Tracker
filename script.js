const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalElement = document.getElementById('total');
const addBtn = document.getElementById('add-btn');
const updateBtn = document.getElementById('update-btn');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editIndex = null;

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Render expenses in table
function renderExpenses() {
  expenseList.innerHTML = '';
  let total = 0;

  expenses.forEach((expense, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${expense.description}</td>
      <td>₹${expense.amount}</td>
      <td>${expense.date}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editExpense(${index})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteExpense(${index})">Delete</button>
      </td>
    `;
    expenseList.appendChild(tr);
    total += parseFloat(expense.amount);
  });

  totalElement.textContent = `Total: ₹${total}`;
}

// Add expense
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;

  const expense = { description, amount, date };
  expenses.push(expense);
  saveToLocalStorage();
  renderExpenses();
  form.reset();
});

// Delete expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveToLocalStorage();
  renderExpenses();
}

// Edit expense
function editExpense(index) {
  const expense = expenses[index];
  document.getElementById('description').value = expense.description;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('date').value = expense.date;

  editIndex = index;
  addBtn.style.display = 'none';
  updateBtn.style.display = 'inline-block';
}

// Update expense
updateBtn.addEventListener('click', () => {
  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;

  expenses[editIndex] = { description, amount, date };
  saveToLocalStorage();
  renderExpenses();

  form.reset();
  addBtn.style.display = 'inline-block';
  updateBtn.style.display = 'none';
  editIndex = null;
});

// Initial render
renderExpenses();
