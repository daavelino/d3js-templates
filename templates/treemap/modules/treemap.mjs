import * as d3 from "https://cdn.skypack.dev/d3@7"


function treemap(settings) {

  let div_id = settings["html_layout"]["div_id"];
  let width = settings["html_layout"]["svg"]["width"];
  let height = settings["html_layout"]["svg"]["height"];
  let svg_font = settings["html_layout"]["svg"]["font"];
  let data_url = settings["data_url"];


  d3.select(div_id)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, width, height])
    .style("max-width", width)
    .style("max-height", height)
    .style("font", svg_font);
 

  var count = 0;
  const uid = function(name) {
    return new Id("O-" + (name == null ? "" : name + "-") + ++count);
    }

    function Id(id) {
      this.id = id;
      this.href = new URL(`#${id}`, location) + "";
    }

    Id.prototype.toString = function() {
      return "url(" + this.href + ")";
  };

  const svg = d3.select("svg");

  // Chart construction:
  d3.json(data_url).then(function(data) {

   const color = d3.scaleOrdinal(d3.schemeCategory10);
   const format = d3.format(",d");

   const treemap = data => d3.treemap()
    .size([width, height])
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
          .attr("id", d => (d.leafUid = uid("leaf")).id)
          .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
          .attr("fill-opacity", 0.6)
          .attr("width", d => d.x1 - d.x0)
          .attr("height", d => d.y1 - d.y0);
    
      leaf.append("clipPath")
          .attr("id", d => (d.clipUid = uid("clip")).id)
        .append("use")
          .attr("xlink:href", d => d.leafUid.href);
    
      leaf.append("text")
          .attr("clip-path", d => d.clipUid)
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
        .join("tspan")
          .attr("x", 3)
          .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
          .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
          .text(d => d);


    return svg.node();
    
  });

}

export { treemap };
