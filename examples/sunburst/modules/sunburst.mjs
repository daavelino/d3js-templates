import * as d3 from "https://cdn.skypack.dev/d3@7"


function gen_sunburst(settings) {

  let svg_id = settings["html_layout"]["svg"]["id"];
  let svg_width = settings["html_layout"]["svg"]["width"];
  let svg_height = settings["html_layout"]["svg"]["height"];
  let svg_font = settings["html_layout"]["svg"]["font"];
  let html_title = settings["html_layout"]["title"]; 
  let data_url = settings["data_url"];

  let radius = Math.min(svg_width, svg_height) / 2;
  
  d3.select("title").text(html_title);

  d3.select("#chart")
    .append("svg")
    .attr("id",svg_id)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, svg_width, svg_height])
    .style("font", svg_font);
  
  const svg = d3.select("svg")
    .append("g").attr("transform",`translate(${svg_width / 2}, ${svg_height / 2})`);

  
  // Chart construction:
  d3.json(data_url).then(function(data) {

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    const format = d3.format(",d");

    const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    const partition = data => d3.partition()
        .size([2 * Math.PI, radius])
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value))
  
    const root = partition(data);

    svg.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("path")
    .data(root.descendants().filter(d => d.depth))
    .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("d", arc)
    .append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
    .selectAll("text")
    .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
    .join("text")
      .attr("transform", function(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.35em")
      .text(d => d.data.name);


   return svg.node();

  });

}

export { gen_sunburst };
