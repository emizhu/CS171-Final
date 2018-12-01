//#todo fix labels
//#todo fix error if filter is n/a


LifeStyle = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];

    this.initVis();
}



LifeStyle.prototype.initVis = function() {
    var vis = this;

    //Customize here
    //----------------------------------------------------------
    // Margin object with properties for the four directions
    vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
    //vis.columnwidth = $("#" + vis.parentElement).width();
    //vis.width = 750- vis.margin.left -vis.margin.right,
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left -vis.margin.right;
    vis.height = 700 - vis.margin.top -vis.margin.bottom;
    vis.padding = 10;

    //color range for comparisons
    vis.color = [d3.schemeCategory20[0],d3.schemeCategory20[2]];

    vis.lineLength = 320;
    vis.circleradius = 7;
    vis.labelBuffer = 25;
    vis.innerAxis = 30;
    //----------------------------------------------------------

    //create array with labels - can edit text in atussum_0317_two_digits_cat.csv
    //DO NOT CHANGE ORDER OF ROWS/COLUMNS IN THE CSV - only text in column 2
    var i = 0;
    vis.labels = [];
    for (i = 0; i < dataCat["columns"].length; i++) {
        vis.labels.push(dataCat[0][dataCat["columns"][i]]);
    };
    vis.labels.splice(1, 0, "Sleep"); // at index position 1, remove 0 elements, then add "Sleep"

    // vis.labels =["Personal Care", "Sleep", "Household", "Help Household Members", "Help Non-Household Members",
    //     "Work", "Education", "Consumer Purchases", "Prof/Personal Services", "Household Services", "Govt & Civic",
    //     "Eat & Drink", "Leisure", "Sports", "Religious", "Volunteer", "Phone Calls", "Traveling",
    //     "Miscellaneous"];

    vis.labels =["Personal Care", "Sleep", "Household",
        "Work", "Education", "Consumer Purchases",  "Household Services", "Govt & Civic",
        "Eat & Drink", "Leisure", "Sports", "Religious", "Volunteer", "Phone Calls", "Traveling"];

    //headers for filtering data
    //these values must EXACTLY match the headers in vis.displayData and should be in the same order as vis.labels
    // vis.headers = ["personal_care", 	"sleep",	"household",	"helping_HH_members",	"helping_nonHH_members",	"work",	"education",
    //     "consumer_purchases",	"professional_personal_services",	"HH_services",	"govt_civic",	"eat_drink",	"leisure",	"sports",
    //     "religious",	"volunteer",	"phone",	"traveling",	"misc"];

    vis.headers = ["personal_care", 	"sleep",	"household", 	"work",	"education",
        "consumer_purchases",	"HH_services",	"govt_civic",	"eat_drink",	"leisure",	"sports",
        "religious",	"volunteer",	"phone",	"traveling"];





    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.lineNumber = vis.headers.length;
    vis.angle = 360/vis.lineNumber;
    vis.angleRadian = vis.angle * Math.PI / 180;
    vis.outerArcLength = vis.lineLength * vis.angleRadian;


    //filter data for 2017 only
    vis.displayData = vis.data.filter(function(d) {
        return d.year == "2017";
    });


    for (i = 0; i < vis.headers.length; i++) {

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
            .attr('stroke-linejoin', 'round')
            .attr("class","arc")
            .attr("id","arc" + i)
            .attr("d", outerArc())
            .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height/2) + ")");

        // https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html
        //Append the month names to each slice
        vis.svg
            .append("text")
            .append("textPath")
            .attr("class", "activityText")
            //.style("text-anchor","middle") //place the text halfway on the arc
            .attr("startOffset", "50%")
            .attr("xlink:href","#arc" + i)
            .text(vis.labels[i])
            .attr("font-size", "12px");


        // //get position of arc
        // //https://stackoverflow.com/questions/49382836/how-to-add-text-at-the-end-of-arc
        // var pointLabel = vis["svgarc" + i].node().getPointAtLength(vis["svgarc" + i].node().getTotalLength() / 2);
        //
        // //append text labels
        // var text = vis.svg.append("text")
        //     .attr("x", pointLabel.x)
        //     .attr("y", pointLabel.y)
        //     .attr("text-anchor", "left")
        //     .attr("dominant-baseline", "central")
        //     .attr("font-size", "12px")
        //     .text(vis.labels[i])
        //     .attr("class","lifestyle-x-labels")
        //     .attr("class","x-axis")
        //     .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height/2) + ")" );
        // ----------------------------------------------------------


        //Create axes
        //----------------------------------------------------------
        // create scales
        vis["x" + i] = d3.scaleLinear()
            // .domain(d3.extent(vis.displayData, function(d){return d[vis.headers[i]];}))
            .domain([.2,1.2])
            .range([vis.innerAxis,vis.lineLength]);
        vis["xAxis" + i] = d3.axisBottom(vis["x" + i]);

        //console.log("extent: " + d3.extent(vis.displayData, function(d){return d[vis.headers[i]];})  );

        vis["svgx" + i]= vis.svg.append("g")
            .attr("class","axis")
            .attr("class","life-x-axis")
            .attr("transform", "translate(" + vis.width/2 + ","  + (vis.height/2)   + ") " + "rotate(" + vis.angle*i + ")" )
            .call(vis["xAxis" + i].ticks(0));
        //----------------------------------------------------------



        //color rows of checkboxes
        $("#checkboxes1").css("color",vis.color[0]);
        $("#checkboxes2").css("color",vis.color[1]);

    };


    //Create checkboxes
    //----------------------------------------------------------
    //categories for filtering
    vis.checkboxCategories = ["sex", "full_part_time", "multiple_jobs","school_enrollment","number_children"];

    for (i = 0; i < vis.checkboxCategories.length; i++) {

        //group data by checkboxCategories (sex, etc)
        vis["nested" + vis.checkboxCategories[i]] = d3.nest()
            .key(function (d) {
                return d[vis.checkboxCategories[i]];
            })
            .rollup(function (leaves) {
                return leaves.length;
            })
            .entries(vis.displayData);
    };

    //----------------------------------------------------------




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

    vis.displayData.forEach(function(d){
        d.number_children = +d.number_children;
    });

    // filter data based on checkbox selection
    vis.filterData();
}




LifeStyle.prototype.filterData = function(){
    var vis = this;

    var i = 0;
    var j=0;
    var k=0;

    for (i = 0; i < vis.checkboxCategories.length; i++) {

        //create two filtered arrays
        for (k = 1; k <= 2; k++) {
            //create empty arrays for selected values using checkboxCategories
            vis[vis.checkboxCategories[i] + "values" +k] = [];

            //if no values are selected, treat as if all are selected
            function isundefined(currentValue) {
                return currentValue === undefined;
            }

            //for all categories except number of children the keys match the checkbox values
            if (vis.checkboxCategories[i] != "number_children") {
                //push selected values to empty arrays
                for (j = 0; j < vis["nested" + vis.checkboxCategories[i]].length; j++) {
                    //str = lifestyle.nestedsex[0].key = "Female"
                    var str = "#" + vis.checkboxCategories[i] + vis["nested" + vis.checkboxCategories[i]][j].key +k;
                    vis[vis.checkboxCategories[i] + "values" +k].push($(str + ":checked").val());
                };

                if (vis[vis.checkboxCategories[i] + "values" +k].every(isundefined)) {
                    vis[vis.checkboxCategories[i] + "values" +k] = [];
                    for (j = 0; j < vis["nested" + vis.checkboxCategories[i]].length; j++) {
                        var str = "#" + vis.checkboxCategories[i] + vis["nested" + vis.checkboxCategories[i]][j].key +k;
                        vis[vis.checkboxCategories[i] + "values" +k].push($(str).val());
                    };
                }
            }

            //for number of children
            else {
                var str = "#" + vis.checkboxCategories[i] + "Yes" +k;
                if ($(str + ":checked").val() == "Yes") {
                    var j = 1;
                    for (j=1; j<12; j++) {
                        vis[vis.checkboxCategories[i] + "values" +k].push(j);
                    }
                }
                var str = "#" + vis.checkboxCategories[i] + "No" +k;
                if ($(str + ":checked").val() == "No") {
                    vis[vis.checkboxCategories[i] + "values" +k].push(0);
                }

                if (vis[vis.checkboxCategories[i] + "values" +k].every(isundefined)) {
                    var j = 0;
                    for (j=0; j<12; j++) {
                        vis[vis.checkboxCategories[i] + "values" +k].push(j);
                    }
                }
            }

        };

    };



    // final filtered arrays
    for (k = 1; k <= 2; k++) {

        vis["filtered" + k] = [];
        vis["filtered" + k] = vis.displayData.filter(function(value){
            return (
                vis["sexvalues" + k].includes(value.sex) &&
                vis["full_part_timevalues" + k].includes(value.full_part_time) &&
                vis["multiple_jobsvalues" + k].includes(value.multiple_jobs) &&
                vis["school_enrollmentvalues" + k].includes(value.school_enrollment) &&
                vis["number_childrenvalues" + k].includes(value.number_children)
            );
        });
        console.log("sex values" + k + ": "+ vis["sexvalues" + k]);
        console.log("full_part_time values" + k + ": "+ vis["full_part_timevalues" + k]);
        console.log("multiple_jobs values" + k + ": "+ vis["multiple_jobsvalues" + k]);
        console.log("school_enrollment values" + k + ": "+ vis["school_enrollmentvalues" + k]);
        console.log("number_children values" + k + ": "+ vis["number_childrenvalues" + k]);

    };


    // calculate averages
    vis.calcData();
}




LifeStyle.prototype.calcData = function(){

    var vis = this;

    //function for calculating averages
    function calcAverages(array, number){
        var i, j;
        for (j = 0; j < vis.headers.length; j++) {

            //calculate totals for averages
            vis[vis.headers[j] + "total" + number] = 0;

            //create array for percentiles
            vis[vis.headers[j] + "array" + number] =[];

            for (i = 0; i < array.length; i++) {
                vis[vis.headers[j] + "total" + number] += array[i][vis.headers[j]];
                vis[vis.headers[j] + "array" + number].push(array[i][vis.headers[j]]);
            };

            //calculate averages and percentiles
            vis[vis.headers[j] + "avg" + number] = vis[vis.headers[j] + "total" + number]/ array.length;
            vis[vis.headers[j] + "per" + number] = jStat.percentileOfScore(vis[vis.headers[j] + "array" + number], vis[vis.headers[j] + "avg" + number]);

        };
    }

    //call function for all data and for filtered data
    calcAverages(vis.filtered1, 0);
    calcAverages(vis.filtered2, 1);


    //create arrays for each category with 2 points each; first is all data, second is filtered
    var i;
    for (i = 0; i < vis.headers.length; i++) {
        vis[vis.headers[i]+"test"] = {};
        vis[vis.headers[i]] = [];

        vis[vis.headers[i] + "AvgArray"] = [];
        vis[vis.headers[i] + "AvgArray"].push(vis[vis.headers[i] + "avg0"]);
        vis[vis.headers[i] + "AvgArray"].push(vis[vis.headers[i] + "avg1"]);


        vis[vis.headers[i] + "PerArray"] = [];
        vis[vis.headers[i] + "PerArray"].push(vis[vis.headers[i] + "per0"]);
        vis[vis.headers[i] + "PerArray"].push(vis[vis.headers[i] + "per1"]);

        vis[vis.headers[i]].avg = vis[vis.headers[i] + "AvgArray"];
        vis[vis.headers[i]].per = vis[vis.headers[i] + "PerArray"];
     //   vis[vis.headers[i]].color = vis.color;


        vis[vis.headers[i]].push(
            {avg: vis[vis.headers[i] + "avg0"], per: vis[vis.headers[i] + "per0"] , color: vis.color[0]}
        );
        vis[vis.headers[i]].push(
            {avg: vis[vis.headers[i] + "avg1"], per: vis[vis.headers[i] + "per1"] , color: vis.color[1]}
        );

        // vis[vis.headers[i]+"test"][0].avg = vis[vis.headers[i] + "avg0"];
        // vis[vis.headers[i]+"test"][1].avg = vis[vis.headers[i] + "avg1"];


    };







    //draw circles and call tooltip
    vis.updateVis();
}




LifeStyle.prototype.updateVis = function(){
    var vis = this;




    //create tooltip
    //https://stackoverflow.com/questions/10805184/show-data-on-mouseover-of-circle
    //http://bl.ocks.org/Caged/6476579

    vis.tip = d3.tip()
        .attr("class","d3-tip")
        .offset([-20,0])
        .html(function(d){
            d3.select(".d3-tip").style("background-color", d.color);
            return ("Percentile: " + Math.round(d.per * 100) + "<br> Average min/day: "  + Math.round(d.avg*10)/10);
        });


    for (i = 0; i < vis.headers.length; i++) {

        //draw circles
        var circle = vis["svgx" + i]
            .selectAll("circle")
            // .data(vis[vis.headers[i] + "AvgArray"]);
            // .data(vis[vis.headers[i] + "PerArray"]);
            .data(vis[vis.headers[i]]);
        circle.enter()
            .append("circle")
            .merge(circle)
            .on("mouseover",vis.tip.show)
            .on("mouseout",vis.tip.hide)
            .transition().duration(800)
            .attr("fill", function(d) {return d.color;})
            .attr("cx", function(d) { return vis["x" + i](d.per); })
            .attr("r", vis.circleradius);
        circle.exit().remove();




    };


    //call tooltips
    vis.svg.call(vis.tip);


}




