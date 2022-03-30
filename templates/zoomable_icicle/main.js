import * as d3 from "https://cdn.skypack.dev/d3@7";
import { gen_zoom_icicle } from './modules/zoom_icicle.mjs';

var settings = {
  "html_layout": {
    "div_id": "#zoom_icicle_chart", // the div id where you want to plug the chart.
    "svg": {
      "width":975,
      "height":600,
      "font": "10px sans-serif"
    },
    "tspan":{
      "fill-opacity":0.7
    },
    "rect":{
      "fill-opacity":0.6
    }
  },
  "data_url":"./data/flare-2.json" // It can also be a web address.
};

gen_zoom_icicle(settings);


