// ================= AI INSIGHTS =================
async function getInsights() {
  document.getElementById("aiResult").innerHTML = "Analyzing... ⏳";

  try {
    const res = await fetch("http://localhost:3000/api/ai/insights", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();

    document.getElementById("aiResult").innerHTML = `
      <h3>📊 Spending Insights</h3>
      <p>${data.insight.replace(/\n/g, "<br>")}</p>
    `;
  } catch (error) {
    document.getElementById("aiResult").innerHTML =
      "❌ Failed to load insights";
  }
}
function openReport() {
  window.location.href = "report.html";
}
