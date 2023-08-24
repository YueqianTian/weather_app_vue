# Vue Weather App v2.0

重新编写 John Komomarnicki - Vue and Taiwind - Weather App Build，添加自定义视图及其它新功能。

## 描述

用 Vue 重新编写的天气预报 app。 该 app 用 Vue3（包括 VueX / Vue-Router），重新编写了一些算法和逻辑。 V2.0 增加了新功能 —— 用 Vue Chart.js 创建了图表视图。

DEMO: https://weather-app-vue-v2.netlify.app/

![screenshot_weather_app](https://github.com/YueqianTian/weather_app_vue/assets/108514828/7d2a7e98-a25b-4fa7-92e6-d756b1618089)

## 新功能

A. 图表视图（v2.0）: 未来 10 天内每小时天气指数数据（温度、相对湿度等）概览的折线图。（由于只有 48 小时的逐小时预报，图表根据第二天的数据搭建。）

B. 颜色系统更新（v2.0）: 根据温度范围而自动产生不同的颜色级别。

C. 城市视图温度进度条: 易于显示 10 天内每天的天气波动范围。

D. 搜索查询的预处理器: 使用 AMap API 基于国内精准搜索行政区域，并进行搜索预处理。

## 说明

改用了国内 API （行政区域查询 | 国内天气预报），更符合国内搜索习惯。你需要在 APISpace API(有免费使用版)和 AMap API 注册新的 API 密钥，在文档 .env 中进行更新。

搜索语言 - 中文（不包含拼音）
搜索范围 - 中国

## 搭建工具

-   Tailwind CSS
-   Vue3 + Vue Chart.js
-   Vite
-   [AMap API (Geocoding API) ](https://lbs.amap.com/)
-   [APISpace API (Weather API)](https://www.apispace.com/)

## 编程者

Tian Yueqian
