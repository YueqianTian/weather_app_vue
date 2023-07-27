# Vue Weather App v2.0

John Komomarnicki - Vue and Taiwind - Weather App Build

## Description

Re-created a Vue weather search app. This app was written in Vue3 (including VueX and Vue-Router) and uses some revised logic and methods not shown during the project lectures. New feature- index pages was written in Vue Chart.js.

See demo: https://weather-app-vue-v2.netlify.app/

### New features

v2.0 Index chart - a clear overview on hourly weather index data (tempature, relative humidity, etc) for futher 10 days with line charts.

(NOTE: Since lack of hourly data and sunrise/sunset data (only 48 hours), all hourly data we built for chart page according to SECOND DAY. )

v2.0 Color system updated - different color levels due to different temperature ranges.

v1.0 Progress bar - easier to distinguish between low and high temperature.

v1.0 Preprocessor for search query - precise search for adminstrative regions, according to designed display strategies, which is more consistent with search habits.

### Running

After downloading or cloning the repo, type `npm run dev` in the terminal to load the application locally on http://127.0.0.1:5173/.

### Note

Use domestic API to get more precise data（including administrative regions and local weather）. You will need to sign up for an API key at APISpace API (free for trial) and AMap API to use in config.js.

Search Language - Chinese only (not including Pinyin)  
Search scope - China

## Built With

Tailwind CSS  
Vue3  
Vue Chart.js (v2.0)
AMap API (Geocoding API)  
APISpace API (Weather API)

## Re-creator

Tian Yueqian
