import * as d3 from "https://cdn.skypack.dev/d3@7";
import { treemap } from './modules/treemap.mjs';

const settings = {
  "html_layout": {
    "title":"Treemap",  // The main HTML title.
    "svg": {
      "id": "treemap_chart",
      "width":975,
      "height":600,
      "font": "9px sans-serif"
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

treemap(settings);


