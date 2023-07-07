import * as d3 from "https://cdn.skypack.dev/d3@7"


function gen_barrace(settings) {

  let div_id = settings["html_layout"]["div_id"];
  let width = settings["html_layout"]["svg"]["width"];
  let height = settings["html_layout"]["svg"]["height"];
  let svg_font = settings["html_layout"]["svg"]["font"];
  let data_url = settings["data_url"];

  d3.select(div_id)
    .append("svg")
    .attr("text-anchor", "middle")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, width, height])
    .style("max-width", width)
    .style("max-height", height)
    .style("font", svg_font);
  
  const svg = d3.select(div_id).select("svg");

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


  // Chart construction:
  d3.csv(data_url).then(function(data) {

    const shadow = uid("shadow");
  
    const color = d3.scaleSequential([6, 0], d3.interpolateMagma);
    const format = d3.format(",d");
 
    const rollup = d3.rollup(
      data,
      v => d3.sum(v, d => d.counting),
      d => d.root,
      d => d.actor,
      d => d.resource,
      d => d.action,
    );

    const pack = data => d3.pack()
      .size([width - 2, height - 2])
      .padding(3)
      .radius(d => d.value + 50)
    (d3.hierarchy(rollup)
      .sum(d => d.counting)
      .sort((a, b) => b.value - a.value));
  
    const root = pack(rollup);
  
    svg.append("filter")
        .attr("id", shadow.id)
      .append("feDropShadow")
        .attr("flood-opacity", 0.3)
        .attr("dx", 0)
        .attr("dy", 1);
  
    const node = svg.selectAll("g")
      .data(d3.group(root.descendants(), d => d.height))
      .join("g")
        .attr("filter", shadow)
      .selectAll("g")
      .data(d => d[1])
      .join("g")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);
  
    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => color(d.height));
    node.append("title")
        .text(d => `${d.data[0]}`);
 
    const leaf = node.filter(d => !d.children);

    leaf.select("circle")
        .attr("id", d => (d.leafUid = uid("leaf")).id);
  
    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = uid("clip")).id)
      .append("use")
        .attr("xlink:href", d => d.leafUid.href);
  
    leaf.append("text")
      .attr("clip-path", d => d.clipUid)
     .selectAll("tspan")
     .data(d => d.data)
       .join("tspan")
         .attr("x", 0)
         .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .text(d => d);

    node.append("title")
        .text(d => d);
      
    return svg.node();
  
  });

}

export { gen_barrace };
