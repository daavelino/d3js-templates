import * as d3 from "https://cdn.skypack.dev/d3@7";
import { gen_cpack } from './modules/cpack.mjs';

const settings = {
  "html_layout": {
    "title":"Circle Packing",  // The main HTML title.
    "svg": {
      "id": "cpacking_chart",
      "width":975,
      "height":975,
      "font": "10px sans-serif"
    },
  },
  "data_url":"./data/flare-2.json" // It can also be a web address.
};

gen_cpack(settings);


