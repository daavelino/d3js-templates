import * as d3 from "https://cdn.skypack.dev/d3@7"


function icicle(settings) {

  let div_id = settings["html_layout"]["div_id"];
  let width = settings["html_layout"]["svg"]["width"];
  let height = settings["html_layout"]["svg"]["height"];
  let svg_id = settings["html_layout"]["svg"]["id"];
  let svg_font_size = settings["html_layout"]["svg"]["font_size"];
  let svg_font_type = settings["html_layout"]["svg"]["font_type"];
  let svg_font = svg_font_size + "px " + svg_font_type;
  let rect_fill_opacity = settings["html_layout"]["rect"]["fill-opacity"];
  let tspan_fill_opacity = settings["html_layout"]["tspan"]["fill-opacity"];
  let data_url = settings["data_url"];


  d3.select("#" + div_id)
    .append("svg")
    .attr("id", svg_id)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, width, height])
    .style("max-width", width)
    .style("max-height", height)
    .style("font", svg_font);
  
  const svg = d3.select("#" + svg_id);

  // Chart construction:
  d3.json(data_url).then(function(data) {
  
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

    const format = d3.format(",d");

    const partition = data => d3.partition()
      .size([height, width])
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
      .attr("height", d => (d.x1 - d.x0))
      .attr("fill-opacity", rect_fill_opacity)
      .attr("fill", d => {
        if (!d.depth) return "#ccc";
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      });
    
    const text = cell.filter(d => (d.x1 - d.x0) > parseInt(svg_font_size) + 1).append("text")
      .attr("x", 4)
      .attr("y", parseInt(svg_font_size));
    
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

export { icicle };
