var keyselected;
var colorindex;
var averagetime;
var barHeight;
var format = d3.format(".2f");
var Y_pos = 58;
var colorselected;
var textColor;

StackedChart = function(_parentElement, _data, _dataCategory, _detail){
    this.parentElement = _parentElement;
    this.data = _data;
    this.dataCat = _dataCategory;
    this.detail =_detail;

    this.activityType= "t";
    this.filtered =this.data;
    this.initVis();
}

//--------------------------------------------------------------------
//                          initVis
//--------------------------------------------------------------------
StackedChart.prototype.initVis = function() {
    var vis = this;

    keyselected =  vis.dataCat.columns;

    vis.filtered = vis.data;
    console.log(keyselected.length);
    console.log(keyselected);
    vis.active_link = "0"; //to control legend selections and hover

    // Margin object with properties for the four directions
    vis.margin = {top: 20, right: 15, bottom: 20, left:15};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 700 - vis.margin.top -vis.margin.bottom,
        vis.onethirdheight = vis.height*0.6 -vis.margin.top -vis.margin.bottom;
        vis.padding = 24;

    // SVG drawing area
    vis.facts = d3.select(".facts").append("text")
        .attr("x", 10).attr("y", 10)
        .attr("class", "facts");

    vis.svg_legend = d3.select("#legend").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right +50)
        .attr("height", vis.height*0.4 - vis.margin.top -10)
        .append("g")
        .attr("transform", "translate(" + (-80 )  + "," + 120+ ")");


    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right +50)
        .attr("height", vis.height*0.6)
        .append("g")
        .attr("transform", "translate(" + (vis.margin.left  + vis.margin.right +10)  + "," +(-20)+ ")");


//Create linear scales by using the D3 scale functions
    // Extend X : 24hours *60 minutes = 1440 minutes
    vis.max = 1440;

    vis.x = d3.scaleLinear()
        .domain([0,vis.max])
        .range([0, vis.width  ]);

    vis.y = d3.scaleBand()
        .rangeRound([-vis.onethirdheight + vis.padding , -50])
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
    vis.q = d3.scaleLinear()
        .domain([0, 8]);

    // Define X Axis
    vis.svg.append("g")
        .attr("class", "Xaxis")
        .attr("transform", "translate(20," + (vis.onethirdheight - vis.padding -20) +")");

    // Define Y Axis
    vis.svg.append("g")
        .attr("class", "Yaxis")
        .attr("transform", "translate(20," + (vis.onethirdheight +15)+")")
        .call(customYAxis);

    // Y Axis
    vis.svg.append("text")
        .attr("class", "axis")
        .style("text-anchor", "middle")
        .attr("x", -5).attr("y", 30)
        .text("Age");

    // X Axis
    vis.svg.append("g")
        .attr("class", "Xaxis");

    vis.svg.append("text")
        .attr("class", "axis")
        .attr("x", vis.width/2 ).attr("y", vis.onethirdheight-vis.margin.bottom +35)
        .text("Time (Min)");

    function customYAxis(g) {
        g.call(d3.axisLeft(vis.y));
        g.select(".domain").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    }


    vis.barsdetails = vis.svg.append("g")
        .selectAll("g") ;

// Define Legends
    vis.legend = vis.svg_legend.selectAll(".legend")
        .data(vis.dataCat.columns)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate("+ i*30+"," + 0 +")"; });

    // var rect = 18;
    // console.log(vis.width);
    var rect = vis.width/60;
    // console.log(rewidth)


    vis.dataCat2 = d3.values(vis.dataCat[0]);
    vis.dataAverage = d3.values(vis.dataCat[1]);
    vis.facts = d3.values(vis.dataCat[3]);
    vis.intfacts = d3.values(vis.dataCat[4]);

    console.log(vis.intfacts);
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
        .attr("class", "legend2")
        .attr("transform", function(d) {
            return "rotate(-45)" })
        .attr("transform", function(d) {
            return "rotate(-45)" })
        .attr("x", 160).attr("y", 145)
        .style("text-anchor", "end")
        // .attr("dx", "-.8em").attr("dy", ".15em")

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
    //
    // vis.tooltip.append("rect")
    //     .attr("width", 30)
    //     .attr("height", 20)
    //     .attr("fill", "white")
    //     .style("opacity", 1);

    vis.tooltip.append("text")
        .attr("x", 15)
        // .attr("dy", "1.2em")
        // .style("text-anchor", "middle")
        // .attr("font-size", "12px")
        .attr("font-weight", "bold");

    vis.bars = vis.svg.append("g")
        .selectAll("g") ;

    vis.updateVis_filtered();
}

//--------------------------------------------------------------------
//                          Wrangle Data
//--------------------------------------------------------------------

StackedChart.prototype.wrangleData = function(keyselected){

    var vis = this;

    var actTypes = vis.dataCat.columns;
    var actTypesDetail =vis.detail.columns;

    vis.detailCategory = vis.detail[6];

    var tempdata = vis.detail.slice(0, 6);;

    tempdata.forEach(function (d) {
        var i;
        for (i = 0; i < (actTypesDetail.length) ; i++) {
            var cat = actTypesDetail[i];
            if (cat[0] == 't') {
                d[cat] = +d[cat];
            }
        }
    });

    filtered2 = tempdata;

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

//define colors for detailed stack chart
    colorselected = vis.z(colorindex);
    var colorrange = [colorselected, 'white'];
    vis.q
        .range(colorrange)
        .interpolate(d3.interpolateHcl);


//filter data based on the selected category
    vis.detail.map(function(d){

        filteredDetail.push({
                "age": d.age,
                [vis.keyselected2[0]] : d[vis.keyselected2[0]],
                [vis.keyselected2[1]] : d[vis.keyselected2[1]],
                [vis.keyselected2[2]] : d[vis.keyselected2[2]],
                [vis.keyselected2[3]] : d[vis.keyselected2[3]],
                [vis.keyselected2[4]] : d[vis.keyselected2[4]],
                [vis.keyselected2[5]] : d[vis.keyselected2[5]],
                [vis.keyselected2[5]] : d[vis.keyselected2[6]],
                [vis.keyselected2[5]] : d[vis.keyselected2[7]]
        })
    });

    vis.filtered2 = filteredDetail;

    // console.log(vis.filtered2);
    // console.log(vis.keyselected2);
    // console.log(filteredDetail);
    //
    vis.updateVis_filtered();
    vis.updateVisDetails();
} ;


//--------------------------------------------------------------------
//                       Update Vis.
//--------------------------------------------------------------------


StackedChart.prototype.updateVis_filtered = function(){

    var vis = this;

    vis.svg = d3.select("body").transition();
    getText(colorindex, vis.dataCat2, vis.dataAverage, vis.facts, vis.intfacts);
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
        .attr("transform", "translate(20," + (vis.onethirdheight -vis.margin.bottom -8) + ")")
        .transition()
        .call(customXAxis);

    function customXAxis(g) {
        g.call(d3.axisBottom(vis.x).ticks(12).tickSize(-vis.width));
        g.select(".domain").remove();
        g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777");
    }

    barHeight = (vis.onethirdheight / 6 - vis.margin.top -18);


    if (keyselected.length === 3) {

    // Plot Single Bar Chart
        vis.svg.selectAll(".bars")
            .transition()
            // .duration(10)
            .attr("y", function (d, i) { console.log(d[i]);
                return Y_pos + i * (barHeight +  vis.padding)
            })
            .attr("x", function (d) {
                return vis.x(d[0]);
            })
            .attr("width", 0)

            .attr("height", barHeight)
            .attr("fill", "white");
            // .attr("fill", vis.z(colorindex));

    }
    else{
        // Plot Stacked Bar Chart
        vis.barsdetails.selectAll(".bars")
            .exit().remove();

        vis.bars.data(d3.stack().keys(keyselected)(vis.filtered))
            .enter().append("g")
            .attr("fill", function(d, index) {
                console.log(1);
                return vis.z(index);})
            .selectAll("rect")
            .data(function(d) { return d;})
            .enter().append("rect")
            .attr("class", "bars")
            .attr("y", function(d, i) {   return  Y_pos+ i*(barHeight + vis.padding) })
            .attr("x", function(d) {   return vis.x(d[0]); })
            .attr("width", function(d) {
                return vis.x(d[1]) - vis.x(d[0]); })
            .attr("height", barHeight)
            .attr("transform", "translate(20,0)")
            .on("mouseover", function(d,i) {
                d3.select(this)

                vis.tooltip.transition()
                    .duration(100)
                    .style("opacity",1);

                if (keyselected.length === 3){
                    console.log(d.data[keyselected]);
                    vis.tooltip.html("<b>" + format(d.data[keyselected])+"</b>"+ " Minutes" )
                        .style("left", (d3.event.pageX + 3) + "px")
                        .style("top", (d3.event.pageY + 10) + "px");

                    // var summary= " <p> The average American spent <b>9.59</b> hours a day on <b>" + vis.dataCat[keyselected] + "</b>.</p>";
                    // document.getElementById("facts").innerHTML=summary;
                }
                else {
                    // console.log(this);

                    var ke = getKeyByValue(d.data, (d[1]-d[0]));

                    var activityr = vis.dataCat2[keyselected.indexOf(ke,0)];
                    // console.log(vis.dataCat2[activityr]);

                    textColor = vis.z(keyselected.indexOf(ke,0));

                    getText_Average (d.data.age, format((d[1] - d[0])), activityr);

                    vis.tooltip.html("<b>" + format((d[1] - d[0]))+"</b>" + " Minutes " )
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

//--------------------------------------------------------------------
//               Update Vis Details Stacked Chart
//--------------------------------------------------------------------

StackedChart.prototype.updateVisDetails = function(){

    var vis = this;

    vis.bars.selectAll(".bars")
        .exit().remove();

    // Plot detailed Chart
    vis.barsdetails.data(d3.stack().keys(vis.keyselected2)(vis.filtered2))
        .enter().append("g")

        .attr("fill", function(d, index) {
            // console.log(index);
            return vis.q(index);})
        .on("mouseover", function(d, index) {
            d3.select(this)
            vis.tooltip.transition()
                .duration(100)
                .style("opacity",1);
            vis.tooltip.html("<b>"+ vis.detailCategory[d.key] +"</b>")
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY + 15) + "px")
        })
        .on("mouseout", function(d) {
                vis.tooltip.transition()
                    .duration(100)
                    .style("opacity", 0); })

        .selectAll("rect")
        .data(function(d) { return d;})
        .enter().append("rect")

        .attr("class", "bars")
        .attr("y", function(d, i) {   return  Y_pos + i*(barHeight +  vis.padding) })
        .attr("x", function(d) {   return vis.x(d[0]); })
        .attr("width", function(d) {
            return vis.x(d[1]) - vis.x(d[0]); })
        .attr("height", barHeight)
        .attr("transform", "translate(20,0)")
}

function getText(index, datacat, averagetime, facts, intfacts) {

    console.log(colorselected);
    if (index ==null){

        var summary= " <p> The average American spent ______  hours a day on ______</p>";
        document.getElementById("facts").innerHTML=summary;
    }
    else {
        if (intfacts[index].length < 3){
            var summary = " <p> The average American spent <b>" + averagetime[index] + "</b> hours a day on <strong><a style='color:" + String(colorselected) + "'>"
                + datacat[index] + ".</a></strong><br><br>" +facts[index]+"<br><br><b></p>";
        }
        else{
            var summary = " <p> The average American spent <b>" + averagetime[index] + "</b> hours a day on <strong><a  style='color:" + String(colorselected) + "'>"
                +   datacat[index] + ".</a></strong> <br><br>" +facts[index]+"<br><br><b> Did you know ? <sup>3</sup></sum></b><br>" + intfacts[index] +"</p>";
        }
        document.getElementById("facts").innerHTML = summary;
    }
}

function getText_Average (age, hours, activity){
    var summary= " <p> The average American age group from " + age + " spent "+ "<b>" + hours + "</b>" +" hours a day on <strong><a  style='color:" + String(textColor) + "'>"
            + activity + "</a></strong></p>";
    document.getElementById("facts").innerHTML=summary;
}

function getKeyByValue (obj, value) {
    return Object.keys(obj).find(key => format(obj[key]) === format(value));
}

