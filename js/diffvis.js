DiffVis = function(_parentElement, _time1a, _time1b, _time2a, _time2b, _group1, _group2, _activity1, _activity2) {
    this.parentElement = _parentElement;
    this.time1a = _time1a;
    this.time1b = _time1b;
    this.time2a = _time2a;
    this.time2b = _time2b;
    this.group1 = _group1;
    this.group2 = _group2;
    this.activity1 = _activity1;
    this.activity2 = _activity2;

    this.initVis();
}


DiffVis.prototype.initVis = function() {
    var vis = this;

    vis.timetotal = 1;

    vis.margin = {top: 40, right: 60, bottom: 60, left: 60};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.totalwidth = vis.width + vis.margin.left + vis.margin.right;
    vis.sideMargin = 30;
    vis.boxMargin = 5;
    vis.boxWidth = ((vis.width/2) - (vis.sideMargin) - (48*vis.boxMargin))/48;

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

    vis.legend = vis.svg.append("g")
    // .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    var dist =vis.boxWidth*48*2 + vis.boxMargin*48*2 + vis.sideMargin;
    var bez1 = -1 *dist/10;
    var bez2 = -1*dist/25;
    var enddist = dist+bez1;

    // vis.calendar = vis.legend.append("path")
    //     .attr
    //     // .attr("d", "M0,"  + (-1*bez2) +"C" + (-1*bez1) + "," + bez2 + " " + enddist + "," + bez2 + " " + dist + "," + (-1*bez2))
    //     .attr("stroke", "black")
    //     .attr("fill", "transparent");

    vis.legend.append("rect")
        .attr("fill", "steelblue")
        .attr("width", vis.boxWidth)
        .attr("height", vis.boxWidth)
        .attr("x", vis.margin.left)
        .attr("y",50);

    vis.legend.append("text")
        .attr("x", vis.margin.left + vis.boxWidth + 5)
        .attr("y", 50+vis.boxWidth)
        .attr("font-size", 12)
        .text("1 square = 1 hour of time spent on " + vis.activity1);

    vis.legend.append("rect")
        .attr("fill", "red")
        .attr("width", vis.boxWidth)
        .attr("height", vis.boxWidth)
        .attr("x", vis.margin.left)
        .attr("y",70);

    vis.legend.append("text")
        .attr("x", vis.margin.left + vis.boxWidth +5)
        .attr("y", 70+vis.boxWidth)
        .attr("font-size", 12)
        .text("1 square = 1 hour of time spent on " + vis.activity2);

    vis.left = vis.svg.append("g")
        .attr("class", "left-vis")
        .attr("transform",  "translate(" + vis.margin.left + ",100)");

    vis.right = vis.svg.append("g")
        .attr("class", "right-vis")
        .attr("transform", "translate(" + vis.totalwidth/2 +  ", 100)");

    vis.left
        .append("text")
        .attr("class", "dv-label")
        .attr("y", 0)
        .attr("x", (vis.totalwidth/4) - vis.sideMargin)
        .text(vis.group1);

    vis.left
        .append("line")
        .attr("x1", 0)
        .attr("y1", 24)
        .attr("x2", vis.boxMargin*47 + vis.boxWidth*48)
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
        .attr("x1", vis.boxMargin*47 + vis.boxWidth*48)
        .attr("y1", 20)
        .attr("x2", vis.boxMargin*47 + vis.boxWidth*48)
        .attr("y2", 28)
        .attr("stroke", "rgba(188, 188, 188)")
        .attr("stroke-width", 1);

    vis.left
        .append("text")
        .attr("x", (vis.boxMargin*47 + vis.boxWidth*48)/2)
        .attr("y", 22)
        .attr("class", "dv-axis-label")
        .text('one row = 48 hours = 2 days');

     vis.right
        .append("text")
        .attr("class", "dv-label")
        .attr("y", 0)
        .attr("x", vis.totalwidth/4)
        .text(vis.group2);

    vis.right
        .append("line")
        .attr("x1", vis.sideMargin)
        .attr("y1", 24)
        .attr("x2", vis.boxMargin*47 + vis.boxWidth*48 + vis.sideMargin)
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
        .attr("x1", vis.boxMargin*47 + vis.boxWidth*48 + vis.sideMargin)
        .attr("y1", 20)
        .attr("x2", vis.boxMargin*47 + vis.boxWidth*48 + vis.sideMargin)
        .attr("y2", 28)
        .attr("stroke", "rgba(188, 188, 188)")
        .attr("stroke-width", 1);

    vis.right
        .append("text")
        .attr("x", (vis.boxMargin*47 + vis.boxWidth*48)/2 + vis.sideMargin)
        .attr("y", 22)
        .attr("class", "dv-axis-label")
        .text('one row = 48 hours = 2 days');

    vis.init = true;
    vis.wrangleData();

}

DiffVis.prototype.wrangleData = function() {
    var vis = this;
    // total = one year = time * 365
    // speed = units/time (10s)
    // 12 seconds = 1 second per month
    vis.total1a = (vis.time1a*365)/60;
    vis.lapse1a = 10/vis.total1a;

    vis.total1b = (vis.time1b*365)/60;
    vis.lapse1b = 10/vis.total1b;

    vis.total2a = (vis.time2a*365)/60;
    vis.lapse3a = 10/vis.total2a;

    vis.total2b = (vis.time2b*365)/60;
    vis.lapse2b = 10/vis.total2b;

    vis.drawVis();
}

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
            // console.log(i);
            vis.leftrect.append("rect")
                .attr("class", "square1a")
                .attr("fill", "steelblue")
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * (j % 48))
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor(j/48)+10);
        },time1 * j);
    });


    array1b.forEach(function(d, j) {
            setTimeout(function() {
                // console.log(i);
                vis.rightrect.append("rect")
                    .attr("class", "square1a")
                    .attr("fill", "steelblue")
                    .attr("width", vis.boxWidth)
                    .attr("height", vis.boxWidth)
                    .attr("x", vis.sideMargin + (vis.boxWidth+vis.boxMargin) * (j % 48))
                    .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor(j/48)+10);
            },time2 * j);
        });

    setTimeout(function () {
        vis.drawBlanks();
        vis.showButton();
        vis.showTooltip(false);
    }, vis.timetotal+600);

}

DiffVis.prototype.showButton = function() {

    var vis = this;

    vis.button = vis.legend.append("rect")
        .attr("fill", "red")
        .attr("width", 18)
        .attr("height", 18)
        .attr("x", 450)
        .attr("y", 0);

    vis.buttonlabel = vis.legend.append("text")
        .attr("class", "desc")
        .attr("x", 500)
        .attr("y", 15)
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
}

DiffVis.prototype.showSecond = function() {
    var vis = this;

    vis.button.remove();

    vis.buttonlabel.remove();
    vis.rightrect.selectAll(".blank").remove();
    vis.rightrect.selectAll(".outline").remove();

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
                .attr("fill", "red")
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * ((finala+j) % 48))
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor((finala+j)/48)+10);
        },time1 * j);
    });


    array2b.forEach(function(d, j) {
        setTimeout(function() {
            // console.log(i);
            vis.rightrect
                .append("rect")
                // .attr("class", "square1a")
                .attr("fill", "red")
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * ((finalb+j) % 48)+vis.sideMargin)
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor((finalb+j)/48)+10);
        },time2 * j);
    });


    console.log("here:" + finala);
    console.log("there:" + finalb);
    console.log(array2a.length);

    vis.finala += array2a.length;
    vis.finalb += array2b.length;

    console.log("what:" + vis.finala);
    console.log(finalb);

    setTimeout(function () {
        vis.drawBlanks();
        vis.showTooltip(true);
    }, vis.timetotal+600);
}

DiffVis.prototype.drawBlanks = function() {
    var vis = this;

    var check = vis.finala - vis.finalb;
    console.log(check);
    console.log(vis.total1a - vis.total1b);
    var diff = Array(Math.round(check)).fill(0);

    var blanks = vis.rightrect.selectAll(".blank")
        .data(diff);

    blanks.enter()
        .append("rect")
        .attr("class", function (d, i){
            if (check == Math.round(vis.total1a - vis.total1b)) {
                return "blank1";
            }
            else if (i <= vis.total1a - vis.total1b) {
                return "blank2";
            }
            else {
                return "blank3";
            }
        })
        .attr("fill", function (d, i) {
            if (check == Math.round(vis.total1a - vis.total1b)) {
                return "#bcbcbc";
            }
            else if (i <= vis.total1a - vis.total1b) {
                return "#BCBCDF";
            }
            else {
                return "#e6bcbc";
            }

        })
        .attr("width", vis.boxWidth)
        .attr("height", vis.boxWidth)
        .attr("x", function(d, i) {
            return (vis.boxWidth+vis.boxMargin) * ((vis.finalb+i) % 48) + vis.sideMargin;
        })
        .attr("y",function(d, i) {
            return (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+i)/48)+10;
        });
}

DiffVis.prototype.showTooltip = function (bool) {
    var vis = this;
    let x1, y1, x2, y3, x4, y5, x6, y7, x8, y9;
    const padding = 3;
    var center_x, center_y;

    vis.placeholder = vis.svg.append("text")
        .attr("class", "placeholder")
        .attr("fill", "black")
        .attr("x", 0)
        .attr("y", 0)
        .text(vis.group1 + " spend approximately " + Math.round(vis.savea) + " hours a year on " + vis.activity1);

    vis.placeholder = vis.svg.selectAll(".placeholder");

    var bbox = vis.placeholder.node().getBBox();

    vis.svg.selectAll(".placeholder").remove();

    if (!bool) {

        x1 = 0;
        y1 = 10;
        x2 = (vis.boxWidth+vis.boxMargin) * 47 + vis.boxWidth;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/48)+10 - vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.savea) % 48) - vis.boxMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/48)+10+ vis.boxWidth;
        x6 = 0;
        y7 = 10;

        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper = vis.leftrect.append("g")
            .attr("class", 'wrapper1');

        vis.wrapper.append("path")
            .attr("class", "outline1")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7)
            .attr("fill","transparent");

        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2-padding)
            .attr("y", center_y - bbox.height/2-padding)
            .attr("width", bbox.width+2*padding)
            .attr("height", bbox.height+2*padding);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+5-padding)
            .text(vis.group1 + " spend approximately " + Math.round(vis.total1a) + " hours a year on " + vis.activity1);


        x1 = vis.sideMargin;
        y1 = 10;
        x2 = (vis.boxWidth+vis.boxMargin) * 47 + vis.boxWidth+vis.sideMargin;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/48)+10 - vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.saveb) % 48) - vis.boxMargin+vis.sideMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/48)+10+ vis.boxWidth;
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
            .attr("x", center_x - bbox.width/2-padding)
            .attr("y", center_y - bbox.height/2-padding)
            .attr("width", bbox.width+2*padding)
            .attr("height", bbox.height+2*padding);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+5-padding)
            .text(vis.group2 + " spend approximately " + Math.round(vis.total1b) + " hours a year on " + vis.activity1);


        x1 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb) % 48)+vis.sideMargin;
        y1 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/48)+10;
        x2 = (vis.boxWidth+vis.boxMargin) * 47 + vis.boxWidth+vis.sideMargin;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finala)/48)+10 -  vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finala) % 48) - vis.boxMargin+vis.sideMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finala)/48)+10+ vis.boxWidth;
        x6 = vis.sideMargin;
        y7 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/48)+10+ vis.boxWidth + vis.boxMargin;
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
            .attr("x", center_x - bbox.width/2-padding)
            .attr("y", center_y - bbox.height/2-padding)
            .attr("width", bbox.width+2*padding)
            .attr("height", bbox.height+2*padding);

        vis.wrapper2.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+5-padding)
            .text(vis.group1 + " spend approximately " + Math.round(vis.total1a - vis.total1b) + " more hours a year on "
                + vis.activity1 + " than " + vis.group2);

    }

    else {
        vis.rightrect.selectAll(".outline2").remove();

        x1 = (vis.boxWidth+vis.boxMargin) * ((vis.savea) % 48);
        y1 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/48)+10;
        x2 = (vis.boxWidth+vis.boxMargin) * 47 + vis.boxWidth;
        y3 =(vis.boxWidth+vis.boxMargin) * Math.floor((vis.finala)/48)+10 - vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finala) % 48) - vis.boxMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finala)/48)+10+ vis.boxWidth;
        x6 = 0;
        y7 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/48)+10 + vis.boxMargin+vis.boxWidth;
        x8 = (vis.boxWidth+vis.boxMargin) * ((vis.savea) % 48);
        y9 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.savea)/48)+10;

        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper = vis.leftrect.append("g")
            .attr("class", 'wrapper3');

        vis.wrapper.append("path")
            .attr("class", "outline3")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7)
            .attr("fill","transparent");

        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2-padding)
            .attr("y", center_y - bbox.height/2-padding)
            .attr("width", bbox.width+2*padding)
            .attr("height", bbox.height+2*padding);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+5-padding)
            .text(vis.group1 + " spend approximately " + Math.round(vis.total2a) + " hours a year on " + vis.activity2);



        x1 = (vis.boxWidth+vis.boxMargin) * ((vis.saveb) % 48)+vis.sideMargin;
        y1 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/48)+10;
        x2 = (vis.boxWidth+vis.boxMargin) * 47 + vis.boxWidth + vis.sideMargin;
        y3 =(vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/48)+10 - vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb) % 48) - vis.boxMargin + vis.sideMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/48)+10+ vis.boxWidth;
        x6 = vis.sideMargin;
        y7 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/48)+10 + vis.boxMargin+vis.boxWidth;
        x8 = (vis.boxWidth+vis.boxMargin) * ((vis.saveb) % 48) + vis.sideMargin;
        y9 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.saveb)/48)+10;

        center_x =(x2-x6)/2 +x6;
        center_y = (y5-y1)/2 + y1;

        vis.wrapper = vis.rightrect.append("g")
            .attr("class", 'wrapper3');

        vis.wrapper.append("path")
            .attr("class", "outline3")
            .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
                + " V " + y5 + " H " + x6 + " V " + y7)
            .attr("fill","transparent");


        vis.wrapper.append("rect")
            .attr("class", "dv-tooltip-box")
            .attr("x", center_x - bbox.width/2-padding)
            .attr("y", center_y - bbox.height/2-padding)
            .attr("width", bbox.width+2*padding)
            .attr("height", bbox.height+2*padding);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+5-padding)
            .text(vis.group2 + " spend approximately " + Math.round(vis.total2b) + " hours a year on " + vis.activity2);

        x1 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb) % 48)+vis.sideMargin;
        y1 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/48)+10;
        x2 = (vis.boxWidth+vis.boxMargin) * 47 + vis.boxWidth+vis.sideMargin;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+vis.total1a - vis.total1b)/48)+10 -  vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb+vis.total1a - vis.total1b) % 48) +vis.sideMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+vis.total1a - vis.total1b)/48)+10+ vis.boxWidth;
        x6 = vis.sideMargin;
        y7 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/48)+10 + vis.boxWidth+vis.boxMargin;
        x8 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb) % 48)+vis.sideMargin;
        y9 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb)/48)+10;

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
            .attr("x", center_x - bbox.width/2-padding)
            .attr("y", center_y - bbox.height/2-padding)
            .attr("width", bbox.width+2*padding)
            .attr("height", bbox.height+2*padding);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+5-padding)
            .text(vis.group1 + " spend approximately " + Math.round(vis.total1a - vis.total1b) + " more hours a year on "
                + vis.activity1 + " than " + vis.group2);


        x1 = x4 + vis.boxMargin;
        y1 = y3 + vis.boxMargin;
        y7 = y5 + vis.boxMargin;
        x2 = (vis.boxWidth+vis.boxMargin) * 47 + vis.boxWidth+vis.sideMargin;
        y3 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+vis.total1a +vis.total2a- vis.total1b-vis.total2b)/48)+10 -  vis.boxMargin;
        x4 = (vis.boxWidth+vis.boxMargin) * ((vis.finalb+vis.total1a +vis.total2a- vis.total1b-vis.total2b) % 48) +vis.sideMargin+10 - vis.boxMargin;
        y5 = (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+vis.total1a +vis.total2a- vis.total1b-vis.total2b)/48)+10+ vis.boxWidth;
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
            .attr("x", center_x - bbox.width/2-padding)
            .attr("y", center_y - bbox.height/2-padding)
            .attr("width", bbox.width+2*padding)
            .attr("height", bbox.height+2*padding);

        vis.wrapper.append("text")
            .attr("class", "dv-tooltip-text")
            .attr("fill", "white")
            .attr("x", center_x)
            .attr("y", center_y+5-padding)
            .text(vis.group1 + " spend approximately " + Math.round(vis.total2a - vis.total2b) + " more hours a year on "
                + vis.activity2 + " than " + vis.group2);


    }


}

DiffVis.prototype.calMove = function () {
    var vis = this;

    var start = Date.now(); // remember start time

    var timer = setInterval(function() {
        // how much time passed from the start?
        let timePassed = Date.now() - start;

        if (timePassed >= vis.timetotal) {
            clearInterval(timer); // finish the animation after 2 seconds
            return;
        }

        // draw the animation at the moment timePassed
        draw(timePassed);

    }, 20);

// as timePassed goes from 0 to 2000
// left gets values from 0px to 400px
    function draw(timePassed) {
        train.style.left = timePassed / 5 + 'px';
    }
}

