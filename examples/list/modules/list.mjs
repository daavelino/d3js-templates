import * as d3 from "https://cdn.skypack.dev/d3@7"


function list(settings) {

  let div_id = settings["html_layout"]["div_id"];
  let data_url = settings["data_url"];


  // Chart construction:
  d3.json(data_url).then(function(data) {

    const treemap = data => d3.treemap()
      (d3.hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => a.name)
      );

    const root = treemap(data);

    const list = d3.select(div_id).append("ul")
      .data(root.leaves())
	  .enter()
        .append("li")
        .append("a")
          .attr("href", d => "https://github.solarisbank.de/"+d.parent.data.name+"/"+d.data.name.replace(":","/blob/master/"))
          .attr("target", "_blank")
          .text(d => d.parent.data.name+"/"+d.data.name);

  });

}

export { list };
