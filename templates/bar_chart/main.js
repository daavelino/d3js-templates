import * as d3 from "https://cdn.skypack.dev/d3@7";
import { bar_chart } from './modules/bar_chart.mjs';

const settings = {
  "html_layout": {
    "div_id": "#bar_chart", // the div id where you want to plug the chart.
    "svg": {
      "width":650,
      "height":650,
      "font": "10px sans-serif"
    },
  },
  "chart":{
    "margin" :{
      "top":30,
      "right":0,
      "bottom":30,
      "left":40
    },
    "color":"#6699cc",
    "y_axis_format":"%",
  },
  "data_url":"./data/alphabet.csv" // It can also be a web address.
};

bar_chart(settings);


