# Vue Weather App v2.0

John Komomarnicki - Vue and Taiwind - Weather App Build

## Description

Re-created Vue weather app. This app was written in Vue3 (including VueX and Vue-Router) and uses some revised logic and methods not shown during the project lectures. New feature- index pages was written in Vue Chart.js(v2.0).

DEMO: https://weather-app-vue-v2.netlify.app/

## New features

-   Index chart (v2.0)  
    Line charts of overview on hourly weather index data (tempature, relative humidity, etc) in futher 10 days.

(NOTE: Since lack of hourly data (only 48 hours), I built chart page with data according to SECOND DAY. )

-   Color system updated (v2.0)  
    Different color levels due to different temperature ranges.

-   Progress bar  
    Easier to distinguish between low and high temperature.

-   Preprocessor for search query  
    Precise search for adminstrative regions, according to designed display strategies, which is more consistent with search habits.

## Running

After downloading or cloning the repo, type `npm run dev` in the terminal to load the application locally on http://127.0.0.1:5173/.

## Note

Use domestic API to get more precise data（including administrative regions and local weather）. You will need to sign up for an API key at APISpace API (free for trial) and AMap API to use in .env file.

-   Search Language - Chinese only (not including Pinyin)
-   Search scope - China

## Built With

-   Tailwind CSS
-   Vue3 + Vue Chart.js
-   Vite
-   [AMap API (Geocoding API) ](https://lbs.amap.com/)
-   [APISpace API (Weather API)](https://www.apispace.com/)

## Re-creator

Tian Yueqian
