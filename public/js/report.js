async function loadReport() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/report", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  const { expenses, incomes } = data;

  const table = document.getElementById("expenseBody");
  const summary = document.getElementById("yearlySummary");

  table.innerHTML = "";
  summary.innerHTML = "";

  let yearIncome = 0;
  let yearExpense = 0;

  // Merge income + expense
  const records = [];

  expenses.forEach(e => {
    records.push({
      date: new Date(e.date),
      desc: e.description,
      category: e.category,
      income: 0,
      expense: e.amount
    });
    yearExpense += Number(e.amount);
  });

  incomes.forEach(i => {
    records.push({
      date: new Date(i.date),
      desc: i.source || "Income",
      category: "Income",
      income: i.amount,
      expense: 0
    });
    yearIncome += Number(i.amount);
  });

  // Sort by date
  records.sort((a, b) => a.date - b.date);

  // Group by Month & Week
  const grouped = {};

  records.forEach(item => {
    const year = item.date.getFullYear();
    const month = item.date.getMonth() + 1;
    const week = Math.ceil(item.date.getDate() / 7);
    const key = `${year}-${month}`;

    if (!grouped[key]) grouped[key] = {};
    if (!grouped[key][week]) grouped[key][week] = [];

    grouped[key][week].push(item);
  });

  // Render data
  Object.keys(grouped).forEach(monthKey => {
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    Object.keys(grouped[monthKey]).forEach(week => {
      table.innerHTML += `
        <tr class="week-header">
          <td colspan="5"><b>${monthKey.replace("-", " Month ")} - Week ${week}</b></td>
        </tr>
      `;

      grouped[monthKey][week].forEach(row => {
        table.innerHTML += `
          <tr>
            <td>${row.date.toISOString().split("T")[0]}</td>
            <td>${row.desc}</td>
            <td>${row.category}</td>
            <td>${row.income ? "Rs. " + row.income : ""}</td>
            <td>${row.expense ? "Rs. " + row.expense : ""}</td>
          </tr>
        `;
        monthlyIncome += row.income;
        monthlyExpense += row.expense;
      });
    });

    // 🔹 MONTH TOTAL ROW
    table.innerHTML += `
      <tr style="background:#e8f0ff;font-weight:bold;">
        <td colspan="3">Total for ${monthKey}</td>
        <td>Rs. ${monthlyIncome}</td>
        <td>Rs. ${monthlyExpense}</td>
      </tr>
    `;
  });

  // YEAR SUMMARY
  summary.innerHTML = `
    <tr>
      <td>${new Date().getFullYear()}</td>
      <td>Rs. ${yearIncome}</td>
      <td>Rs. ${yearExpense}</td>
      <td>Rs. ${yearIncome - yearExpense}</td>
    </tr>
  `;
}
async function loadNotes() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/notes", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  const notesBody = document.getElementById("notesBody");

  notesBody.innerHTML = "";

  data.notes.forEach(note => {
    notesBody.innerHTML += `
      <tr>
        <td>${note.date}</td>
        <td>${note.note}</td>
      </tr>
    `;
  });
}


window.onload = () => {
  loadReport();
  loadNotes();
};


function downloadReport() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text("Expense Report", 14, 15);

  let y = 25;

  // ---------------- NOTES TABLE ----------------
  doc.setFontSize(12);
  doc.text("Notes", 14, y);
  y += 5;

  const noteRows = [];
  document.querySelectorAll("#notesBody tr").forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length >= 2) {
      noteRows.push([cols[0].innerText, cols[1].innerText]);
    }
  });

  doc.autoTable({
    startY: y,
    head: [["Date", "Note"]],
    body: noteRows,
  });

  y = doc.lastAutoTable.finalY + 10;

  // ---------------- EXPENSE TABLE ----------------
  doc.text("Expense Report", 14, y);
  y += 5;

  const expenseRows = [];
  document.querySelectorAll("#expenseBody tr").forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length >= 5) {
      expenseRows.push([
        cols[0].innerText,
        cols[1].innerText,
        cols[2].innerText,
        cols[3].innerText,
        cols[4].innerText
      ]);
    }
  });

  doc.autoTable({
    startY: y,
    head: [["Date", "Description", "Category", "Income", "Expense"]],
    body: expenseRows,
  });
    y = doc.lastAutoTable.finalY + 10;

// ------------------ YEARLY SUMMARY ------------------
  doc.text("Yearly Summary", 14, y);
  y += 5;

  const summaryRows = [];
  document.querySelectorAll("#yearlySummary tr").forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length === 4) {
      summaryRows.push([
        cols[0].innerText,
        cols[1].innerText,
        cols[2].innerText,
        cols[3].innerText
      ]);
    }
  });

  doc.autoTable({
    startY: y,
    head: [["Month", "Income", "Expense", "Savings"]],
    body: summaryRows
  });

  doc.save("Expense_Report.pdf");
}