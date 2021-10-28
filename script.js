let driving;
d3.csv('driving.csv', d3.autoType).then(data=>{
    driving = data
	console.log('driving', driving);
    makeScatter()
	
});

function makeScatter() {

    const outerWidth = 1000;
    const outerHeight = 750;

    const margin = {top:40, left:40, bottom:25, right:25};
    const width = outerWidth - margin.left - margin.right;
    const height = outerHeight - margin.top - margin.bottom;

    
    const svg = d3.select('.driving-plot')
                .append('svg')
                .attr('width', outerWidth)
                .attr('height', outerHeight)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.append('g')
        .attr('class', 'axis-y-axis');
        
    svg.append('g')
        .attr('class', 'axis-x-axis');
        


    let milesExtent = d3.extent(driving, d=>d.miles)
    let gasExtent = d3.extent(driving, d=>d.gas)

    const xScale = d3.scaleLinear()
                .range([0, width])
                .domain([milesExtent[0],milesExtent[1]]).nice()
    const yScale = d3.scaleLinear()
                .range([height,0])
                .domain([0,gasExtent[1]]).nice()

    const xAxis = d3.axisBottom()
                .scale(xScale)
    const yAxis = d3.axisLeft()
                .scale(yScale)

    svg.select(".axis-x-axis")
                .call(xAxis)
                .attr("transform", `translate(0, ${height})`)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line")
                            .clone()
                            .attr("y2", -1*height)
                            .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                            .attr("x", width)
                            .attr("y", margin.bottom-28)
                            .attr("fill", "black")
                            .attr("text-anchor", "end")
                            .attr("font-weight", "bold")
                            .text("Miles driven (per capita per year)")
                            .call(halo));
        
    svg.select(".axis-y-axis")
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line")
                            .clone()
                            .attr("x2", width)
                            .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                            .attr("x", margin.left-40)
                            .attr("y", 10)
                            .attr("fill", "black")
                            .attr("text-anchor", "start")
                            .attr("font-weight", "bold")
                            .text("Price of gas (per gallon, adjusted average $)")
                            .call(halo));


    let selection = svg.selectAll('.driving-plot')
						.data(driving)
						.enter()
						.append('circle')
						.attr("cx", function(d,i) {
							return xScale(d.miles);})
						.attr("cy", function(d,i) {
							return yScale(d.gas);})
                        .attr("r", 3)
                        .attr("fill", 'white')
                        .attr("stroke", 'black')
                        .attr("stroke-width", 1);

    let labels = svg.selectAll('.population-plot')
						.data(driving)
						.enter()
						.append('text')
						.text(function(d) {
							return d.year;
						})
						.attr("x", function(d,i) {
							return xScale(d.miles);})
						.attr("y", function(d,i) {
							return yScale(d.gas);})
                        .each(position)
                        .call(halo)

    const line = d3.line()
                    .x(function(d,i) {
                        return xScale(d.miles);})
                    .y(function(d,i) {
                        return yScale(d.gas);});

    svg.append("path")
        .datum(driving)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
						
						
}

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
}


function halo(text) {
    text
      .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
}

