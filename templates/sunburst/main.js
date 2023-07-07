import { sunburst } from './modules/sunburst.mjs';

const settings_sunburst = {
  "html_layout": {
    "div_id": "sunburst_chart", // the div id where you want to plug the chart.
    "svg": {
      "id": "id" + self.crypto.randomUUID().replaceAll("-",""),
      "width":975,
      "height":975,
      "font_type": "sans-serif",
      "font_size": "8"
    },
  },
  "data_url":"./data/data.json"
};

sunburst(settings_sunburst);

