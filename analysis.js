// Analysis page using realtime DB
document.addEventListener('DOMContentLoaded', ()=> {
  const params = new URLSearchParams(window.location.search);
  const date = params.get('date') || new Date().toISOString().slice(0,10);
  document.getElementById('dayTitle').textContent = 'Analysis — ' + date;

  document.getElementById('backBtn').addEventListener('click', ()=> window.history.back());
  document.getElementById('goLog').addEventListener('click', ()=> window.location.href = 'app.html?date=' + date);

  firebase.auth().onAuthStateChanged(async user => {
    if(!user) return window.location.href = 'index.html';
    const uid = user.uid;
    const ref = db.ref('users/' + uid + '/days/' + date + '/activities');
    const snap = await ref.once('value');
    const data = snap.val();
    const noData = document.getElementById('noData');
    const chartsArea = document.getElementById('chartsArea');
    const activitiesTable = document.getElementById('activitiesTable');
    if(!data){
      noData.classList.remove('hidden');
      chartsArea.classList.add('hidden');
      activitiesTable.innerHTML = '';
      document.getElementById('summaryStats').textContent = '';
      return;
    }
    noData.classList.add('hidden');
    chartsArea.classList.remove('hidden');

    // aggregate by category
    const byCat = {};
    let total = 0;
    const activities = [];
    Object.keys(data).forEach(key => {
      const a = data[key];
      activities.push(a);
      total += a.minutes || 0;
      const cat = a.category || 'Other';
      byCat[cat] = (byCat[cat] || 0) + (a.minutes || 0);
    });

    document.getElementById('summaryStats').textContent = total + ' minutes • ' + activities.length + ' activities';

    // prepare charts
    const catLabels = Object.keys(byCat);
    const catValues = catLabels.map(l => byCat[l]);

    // destroy previous charts if any by replacing canvas nodes
    const pieParent = document.getElementById('pieChart').parentNode;
    pieParent.innerHTML = '<canvas id="pieChart"></canvas>';
    const barParent = document.getElementById('barChart').parentNode;
    barParent.innerHTML = '<canvas id="barChart"></canvas>';

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
      type: 'pie',
      data: { labels: catLabels, datasets: [{ data: catValues }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
      type: 'bar',
      data: { labels: activities.map(a=> a.name + ' (' + (a.category||'Other') + ')'), datasets: [{ label: 'Minutes', data: activities.map(a=> a.minutes) }] },
      options: { indexAxis: 'y', responsive: true }
    });

    activitiesTable.innerHTML = activities.map(a => `
      <div class="item">
        <div>
          <strong>${escapeHtml(a.name)}</strong>
          <div class="muted small">${escapeHtml(a.category)}</div>
        </div>
        <div class="muted small">${a.minutes} min</div>
      </div>
    `).join('');
  });
});

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
