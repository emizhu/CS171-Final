


StackedChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    // this.displayData = [];

    this.initVis();
}


// var data = loadData();
// var data2017, keys;

StackedChart.prototype.initVis = function() {
    var vis = this;

    // Margin object with properties for the four directions
    vis.margin = {top: 40, right: 0, bottom: 60, left: 60};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    //Create linear scales by using the D3 scale functions
    // Extend X : 24hours *60 minutes = 1440 minutes
    vis.extendx = 1440;

    vis.x = d3.scaleLinear()		// y = d3.scaleLinear()
        .range([0, vis.width]);	// .rangeRound([height, 0]);

    vis.y = d3.scaleBand()			// x = d3.scaleBand()
        .rangeRound([vis.height, 0])	// .rangeRound([0, width])
        .padding(0.1)
        .round(true);

    //Create color scales
    vis.colors = d3.schemeCategory20;
    vis.colors = vis.colors.slice(0, 17);
    console.log(vis.colors);

    vis.z = d3.scaleOrdinal()
        .range(vis.colors);

    vis.tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    vis.tooltip.append("rect")
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

    vis.tooltip.append("text")
        .attr("x", 15)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");
}


StackedChart.prototype.wrangleData = function(){
        var vis = this;

        //next data by year
        vis.displayData = d3.nest()
            .key(function (d) {
                return d.tuyear;
            })
            .entries(vis.data);

        //store 2017 only
        vis.data2017 = d3.values(vis.displayData[14]);
        vis.displayData = vis.data2017[1];

        // column values
        keys = data.columns;
        console.log(vis.keys);

        // filter data
        vis.displayData.forEach(function (d) {
            //convert string to number
            var i;
            for (i = 0; i < keys.length; i++) {
                var category = keys[i];
                if (category[0] == 't') {
                    d[category] = +d[category];
                }}
        });
    // Update the visualization
    vis.updateVis();
}

AreaChart.prototype.updateVis = function(){
    var vis = this;

    vis.keys= vis.keys.slice(2,19);
    console.log(vis.keys);
    console.log(vis.data2017);

    y.domain(data2017.map(function(d) { return d.age; }));					// x.domain...
    x.domain([0,extendx]).nice();	// y.domain...
    // z.domain(keys);

    vis.svg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data2017))
        .enter().append("g")
        .attr("fill", function(d, index) { return z(index); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("y", function(d, i) { return 23 + i*(vis.height/keys.length+38)})
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("height", vis.height/6 - vis.margin.top - vis.margin.bottom)
        .attr("transform", "translate(60,0)")
        .on("mouseover", function(d) {
            d3.select(this)
                .style("fill", "orange");
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d[0] + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("fill", function(d, index) { return z(index); });
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

    vis.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(60,0)")
        .call(d3.axisLeft(vis.y));

}