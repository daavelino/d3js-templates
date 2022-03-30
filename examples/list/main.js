import * as d3 from "https://cdn.skypack.dev/d3@7";
import { list } from './modules/list.mjs';

const settings = {
  "html_layout": {
    "div_id": "#list_chart", // the div id where you want to plug the chart.
    "svg": {
      "width":1280,
      "height":700,
      "font": "9px sans-serif"
    }
  },
  "data_url":"./data/flare-2.json" // It can also be a web address.
};

list(settings);


