import * as d3 from "https://cdn.skypack.dev/d3@7";
import { gen_barrace } from './modules/barrace.mjs';

const settings = {
  "html_layout": {
    "div_id": "#bar_chart_race", // the div id where you want to plug the chart.
    "svg": {
      "width":975,
      "height":975,
      "font": "10px sans-serif"
    },
  },
  "data_url":"./data/data.csv" // It can also be a web address.
};

gen_cpack(settings);


