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

  const max_bars = settings["chart"]["max_bars"];
  const bar_padding = settings["chart"]["bar_padding"];
  const x_padding = settings["chart"]["x_padding"];
  const year_font_type = settings["chart"]["year_font_type"];
  const year_font_size = settings["chart"]["year_font_size"];
  const trans_duration = settings["chart"]["trans_duration"];
  const chart_speed = settings["chart"]["chart_speed"];

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

  const xScale = d3.scaleLinear().range([0, chartWidth - x_padding]);

  const yScale = d3.scaleBand()
    .domain(d3.range(chartHeight, 0))
    .rangeRound([margin.top, margin.top + chartHeight])
    .align(10)
    .padding(bar_padding);

  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  const xAxis = d3.axisTop(xScale)
    .ticks(width / 160)
    .tickSize(5);

  const yAxis = d3.axisLeft(yScale)
    .tickSize(0)
    .tickFormat("");

  chart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${margin.top + 10})`);

  chart.append("g").attr("class", "y-axis");
    
  const updateBars = (yearData, year) => {


    yearData.sort((a, b) => d3.descending(a.value, b.value));

    const sampleData = yearData.slice(0, max_bars + 1); 

    xScale.domain([0, d3.max(sampleData, d => d.value)]);
    yScale.domain(sampleData.map(d => d.name));

    const bars = chart.selectAll(".bar").data(sampleData, d => d.name);
    const valueLabels = chart.selectAll(".value-label").data(sampleData, d => d.name);
    const nameLabels = chart.selectAll(".name-label").data(sampleData, d => d.name);

    var yearLabel = chart.select(".year-label");
    yearLabel.remove();

    yearLabel = chart
      .append("text")
      .attr("class", "year-label")
      .attr("x", chartWidth)
      .attr("y", chartHeight - 50)
      .attr("text-anchor", "end")
      .style("font-weight", "bold")
      .style("font-size", `${year_font_size}px`)
      .style("fill", "#333333")
      .text(year);

    bars.exit().remove();
    valueLabels.exit().remove();
    nameLabels.exit().remove();

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", x_padding)
      .attr("y", (d) =>  yScale(d.name))
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth())
      .style("fill", (d) => colorScale(d.category))
      .style("fill-opacity", rect_fill_opacity);

    valueLabels
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => xScale(d.value) + 3)
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("text-anchor", "start")
      .style("fill-opacity", tspan_fill_opacity)
      .text((d) => d3.format(",d")(d.value));

    nameLabels
      .enter()
      .append("text")
      .attr("class", "name-label")
      .attr("x", d => xScale(d.value) - 10)
      .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
      .attr("title", (d) => d.category)
      .attr("text-anchor", "end")
      .style("font-weight", "bold")
      .style("fill-opacity", tspan_fill_opacity)
      .text(d => d.name);


    // transitions:
    bars
      .transition()
      .duration(trans_duration)
      .ease(d3.easeLinear)
      .attr("x", x_padding)
      .attr("y", (d) => yScale(d.name))
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth())
      .style("fill", (d) => colorScale(d.category))
      .style("fill-opacity", rect_fill_opacity);

    valueLabels
      .transition()
      .duration(trans_duration)
      .ease(d3.easeLinear)
      .attr("x", (d) => xScale(d.value) + 3)
      .attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2)
      .text((d) => d3.format(",d")(d.value));

    nameLabels
      .transition()
      .duration(trans_duration)
      .ease(d3.easeLinear)
      .attr("x", d => xScale(d.value) - 10)
      .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
      .text(d => d.name);

    chart.select(".x-axis").call(xAxis);
    chart.select(".y-axis").call(yAxis);
  };

  d3.json(data_url).then(function (data) {
    let currentYear = 0;
    let interval;

    data.sort((a, b) => a.year - b.year);

    function startAnimation() {
      interval = setInterval(() => {
        const yearData = data[currentYear].values;
        updateBars(yearData, data[currentYear].year);

        currentYear++;
        if (currentYear === data.length) {
          clearInterval(interval);
          addReplayButton();
        }
      }, chart_speed ); // Adjust the speed based on the number of bars
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

