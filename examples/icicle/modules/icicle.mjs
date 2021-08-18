import * as d3 from "https://cdn.skypack.dev/d3@7"


function gen_icicle(settings) {

  var svg_id = settings["html_layout"]["svg"]["id"];
  var svg_width = settings["html_layout"]["svg"]["width"];
  var svg_height = settings["html_layout"]["svg"]["height"];
  var svg_font = settings["html_layout"]["svg"]["font"];
  var html_title = settings["html_layout"]["title"]; 
  var rect_fill_opacity = settings["html_layout"]["rect"]["fill-opacity"];
  var tspan_fill_opacity = settings["html_layout"]["tspan"]["fill-opacity"];

  d3.select("title").text(html_title);

  d3.select("#chart")
    .append("svg")
    .attr("id",svg_id)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, svg_width, svg_height])
    .style("font", svg_font);
  
  var svg = d3.select("svg");
  
  d3.json(settings["data_url"]).then(function(data) {
  
    var partition = data => d3.partition()
      .size([svg_height, svg_width])
      .padding(1)
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value));

    var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    var root = partition(data);
    var format = d3.format(",d");
  
    var cell = svg
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
    
    var text = cell.filter(d => (d.x1 - d.x0) > 16).append("text")
      .attr("x", 4)
      .attr("y", 13);
    
    text.append("tspan")
      .text(d => d.data.name);
    
    text.append("tspan")
      .attr("fill-opacity", settings["html_layout"]["tspan"]["opacity"])
      .text(d => ` ${format(d.value)}`);
    
    cell.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
  
    return svg.node();
    
  });

}

export { gen_icicle };
