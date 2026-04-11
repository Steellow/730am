(function() {
  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function calculateAverage(times) {
    if (times.length === 0) return null;
    const sum = times.reduce((a, b) => a + b, 0);
    return Math.round(sum / times.length);
  }

  function calculateMedian(times) {
    if (times.length === 0) return null;
    const sorted = [...times].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }
    return sorted[mid];
  }

  function calculateStreak(data, goalMinutes) {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (timeToMinutes(data[i].time) <= goalMinutes) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  function calculateStats(data, goalTime) {
    const times = data.map(d => timeToMinutes(d.time));
    const goalMinutes = timeToMinutes(goalTime);

    return {
      count: data.length,
      streak: calculateStreak(data, goalMinutes),
      average: minutesToTime(calculateAverage(times)),
      median: minutesToTime(calculateMedian(times)),
      min: minutesToTime(Math.min(...times)),
      max: minutesToTime(Math.max(...times)),
    };
  }

  function renderStats(stats) {
    document.getElementById('stat-count').textContent = stats.count;
    document.getElementById('stat-streak').textContent = stats.streak;
    document.getElementById('stat-average').textContent = stats.average;
    document.getElementById('stat-median').textContent = stats.median;
    document.getElementById('stat-min').textContent = stats.min;
    document.getElementById('stat-max').textContent = stats.max;
  }

  function renderRecentEntries(data, limit = 15) {
    const container = document.getElementById('recent-entries');
    const recent = data.slice(-limit).reverse();
    container.innerHTML = recent.map(entry => `
      <div class="log-entry">
        <span class="timestamp">${entry.date}</span>
        <span class="entry-data">WAKE: ${entry.time}</span>
      </div>
    `).join('');
  }

  function renderChart(data, goalTime) {
    const ctx = document.getElementById('chart').getContext('2d');
    const labels = data.map(d => d.date.slice(5));
    const times = data.map(d => timeToMinutes(d.time));
    const goalMinutes = timeToMinutes(goalTime);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'WAKE TIME',
          data: times,
          borderColor: '#ff6600',
          backgroundColor: 'rgba(255, 102, 0, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#ff9933',
          pointBorderColor: '#ff6600',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0,
        }, {
          label: 'GOAL',
          data: Array(data.length).fill(goalMinutes),
          borderColor: '#333333',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          y: {
            reverse: true,
            ticks: {
              callback: function(value) {
                return minutesToTime(value);
              },
              color: '#666666',
              font: { family: 'VT323', size: 14 },
            },
            grid: {
              color: '#222222',
            },
          },
          x: {
            ticks: {
              color: '#666666',
              font: { family: 'VT323', size: 12 },
              maxRotation: 45,
            },
            grid: {
              color: '#222222',
            },
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ff6600',
              font: { family: 'VT323', size: 14 },
            }
          },
          tooltip: {
            backgroundColor: '#0a0a0a',
            titleColor: '#ff6600',
            bodyColor: '#00ff00',
            borderColor: '#333333',
            borderWidth: 1,
            titleFont: { family: 'VT323', size: 16 },
            bodyFont: { family: 'VT323', size: 14 },
            callbacks: {
              label: function(context) {
                if (context.dataset.label === 'GOAL') return null;
                return 'WAKE: ' + minutesToTime(context.raw);
              }
            }
          }
        }
      }
    });
  }

  function updateClock() {
    const now = new Date();
    const time = now.toISOString().split('T')[1].split('.')[0];
    const date = now.toISOString().split('T')[0];
    document.getElementById('current-time').textContent = `${date} ${time} UTC`;
  }

  document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 1000);
    const stats = calculateStats(wakeUpData, GOAL_TIME);
    renderStats(stats);
    renderRecentEntries(wakeUpData);
    renderChart(wakeUpData, GOAL_TIME);
  });
})();