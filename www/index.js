//initilize svg or grab svg
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

fetch("data.json")
  .then((res) => res.json())
  .then((graphData) => {

    svg.append('defs').append('marker')
        .attrs({'id':'arrowhead',
            'viewBox':'-0 -5 10 10',
            'refX':6,
            'refY':0,
            'orient':'auto',
            'markerWidth':6,
            'markerHeight':6,
            'xoverflow':'visible'})
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');

    var simulation = d3
      .forceSimulation(graphData.nodes)
      .force("charge", d3.forceManyBody().strength(-30))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "link",
        d3.forceLink(graphData.links).id((d) => d.name).distance(50)
      )
      .on("tick", ticked);

    var links = svg
      .append("g")
      .selectAll("line")
      .data(graphData.links)
      .enter()
      .append("line")
      .attr('marker-end','url(#arrowhead)')
      .attr("stroke-width", 3)
      .style("stroke", "#999");

    links.append("text").text((d) => d.name);

    var drag = d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    var textsAndNodes = svg
      .append("g")
      .selectAll("g")
      .data(graphData.nodes)
      .enter()
      .append("g")
      .call(drag);

    var circles = textsAndNodes
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => d.color);

    var texts = textsAndNodes.append("text").text((d) => d.name);

    function ticked() {
      textsAndNodes.attr("transform", (d) => `translate(${d.x},${d.y})`);

      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      console.log(simulation.alpha());
    }

    function dragstarted(d) {
      //your alpha hit 0 it stops! make it run again
      simulation.alphaTarget(0.3).restart();
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      // alpha min is 0, head there
      simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }); /* FIN then */
