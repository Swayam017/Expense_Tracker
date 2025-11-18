const signupBtn = document.getElementById('signupBtn');

signupBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');

  errorMsg.textContent = "";
  successMsg.textContent = "";

  if (!username || !email || !password) {
    errorMsg.textContent = "All fields are required.";
    return;
  }

  try {
    const res = await fetch('/signup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.error || "Signup failed.";
      return;
    }

    successMsg.textContent = "Account created successfully! Redirecting...";

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1500);

  } catch (err) {
    errorMsg.textContent = "Server error, please try again later.";
  }
});
