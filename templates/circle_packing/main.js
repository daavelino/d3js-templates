import { cpack } from './modules/cpack.mjs';

const settings_cpack = {
  "html_layout": {
    "div_id": "cpacking_chart", // the div id where you want to plug the chart.
    "svg": {
    "id": "id" + self.crypto.randomUUID().replaceAll("-",""),
      "width":750,
      "height":750,
      "font_type": "sans-serif",
      "font_size": "8"
    },
  },
  "data_url":"./data/data.json"
};

cpack(settings_cpack);


