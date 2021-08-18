import * as d3 from "https://cdn.skypack.dev/d3@7";
import { gen_zoom_cpack } from './modules/zoom_cpack.mjs';

const settings = {
  "html_layout": {
    "title":"Zoomable Circle Packing",  // The main HTML title.
    "svg": {
      "id": "zoom_cpacking_chart",
      "width":450,
      "height":450,
      "font": "10px sans-serif"
    },
  },
  "data_url":"./data/flare-2.json" // It can also be a web address.
};

gen_zoom_cpack(settings);


