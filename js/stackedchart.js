var keyselected;
var colorindex;

StackedChart = function(_parentElement, _data, _dataCategory){
    this.parentElement = _parentElement;
    this.data = _data;
    this.dataCat = _dataCategory;

    this.activityType= "t";
    this.filtered =this.data;
    this.initVis();
}


StackedChart.prototype.initVis = function() {
    var vis = this;

    keyselected =  vis.dataCat.columns;

    vis.filtered = vis.data;
    vis.active_link = "0"; //to control legend selections and hover

// Margin object with properties for the four directions
    vis.margin = {top: 40, right: 30, bottom: 20, left:40};
    vis.width = 1200- vis.margin.left -vis.margin.right,
        vis.height = 500- vis.margin.top -vis.margin.bottom,
        vis.padding = 30;

// SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.svg_legend = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height/4 + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
//Create linear scales by using the D3 scale functions
// Extend X : 24hours *60 minutes = 1440 minutes
    vis.max = 1440;

    vis.x = d3.scaleLinear()
        .domain([0,vis.max])
        .range([0, vis.width - vis.margin.right -vis.margin.left]);

    vis.y = d3.scaleBand()
        .rangeRound([-vis.height, -50])
        .padding(0.1)
        .round(true);

//Create color scales
    vis.colors = d3.schemeCategory20;
    vis.colors = vis.colors.slice(0, 18);


    // vis.x.domain([0,vis.max]);
    console.log(vis.data);
    vis.y.domain(vis.data.map(function(d) { return d.age; }));
    vis.z = d3.scaleOrdinal()
        .domain(vis.dataCat.columns)
        .range(vis.colors);

    // console.log(vis.data);
    // for (i=0; i<18; i++){
    // console.log(vis.z(i));}
    //
    // console.log(vis.dataCat.columns);
    // console.log(vis.z(vis.dataCat.columns));
    // Define X Axis
    vis.svg.append("g")
        .attr("class", "Xaxis")
        .attr("transform", "translate(20," + (vis.height - vis.padding -20) +")");

    // Define Y Axis
    vis.svg.append("g")
        .attr("class", "Yaxis")
        .attr("transform", "translate(20," + (vis.height +15)+")")
        .call(customYAxis);

    // Y Axis
    vis.svg.append("text")
        .attr("class", "axis")
        .style("text-anchor", "end")
        .attr("x", 0).attr("y", 0)
        .text("Age");

    // X Axis
    vis.svg.append("g")
        .attr("class", "Xaxis");

    vis.svg.append("text")
        .attr("class", "axis")
        .attr("x", vis.width -45).attr("y", vis.height-vis.margin.bottom +5)
        .text("Time (Min)");

    function customYAxis(g) {
        g.call(d3.axisLeft(vis.y));
        g.select(".domain").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    }



// Define Legends
    vis.legend = vis.svg_legend.selectAll(".legend")
        .data(vis.dataCat.columns)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate("+ i*30+"," + 0 +")"; });

    var rect = 18;
    vis.dataCat2 = d3.values(vis.dataCat[0]);
    vis.legend.append("rect")
        .attr("x", 210).attr("y", -40)
        .attr("width", rect).attr("height", rect)
        .style("fill", function(d){return vis.z(d);})
        .on("mouseover",function(){

            if (vis.active_link === "0") d3.select(this).style("cursor", "pointer");
            else {
                if (vis.active_link.split("class").pop() === this.id.split("id").pop()) {
                    d3.select(this).style("cursor", "pointer");
                } else d3.select(this).style("cursor", "auto");
            }
        })
        .on("click",function(d){
            var test = d3.select(this);
            keyselected = test._groups[0][0].__data__;
            vis.wrangleData(keyselected);
        });

    vis.legend.append("text")
        .attr("x", 176).attr("y", rect*8)
        .style("text-anchor", "end")
        .attr("dx", "-.8em").attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)" })
        .text(function(d, i) { return vis.dataCat2[i]});

    vis.svg_legend.append("text")
        .attr("x", 160).attr("y", -28)
        .style("text-anchor", "end")
        .text("Activity Types");

// Define Tooltips
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

    vis.bars = vis.svg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keyselected)(vis.filtered));

    vis.bars.enter().append("g")
        .attr("fill", function(d, index) {
            console.log(1);
            return vis.z(index);})
        .selectAll("rect")
        .data(function(d) { return d;})
        .enter().append("rect")
        .attr("class", "bars")
        .attr("y", function(d, i) { return  40+ i*(vis.height/6 - 10) })
        .attr("x", function(d) {   return vis.x(d[0]); })
        .attr("width", function(d) {
            return vis.x(d[1]) - vis.x(d[0]); })
        .attr("height", vis.height/6 - vis.margin.top -10)
        .attr("transform", "translate(20,0)")
        .on("mouseover", function(d,i) {
            d3.select(this)
            console.log(d);
            // .style("fill", "orange");
            vis.tooltip.transition()
                .duration(100)
                .style("opacity", .9);
            vis.tooltip.html(parseInt((d[1]-d[0])) + " Minutes")
                .style("left", (d3.event.pageX +3) + "px")
                .style("top", (d3.event.pageY +10) + "px");
        })
        .on("mouseout", function(d) {

            vis.tooltip.transition()
                .duration(100)
                .style("opacity", 0); });

    // console.log(dataNew);
    // vis.updateVis();
}

// noinspection JSAnnotator
StackedChart.prototype.wrangleData = function(keyselected){

    var vis = this;

    // var actSelected = activityType;
    var actTypes = vis.dataCat.columns;

    vis.svg = d3.select("body").transition();

    colorindex = actTypes.indexOf(keyselected,0) ;
    console.log(colorindex);
    actTypes = actTypes.filter(function(value, i, arr){
        if (value != keyselected){
            return value;}});

    vis.filtered =[];
    vis.data.map(function(d){
        vis.filtered.push({
            "age": d.age,
            [keyselected] : d[keyselected]
        });
    });

    // console.log(vis.filtered);
    // console.log(vis.data);
    vis.updateVis();
}

StackedChart.prototype.updateVis = function(){

    var vis = this;

    console.log(vis.filtered);
    console.log(keyselected);
    // Update X domian

    // Update domains
    vis.max = d3.max(vis.filtered.map(function(d) { return d[keyselected];}));
    vis.x.domain([0, vis.max]);

    vis.svg.select(".Xaxis")

        .attr("transform", "translate(20," + (vis.height -vis.margin.bottom -8) + ")")
        .transition()
        .call(customXAxis);

    function customXAxis(g) {

        g.call(d3.axisBottom(vis.x).ticks(12).tickSize(-vis.width));
        g.select(".domain").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777");
    }

    // Stacked Bar Chart
    vis.svg.selectAll(".bars")
        .transition()
        .attr("y", function(d, i) { return  40+ i*(vis.height/6 - 10) })
        .attr("x", function(d) {   return vis.x(d[0]); })
        .attr("width", function(d) {
            // console.log(d.data[keyselected]);
            return vis.x(d.data[keyselected]);
        })
        .attr("height", vis.height/6 - vis.margin.top -10)
        .attr("fill", function(d) {
            console.log(colorindex);

            return vis.z(colorindex);
        });
}

