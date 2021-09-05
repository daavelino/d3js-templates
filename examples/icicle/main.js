import * as d3 from "https://cdn.skypack.dev/d3@7";
import { gen_icicle } from './modules/icicle.mjs';

const settings = {
  "html_layout": {
    "div_id": "#icicle_chart", // the div id where you want to plug the chart.
    "svg": {
      "width":600,
      "height":400,
      "font": "10px sans-serif"
    },
    "tspan":{
      "opacity":0.7
    },
    "rect":{
      "fill-opacity":0.6
    }
  },
  "data_url":"./data/flare-2.json" // It can also be a web address.
};

gen_icicle(settings);


