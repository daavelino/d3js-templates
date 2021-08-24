import * as d3 from "https://cdn.skypack.dev/d3@7"


function bar_chart(settings) {

  let svg_id = settings["html_layout"]["svg"]["id"];
  let svg_width = settings["html_layout"]["svg"]["width"];
  let svg_height = settings["html_layout"]["svg"]["height"];
  let svg_font = settings["html_layout"]["svg"]["font"];
  let html_title = settings["html_layout"]["title"];

  let margin = {
    "top": settings["chart"]["margin"]["top"],
    "right": settings["chart"]["margin"]["right"],
    "botton": settings["chart"]["margin"]["botton"],
    "left": settings["chart"]["margin"]["left"],
    };

  let color = settings["chart"]["color"];
  let y_axis_format = settings["chart"]["y_axis_format"];
  let y_axis_label = settings["chart"]["y_axis_label"];
 
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
  d3.csv(data_url).then(function(data) {

    const x_axis_name = data.columns[0];
    const y_axis_name = data.columns[1];

    const m_from = {x_axis_name: y_axis_name};
    const m_to = {name: x_axis_name, value: y_axis_name};

    data = Object.assign(
      d3.sort(data, d => -d[y_axis_name])
        .map(({letter, frequency}) => 
             ({name: letter, value: frequency})),
        {format: y_axis_format, y: y_axis_label}
      );

    const x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, svg_width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([svg_height - margin.botton, margin.top]);

    const xAxis = g => g
      .attr("transform", `translate(0, ${svg_height - margin.botton})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))
      .call(g => g.append("text")
        .attr("x", svg_width - 1)
        .attr("y", margin.botton)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(x_axis_name));
 
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(y_axis_name));

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
