DiffVis = function(_parentElement, _time1a, _time1b, _time2a, _time2b, _group1, _group2, _activity1,
                   _activity2) {
    this.parentElement = _parentElement;
    this.time1a = _time1a;
    this.time1b = _time1b;
    this.time2a = _time2a;
    this.time2b = _time2b;
    this.group1 = _group1.toLowerCase();
    this.group2 = _group2.toLowerCase();
    this.activity1 = _activity1.toLowerCase();
    this.activity2 = _activity2;

    this.initVis();
};


DiffVis.prototype.initVis = function() {
    var vis = this;

    if (vis.activity2) {
        vis.activity2 = vis.activity2.toLowerCase();
    }


    if (vis.time1a>200) {
        vis.rownum = 14;
        vis.hours = 24;
        vis.legendtime = "24 hours";
        vis.label = "1 row = 14 days = 1/2 month"
    }
    else if (vis.activity2) {
        vis.rownum = 48;
        vis.hours = 1;
        vis.legendtime = "1 hour";
        vis.label = "1 row = 48 hours = 2 days"
    }
    else if (vis.time1a<100) {
        vis.rownum = 24;
        vis.hours = 1;
        vis.legendtime = "1 hour";
        vis.label = "1 row = 24 hours = 1 day"
    }

    vis.timetotal = 1;

    vis.margin = {top: 40, right: 120, bottom: 60, left: 120};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 600 - vis.margin.top - vis.margin.bottom;

    vis.totalwidth = vis.width + vis.margin.left + vis.margin.right;
    vis.sideMargin = 40;
    vis.boxMargin = 2;
    vis.boxWidth = ((vis.width/2) - (vis.sideMargin) - (vis.rownum*vis.boxMargin))/vis.rownum;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
        // .append("g")
        // .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // vis.calendar = vis.svg.append("g");
    // vis.calendar.append("path")
    //     .attr("fill", "transparent")
    //     .attr("stroke", "black")
    //     .attr("d", "M 0 0 H " + (vis.width - 200));

    vis.legend = vis.svg.append("g");
    // .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    if (vis.activity2) {
        vis.legend.append("rect")
            .attr("fill", d3.schemeCategory20[0])
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", vis.margin.left)
            .attr("y",43);

        vis.legend.append("text")
            .attr("class", "legend-text")
            .attr("x", vis.margin.left + 20)
            .attr("y", 55)
            .attr("font-size", 12)
            .text("1 square = " +vis.legendtime + " spent on " + vis.activity1);

        vis.legend.append("rect")
            .attr("fill", d3.schemeCategory20[2])
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", vis.margin.left)
            .attr("y",63);

        vis.legend.append("text")
            .attr("x", vis.margin.left + 20)
            .attr("y", 75)
            .attr("font-size", 12)
            .text("1 square = " +vis.legendtime + " spent on " + vis.activity2);
    }
    else {
        vis.legend.append("rect")
            .attr("fill", d3.schemeCategory20[0])
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", vis.margin.left)
            .attr("y",53);

        vis.legend.append("text")
            .attr("class", "legend-text")
            .attr("x", vis.margin.left + 20)
            .attr("y", 65)
            .attr("font-size", 12)
            .text("1 square = " +vis.legendtime + " spent on " + vis.activity1);
    }


    vis.legendstart = vis.legend.selectAll(".legend-text").node().getBBox().width
        + vis.margin.left + vis.boxWidth + 70;

    vis.calendarlabel = vis.legend.append("text")
        .attr("x", vis.legendstart-40)
        .attr("y", 38)
        // .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .text("Click the arrow to start the animation!");

    vis.calendarline = vis.legend.append("path")
        .attr("d", "M" + vis.legendstart + " 60 " + "L " + (vis.totalwidth-vis.margin.right-vis.sideMargin) + " 60 ")
        .attr("stroke", "black");

    var months = [ "Jan", "Feb", "March", "Apr", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
    vis.increment = (vis.totalwidth-vis.margin.right - vis.legendstart-vis.sideMargin)/11;

    for (var i = 0; i < 12; i++) {
        vis.legend.append("path")
            .attr("d", "M" + (vis.legendstart + i*vis.increment) + " 65 " + "L " + (vis.legendstart + i*vis.increment) + " 55 ")
            .attr("stroke", "black");

        vis.legend.append("text")
            .attr("x", vis.legendstart + i*vis.increment)
            .attr("y", 80)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .text(months[i]);
    }


    vis.calendararrow = vis.legend.append("path")
        .attr("d", "M" + (vis.legendstart-2) + " 70 " + " L " + (vis.legendstart + 14) + " 60 " + " L " + (vis.legendstart-2) + " 50")
        .attr("fill", d3.schemeCategory20[0]);

    vis.left = vis.svg.append("g")
        .attr("class", "left-vis")
        .attr("transform",  "translate(" + vis.margin.left + ",120)");

    vis.right = vis.svg.append("g")
        .attr("class", "right-vis")
        .attr("transform", "translate(" + vis.totalwidth/2 +  ", 120)");

    vis.left
        .append("text")
        .attr("class", "dv-label")
        .attr("y", 0)
        .attr("x", (vis.width/2 - vis.sideMargin)/2)
        .text(toUpper(vis.group1));

    vis.left
        .append("line")
        .attr("x1", 0)
        .attr("y1", 24)
        .attr("x2", vis.boxMargin*(vis.rownum-1) + vis.boxWidth*vis.rownum)
        .attr("y2", 24)
        .attr("stroke", "rgba(188, 188, 188)")
        .attr("stroke-width", 1);

    vis.left
        .append("line")
        .attr("x1", 0)
        .attr("y1", 20)
        .attr("x2", 0)
        .attr("y2", 28)
        .attr("stroke", "rgba(188, 188, 188)")
        .attr("stroke-width", 1);

    vis.left
        .append("line")
        .attr("x1", vis.boxMargin*(vis.rownum-1) + vis.boxWidth*vis.rownum)
        .attr("y1", 20)
        .attr("x2", vis.boxMargin*(vis.rownum-1) + vis.boxWidth*vis.rownum)
        .attr("y2", 28)
        .attr("stroke", "rgba(188, 188, 188)")
        .attr("stroke-width", 1);

    vis.left
        .append("text")
        .attr("x", (vis.boxMargin*(vis.rownum-1) + vis.boxWidth*vis.rownum)/2)
        .attr("y", 22)
        .attr("class", "dv-axis-label")
        .text(vis.label);

     vis.right
        .append("text")
        .attr("class", "dv-label")
        .attr("y", 0)
        .attr("x",  (vis.width/2 - vis.sideMargin)/2 + vis.sideMargin)
        .text(toUpper(vis.group2));

    vis.right
        .append("line")
        .attr("x1", vis.sideMargin)
        .attr("y1", 24)
        .attr("x2", vis.boxMargin*(vis.rownum-1) + vis.boxWidth*vis.rownum + vis.sideMargin)
        .attr("y2", 24)
        .attr("stroke", "rgba(188, 188, 188)")
        .attr("stroke-width", 1);

    vis.right
        .append("line")
        .attr("x1", vis.sideMargin)
        .attr("y1", 20)
        .attr("x2", vis.sideMargin)
        .attr("y2", 28)
        .attr("stroke", "rgba(188, 188, 188)")
        .attr("stroke-width", 1);

    vis.right
        .append("line")
        .attr("x1", vis.boxMargin*(vis.rownum-1) + vis.boxWidth*vis.rownum + vis.sideMargin)
        .attr("y1", 20)
        .attr("x2", vis.boxMargin*(vis.rownum-1) + vis.boxWidth*vis.rownum + vis.sideMargin)
        .attr("y2", 28)
        .attr("stroke", "rgba(188, 188, 188)")
        .attr("stroke-width", 1);

    vis.right
        .append("text")
        .attr("x", (vis.boxMargin*(vis.rownum-1) + vis.boxWidth*vis.rownum)/2 + vis.sideMargin)
        .attr("y", 22)
        .attr("class", "dv-axis-label")
        .text(vis.label);

    vis.init = true;
    vis.wrangleData();

    vis.calendararrow
        .on("click", function (d) {
            vis.startAnimation(true);
        } );

};

DiffVis.prototype.wrangleData = function() {
    var vis = this;
    // total = one year = time * 365
    // speed = units/time (10s)
    // 12 seconds = 1 second per month


    vis.total1a = (vis.time1a*365)/(60*vis.hours);
    vis.lapse1a = 10/vis.total1a;

    vis.total1b = (vis.time1b*365)/(60*vis.hours);
    vis.lapse1b = 10/vis.total1b;

    vis.total2a = (vis.time2a*365)/(60*vis.hours);
    vis.lapse3a = 10/vis.total2a;

    vis.total2b = (vis.time2b*365)/(60*vis.hours);
    vis.lapse2b = 10/vis.total2b;

    vis.drawVis();
};

DiffVis.prototype.drawVis = function() {
    var vis = this;

    vis.leftrect=vis.left.append("g")
        .attr("transform", "translate(0, 20)");

    vis.rightrect=vis.right.append("g")
        .attr("transform", "translate(0, 20)");

    var array1a = Array(Math.round(vis.total1a)).fill(0);
    var array1b = Array(Math.round(vis.total1b)).fill(0);

    var time1 = vis.timetotal/array1a.length;
    var time2 = vis.timetotal/array1b.length;

    vis.finala = array1a.length;
    vis.savea = vis.finala;
    vis.finalb = array1b.length;
    vis.saveb = vis.finalb;

    array1a.forEach(function(d, j) {
        setTimeout(function() {
            vis.leftrect.append("rect")
                .attr("class", "square1a")
                .attr("fill", d3.schemeCategory20[0])
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * (j % vis.rownum))
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor(j/vis.rownum)+10);
        },time1 * j);
    });


    array1b.forEach(function(d, j) {
            setTimeout(function() {
                vis.rightrect.append("rect")
                    .attr("class", "square1a")
                    .attr("fill", d3.schemeCategory20[0])
                    .attr("width", vis.boxWidth)
                    .attr("height", vis.boxWidth)
                    .attr("x", vis.sideMargin + (vis.boxWidth+vis.boxMargin) * (j % vis.rownum))
                    .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor(j/vis.rownum)+10);
            },time2 * j);
        });

    setTimeout(function () {
        vis.drawBlanks();
        vis.showTooltip(false);

        if (vis.init && vis.activity2) {
            vis.showSecond();
        }
        else if (vis.activity2) {
            vis.calendararrow
                .attr("fill", d3.schemeCategory20[2]);

            vis.calendarlabel = vis.legend.append("text")
                .text("Click the arrow to start the animation!");

            vis.calendarlabel
                .text("Click the arrow to add " + vis.activity2)

            vis.calendararrow
                .on("click", function (d) {
                    console.log("clicked");
                    vis.startAnimation(false);
                });
        }
        vis.calendararrow
            .transition()
            .ease(d3.easeElastic)
            .attr("transform", "translate(0, 0)")
            .duration(400);

    }, vis.timetotal+600);

};

DiffVis.prototype.showButton = function() {

    var vis = this;

    vis.button = vis.legend.append("rect")
        .attr("fill", d3.schemeCategory20[2])
        .attr("width", 18)
        .attr("height", 18)
        .attr("x", 450)
        .attr("y", 0);

    vis.buttonlabel = vis.legend.append("text")
        .text("Click to Add " + vis.activity2);

    if (vis.init) {
        vis.showSecond();
    }
    else {
        vis.button
            .on("click", function(d) {
                vis.showSecond();
            });
    }
};

DiffVis.prototype.showSecond = function() {
    var vis = this;

    // vis.blanks.remove();
    vis.blanks = vis.rightrect.selectAll(".blanks");
    vis.blanks.remove();
    // vis.wrapper2.remove();

    var array2a = Array(Math.round(vis.total2a)).fill(0);
    var array2b = Array(Math.round(vis.total2b)).fill(0);


    var time1 = vis.timetotal/array2a.length;
    var time2 = vis.timetotal/array2b.length;

    // when I don't do this, the value of finala seems to double. not sure why?
    var finala = vis.finala;
    var finalb = vis.finalb;

    array2a.forEach(function(d, j) {
        setTimeout(function() {
            vis.leftrect.append("rect")
                // .attr("class", "square1a")
                .attr("fill", d3.schemeCategory20[2])
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * ((finala+j) % vis.rownum))
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor((finala+j)/vis.rownum)+10);
        },time1 * j);
    });


    array2b.forEach(function(d, j) {
        setTimeout(function() {
            vis.rightrect
                .append("rect")
                // .attr("class", "square1a")
                .attr("fill", d3.schemeCategory20[2])
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * ((finalb+j) % vis.rownum)+vis.sideMargin)
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor((finalb+j)/vis.rownum)+10);
        },time2 * j);
    });


    vis.finala += array2a.length;
    vis.finalb += array2b.length;


    setTimeout(function () {
        vis.drawBlanks();
        vis.showTooltip(true);

        vis.calendararrow
            .attr("fill", d3.schemeCategory20[0]);

        vis.calendararrow
            .on("click", function (d) {
                vis.startAnimation(true);
            } );

        vis.calendararrow
            .transition()
            .ease(d3.easeElastic)
            .attr("transform", "translate(0, 0)")
            .duration(200);

    }, vis.timetotal+600);
};

DiffVis.prototype.drawBlanks = function() {
    var vis = this;

    var check = vis.finala - vis.finalb;
    var diff = Array(Math.round(check)).fill(0);

    vis.blanks = vis.rightrect.selectAll(".blank")
        .data(diff);

    vis.blanks.enter()
        .append("rect")
        .attr("class", function (d, i){
            if (check == Math.round(vis.total1a - vis.total1b)) {
                return "blanks";
            }
            else if (i <= vis.total1a - vis.total1b) {
                return "blanks";
            }
            else {
                return "blanks";
            }
        })
        .attr("fill", function (d, i) {
            if (check == Math.round(vis.total1a - vis.total1b)) {
                return d3.schemeCategory20[1];
            }
            else if (i <= vis.total1a - vis.total1b) {
                return d3.schemeCategory20[1];
            }
            else {
                return d3.schemeCategory20[3];
            }

        })
        .attr("width", vis.boxWidth)
        .attr("height", vis.boxWidth)
        .attr("x", function(d, i) {
            return (vis.boxWidth+vis.boxMargin) * ((vis.finalb+i) % vis.rownum) + vis.sideMargin;
        })
        .attr("y",function(d, i) {
            return (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+i)/vis.rownum)+10;
        });
};

DiffVis.prototype.showTooltip = function (bool) {
    var vis = this;
    let x1, y1, x2, y3, x4, y5, x6, y7, x8, y9;
    var center_x, center_y;

    vis.placeholder = vis.svg.append("text")
        .attr("class", "placeholder")
        .attr("fill", "black")
        .attr("x", 0)
        .attr("y", 0)
        .text(vis.group1.charAt(0).toUpperCase() + " spend approximately " + Math.round(vis.savea*vis.hours) + " hours a year on " + vis.activity1);

    vis.placeholder = vis.svg.selectAll(".placeholder");

    var bbox = {
        width: vis.width/2 - vis.sideMargin-30,
        height: 30
    };


    vis.svg.selectAll(".placeholder").remove();

    if (!bool) {

        x1 = 0;
        y1 = 10;
        x2 = (vis.boxWidth+vis.boxMargin) * (vis.rownum-1) + vis.boxWidth;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/vis.rownum)+10 - vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.savea) % vis.rownum) - vis.boxMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/vis.rownum)+10+ vis.boxWidth;
        x6 = 0;
        y7 = 10;

        center_x =(x2-x6)/2 +x6;
        center_y = (y3-y1)/2 + y1;

        vis.wrapper = vis.leftrect.append("g")
            .attr("class", 'wrapper1');

        vis.wrapper.append("path")
            .attr("class", "outline1")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7)
            .attr("fill","transparent");

        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2)
            .attr("y", center_y - bbox.height/2)
            .attr("width", bbox.width)
            .attr("height", bbox.height);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+3)
            .text(vis.group1.charAt(0).toUpperCase() + vis.group1.slice(1) + " spend approximately " + Math.round(vis.savea*vis.hours) + " hours a year on " + vis.activity1);


        x1 = vis.sideMargin;
        y1 = 10;
        x2 = (vis.boxWidth+vis.boxMargin) * (vis.rownum-1) + vis.boxWidth+vis.sideMargin;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/vis.rownum)+10 - vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.saveb) % vis.rownum) - vis.boxMargin+vis.sideMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/vis.rownum)+10+ vis.boxWidth;
        x6 = vis.sideMargin;
        y7 = 10;


        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper = vis.rightrect.append("g")
            .attr("class", 'wrapper1');

        vis.wrapper.append("path")
            .attr("class", "outline1")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7)
            .attr("fill","transparent");


        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2)
            .attr("y", center_y - bbox.height/2)
            .attr("width", bbox.width)
            .attr("height", bbox.height);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+3)
            .text(vis.group2.charAt(0).toUpperCase() + vis.group2.slice(1) + " spend approximately " + Math.round(vis.saveb*vis.hours) + " hours a year on " + vis.activity1);


        x1 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb) % vis.rownum)+vis.sideMargin;
        y1 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/vis.rownum)+10;
        x2 = (vis.boxWidth+vis.boxMargin) * (vis.rownum-1) + vis.boxWidth+vis.sideMargin;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finala)/vis.rownum)+10 -  vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finala) % vis.rownum) - vis.boxMargin+vis.sideMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finala)/vis.rownum)+10+ vis.boxWidth;
        x6 = vis.sideMargin;
        y7 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/vis.rownum)+10+ vis.boxWidth + vis.boxMargin;
        x8 = x1;
        y9 = y1;

        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper2 = vis.rightrect.append("g")
            .attr("class", 'wrapper2');

        vis.wrapper2.append("path")
            .attr("class", "outline2")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4 + " V " + y5 + " H " + x6 + " V " + y7 + " H " + x8 + " V " + y9)
            .attr("fill","transparent");

        vis.wrapper2.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2)
            .attr("y", center_y - bbox.height/2)
            .attr("width", bbox.width)
            .attr("height", bbox.height);

        vis.wrapper2.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y-2)
            .text(vis.group1.charAt(0).toUpperCase() + vis.group1.slice(1) + " spend approximately " + Math.round((vis.total1a - vis.total1b)*vis.hours)
                + " more hours a year")
        vis.wrapper2.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+10)
            .text("on " + vis.activity1 + " than " + vis.group2);

    }

    else {
        vis.rightrect.selectAll(".outline2").remove();

        x1 = (vis.boxWidth+vis.boxMargin) * ((vis.savea) % vis.rownum);
        y1 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/vis.rownum)+10;
        x2 = (vis.boxWidth+vis.boxMargin) * (vis.rownum-1) + vis.boxWidth;
        y3 =(vis.boxWidth+vis.boxMargin) * Math.floor((vis.finala)/vis.rownum)+10 - vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finala) % vis.rownum) - vis.boxMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finala)/vis.rownum)+10+ vis.boxWidth;
        x6 = 0;
        y7 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/vis.rownum)+10 + vis.boxMargin+vis.boxWidth;
        x8 = (vis.boxWidth+vis.boxMargin) * ((vis.savea) % vis.rownum);
        y9 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/vis.rownum)+10;

        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper = vis.leftrect.append("g")
            .attr("class", 'wrapper3');

        vis.wrapper.append("path")
            .attr("class", "outline3")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7 + " H " + x8 + " V " + y9)
            .attr("fill","transparent");

        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2)
            .attr("y", center_y - bbox.height/2)
            .attr("width", bbox.width)
            .attr("height", bbox.height);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+3)
            .text(vis.group1.charAt(0).toUpperCase() + vis.group1.slice(1) +
                " spend approximately " + Math.round(vis.total2a*vis.hours) + " hours a year on " + vis.activity2);



        x1 = (vis.boxWidth+vis.boxMargin) * ((vis.saveb) % vis.rownum)+vis.sideMargin;
        y1 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/vis.rownum)+10;
        x2 = (vis.boxWidth+vis.boxMargin) * (vis.rownum-1) + vis.boxWidth + vis.sideMargin;
        y3 =(vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/vis.rownum)+10 - vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb) % vis.rownum) - vis.boxMargin + vis.sideMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/vis.rownum)+10+ vis.boxWidth;
        x6 = vis.sideMargin;
        y7 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/vis.rownum)+10 + vis.boxMargin+vis.boxWidth;
        x8 = (vis.boxWidth+vis.boxMargin) * ((vis.saveb) % vis.rownum) + vis.sideMargin;
        y9 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/vis.rownum)+10;

        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper = vis.rightrect.append("g")
            .attr("class", 'wrapper3');

        vis.wrapper.append("path")
            .attr("class", "outline3")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7 + " H " + x8 + " V " + y9)
            .attr("fill","transparent");


        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2)
            .attr("y", center_y - bbox.height/2)
            .attr("width", bbox.width)
            .attr("height", bbox.height);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+3)
            .text(vis.group2.charAt(0).toUpperCase() + vis.group2.slice(1) + " spend approximately " + Math.round(vis.total2b*vis.hours) + " hours a year on " + vis.activity2);

        x1 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb) % vis.rownum)+vis.sideMargin;
        y1 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/vis.rownum)+10;
        x2 = (vis.boxWidth+vis.boxMargin) * (vis.rownum-1) + vis.boxWidth+vis.sideMargin;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+vis.total1a - vis.total1b)/vis.rownum)+10 -  vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb+vis.total1a - vis.total1b) % vis.rownum) +vis.sideMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+vis.total1a - vis.total1b)/vis.rownum)+10+ vis.boxWidth;
        x6 = vis.sideMargin;
        y7 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/vis.rownum)+10 + vis.boxWidth+vis.boxMargin;
        x8 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb) % vis.rownum)+vis.sideMargin;
        y9 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/vis.rownum)+10;

        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper = vis.rightrect.append("g")
            .attr("class", 'wrapper4');

        vis.wrapper.append("path")
            .attr("class", "outline4")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7 + " H " + x8 + " V " + y9)
            .attr("fill","transparent");

        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2)
            .attr("y", center_y - bbox.height/2)
            .attr("width", bbox.width)
            .attr("height", bbox.height);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text wrap")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+3)
            .text(vis.group1.charAt(0).toUpperCase() + vis.group1.slice(1) + " spend approximately " + Math.round(vis.total1a - vis.total1b) + " more hours a year on "
                + vis.activity1 + " than " + vis.group2);


        x1 = x4 + vis.boxMargin;
        y1 = y3 + vis.boxMargin;
        y7 = y5 + vis.boxMargin;
        x2 = (vis.boxWidth+vis.boxMargin) * (vis.rownum-1) + vis.boxWidth+vis.sideMargin;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+vis.total1a +vis.total2a- vis.total1b-vis.total2b)/vis.rownum)+10 -  vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb+vis.total1a +vis.total2a- vis.total1b-vis.total2b) % vis.rownum) +vis.sideMargin+10 - vis.boxMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+vis.total1a +vis.total2a- vis.total1b-vis.total2b)/vis.rownum)+10+ vis.boxWidth;
        x6 = vis.sideMargin;
        x8 = x1;
        y9 = y1;

        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper = vis.rightrect.append("g")
            .attr("class", 'wrapper5');

        vis.wrapper.append("path")
            .attr("class", "outline5")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7 + " H " + x8 + " V " + y9)
            .attr("fill","transparent");

        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2)
            .attr("y", center_y - bbox.height/2)
            .attr("width", bbox.width)
            .attr("height", bbox.height);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text wrap")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+3)
            .text(vis.group1.charAt(0).toUpperCase() + vis.group1.slice(1) + " spend approximately " + Math.round((vis.total2a - vis.total2b)*vis.hours) + " more hours a year on "
                + vis.activity2 + " than " + vis.group2);
    }

    // d3plus.textwrap()
    //     .container(d3.select(".dv-tooltip-box"))
    //     .draw();

};

DiffVis.prototype.startAnimation = function(bool) {
    var vis = this;

    vis.arrowend = vis.totalwidth-vis.margin.right-vis.sideMargin-vis.legendstart;
    vis.timetotal = 7000;
    vis.init = false;

    if (bool) {
        vis.leftrect.remove();
        vis.rightrect.remove();
        vis.drawVis();
    }
    else {
        vis.showSecond()
    }

    vis.calendararrow
        .transition()
        .ease(d3.easeLinear)
        .attr("transform", "translate(" +vis.arrowend + ", 0)")
        .duration(vis.timetotal);

}
//
// DiffVis.prototype.calMove = function () {
//     var vis = this;
//
//     var start = Date.now(); // remember start time
//
//     var timer = setInterval(function() {
//         // how much time passed from the start?
//         let timePassed = Date.now() - start;
//
//         if (timePassed >= vis.timetotal) {
//             clearInterval(timer); // finish the animation after 2 seconds
//             return;
//         }
//
//         // draw the animation at the moment timePassed
//         draw(timePassed);
//
//     }, 20);
//
// // as timePassed goes from 0 to 2000
// // left gets values from 0px to 400px
//     function draw(timePassed) {
//         train.style.left = timePassed / 5 + 'px';
//     }
// }


function toUpper(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function(word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
}


