import { treemap } from './modules/treemap.mjs';


const settings_treemap = {
  "html_layout": {
    "div_id": "treemap_chart", // the div id where you want to plug the chart.
    "svg": {
      "id": "id" + self.crypto.randomUUID().replaceAll("-",""),
      "width":975,
      "height":600,
      "font_type": "sans-serif",
      "font_size": "8"
    }
  },
  "data_url":"./data/data.json" // It can also be a web address.
};

treemap(settings_treemap);


