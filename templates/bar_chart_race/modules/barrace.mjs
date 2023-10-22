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

    const margin = { 
        top: settings["html_layout"]["svg"]["margin"]["top"], 
        right: settings["html_layout"]["svg"]["margin"]["right"], 
        bottom: settings["html_layout"]["svg"]["margin"]["bottom"], 
        left: settings["html_layout"]["svg"]["margin"]["left"]
    };

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
        .rangeRound([margin.top, margin.top + chartHeight + 1])
        .align(0.5)
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
   
    // updateBars(year, yearValues):
    const updateBars = (year, yearValues) => {

        // compute the sum of values for stacked elements:
        const sumStacked = (yearValues) => {
	    let holder = {};
	    let result = [];

	    for (let i = 0; i < yearValues.length; i++) {
	        let name = yearValues[i].name;
	        let category = yearValues[i].category;
	        let value = yearValues[i].value;

		if (!Object.keys(holder).includes(name)) {
		    holder[name] = {"position": {}};
		    holder[name]["position"][category] = {"start": 0, "end": value};
		    holder[name]["total"] = value;
		} else {
		    holder[name]["total"] += value;

		    Object.keys(holder[name]["position"]).forEach((i) => {
		        let start = holder[name]["position"][i]["end"]
		        holder[name]["position"][category] = {
			    "start": start,
			    "end": start + value
			};
		    });
		    
		}
	    }

	    for (let i = 0; i < yearValues.length; i++) {
	        let name = yearValues[i].name;
	        let category = yearValues[i].category;
	        let value = yearValues[i].value;
		let total = holder[name]["total"];
		let stack = holder[name]["position"][category];

		result.push(
		    {
		        "name": name,
			"category": category,
			"position": stack,
			"value": value,
			"total": total
		    }
		)
	    }

            return result;
	}

	const tmpData = sumStacked(yearValues);

        tmpData.sort((a, b) => d3.descending(a.total, b.total));
        const stackedData = tmpData.slice(0, max_bars + 1);

        xScale.domain([0, d3.max(stackedData, d => d.total)]);
        yScale.domain(stackedData.map(d => d.name));

        const bars = chart.selectAll(".bar").data(stackedData);
        const valueLabels = chart.selectAll(".value-label").data(stackedData);
        const nameLabels = chart.selectAll(".name-label").data(stackedData);

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

        const transition = svg.transition()
	    .duration(trans_duration)
	    .ease(d3.easeLinear);

        bars.join(
	    enter => enter.append("rect")
                .attr("class", "bar")
                .style("fill-opacity", rect_fill_opacity),
	    update => update
	      .transition(transition)
                .attr("x", d => xScale(x_padding + d.position["start"]))
                .attr("y", d => yScale(d.name))
                .attr("width", d => xScale(d.value))
                .attr("height", yScale.bandwidth())
                .attr("title", d => d.category)
                .style("fill", d => colorScale(d.category)),
	    exit => exit
	      .call(exit => exit.transition(transition)),
	  );

        valueLabels.join(
	    enter => enter.append("text")
                .style("fill-opacity", tspan_fill_opacity)
                .attr("text-anchor", "start")
                .attr("class", "value-label"),
	    update => update
	      .transition(transition)
                .attr("x", d => xScale(d.position["end"] - 30))
                .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
                .text(d => d3.format(",d")(d.value)),
	    exit => exit
	      .call(exit => exit.transition(transition)),
	  );

        nameLabels.join(
	    enter => enter.append("text")
                .attr("class", "name-label")
                .attr("text-anchor", "end")
                .style("font-weight", "bold")
                .style("fill-opacity", tspan_fill_opacity),
	    update => update
                .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2)
                .text(d => d.name),
	    exit => exit
	      .call(exit => exit.transition(transition)),
	    );

        chart.select(".x-axis").call(xAxis);
        chart.select(".y-axis").call(yAxis);
    };


    d3.json(data_url).then(function (data) {
        data.sort((a, b) => a.year - b.year);
        let interval;

        function startAnimation() {
            let idx = 0;
	    // https://developer.mozilla.org/en-US/docs/Web/API/setInterval
            interval = setInterval(() => {
            let year = data[idx].year;
            let yearValues = data[idx].values;

            updateBars(year, yearValues);

            idx++;
            if (idx >= data.length) {
		// https://developer.mozilla.org/en-US/docs/Web/API/clearInterval
                clearInterval(interval); 
                addReplayButton();
                }
            }, chart_speed ); // Adjust the speed based on the number of bars
        }

        function addReplayButton() {
            var replayButton = svg
                .append("g")
                .attr("class", "replay-button")
                .attr(
                  "transform",
                  `translate(${width - margin.right - 100}, ${height - margin.bottom + 20})`
                )
                .style("cursor", "pointer")
                .on("click", () => {
                  startAnimation();
                });

            replayButton
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 80)
                .attr("height", 30)
                .attr("rx", 15)
                .attr("ry", 15)
                .attr("fill", "#007bff");

            replayButton
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

