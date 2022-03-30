import * as d3 from "https://cdn.skypack.dev/d3@7";
import { gen_sunburst } from './modules/sunburst.mjs';

const settings = {
  "html_layout": {
    "div_id": "#sunburst_chart", // the div id where you want to plug the chart.
    "svg": {
      "width":975,
      "height":975,
      "font": "9px sans-serif"
    },
  },
  "data_url":"./data/flare-2.json" // It can also be a web address.
};

gen_sunburst(settings);


