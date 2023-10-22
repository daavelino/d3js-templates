import { barrace } from './modules/barrace.mjs';

const settings_barrace = {
  "html_layout": {
    "div_id": "bar_chart_race", // the div id where you want to plug the chart.
    "svg": {
      "id": "id" + self.crypto.randomUUID().replaceAll("-",""),
      "width":1024,
      "height":768,
      "font_type": "sans-serif",
      "font_size": "8",
      "margin": {
        "top": 20,
	"right": 30,
	"bottom": 60,
	"left": 200
      }
    },
    "tspan":{
      "opacity":0.7
    },
    "rect":{
      "fill-opacity":0.6
    }
  },
  "chart": {
    "max_bars": 50,
    "bar_padding": 0.05,
    "x_padding": 2,
    "year_font_type": "sans-serif",
    "year_font_size": 30,
    "trans_duration": 1200,
    "chart_speed": 2000,
  },
  "data_url":"./data/data.json" // It can also be a web address.
};

barrace(settings_barrace);


