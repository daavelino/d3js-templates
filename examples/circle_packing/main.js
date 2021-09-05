import * as d3 from "https://cdn.skypack.dev/d3@7";
import { gen_cpack } from './modules/cpack.mjs';

const settings = {
  "html_layout": {
    "div_id": "#cpacking_chart", // the div id where you want to plug the chart.
    "svg": {
      "width":750,
      "height":750,
      "font": "10px sans-serif"
    },
  },
  "data_url":"./data/flare-2.json" // It can also be a web address.
};

gen_cpack(settings);


