import * as d3 from "https://cdn.skypack.dev/d3@7"


function zoom_icicle(settings) {

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

    function clicked(event, p) {
      focus = focus === p ? p = p.parent : p;

      root.each(d => d.target = {
        x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
        x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
        y0: d.y0 - p.y0,
        y1: d.y1 - p.y0
      });


    const t = cell.transition().duration(750)
      .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);

    rect.transition(t).attr("height", d => rectHeight(d.target));
    text.transition(t).attr("fill-opacity", d => labelVisible(d.target));
    tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target) * tspan_fill_opacity);
    }
	
    function rectHeight(d) {
      return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
    }

    function labelVisible(d) {
      return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
    }
	

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

    const format = d3.format(",d");

    const partition = data => d3.partition()
      .size([height, width])
      .padding(1)
      (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value));

    const root = partition(data);
    let focus = root;


    const cell = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
        .attr("transform", d => `translate(${d.y0},${d.x0})`);

    const rect = cell.append("rect")
      .attr("width", d => d.y1 - d.y0)
      .attr("height", d => d.x1 - d.x0)
      .attr("fill-opacity", rect_fill_opacity)
      .attr("fill", d => {
        if (!d.depth) return "#ccc";
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .style("cursor", "pointer")
      .on("click", clicked);

    const text = cell.filter(d => (d.x1 - d.x0) > 16).append("text")
      .attr("x", 4)
      .attr("y", 13)
      .attr("fill-opacity", d => +labelVisible(d))
      .attr("pointer-events", "none")
      .style("user-selected", "none");

    text.append("tspan")
      .text(d => d.data.name);

    const tspan = text.append("tspan")
      .attr("fill-opacity", tspan_fill_opacity)
      .text(d => ` ${format(d.value)}`);

    cell.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);


    return svg.node();

  });


}

export { zoom_icicle };
