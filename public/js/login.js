const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = "";

  if (!email || !password) {
    errorMsg.textContent = "All fields are required.";
    return;
  }

  try {
    const res = await fetch('/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.error || "Invalid email or password.";
      return;
    }

    // Save JWT token
    localStorage.setItem("token", data.token);

    // Redirect to expenses page
    window.location.href = "/expenses.html";

  } catch (err) {
    errorMsg.textContent = "Server error, please try again later.";
  }
});
