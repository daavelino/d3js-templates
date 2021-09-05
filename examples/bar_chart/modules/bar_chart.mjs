import * as d3 from "https://cdn.skypack.dev/d3@7"


function bar_chart(settings) {

  let div_id = settings["html_layout"]["div_id"];
  let width = settings["html_layout"]["svg"]["width"];
  let height = settings["html_layout"]["svg"]["height"];
  let svg_font = settings["html_layout"]["svg"]["font"];

  let margin = {
    "top": settings["chart"]["margin"]["top"],
    "right": settings["chart"]["margin"]["right"],
    "bottom": settings["chart"]["margin"]["bottom"],
    "left": settings["chart"]["margin"]["left"],
    };

  let color = settings["chart"]["color"];
  let y_axis_format = settings["chart"]["y_axis_format"];
  let y_axis_label = settings["chart"]["y_axis_label"];
 
  let data_url = settings["data_url"];

  d3.select(div_id)
    .append("svg")
    .attr("id","svg_" + div_id)
    .attr("width",width)
    .attr("height",height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox",[0, 0, width, height])
    .style("font", svg_font);
  
  const svg = d3.select("svg");


  // Chart construction:
  d3.csv(data_url).then(function(data) {

    // Dynamically get the name of the 2 csv columns:
    const x_set_name = data.columns[0];
    const y_set_name = data.columns[1];
    data = d3.map(data, 
      d => ({"name":d[x_set_name], "value":d[y_set_name]}));

    // Sorting data:
    data = d3.sort(data, d => -d.value);
    data["format"] = y_axis_format;

    const x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))
      .call(g => g.append("text")
        .attr("x", width - 1)
        .attr("y", margin.bottom)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(x_set_name));
 
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(y_set_name));

    svg.append("g")
        .attr("fill", color)
      .selectAll("rect")
      .data(data)
      .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    return svg.node();

  });
}

export { bar_chart };
