import { barrace } from './modules/barrace.mjs';

const settings_barrace = {
  "html_layout": {
    "div_id": "bar_chart_race", // the div id where you want to plug the chart.
    "svg": {
      "id": "id" + self.crypto.randomUUID().replaceAll("-",""),
      "width":768,
      "height":768,
      "font_type": "sans-serif",
      "font_size": "8"
    },
    "tspan":{
      "opacity":0.7
    },
    "rect":{
      "fill-opacity":0.6
    }
  },
  "data_url":"./data/data.json" // It can also be a web address.
};

barrace(settings_barrace);


