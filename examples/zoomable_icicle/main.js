import * as d3 from "https://cdn.skypack.dev/d3@7";
import { gen_zoom_icicle } from './modules/zoom_icicle.mjs';

var settings = {
  "html_layout": {
    "title":"Zoomable Icicle",  // The main HTML title.
    "svg": {
      "id": "zoom_icicle_chart",
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

