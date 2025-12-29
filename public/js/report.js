const expenses = [
  { date: "2025-03-01", desc: "Milk", category: "Milk", income: 0, expense: 60 },
  { date: "2025-03-04", desc: "Salary", category: "Salary", income: 40000, expense: 0 },
  { date: "2025-03-10", desc: "Groceries", category: "Food", income: 0, expense: 500 },
  { date: "2025-03-20", desc: "Electricity", category: "Bills", income: 0, expense: 800 }
];
const notes = [
  { date: "2025-03-01", note: "Paid electricity bill" },
  { date: "2025-03-10", note: "Bought groceries for week" },
  { date: "2025-03-20", note: "Unexpected medical expense" }
];
function loadNotes() {
  const notesBody = document.getElementById("notesBody");
  notesBody.innerHTML = "";

  notes.forEach(note => {
    notesBody.innerHTML += `
      <tr>
        <td>${note.date}</td>
        <td>${note.note}</td>
      </tr>
    `;
  });
}

loadNotes();

function getWeekOfMonth(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + first.getDay()) / 7);
}

function loadReport() {
  const reportBody = document.getElementById("expenseBody");
  const yearSummary = document.getElementById("yearlySummary");

  reportBody.innerHTML = "";
  yearSummary.innerHTML = "";

  let yearTotals = { income: 0, expense: 0 };
  let grouped = {};

  expenses.forEach(item => {
    const d = new Date(item.date);
    const month = d.getMonth();
    const week = getWeekOfMonth(d);

    if (!grouped[month]) grouped[month] = {};
    if (!grouped[month][week]) grouped[month][week] = [];

    grouped[month][week].push(item);
  });

  Object.keys(grouped).forEach(month => {
    Object.keys(grouped[month]).forEach(week => {
      let weekTotal = 0;

      reportBody.innerHTML += `
        <tr><td colspan="5" style="font-weight:bold;">Week ${week}</td></tr>
      `;

      grouped[month][week].forEach(item => {
        reportBody.innerHTML += `
          <tr>
            <td>${item.date}</td>
            <td>${item.desc}</td>
            <td>${item.category}</td>
            <td>${item.income ? item.income : ""}</td>
            <td>${item.expense ? item.expense : ""}</td>
          </tr>
        `;

        yearTotals.income += item.income;
        yearTotals.expense += item.expense;
        weekTotal += item.expense;
      });

            reportBody.innerHTML += `
            <tr style="font-weight:bold;background:#f4f6ff;">
                <td colspan="5" style="text-align:right; padding-right:50px;">
                Weekly Total: ₹${weekTotal}
                </td>
            </tr>
            `;

    });
  });

  // Yearly Summary
  yearSummary.innerHTML = `
    <tr>
      <td>2025</td>
      <td>₹${yearTotals.income}</td>
      <td>₹${yearTotals.expense}</td>
      <td>₹${yearTotals.income - yearTotals.expense}</td>
    </tr>`;
}

window.onload = loadReport;
