import * as d3 from "https://cdn.skypack.dev/d3@7"


function treemap(settings) {

  let svg_id = settings["html_layout"]["svg"]["id"];
  let svg_width = settings["html_layout"]["svg"]["width"];
  let svg_height = settings["html_layout"]["svg"]["height"];
  let svg_font = settings["html_layout"]["svg"]["font"];
  let html_title = settings["html_layout"]["title"]; 
  let rect_fill_opacity = settings["html_layout"]["rect"]["fill-opacity"];
  let tspan_fill_opacity = settings["html_layout"]["tspan"]["fill-opacity"];
  let data_url = settings["data_url"];

  d3.select("title").text(html_title);

  d3.select("#chart")
    .append("svg")
    .attr("id",svg_id)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, svg_width, svg_height])
    .style("font", svg_font);
  
  const svg = d3.select("svg");

  // Chart construction:
  d3.json(data_url).then(function(data) {

   const color = d3.scaleOrdinal(d3.schemeCategory10);
   const format = d3.format(",d");

   const treemap = data => d3.treemap()
    .size([svg_width, svg_height])
    .padding(1)
    .round(true)
  (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));

    const root = treemap(data);
   
    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
	.attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", rect_fill_opacity)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);


    leaf.append("text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
      .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.6 : null)
        .text(d => d);

    leaf.append("title")
      .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);


    return svg.node();
    
  });

}

export { treemap };
