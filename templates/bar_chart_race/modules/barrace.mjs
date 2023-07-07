import * as d3 from "https://cdn.skypack.dev/d3@7";

function barrace(settings) {
  const div_id = settings["html_layout"]["div_id"];
  const width = settings["html_layout"]["svg"]["width"];
  const height = settings["html_layout"]["svg"]["height"];
  const svg_id = settings["html_layout"]["svg"]["id"];
  const svg_font_size = settings["html_layout"]["svg"]["font_size"];
  const svg_font_type = settings["html_layout"]["svg"]["font_type"];
  const svg_font = svg_font_size + "px " + svg_font_type;
  const rect_fill_opacity = settings["html_layout"]["rect"]["fill-opacity"];
  const tspan_fill_opacity = settings["html_layout"]["tspan"]["fill-opacity"];
  const data_url = settings["data_url"];

  const margin = { top: 20, right: 30, bottom: 60, left: 200 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  d3.select("#" + div_id)
    .append("svg")
    .attr("id", svg_id)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", width)
    .style("max-height", height)
    .style("font", svg_font);

  const svg = d3.select("#" + svg_id);

  const chart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear().range([0, chartWidth]);
  const yScale = d3.scaleBand().range([chartHeight, 0]).padding(0.1);
  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  const xAxis = d3.axisTop(xScale);
  const yAxis = d3.axisLeft(yScale).tickSize(0);

  chart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${margin.top + 10})`);

  chart.append("g").attr("class", "y-axis");
    
  const updateBars = (yearData) => {
    yearData.sort((a, b) => a.value - b.value);

    xScale.domain([0, d3.max(yearData, (d) => d.value)]);
    yScale.domain(yearData.map((d) => d.name)).paddingOuter(0.3);

    const bars = chart.selectAll(".bar").data(yearData, (d) => d.name);
    const valueLabels = chart.selectAll(".value-label").data(
      yearData,
      (d) => d.name
    );

    const nameLabels = chart.selectAll(".name-label").data(yearData, d => d.name);

    const yearLabel = chart
      .append("text")
      .attr("class", "year-label")
      .attr("x", chartWidth)
      .attr("y", -10)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#333333");

    bars.exit().remove();
    valueLabels.exit().remove();
    nameLabels.exit().remove();

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.name))
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth())
      .style("fill", (d) => colorScale(d.category))
      .style("fill-opacity", rect_fill_opacity);

    valueLabels
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => xScale(d.value) + 5)
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("text-anchor", "start")
      .style("fill-opacity", tspan_fill_opacity)
      .text((d) => d.value);

    nameLabels
      .enter()
      .append("text")
      .attr("class", "name-label")
      .attr("x", d => xScale(d.value) - 5)
      .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("text-anchor", "end")
      .style("fill-opacity", tspan_fill_opacity)
      .text(d => d.name);

    bars
      .transition()
      .duration(500)
      .attr("x", 0)
      .attr("y", (d) => yScale(d.name))
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth());

    valueLabels
      .transition()
      .duration(500)
      .attr("x", (d) => xScale(d.value) + 5)
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
      .text((d) => d.value);

    nameLabels
      .transition()
      .duration(500)
      .attr("x", d => xScale(d.value) - 5)
      .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
      .text(d => d.name);

    chart.select(".x-axis").call(xAxis);
    chart.select(".y-axis").call(yAxis);

    yearLabel.text(yearData.year);
  };

  d3.json(data_url).then(function (data) {
    let currentYear = 0;
    let interval;

    function startAnimation() {
      interval = setInterval(() => {
        const yearData = data[currentYear].values;
        updateBars(yearData);

        currentYear++;
        if (currentYear === data.length) {
          clearInterval(interval);
          addReplayButton();
        }
      }, 1000 ); // Adjust the speed based on the number of bars
    }

    function addReplayButton() {
      svg
        .append("g")
        .attr("class", "replay-button")
        .attr(
          "transform",
          `translate(${width - margin.right - 100}, ${height - margin.bottom + 20})`
        )
        .style("cursor", "pointer")
        .on("click", () => {
          currentYear = 0;
          startAnimation();
        })
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 80)
        .attr("height", 30)
        .attr("rx", 15)
        .attr("ry", 15)
        .attr("fill", "#007bff")
        .style("opacity", rect_fill_opacity);

      svg
        .select(".replay-button")
        .append("text")
        .attr("x", 40)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .text("Replay");
    }

    startAnimation();
  });
}

export { barrace };

