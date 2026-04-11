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

  function renderRecentEntries(data, limit = 10) {
    const container = document.getElementById('recent-entries');
    const recent = data.slice(-limit).reverse();
    container.innerHTML = recent.map(entry => `
      <div class="entry">
        <span class="entry-date">${entry.date}</span>
        <span class="entry-time">${entry.time}</span>
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
          label: 'Wake Time',
          data: times,
          borderColor: '#00ff41',
          backgroundColor: 'rgba(0, 255, 65, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#00d4ff',
          pointBorderColor: '#00d4ff',
          tension: 0.3,
          fill: true,
        }, {
          label: 'Goal',
          data: Array(data.length).fill(goalMinutes),
          borderColor: '#ff4141',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            reverse: true,
            ticks: {
              callback: function(value) {
                return minutesToTime(value);
              },
              color: '#888',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          },
          x: {
            ticks: {
              color: '#888',
              maxRotation: 45,
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#00ff41',
            }
          }
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const stats = calculateStats(wakeUpData, GOAL_TIME);
    renderStats(stats);
    renderRecentEntries(wakeUpData);
    renderChart(wakeUpData, GOAL_TIME);
  });
})();