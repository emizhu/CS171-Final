//#todo fix height
//#todo why isn't -1 filter/NA working for fulltime?
//#todo tooltip colors??


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
    vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
    //vis.columnwidth = $("#" + vis.parentElement).width();
    //vis.width = 750- vis.margin.left -vis.margin.right,
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left -vis.margin.right;
    vis.height = 580 - vis.margin.top -vis.margin.bottom;
    vis.padding = 10;

    //color range for comparisons
    vis.color = [d3.schemeCategory20[0],d3.schemeCategory20[2]];

    vis.lineLength = 220;
    vis.circleradius = 7;
    vis.labelBuffer = 40;
    vis.innerAxis = 30;
    //----------------------------------------------------------

    //create array with labels - can edit text in atussum_0317_two_digits_cat.csv
    //DO NOT CHANGE ORDER OF ROWS/COLUMNS IN THE CSV - only text in column 2
    var i = 0;
    vis.labels = [];
    vis.facts = [];

    for (i = 0; i < dataCat["columns"].length; i++) {
        vis.labels.push(dataCat[0][dataCat["columns"][i]]);
    };
    vis.labels.splice(1, 0, "Sleep"); // at index position 1, remove 0 elements, then add "Sleep"

    vis.labels2 =["Personal Care", "Sleep", "Household", "Help Household Members", "Help Non-Household Members",
        "Work", "Education", "Consumer Purchases", "Prof/Personal Services", "Household Services", "Govt & Civic",
        "Eat & Drink", "Leisure", "Sports", "Religious", "Volunteer", "Phone Calls", "Traveling",
        "Miscellaneous"];

    vis.labels =["Volunteer", "Phone Calls", "Traveling", "Personal Care", "Sleep", "Household",
        "Work", "Education", "Consumer Purchases",  "Household Services", "Govt & Civic",
        "Eat & Drink", "Leisure", "Sports", "Religious"];

    vis.facts = ["Volunteer Activities include doing Social Service & Care Activities, volunteering Indoor & Outdoor Maintenance, Building, & Clean-up Activities, Participating in Performance & Cultural Activities and so on.",
        "Telephone Calls include activities such as Talking on the phone to/from family, friends, and acquaintances and Waiting Associated with Telephone Calls.",
        "Traveling includes all kind activities?happening while traveling from Personal care to Volunteering.",
        "Personal Care includes activities such as Grooming, taking medicine, having sex, and  being involved in a personal accident.",
        "Sleeping",
        "Household Activities include Cleaning, Doing laundry, Preparing food, Repairing, Caring for household pets, Decorating and Maintaining a house.",
        // "Caring For & Helping Household (HH) Members includes activities such as playing with household children, helping to do homework, caring for household members and so on.",
        // "Caring For & Helping Non-Household (NonHH) Members includes activities such as playing with NonHH children, Attending NonHH children's events, Dropping off/picking up NonHH children, caring for household members and so on.",
        "Work & Work-Related Activities include Working, Waiting associated with working, Attending social event w/coworkers, Doing Income-generating performances/Services, Searching jobs and so on.",
        "Education includes activities such as Taking a class, Doing a research, Spending a time in extracurricular school activities, Looking at course descriptions, Waiting to enroll in a class.",
        "Consumer Purchases include Shopping (Store, Telephone, Internet), Researching Purchases, and Being searched at a security checkpoint.",
        // "Professional & Personal Care Services include Childcare Services, Financial Services, Legal Services, Medical and Care Services, Personal Care Services such as getting a haircut, having nails done and having a message.",
        "Household Services include activities such as Using interior cleaning services, Using meal preparation services, Using home maint/repair/decoration/construction services, Getting Pet Services, and Having Vehicle Maint. & Repair Services.",
        "Government Services & Civic Obligations include activities such as Using Government Services, Participating Civic Obligations, Waiting associated with using government services and so on.",
        "Eating and Drinking includes activities such as Eating and drinking and Waiting associated w/eating & drinking.",
        "Socializing, Relaxing, and Leisure include activities such as Socializing and communicating with others, Attending or Hosting Social Events, Relaxing and Leisure, Attending performing arts, museums, and movies/film, and Waiting Associated with Socializing, Relaxing, and Leisure.",
        "Sports, Exercise, and Recreation include activities such as Participating in Sports, Exercise, or Recreation, Attending Sporting/Recreational Events and Waiting Associated with Sports, Exercise, & Recreation.",
        "Religious and Spiritual Activities include Attending religious services, Participation in religious practices and Waiting associated w/religious & spiritual activities."];

    //headers for filtering data
    //these values must EXACTLY match the headers in vis.displayData and should be in the same order as vis.labels
    // vis.headers = ["personal_care",     "sleep",   "household",   "helping_HH_members",  "helping_nonHH_members",   "work",    "education",
    //     "consumer_purchases",   "professional_personal_services",  "HH_services", "govt_civic",  "eat_drink",   "leisure", "sports",
    //     "religious",    "volunteer",   "phone",   "traveling",   "misc"];

    vis.headers = ["personal_care",    "sleep",   "household",   "work",    "education",
        "consumer_purchases",  "HH_services", "govt_civic",  "eat_drink",   "leisure", "sports",
        "religious",   "volunteer",   "phone",   "traveling"];





    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.lineNumber = vis.headers.length;
    vis.angle = 360/vis.lineNumber;
    vis.angleRadian = vis.angle * Math.PI / 180;
    // vis.outerArcLength = vis.lineLength * vis.angleRadian;


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
        // vis.svg
        //     .append("text")
        //     .append("textPath")
        //     .attr("class", "activityText")
        //     //.style("text-anchor","middle") //place the text halfway on the arc
        //     .attr("startOffset", "50%")
        //     .attr("xlink:href","#arc" + i)
        //     .text(vis.labels[i])
        //     .attr("font-size", "12px")
        //     .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height/2) + ")" );
        // + "rotate(" + vis.angle*i + ")"


        // get position of arc
        // https://stackoverflow.com/questions/49382836/how-to-add-text-at-the-end-of-arc
        var pointLabel = vis["svgarc" + i].node().getPointAtLength(vis["svgarc" + i].node().getTotalLength() / 2);

        // append text labels
        var text = vis.svg.append("text")
            .attr("x", pointLabel.x -5)
            .attr("y", pointLabel.y)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", "12px")
            .text(vis.labels[i])
            .attr("class","lifestyle-x-labels")
            .attr("class","x-axis")
            .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height/2) + ")" );



        //create hover content for text labels
        $("text.x-axis").hover(function() {
            var label = $(this).text();
            var n = vis.labels.indexOf(label);
            $("#hoverdetails").html(vis.facts[n]);

        }, function() {
            $("#hoverdetails").html("");
        });
        // ----------------------------------------------------------



        //Create axes
        //----------------------------------------------------------
        // create scales
        vis["x" + i] = d3.scaleLinear()
        // .domain(d3.extent(vis.displayData, function(d){return d[vis.headers[i]];}))
            .domain([.2,1.1])
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
        $("#checkboxes1").css("color","white").css('background-color',vis.color[0]).css('opacity', '0.6');
        $("#checkboxes2").css("color","white").css('background-color',vis.color[1]).css('opacity', '0.7');
        $("#headerrow").css("color","#404040");


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
    vis.numericheaders = ["personal_care",     "sleep",   "household",   "helping_HH_members",  "helping_nonHH_members",   "work",    "education",
        "consumer_purchases",  "professional_personal_services",  "HH_services", "govt_civic",  "eat_drink",   "leisure", "sports",
        "religious",   "volunteer",   "phone",   "traveling",   "misc"];
    var i;
    for (i = 0; i < vis.numericheaders.length; i++) {
        vis.displayData.forEach(function(d){
            d[vis.numericheaders[i]] = +d[vis.numericheaders[i]];
        });
    };

    vis.displayData.forEach(function(d){
        d.number_children = +d.number_children;
    });

    var j;
    for (j = 0; j < vis.headers.length; j++) {
        vis[vis.headers[j] + "array"] = [];
        for (i = 0; i < vis.displayData.length; i++) {
            vis[vis.headers[j] + "array"].push(vis.displayData[i][vis.headers[j]]);
        };
    }






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

                //if array is undefined
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
                //create arrays of values
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

                //if array is undefined
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

        //if nothing matches all conditions, return nothing
        if (vis["filtered" + k].length == 0) {
            var i;
            for (i = 0; i < vis.headers.length; i++) {
                var dummy = {};
                dummy[vis.headers] = 0;
                vis["filtered" + k].push(dummy);
            }
        }

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
            vis[vis.headers[j] + "avg" + number] = vis[vis.headers[j] + "total" + number]/ vis[vis.headers[j] + "array" + number].length;
            // vis[vis.headers[j] + "per" + number] = jStat.percentileOfScore(vis[vis.headers[j] + "array" + number], vis[vis.headers[j] + "avg" + number]);
            vis[vis.headers[j] + "per" + number] = jStat.percentileOfScore(vis[vis.headers[j] + "array"], vis[vis.headers[j] + "avg" + number]);

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


        vis[vis.headers[i]].push(
            {avg: vis[vis.headers[i] + "avg0"], per: vis[vis.headers[i] + "per0"] , color: vis.color[0], name: vis.headers[i]}
        );
        vis[vis.headers[i]].push(
            {avg: vis[vis.headers[i] + "avg1"], per: vis[vis.headers[i] + "per1"] , color: vis.color[1], name: vis.headers[i]}
        );
    };







    //draw circles and call tooltip
    vis.updateVis();
}




LifeStyle.prototype.updateVis = function(){
    var vis = this;
    var str1 = vis.filtered1.length + " respondents";
    var colorstr1 = str1.fontcolor(vis.color[0]);

    var str2 = vis.filtered2.length + " respondents";
    var colorstr2 = str2.fontcolor(vis.color[1]);


    var str = "Averages based on: <br>" + colorstr1 + "<br>" + colorstr2;
    $("#filtered-counts").html(str);




    //create tooltip
    //https://stackoverflow.com/questions/10805184/show-data-on-mouseover-of-circle
    //http://bl.ocks.org/Caged/6476579

    var tip = d3.tip()
        .attr("class","d3-tip")
        .offset([-20,0])
        .html(function(d){
            // d3.select(".d3-tip").style("background-color", d.color);
            // +"<br>"+d.name
            var str = "Average min/day: "  + Math.round(d.avg*10)/10 + "<br>" + "Percentile: " + Math.round(d.per * 100);
            var colorstr = str.fontcolor(d.color);

            return (colorstr);
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
            .on("mouseover",tip.show)
            .on("mouseout",tip.hide)
            .transition().duration(800)
            .attr("fill", function(d) {return d.color;})
            .attr("cx", function(d) { return vis["x" + i](d.per); })
            .attr("r", vis.circleradius);
        circle.exit().remove();


    };


    //call tooltips
    vis.svg.call(tip);


}

