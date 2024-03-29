import * as d3 from "https://cdn.skypack.dev/d3@7"


function zoom_cpack(settings) {

  let div_id = settings["html_layout"]["div_id"];
  let width = settings["html_layout"]["svg"]["width"];
  let height = settings["html_layout"]["svg"]["height"];
  let svg_id = settings["html_layout"]["svg"]["id"];
  let svg_font_size = settings["html_layout"]["svg"]["font_size"];
  let svg_font_type = settings["html_layout"]["svg"]["font_type"];
  let svg_font = svg_font_size + "px " + svg_font_type;
  let data_url = settings["data_url"];


  d3.select("#" + div_id)
    .append("svg")
    .attr("id", svg_id)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .style("max-width", width)
    .style("max-height", height)
    .style("display", "block")
    .style("margin", "0 -14px")
    .style("cursor", "pointer")
    .style("font", svg_font);

  const svg = d3.select("#" + svg_id);


  // Chart construction:
  d3.json(data_url).then(function(data) {

    const color = d3.scaleLinear()
      .domain([0, 5])
      .range(["hsl(50,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    const format = d3.format(",d");
  
    const pack = data => d3.pack()
      .size([width, height])
      .padding(3)
    (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));

    const root = pack(data);
    let focus = root;
    let view;

    svg.style("background", color(0))
      .on("click", (event) => zoom(event, root));


    const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
  
    const label = svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);
  
    zoomTo([root.x, root.y, root.r * 2]);

    function zoom(event, d) {
      const focus0 = focus;
  
      focus = d;
  
      const transition = svg.transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });
  
      label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
  
    function zoomTo(v) {
      const k = width / v[2];
  
      view = v;
  
      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
        
    return svg.node();
  
  });

}

export { zoom_cpack };

