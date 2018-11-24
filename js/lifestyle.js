//#todo make tooltip color match circles
//#todo make checkboxes match circles
//#todo create better text for axis labels

LifeStyle = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];

    this.initVis();
}




LifeStyle.prototype.initVis = function() {
    var vis = this;

    // Margin object with properties for the four directions
    vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
    vis.width = 550- vis.margin.left -vis.margin.right,
    vis.height = 450- vis.margin.top -vis.margin.bottom,
    vis.padding = 10;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //color range for comparisons
    vis.color = ["cyan","black"];

    //these values must EXACTLY match the headers in vis.displayData
    vis.checkboxCategories = ["sex", "full_part_time"];

    //time categories to be displayed
    vis.headers = ["personal_care", 	"sleep",	"household",	"helping_HH_members",	"helping_nonHH_members",	"work",	"education",
        "consumer_purchases",	"professional_personal_services",	"HH_services",	"govt_civic",	"eat_drink",	"leisure",	"sports",
        "religious",	"volunteer",	"phone",	"traveling",	"misc"];
    vis.lineNumber = vis.headers.length;
    vis.lineLength = 200;
    vis.angle = 360/vis.lineNumber;
    vis.angleRadian = 360/vis.lineNumber * Math.PI / 180;
    vis.labelBuffer = 20;

    //filter data for 2017 only
    vis.displayData = vis.data.filter(function(d) {
        return d.year == "2017";
    });

    for (i = 0; i < vis.headers.length; i++) {

        //Create axes
        //----------------------------------------------------------
        // create scales
        vis["x" + i] = d3.scaleLinear()
            .domain(d3.extent(vis.displayData, function(d){return d[vis.headers[i]];}))
            .range([0,vis.lineLength]);
        vis["xAxis" + i] = d3.axisBottom(vis["x" + i]);

        vis["svgx" + i]= vis.svg.append("g")
            .attr("class","axis")
            .attr("class","x-axis")
            .attr("transform", "translate(" + vis.width/2 + "," + vis.height/2 + ") " + "rotate(" + vis.angle*i + ")" )
            .call(vis["xAxis" + i].ticks(0));
        //----------------------------------------------------------


        //Axis labels
        //----------------------------------------------------------
        //create arcs
        //https://stackoverflow.com/questions/12074959/how-to-add-a-simple-arc-with-d3
        var outerRadius = vis.lineLength + vis.labelBuffer;

        var outerArc = d3.arc()
            .innerRadius(outerRadius)
            .outerRadius(outerRadius)
            .startAngle(i * Math.PI / 180)
            .endAngle((i+1) * vis.angleRadian);

        vis["svgarc" + i]= vis.svg.append("path")
            .style("fill", "none")
            // .style("stroke", "#0B9B29")
            // .style("stroke-width", stroke)
            .attr('stroke-linejoin', 'round')
            .attr("class","arc")
            .attr("d", outerArc())
            .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height/2) + ")");

        //get position of arc
        //https://stackoverflow.com/questions/49382836/how-to-add-text-at-the-end-of-arc
        var point = vis["svgarc" + i].node().getPointAtLength(vis["svgarc" + i].node().getTotalLength() / 2);

        //append text labels
        var text = vis.svg.append("text")
            .attr("x", point.x)
            .attr("y", point.y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", "10px")
            .text(vis.headers[i])
            .attr("class","x-labels")
            .attr("class","x-axis")
            .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height/2) + ")");
        //----------------------------------------------------------

    };


    //create tooltip
    //https://stackoverflow.com/questions/10805184/show-data-on-mouseover-of-circle
    //http://bl.ocks.org/Caged/6476579
    vis.tip = d3.tip()
        .attr("class","d3-tip")
        .offset([-20,0])
        .html(function(d){
            //return value rounded to 1 decimal point
            return (Math.round( d * 10 ) / 10);
        });

    //convert categories to numeric
    vis.wrangleData();
}




LifeStyle.prototype.wrangleData = function() {
    var vis = this;

    //convert categories to numeric
    vis.numericheaders = ["personal_care", 	"sleep",	"household",	"helping_HH_members",	"helping_nonHH_members",	"work",	"education",
        "consumer_purchases",	"professional_personal_services",	"HH_services",	"govt_civic",	"eat_drink",	"leisure",	"sports",
        "religious",	"volunteer",	"phone",	"traveling",	"misc"];
    var i;
    for (i = 0; i < vis.numericheaders.length; i++) {
        vis.displayData.forEach(function(d){
            d[vis.numericheaders[i]] = +d[vis.numericheaders[i]];
        });
    };

    // filter data based on checkbox selection
    vis.filterData();
}




LifeStyle.prototype.filterData = function(){
    var vis = this;

    var i = 0;
    var j=0;
    var k=0;

    for (i = 0; i < vis.checkboxCategories.length; i++) {

        //group data by checkboxCategories (sex, etc)
        vis["nested" + vis.checkboxCategories[i]] = d3.nest()
            .key(function(d) { return d[vis.checkboxCategories[i]]; })
            .rollup(function(leaves) { return leaves.length; })
            .entries(vis.displayData);

        //create two filtered arrays
        for (k = 1; k <= 2; k++) {
            //create empty arrays for selected values using checkboxCategories
            vis[vis.checkboxCategories[i] + "values" +k] = [];

            //push selected values to empty arrays
            for (j = 0; j < vis["nested" + vis.checkboxCategories[i]].length; j++) {
                //str = lifestyle.nestedsex[0].key = "Female"
                var str = "#" + vis["nested" + vis.checkboxCategories[i]][j].key +k;
                vis[vis.checkboxCategories[i] + "values" +k].push($(str + ":checked").val());
            };

            //if no values are selected, treat as if all are selected
            function isundefined(currentValue) {
                return currentValue === undefined;
            }
            if (vis[vis.checkboxCategories[i] + "values" +k].every(isundefined)) {
                vis[vis.checkboxCategories[i] + "values" +k] = [];
                for (j = 0; j < vis["nested" + vis.checkboxCategories[i]].length; j++) {
                    var str = "#" + vis["nested" + vis.checkboxCategories[i]][j].key +k;
                    vis[vis.checkboxCategories[i] + "values" +k].push($(str).val());
                };

            };

            // final filtered arrays
            // vis["filtered" + k] = [];
            // vis["filtered" + k] = vis.displayData.filter(function(value){
            //     return vis["sexvalues" + k].includes(value.sex) && vis["full_part_timevalues" + k].includes(value.full_part_time);
            // });
            // console.log("sex values" + k + ": "+ vis["sexvalues" + k]);
            // console.log("full_part_time values" + k + ": "+ vis["full_part_timevalues" + k]);

        };

    };


    //final filtered arrays
    vis.filtered1 = [];
    vis.filtered1 = vis.displayData.filter(function(value){
        return vis.sexvalues1.includes(value.sex) && vis.full_part_timevalues1.includes(value.full_part_time);
    });

    vis.filtered2 = [];
    vis.filtered2 = vis.displayData.filter(function(value){
        return vis.sexvalues2.includes(value.sex) && vis.full_part_timevalues2.includes(value.full_part_time);
    });


    console.log("Filtered: " + vis.filtered1.length);
    console.log("sex values1: " + vis.sexvalues1);
    console.log("full_part_time values1: " + vis.full_part_timevalues1);

    console.log("sex values2: " + vis.sexvalues2);
    console.log("full_part_time values2: " + vis.full_part_timevalues2);



    // create arrays with selected values
    // vis.sexvalues.push($('#Male:checked').val());
    // vis.sexvalues.push($('#Female:checked').val());
    //
    // vis.fullpartvalues.push($('#Full:checked').val());
    // vis.fullpartvalues.push($('#Part:checked').val());
    // vis.fullpartvalues.push($('#NA:checked').val());


    // if (vis.sexvalues.every(isundefined)) {
    //     vis.sexvalues.push($('#Male').val());
    //     vis.sexvalues.push($('#Female').val());
    // }
    // if (vis.full_part_timevalues.every(isundefined)) {
    //     vis.full_part_timevalues.push($('#Full').val());
    //     vis.full_part_timevalues.push($('#Part').val());
    //     vis.full_part_timevalues.push($('#-1').val());
    // }



    // calculate averages
    vis.calcData();
}




LifeStyle.prototype.calcData = function(){

    var vis = this;
    //function for calculating averages
    function calcAverages(array, number){
        var i, j;
        for (j = 0; j < vis.headers.length; j++) {
            vis[vis.headers[j] + "total" + number] = 0;
            for (i = 0; i < array.length; i++) {
                vis[vis.headers[j] + "total" + number] += array[i][vis.headers[j]];
            };
            //calculate average
            vis[vis.headers[j] + "avg" + number] = vis[vis.headers[j] + "total" + number]/ array.length;

        };
    }

    //call function for all data and for filtered data
    calcAverages(vis.filtered1, 0);
    calcAverages(vis.filtered2, 1);


    //create arrays for each category with 2 points each; first is all data, second is filtered
    var i;
    for (i = 0; i < vis.headers.length; i++) {
        vis[vis.headers[i] + "AvgArray"] = [];
        vis[vis.headers[i] + "AvgArray"].push(vis[vis.headers[i] + "avg0"]);
        vis[vis.headers[i] + "AvgArray"].push(vis[vis.headers[i] + "avg1"]);
    };

    //draw circles and call tooltip
    vis.updateVis();
}




LifeStyle.prototype.updateVis = function(){
    var vis = this;

    for (i = 0; i < vis.headers.length; i++) {

        //draw circles
        var circle = vis["svgx" + i]
            .selectAll("circle")
            .data(vis[vis.headers[i] + "AvgArray"]);
        circle.enter()
            .append("circle")
            .merge(circle)
            .on("mouseover",vis.tip.show)
            .on("mouseout",vis.tip.hide)
            .transition().duration(800)
            .attr("fill", function(d) {
                //get data position in array
                var value = vis[vis.headers[i] + "AvgArray"].indexOf(d);
                return vis.color[value];
            })
            .attr("cx", function(d) { return vis["x" + i](d); })
            .attr("r", 4)
            ;
        circle.exit().remove();

    };


    //call tooltips
    vis.svg.call(vis.tip);

}




