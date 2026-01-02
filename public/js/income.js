if (!localStorage.getItem("token")) {
  window.location.href = "/login.html";
}

let editId = null;
const addBtn = document.getElementById("add-btn");
const updateBtn = document.getElementById("update-btn");
const totalElement = document.getElementById("total");

function getAuthHeader() {
  return { Authorization: "Bearer " + localStorage.getItem("token") };
}
const token = localStorage.getItem("token");
if (!token) {
  alert("Session expired. Please login again.");
  window.location.href = "/login.html";
}

async function loadIncome() {
  const res = await fetch("http://localhost:3000/income", {
    headers: getAuthHeader()
  });

  if (!res.ok) {
  console.error("Failed to fetch income");
  return;
}


  const data = await res.json();
  const list = document.getElementById("incomeList");
  list.innerHTML = "";

  let total = 0;

  data.incomes.forEach(income => {
    total += Number(income.amount);

    list.innerHTML += `
      <tr>
        <td>${income.source}</td>
        <td>₹${income.amount}</td>
        <td>${new Date(income.date).toLocaleDateString()}</td>
        <td>
          <button onclick="editIncome(${income.id}, '${income.source}', '${income.amount}', '${income.date}')">Edit</button>
          <button onclick="deleteIncome(${income.id})">Delete</button>
        </td>
      </tr>
    `;
  });

  totalElement.textContent = `Total: ₹${total}`;
}

document.getElementById("incomeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const source = document.getElementById("source").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  await fetch("http://localhost:3000/income", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ source, amount, date })
  });

  e.target.reset();
  loadIncome();
});

function editIncome(id, source, amount, date) {
  editId = id;
  document.getElementById("source").value = source;
  document.getElementById("amount").value = amount;
  document.getElementById("date").value = date;

  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
}

updateBtn.addEventListener("click", async () => {
  const source = document.getElementById("source").value;
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;

  await fetch(`http://localhost:3000/income/${editId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ source, amount, date })
  });

  editId = null;
  updateBtn.style.display = "none";
  addBtn.style.display = "inline-block";

  document.getElementById("incomeForm").reset();
  loadIncome();
});

async function deleteIncome(id) {
  await fetch(`http://localhost:3000/income/${id}`, {
    method: "DELETE",
    headers: getAuthHeader()
  });
  loadIncome();
}

loadIncome();
