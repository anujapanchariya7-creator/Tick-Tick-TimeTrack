// LIVE CLOCK TIMER
let timerInterval;
let seconds = 0;
function updateTimer()  { dashboard.js (type=module)}
import { auth, db } from './firebase.js';
import { escapeHtml, catColor } from './components.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const params = new URLSearchParams(location.search);
const dashDateInput = document.getElementById('dashDate');
const dayTitle = document.getElementById('dayTitle');
const summaryStats = document.getElementById('summaryStats');
const noData = document.getElementById('noData');
const chartsArea = document.getElementById('chartsArea');
const activitiesTable = document.getElementById('activitiesTable');
const timelineEl = document.getElementById('timeline');
const backBtn = document.getElementById('backBtn');
const goLog = document.getElementById('goLog');

let currentDate = params.get('date') || new Date().toISOString().slice(0,10);
dashDateInput.value = currentDate;
dayTitle.textContent = `Analysis — ${currentDate}`;

backBtn.addEventListener('click', ()=> history.back());
goLog.addEventListener('click', ()=> location.href = `app.html?date=${currentDate}`);
dashDateInput.addEventListener('change', ()=> { currentDate = dashDateInput.value; dayTitle.textContent = `Analysis — ${currentDate}`; load(); });

onAuthStateChanged(auth, async user => {
  if(!user) return location.href = 'index.html';
  await load();
});

async function load(){
  const user = auth.currentUser;
  if(!user) return;
  const uid = user.uid;
  const col = collection(db, 'users', uid, 'activities');
  const q = query(col, where('date','==', currentDate), orderBy('createdAt'));
  const snap = await getDocs(q);
  if(snap.empty){
    noData.classList.remove('hidden');
    chartsArea.classList.add('hidden');
    activitiesTable.innerHTML = '';
    timelineEl.innerHTML = '';
    summaryStats.textContent = '';
    return;
  }

  noData.classList.add('hidden');
  chartsArea.classList.remove('hidden');

  const activities = [];
  let total = 0;
  const byCat = {};
  snap.forEach(d => {
    const a = d.data();
    activities.push(a);
    total += a.minutes || 0;
    const c = a.category || 'Other';
    byCat[c] = (byCat[c] || 0) + (a.minutes || 0);
  });

  summaryStats.textContent = `${(total/60).toFixed(2)} hrs • ${activities.length} activities`;

  // Pie chart
  const catLabels = Object.keys(byCat);
  const catValues = catLabels.map(l => byCat[l]);

  // create/destroy canvases to avoid stacking charts
  const pieCanvas = document.getElementById('pieChart');
  const barCanvas = document.getElementById('barChart');

  new Chart(pieCanvas.getContext('2d'), { type:'pie', data:{ labels: catLabels, datasets:[{ data: catValues }] }, options:{ responsive:true } });
  new Chart(barCanvas.getContext('2d'), { type:'bar', data:{ labels: activities.map(a=> a.name), datasets:[{ label:'Minutes', data: activities.map(a=> a.minutes) }] }, options:{ indexAxis:'y', responsive:true } });

  // timeline (sequential if no start times)
  timelineEl.innerHTML = '';
  let cumulative = 0;
  activities.forEach(a => {
    const seg = document.createElement('div');
    seg.className = 'segment';
    const widthPct = Math.max(2, Math.round((a.minutes/1440)*100)); // visible min
    seg.innerHTML = `<div style="width:20%;min-width:110px"><strong>${escapeHtml(a.name)}</strong><div class="small">${escapeHtml(a.category)}</div></div>
      <div style="flex:1;display:flex;align-items:center">
        <div class="bar" style="width:${widthPct}%;background:${catColor(a.category)}"></div>
        <div style="margin-left:10px" class="small">${a.minutes} min</div>
      </div>`;
    timelineEl.appendChild(seg);
    cumulative += a.minutes || 0;
  });

  // activities table
  activitiesTable.innerHTML = activities.map(a => `<div class="item"><div><strong>${escapeHtml(a.name)}</strong><div class="small">${escapeHtml(a.category)}</div></div><div class="small">${a.minutes} min</div></div>`).join('');
}
