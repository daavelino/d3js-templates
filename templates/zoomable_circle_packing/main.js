import { zoom_cpack } from './modules/zoom_cpack.mjs';

const settings_cpack = {
  "html_layout": {
    "div_id": "zoom_cpacking_chart", // the div id where you want to plug the chart.
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

zoom_cpack(settings_cpack);


