// spa.js - page switching & UI wiring
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("pageTitle");
  const topUserEmail = document.getElementById("topUserEmail");
  const userEmail = document.getElementById("userEmail");
  const signOutBtn = document.getElementById("signOut");

  function showPage(id) {
    pages.forEach(p => p.id === id ? p.classList.add("visible") : p.classList.remove("visible"));
    const activeLabel = document.querySelector(`.menu-item[data-page="${id}"] .label`);
    pageTitle.innerText = activeLabel ? activeLabel.innerText : "TimeTrack";
  }

  menuItems.forEach(it => {
    it.addEventListener("click", () => {
      menuItems.forEach(m => m.classList.remove("active"));
      it.classList.add("active");
      const page = it.dataset.page;
      showPage(page);
    });
  });

  // simple user display (app.js will set actual email)
  function setUserEmail(email) {
    userEmail.innerText = email;
    topUserEmail.innerText = email;
  }

  // expose for app.js
  window.SPA = { showPage, setUserEmail };
});
