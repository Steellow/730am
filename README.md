# Wake Up Tracker

A simple dashboard for tracking and visualizing your wake-up times. Built with plain HTML/CSS/JS.

## Goal

Wake up at **07:30** every morning. Track progress and maintain motivation through stats and visualizations.

## Quick Start

1. Open `index.html` in your browser
2. Add your wake-up times to `js/data.js`

## Data Format

Edit `js/data.js` to add new entries:

```js
const GOAL_TIME = "07:30";

const wakeUpData = [
  { date: "2026-04-07", time: "07:25" },
  { date: "2026-04-08", time: "07:32" },
  // Add new entries here (newest last)
];
```

**Format:**
- `date`: YYYY-MM-DD
- `time`: HH:MM (24-hour)

## Features

- **Streak**: Consecutive days meeting goal (≤ goal time)
- **Average**: Mean wake time
- **Median**: Middle wake time
- **Min/Max**: Earliest and latest wake times
- **Chart**: Line graph of last 30 days
- **Recent**: List of recent entries

## Deployment

### GitHub Pages

1. Push to a GitHub repository
2. Go to Settings → Pages
3. Source: Deploy from `main` branch
4. Your dashboard will be at `https://username.github.io/repo-name/`

### Raspberry Pi

Serve with any static file server:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then access at `http://<pi-ip>:8000`

## File Structure

```
├── index.html        # Main dashboard
├── css/style.css    # Terminal/space themed styles
├── js/
│   ├── data.js      # Your wake-up data (edit manually)
│   └── app.js       # Stats & chart logic
└── README.md        # This file
```

## Tech Stack

- Plain HTML/CSS/JS (no build step)
- [Chart.js](https://www.chartjs.org/) via CDN for charts
- [Fira Code](https://github.com/tonsky/FiraCode) font

## Customization

### Change Goal Time

Edit `GOAL_TIME` in `js/data.js`:

```js
const GOAL_TIME = "06:00";  // New goal
```

### Change Styling

Edit CSS variables in `css/style.css`:

```css
:root {
  --goal: #your-color;      /* Primary color */
  --accent: #your-color;    /* Accent color */
}
```

## Future Enhancements

- Auto-track via API or cron job
- Add/edit entries via UI
- Export data as CSV
- Mobile-friendly improvements