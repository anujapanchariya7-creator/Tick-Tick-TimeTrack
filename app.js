// app.js - activity logic (localStorage demo) + timer
document.addEventListener("DOMContentLoaded", () => {
  // elements
  const datePicker = document.getElementById("datePicker");
  const addForm = document.getElementById("addForm");
  const actName = document.getElementById("actName");
  const actCategory = document.getElementById("actCategory");
  const actMinutes = document.getElementById("actMinutes");
  const activitiesList = document.getElementById("activitiesList");
  const remainingEl = document.getElementById("remaining");
  const totalUsedEl = document.getElementById("totalUsed");
  const analyseBtn = document.getElementById("analyseBtn");
  const recentList = document.getElementById("recentList");

  // timer elements
  const timerDisplay = document.getElementById("timerDisplay");
  const timerStart = document.getElementById("timerStart");
  const timerPause = document.getElementById("timerPause");
  const timerStop = document.getElementById("timerStop");
  const timerLabel = document.getElementById("timerLabel");
  const sessionsList = document.getElementById("sessionsList");

  // default date = today
  const todayISO = new Date().toISOString().slice(0,10);
  datePicker.value = todayISO;

  // storage key
  const STORAGE_KEY = "tt_activities_v1";

  // read/write storage
  function loadStorage(){
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }
  function saveStorage(obj){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  // helper: get activities for date
  function getForDate(date){
    const db = loadStorage();
    return db[date] || [];
  }

  function setForDate(date, arr){
    const db = loadStorage();
    db[date] = arr;
    saveStorage(db);
  }

  // render list and summary
  function renderActivities(){
    const date = datePicker.value;
    const items = getForDate(date);
    activitiesList.innerHTML = "";
    if(items.length === 0){
      activitiesList.innerHTML = "<div class='muted'>No activities logged for this date.</div>";
      analyseBtn.disabled = true;
    } else {
      items.forEach((it, idx) => {
        const node = document.createElement("div");
        node.className = "activity-item";
        node.innerHTML = `
          <div class="activity-meta">
            <div>
              <div style="font-weight:600">${it.name}</div>
              <div class="muted" style="font-size:13px">${it.category || '—'}</div>
            </div>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <div class="muted" style="min-width:70px; text-align:right;">${it.minutes} min</div>
            <button class="btn outline small" data-action="edit" data-idx="${idx}">Edit</button>
            <button class="btn outline small" data-action="del" data-idx="${idx}">Delete</button>
          </div>
        `;
        activitiesList.appendChild(node);
      });
      analyseBtn.disabled = false;
    }

    // summary
    const totalUsed = items.reduce((s,i)=> s + Number(i.minutes || 0), 0);
    const remaining = Math.max(1440 - totalUsed, 0);
    remainingEl.innerText = `${remaining} min remaining`;
    totalUsedEl.innerText = `${totalUsed} min used • ${items.length} activities`;

    // recent list (for dashboard)
    renderRecent();
  }

  function renderRecent(){
    const db = loadStorage();
    const all = [];
    Object.keys(db).forEach(date => {
      db[date].forEach(it => all.push({ date, ...it }));
    });
    // sort by date desc
    all.sort((a,b) => (a.date < b.date) ? 1 : -1);
    recentList.innerHTML = "";
    const slice = all.slice(0,6);
    if(slice.length === 0){
      recentList.innerHTML = "<div class='muted'>No recent activities</div>";
    } else {
      slice.forEach(it => {
        const el = document.createElement("div");
        el.className = "activity-item";
        el.innerHTML = `<div><strong>${it.name}</strong><div class='muted small'>${it.category || '—'} • ${it.date}</div></div><div class='muted'>${it.minutes} min</div>`;
        recentList.appendChild(el);
      });
    }

    // update dashboard stats
    updateDashboardStats(all);
  }

  function updateDashboardStats(all){
    const total = all.reduce((s,i)=> s + Number(i.minutes||0), 0);
    document.getElementById("dashTotalMinutes").innerText = total;
    // top category
    const count = {};
    all.forEach(it => { const c = it.category || 'Uncategorized'; count[c] = (count[c]||0) + Number(it.minutes||0); });
    const top = Object.entries(count).sort((a,b)=>b[1]-a[1])[0];
    document.getElementById("dashTopCategory").innerText = top ? `${top[0]} (${top[1]}m)` : '—';
    // daily avg (simple)
    const days = new Set(all.map(a=>a.date)).size || 1;
    const avg = Math.round(total / days);
    document.getElementById("dashDailyAvg").innerText = avg;

    function updateDashboardStats(entries) {
  // 1. Total Minutes
  let total = 0;
  let categoryMap = {};

  entries.forEach(e => {
    total += e.minutes;
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.minutes;
  });

  document.getElementById("dashTotalMinutes").textContent = total;

  // 2. Top Category
  let topCat = "—";
  let topVal = 0;

  for (let cat in categoryMap) {
    if (categoryMap[cat] > topVal) {
      topVal = categoryMap[cat];
      topCat = cat + " (" + topVal + "m)";
    }
  }
  document.getElementById("dashTopCategory").textContent = topCat;

  // 3. Daily Avg
  document.getElementById("dashDailyAvg").textContent = total;

  // 4. Remaining Minutes For Today
  const TARGET_DAY_MIN = 1440;
  const remaining = TARGET_DAY_MIN - total;

  let remText = remaining >= 0
      ? `You have ${remaining} minutes left today`
      : `Over target by ${Math.abs(remaining)} minutes`;

  // Write to dashboard
  const remElem = document.getElementById("dashRemaining");
  if (remElem) remElem.textContent = remText;
}



  }

  // add form
  addForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = actName.value.trim();
    const category = actCategory.value.trim();
    const minutes = Number(actMinutes.value);
    if(!name || !minutes) return alert("Please fill activity and minutes");
    const date = datePicker.value;
    const arr = getForDate(date);
    arr.push({ name, category, minutes });
    setForDate(date, arr);
    actName.value = ""; actCategory.value = ""; actMinutes.value = "";
    renderActivities();
  });

  // handle edit/delete via delegation
  activitiesList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if(!btn) return;
    const action = btn.dataset.action;
    const idx = Number(btn.dataset.idx);
    const date = datePicker.value;
    const arr = getForDate(date);
    if(action === "del"){
      if(!confirm("Delete this activity?")) return;
      arr.splice(idx,1);
      setForDate(date, arr);
      renderActivities();
    } else if(action === "edit"){
      // simple inline edit: repopulate fields and remove item
      const item = arr[idx];
      actName.value = item.name;
      actCategory.value = item.category;
      actMinutes.value = item.minutes;
      arr.splice(idx,1);
      setForDate(date, arr);
      renderActivities();
    }
  });

  // date change
  datePicker.addEventListener("change", renderActivities);

  // analyse button (simple demo)
  analyseBtn.addEventListener("click", () => {
    const date = datePicker.value;
    const items = getForDate(date);
    if(items.length === 0) return alert("No activities to analyze");
    // simple analysis: show top 3 categories
    const byCat = {};
    items.forEach(i => { const c = i.category || 'Uncategorized'; byCat[c] = (byCat[c]||0) + Number(i.minutes||0); });
    const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,3);
    alert("Top categories for " + date + ":\n" + top.map(t => `${t[0]} — ${t[1]} min`).join("\n"));
  });

  // INITIAL render
  renderActivities();

  // SIMPLE TIMER LOGIC
  let timer = { running:false, start:null, elapsed:0, label:'' }, timerInterval = null;
  function fmt(s){
    const h = String(Math.floor(s/3600)).padStart(2,'0');
    const m = String(Math.floor((s%3600)/60)).padStart(2,'0');
    const sec = String(s%60).padStart(2,'0');
    return `${h}:${m}:${sec}`;
  }
  function updateTimerUI(){
    timerDisplay.innerText = fmt(Math.floor(timer.elapsed));
    timerPause.disabled = !timer.running;
    timerStop.disabled = !timer.running && timer.elapsed===0;
  }

  timerStart.addEventListener("click", () => {
    if(!timer.running){
      timer.running = true;
      timer.start = Date.now()/1000;
      timer.label = timerLabel.value.trim() || 'Session';
      timerInterval = setInterval(()=> {
        timer.elapsed = (Date.now()/1000 - timer.start) | 0;
        updateTimerUI();
      }, 250);
      timerPause.disabled = false;
      timerStop.disabled = false;
      timerStart.innerText = "Running...";
    }
  });

  timerPause.addEventListener("click", () => {
    if(timer.running){
      timer.running = false;
      clearInterval(timerInterval);
      // finalize elapsed
      const secs = timer.elapsed;
      addSession(secs, timer.label);
      timer.elapsed = 0;
      timer.start = null;
      timerLabel.value = "";
      timerStart.innerText = "Start";
      updateTimerUI();
    }
  });

  timerStop.addEventListener("click", () => {
    if(timer.running){
      timer.running = false;
      clearInterval(timerInterval);
      timerStart.innerText = "Start";
      const secs = timer.elapsed;
      addSession(secs, timer.label);
      timer.elapsed = 0;
      timer.start = null;
      timerLabel.value = "";
      updateTimerUI();
    }
  });

  // add recording to sessions list + storage
  function addSession(seconds, label){
    if(!seconds || seconds < 1) return;
    const key = 'tt_sessions_v1';
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ label: label||'Session', seconds, date: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr));
    renderSessions();
  }

  function renderSessions(){
    const raw = localStorage.getItem('tt_sessions_v1');
    const arr = raw ? JSON.parse(raw) : [];
    sessionsList.innerHTML = "";
    if(arr.length === 0) sessionsList.innerHTML = "<div class='muted'>No sessions</div>";
    else {
      arr.slice(0,6).forEach(s => {
        const el = document.createElement("div");
        el.className = "activity-item";
        el.innerHTML = `<div><strong>${s.label}</strong><div class='muted small'>${new Date(s.date).toLocaleString()}</div></div><div class='muted'>${Math.round(s.seconds/60)} min</div>`;
        sessionsList.appendChild(el);
      });
    }
  }
  renderSessions();

  // Dummy sign-out hook (if you integrate firebase, replace)
  const signOutBtn = document.getElementById("signOut");
  signOutBtn.addEventListener("click", () => {
    if(confirm("Sign out?")) {
      // If using Firebase auth, call firebase.auth().signOut()
      localStorage.removeItem('tt_user_demo');
      SPA.setUserEmail('not signed');
      alert("Signed out (demo).");
    }
  });

  // Demo: show user email if saved, else store a demo user
  const demoUser = localStorage.getItem('tt_user_demo') || 'admin@gmail.com';
  localStorage.setItem('tt_user_demo', demoUser);
  SPA.setUserEmail(demoUser);

  // expose renderActivities for external use (if needed)
  window.tt = { renderActivities };
});
