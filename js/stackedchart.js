var keyselected;
var keyselected2;
var colorindex;
var colorindexDetail;
var averagetime;

StackedChart = function(_parentElement, _data, _dataCategory, _detail){
    this.parentElement = _parentElement;
    this.data = _data;
    this.dataCat = _dataCategory;
    this.detail =_detail;

    this.activityType= "t";
    this.filtered =this.data;
    this.initVis();
}


StackedChart.prototype.initVis = function() {
    var vis = this;

    keyselected =  vis.dataCat.columns;

    vis.filtered = vis.data;
    console.log(keyselected.length);
    vis.active_link = "0"; //to control legend selections and hover

// Margin object with properties for the four directions
    vis.margin = {top: 40, right: 30, bottom: 20, left:40};
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500- vis.margin.top -vis.margin.bottom,
        vis.padding = 30;

// SVG drawing area
    vis.facts = d3.select(".facts").append("text")
        .attr("x", 10).attr("y", 10)
        .attr("class", "facts");

    vis.svg_legend = d3.select("#legend").append("svg")
        .attr("width", vis.width*0.6 + vis.margin.left + vis.margin.right)
        .attr("height", vis.height/4 + vis.margin.top + vis.margin.bottom + 10)
        .append("g")
        .attr("transform", "translate(" + (vis.margin.left +75) + "," + 50+ ")");


    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + 0+ ")");


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

//Create color scales for stacking chart
    vis.colors = d3.schemeCategory20;
    vis.colors = vis.colors.slice(0, 18);

    // console.log(vis.data);
    vis.y.domain(vis.data.map(function(d) { return d.age; }));
    vis.z = d3.scaleOrdinal()
        .domain(vis.dataCat.columns)
        .range(vis.colors);

    //Create color scales for detailed stacking chart
    // vis.colorsTwo = d3.schemeCategory20c;
    //
    vis.q = d3.scaleLinear()
        .domain([1, 5]);
        // .interpolate(d3.interpolateHcl);
    //     .domain(vis.dataCat.columns)
    //     .range(vis.colorsTwo);

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
        .style("text-anchor", "middle")
        .attr("x", -10).attr("y", 30)
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
    vis.dataAverage = d3.values(vis.dataCat[1]);
    vis.facts = d3.values(vis.dataCat[3]);
    // console.log(vis.facts);
    // console.log(vis.dataAverage);
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


            console.log(keyselected);

            vis.wrangleData(keyselected);
        });


    vis.svg_legend.append("rect")
        .attr("x", 150).attr("y", -40)
        .attr("width", rect).attr("height", rect)
        .style("fill", function(d){return "darkgray";})
         .on("mouseover",function(){

             if (vis.active_link === "0") d3.select(this).style("cursor", "pointer");
             else {
                 if (vis.active_link.split("class").pop() === this.id.split("id").pop()) {
                     d3.select(this).style("cursor", "pointer");
                 } else d3.select(this).style("cursor", "auto");
             }
         })
        .on("click",function(d){


            //remove unneeded circles
            vis.filtered = vis.data;
            keyselected =  vis.dataCat.columns;

            vis.updateVis_filtered();
            colorindex = null;
        });

    vis.legend.append("text")
        .attr("x", 176).attr("y", rect*8)
        .style("text-anchor", "end")
        .attr("dx", "-.8em").attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-45)" })
        .text(function(d, i) { return vis.dataCat2[i]});

    vis.svg_legend.append("text")
        .attr("class", "legend")
        .attr("x", 115).attr("y", 110)
        .style("text-anchor", "end")
        .attr("transform", function(d) {
            return "rotate(-45)" })
        .text("All");

    // vis.svg_legend.append("text")
    //     .attr("class", "legend")
    //     .attr("x", 90).attr("y", -28)
    //     .style("text-anchor", "end")
    //     .text("Activity Types");

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
        .selectAll("g") ;

    vis.barsdetails = vis.svg.append("g")
        .selectAll("g") ;

    vis.updateVis_filtered();
}

// noinspection JSAnnotator
StackedChart.prototype.wrangleData = function(keyselected){

    var vis = this;

    var actTypes = vis.dataCat.columns;
    var actTypesDetail =vis.detail.columns;



    console.log(actTypesDetail);
    averagetime = actTypes.indexOf(keyselected,1) ;
    colorindex = actTypes.indexOf(keyselected,0) ;

    vis.filtered =[];
    vis.data.map(function(d){
        vis.filtered.push({
            "age": d.age,
            [keyselected] : d[keyselected]
        });
    });

    var filteredDetail =[];
    vis.keyselected2 = [];



    for (i=0; i<actTypesDetail.length; i++){
        var sub =  actTypesDetail[i].substring(0,3);
        if (keyselected == sub){
            vis.keyselected2.push(actTypesDetail[i])
        }
    }
    console.log(vis.keyselected2);

    var colorselected = vis.z(colorindex);
    console.log(vis.z(colorindex));



    // vis.colorsTwo = d3.schemeCategory20c;
    //

    var colorrange = [0, colorselected];
    vis.q
        .range(colorrange);

    console.log(vis.q(1));
    console.log(vis.q(2));
    console.log(vis.q(3));
    console.log(vis.q(4));
    console.log(vis.q(5));

    vis.detail.map(function(d){

        filteredDetail.push({
                "age": d.age,
                [vis.keyselected2[0]] : d[vis.keyselected2[0]],
                [vis.keyselected2[1]] : d[vis.keyselected2[1]],
                [vis.keyselected2[2]] : d[vis.keyselected2[2]],
                [vis.keyselected2[3]] : d[vis.keyselected2[3]],
                [vis.keyselected2[4]] : d[vis.keyselected2[4]],
                [vis.keyselected2[5]] : d[vis.keyselected2[5]]
        })
    });

    vis.filtered2 = filteredDetail;

    console.log(vis.filtered2);
    console.log(vis.keyselected2);
    console.log(filteredDetail);


    vis.updateVis_filtered();
    vis.updateVisDetails();
} ;





StackedChart.prototype.updateVis_filtered = function(){

    var vis = this;
    //
    // console.log(vis.filtered);
    // console.log(keyselected);


    vis.svg = d3.select("body").transition();
    getText(colorindex, vis.dataCat2, vis.dataAverage, vis.facts);
    // Update domains
    vis.max = d3.max(vis.filtered.map(function(d){
        if (keyselected.length === 3){
            return d[keyselected];
        }
        else{
            return 1440;
        }
    }));

    vis.x.domain([0, vis.max]);

// Update X Axis
    vis.svg.select(".Xaxis")
        .attr("transform", "translate(20," + (vis.height -vis.margin.bottom -8) + ")")
        .transition()
        .call(customXAxis);



    function customXAxis(g) {
        g.call(d3.axisBottom(vis.x).ticks(12).tickSize(-vis.width));
        g.select(".domain").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777");
    }
    if (keyselected.length === 3) {

    // Plot Single Bar Chart

        vis.svg.selectAll(".bars")
            .transition()
            .duration(500)
            .attr("y", function (d, i) { console.log(d[i]);
                return 40 + i * (vis.height / 6 - 10)
            })
            .attr("x", function (d) {
                return vis.x(d[0]);
            })

            .attr("width", function (d, i) {
                if (d[0] ===0){
                    return vis.x(d.data[keyselected]);
                } else{
                    return 0;
                }
            })
            .attr("height", vis.height / 6 - vis.margin.top - 10)
            .attr("fill", vis.z(colorindex));

    }
    else{
        // Plot Stacked Bar Chart

        vis.bars.data(d3.stack().keys(keyselected)(vis.filtered))
            .enter().append("g")
            .attr("fill", function(d, index) {
                console.log(1);
                return vis.z(index);})
            .selectAll("rect")
            .data(function(d) { return d;})
            .enter().append("rect")
            .attr("class", "bars")
            .attr("y", function(d, i) {   return  40+ i*(vis.height/6 - 10) })
            .attr("x", function(d) {   return vis.x(d[0]); })
            .attr("width", function(d) {
                return vis.x(d[1]) - vis.x(d[0]); })
            .attr("height", vis.height/6 - vis.margin.top -10)
            .attr("transform", "translate(20,0)")
            .on("mouseover", function(d,i) {
                d3.select(this)

                vis.tooltip.transition()
                    .duration(100)
                    .style("opacity",1);

                if (keyselected.length === 3){
                    console.log(d.data[keyselected]);
                    vis.tooltip.html(parseInt(d.data[keyselected]) + " Minutes")
                        .style("left", (d3.event.pageX + 3) + "px")
                        .style("top", (d3.event.pageY + 10) + "px");

                    // var summary= " <p> The average American spent <b>9.59</b> hours a day on <b>" + vis.dataCat[keyselected] + "</b>.</p>";
                    // document.getElementById("facts").innerHTML=summary;
                }
                else {
                    console.log("min");
                    vis.tooltip.html(parseInt((d[1] - d[0])) + " Minutes")
                        .style("left", (d3.event.pageX + 3) + "px")
                        .style("top", (d3.event.pageY + 10) + "px");
                }
            })
            .on("mouseout", function(d) {

                vis.tooltip.transition()
                    .duration(100)
                    .style("opacity", 0); });

        console.log("2");
    }
}

StackedChart.prototype.updateVisDetails = function(){

    var vis = this;
    console.log(colorindex);

    console.log(colorindex);
    // Plot detailed Chart
    vis.barsdetails.data(d3.stack().keys(vis.keyselected2)(vis.filtered2))
        .enter().append("g")
        .attr("fill", function(d, index) {
            console.log(1);
            return vis.z(index);})
        .selectAll("rect")
        .data(function(d) { return d;})
        .enter().append("rect")
        .attr("class", "bars")
        .attr("y", function(d, i) {   return  40 + i*(vis.height/6 - 10) })
        .attr("x", function(d) {   return vis.x(d[0]); })
        .attr("width", function(d) {
            return vis.x(d[1]) - vis.x(d[0]); })
        .attr("height", vis.height/6 - vis.margin.top -10)
        .attr("transform", "translate(20,0)")

}





function getText(index, datacat, averagetime, facts) {

    if (index ==null){

        var summary= " <p> The average American spent ______  hours a day on ______</p>";
        document.getElementById("facts").innerHTML=summary;
    }
    else {
        var summary = " <p> The average American spent <b>" + averagetime[index] + "</b> hours a day on <b>"
            + datacat[index] + ".</b></p><br>" + facts[index] ;

        document.getElementById("facts").innerHTML = summary;
    }
}