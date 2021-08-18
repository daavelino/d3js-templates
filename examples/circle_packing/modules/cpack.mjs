import * as d3 from "https://cdn.skypack.dev/d3@7"


function gen_cpack(settings) {

  let svg_id = settings["html_layout"]["svg"]["id"];
  let svg_width = settings["html_layout"]["svg"]["width"];
  let svg_height = settings["html_layout"]["svg"]["height"];
  let svg_font = settings["html_layout"]["svg"]["font"];
  let html_title = settings["html_layout"]["title"]; 
  let data_url = settings["data_url"];

  d3.select("title").text(html_title);

  d3.select("#chart")
    .append("svg")
    .attr("id",svg_id)
    .attr("text-anchor", "middle")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, svg_width, svg_height])
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

  const svg = d3.select(`#${svg_id}`);

  // Chart construction:
  d3.json(data_url).then(function(data) {

    const shadow = uid("shadow");
  
    const color = d3.scaleSequential([6, 0], d3.interpolateMagma);
    const format = d3.format(",d");
  
    const pack = data => d3.pack()
      .size([svg_width - 2, svg_height - 2])
      .padding(3)
    (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));
  
    const root = pack(data);
  
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
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
 
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
     .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
       .join("tspan")
         .attr("x", 0)
         .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
         .text(d => d);

    node.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
      
    return svg.node();
  
  });

}

export { gen_cpack };
