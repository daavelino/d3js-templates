import * as d3 from "https://cdn.skypack.dev/d3@7"


function gen_icicle(settings) {

  let svg_id = settings["html_layout"]["svg"]["id"];
  let svg_width = settings["html_layout"]["svg"]["width"];
  let svg_height = settings["html_layout"]["svg"]["height"];
  let svg_font = settings["html_layout"]["svg"]["font"];
  let html_title = settings["html_layout"]["title"]; 
  let rect_fill_opacity = settings["html_layout"]["rect"]["fill-opacity"];
  let tspan_fill_opacity = settings["html_layout"]["tspan"]["fill-opacity"];

  d3.select("title").text(html_title);

  d3.select("#chart")
    .append("svg")
    .attr("id",svg_id)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, svg_width, svg_height])
    .style("font", svg_font);
  
  const svg = d3.select("svg");

  // Chart construction:
  d3.json(settings["data_url"]).then(function(data) {
  
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

    const format = d3.format(",d");

    const partition = data => d3.partition()
      .size([svg_height, svg_width])
      .padding(1)
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value));

    const root = partition(data);
  
    const cell = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y0},${d.x0})`);
    
    cell.append("rect")
      .attr("width", d => d.y1 - d.y0)
      .attr("height", d => d.x1 - d.x0)
      .attr("fill-opacity", rect_fill_opacity)
      .attr("fill", d => {
        if (!d.depth) return "#ccc";
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      });
    
    const text = cell.filter(d => (d.x1 - d.x0) > 16).append("text")
      .attr("x", 4)
      .attr("y", 13);
    
    text.append("tspan")
      .text(d => d.data.name);
    
    text.append("tspan")
      .attr("fill-opacity", tspan_fill_opacity)
      .text(d => ` ${format(d.value)}`);
    
    cell.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
  
    return svg.node();
    
  });

}

export { gen_icicle };
