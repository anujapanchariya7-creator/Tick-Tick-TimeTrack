// ===== SELECT ELEMENTS =====
const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const toSignup = document.getElementById("toSignup");
const toLogin = document.getElementById("toLogin");

// ===== TAB SWITCHING =====
function switchToLogin() {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");

  showLogin.classList.add("active");
  showSignup.classList.remove("active");
}

function switchToSignup() {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");

  showSignup.classList.add("active");
  showLogin.classList.remove("active");
}

// Buttons events
showLogin.onclick = switchToLogin;
showSignup.onclick = switchToSignup;

toSignup.onclick = (e) => { e.preventDefault(); switchToSignup(); };
toLogin.onclick = (e) => { e.preventDefault(); switchToLogin(); };

// ===== SIMPLE VALIDATION (Optional) =====
document.getElementById("loginForm").onsubmit = function (e) {
  e.preventDefault();
  alert("Login clicked ✔ (Firebase auth will run here)");
};

document.getElementById("signupForm").onsubmit = function (e) {
  e.preventDefault();
  alert("Signup clicked ✔ (Firebase createUser will run here)");
};
// ===== LOGIN FUNCTION =====
document.getElementById("loginForm").onsubmit = function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      document.getElementById("authMsg").textContent = "Login successful!";
      window.location.href = "app.html";    // redirect
    })
    .catch((error) => {
      document.getElementById("authMsg").textContent = error.message;
    });
};
