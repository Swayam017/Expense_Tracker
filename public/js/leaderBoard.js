// ---------------- LEADERBOARD ----------------

leaderboardBtn.addEventListener("click", async () => {
  const res = await fetch("http://localhost:3000/premium/leaderboard", {
    headers: getAuthHeader()
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
        <td>${user.username}</td>
        <td>₹${user.totalSpent || 0}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("leaderboard").innerHTML = html;
}
