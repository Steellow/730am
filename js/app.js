(function() {
  const GOAL_DISPLAY = GOAL_TIME;
  const STREAK_GOAL = "08:00";

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

  function calculateMostCommon(times) {
    if (times.length === 0) return null;
    const counts = {};
    times.forEach(t => counts[t] = (counts[t] || 0) + 1);
    const maxCount = Math.max(...Object.values(counts));
    const mostCommon = Object.keys(counts).find(t => counts[t] === maxCount);
    return parseInt(mostCommon);
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

  function calculateSuccessRateLast30(data, goalMinutes) {
    const last30 = data.slice(-30);
    if (last30.length === 0) return null;
    const successCount = last30.filter(d => timeToMinutes(d.time) <= goalMinutes).length;
    return Math.round((successCount / last30.length) * 100);
  }

  function getLast30Days(data, goalMinutes) {
    const today = new Date();
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = data.find(x => x.date === dateStr);
      if (entry) {
        days.push({
          date: dateStr,
          success: timeToMinutes(entry.time) <= goalMinutes
        });
      } else {
        days.push({ date: dateStr, success: null });
      }
    }
    return days;
  }

  function calculateStats(data, goalTime) {
    const times = data.map(d => timeToMinutes(d.time));
    const goalMinutes = timeToMinutes(goalTime);
    const streakGoalMinutes = timeToMinutes(STREAK_GOAL);

    return {
      count: data.length,
      streak: calculateStreak(data, streakGoalMinutes),
      successRate: calculateSuccessRateLast30(data, streakGoalMinutes),
      last30Days: getLast30Days(data, streakGoalMinutes),
      average: minutesToTime(calculateAverage(times)),
      median: minutesToTime(calculateMedian(times)),
      min: minutesToTime(Math.min(...times)),
      max: minutesToTime(Math.max(...times)),
      most: minutesToTime(calculateMostCommon(times)),
    };
  }

  function renderStats(stats) {
    document.getElementById('stat-count').textContent = stats.count;
    document.getElementById('stat-streak').textContent = stats.streak;
    document.getElementById('stat-average').textContent = stats.average;
    document.getElementById('stat-median').textContent = stats.median;
    document.getElementById('stat-min').textContent = stats.min;
    document.getElementById('stat-max').textContent = stats.max;
    document.getElementById('stat-most').textContent = stats.most;
    document.getElementById('stat-success-rate').textContent = stats.successRate !== null ? stats.successRate + '%' : '--';
    
    const successBar = document.getElementById('bar-success');
    successBar.innerHTML = stats.last30Days.map(d => {
      if (d.success === true) return '<div class="thirty-bar-cell success"></div>';
      if (d.success === false) return '<div class="thirty-bar-cell fail"></div>';
      return '<div class="thirty-bar-cell empty"></div>';
    }).join('');
  }

  function renderRecentEntries(data, limit = 12) {
    const container = document.getElementById('recent-entries');
    const recent = data.slice(-limit).reverse();
    const goalMinutes = timeToMinutes(STREAK_GOAL);
    
    container.innerHTML = recent.map(entry => {
      const mins = timeToMinutes(entry.time);
      const success = mins <= goalMinutes;
      return `
        <div class="log-entry">
          <span class="log-date">${entry.date}</span>
          <span class="log-time">${entry.time}</span>
          <span class="log-status ${success ? 'success' : 'fail'}">${success ? '█ OK' : '✗ LATE'}</span>
        </div>
      `;
    }).join('');
  }

  function renderChart(data, goalTime) {
    const ctx = document.getElementById('chart').getContext('2d');
    const labels = data.map(d => d.date.slice(5));
    const times = data.map(d => timeToMinutes(d.time));
    const goalMinutes = timeToMinutes(goalTime);
    
    const last30 = times.slice(-30);
    const avgLast30 = last30.length > 0 ? Math.round(last30.reduce((a, b) => a + b, 0) / last30.length) : null;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'WAKE',
          data: times,
          borderColor: '#ff6600',
          backgroundColor: 'rgba(255, 102, 0, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#aa8844',
          pointBorderColor: '#aa8844',
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.1,
        }, {
          label: 'GOAL',
          data: Array(data.length).fill(goalMinutes),
          borderColor: '#aa8844',
          borderWidth: 1,
          borderDash: [4, 2],
          pointRadius: 0,
          fill: false,
        }, {
          label: 'AVG30',
          data: Array(data.length).fill(avgLast30),
          borderColor: '#ffff00',
          borderWidth: 1,
          borderDash: [4, 2],
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
            ticks: {
              callback: function(value) {
                return minutesToTime(value);
              },
              color: '#888888',
              font: { family: 'JetBrains Mono', size: 10 },
            },
            grid: {
              color: '#222222',
            },
          },
          x: {
            ticks: {
              color: '#888888',
              font: { family: 'JetBrains Mono', size: 10 },
              maxRotation: 45,
            },
            grid: {
              color: '#222222',
            },
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#888888',
              font: { family: 'JetBrains Mono', size: 10 },
              boxWidth: 12,
              boxHeight: 8,
              padding: 10,
            }
          },
          tooltip: {
            backgroundColor: '#0a0a0a',
            titleColor: '#aa8844',
            bodyColor: '#ff6600',
            borderColor: '#444444',
            borderWidth: 1,
            titleFont: { family: 'JetBrains Mono', size: 12 },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                if (context.dataset.label === 'GOAL') return null;
                if (context.dataset.label === 'AVG30') return 'AVG30: ' + minutesToTime(context.raw);
                return 'WAKE: ' + minutesToTime(context.raw);
              }
            }
          }
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    const stats = calculateStats(wakeUpData, GOAL_DISPLAY);
    renderStats(stats);
    renderRecentEntries(wakeUpData);
    renderChart(wakeUpData, GOAL_DISPLAY);
  });
})();