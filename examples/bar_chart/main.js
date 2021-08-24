import * as d3 from "https://cdn.skypack.dev/d3@7";
import { bar_chart } from './modules/bar_chart.mjs';

const settings = {
  "html_layout": {
    "title":"Bar Chart",  // The main HTML title.
    "svg": {
      "id": "bar_chart",
      "width":975,
      "height":975,
      "font": "10px sans-serif"
    },
  },
  "chart":{
    "margin" :{
      "top":30,
      "right":0,
      "botton":30,
      "left":40
    },
    "color":"steelblue",
    "y_axis_format":"%",
  },
  "data_url":"./data/alphabet.csv" // It can also be a web address.
};

bar_chart(settings);


