DiffVis = function(_parentElement, _time1a, _time1b, _time2a, _time2b){
    this.parentElement = _parentElement;
    this.time1a = _time1a;
    this.time1b = _time1b;
    this.time2a = _time2a;
    this.time2b = _time2b;

    this.initVis();
}


DiffVis.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 40, right: 60, bottom: 60, left: 60};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.totalwidth = vis.width + vis.margin.left + vis.margin.right;
    vis.sideMargin = 30;
    vis.boxMargin = 5;
    vis.boxWidth = ((vis.totalwidth/2) - vis.sideMargin - (24*vis.boxMargin))/24;

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
        .attr("transform", "translate(0, 50)");

    vis.legend.append("rect")
        .attr("fill", "steelblue")
        .attr("width", 18)
        .attr("height", 18)
        .attr("x", 0)
        .attr("y",0);

    vis.legend.append("text")
        .attr("x", 30)
        .attr("y",15)
        .text("1 square = 1 hour of time spent on Activity 1");

    vis.left = vis.svg.append("g")
        .attr("class", "left-vis")
        .attr("transform", "translate(0, 100)");

    vis.right = vis.svg.append("g")
        .attr("class", "right-vis")
        .attr("transform", "translate(" + vis.totalwidth/2 +  ", 100)");

    vis.labelLeft = vis.left
        .append("text")
        .attr("class", "label")
        .attr("y", 0)
        .attr("x", (vis.totalwidth/4) - vis.sideMargin)
        .text("Group 1");

    vis.labelRight = vis.right
        .append("text")
        .attr("class", "label")
        .attr("y", 0)
        .attr("x", vis.totalwidth/4)
        .text("Group 2");

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


    var array1a = Array(Math.round(vis.total1a)).fill(0);
    var array1b = Array(Math.round(vis.total1b)).fill(0);

    var timetotal = 8000;
    var time1 = timetotal/array1a.length;
    var time2 = timetotal/array1b.length;

    vis.finala = array1a.length;
    vis.finalb = array1b.length;

    array1a.forEach(function(d, j) {
        setTimeout(function() {
            // console.log(i);
            vis.left.append("rect")
                .attr("class", "square1a")
                .attr("fill", "steelblue")
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * (j % 24))
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor(j/24)+10);
        },time1 * j);
    });


    array1b.forEach(function(d, j) {
            setTimeout(function() {
                // console.log(i);
                vis.right.append("rect")
                    .attr("class", "square1a")
                    .attr("fill", "steelblue")
                    .attr("width", vis.boxWidth)
                    .attr("height", vis.boxWidth)
                    .attr("x", vis.sideMargin + (vis.boxWidth+vis.boxMargin) * (j % 24))
                    .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor(j/24)+10);
            },time2 * j);
        });

    setTimeout(function () {
        vis.showDetails();
    }, timetotal+600);

}

DiffVis.prototype.showDetails = function() {
    var vis = this;

    var diff = Array(Math.round(vis.finala - vis.finalb)).fill(0);
    //
    var blanks = vis.right.selectAll(".blank")
        .data(diff);

    blanks.enter()
        .append("rect")
        .attr("class", "blank")
        .attr("fill", "#bcbcbc")
        .attr("width", vis.boxWidth)
        .attr("height", vis.boxWidth)
        .attr("x", function(d, i) {
            return (vis.boxWidth+vis.boxMargin) * ((vis.finalb+i) % 24) + vis.sideMargin;
        })
        .attr("y",function(d, i) {
            return (vis.boxWidth+vis.boxMargin) * Math.floor((vis.finalb+i)/24)+10;
        });

    // var x1 = 15 * (vis.final1b % 20) + 4;
    // var y1 = 15* Math.floor(vis.final1b/20) + 4;
    // var x2 = 15 * 20+10;
    // var y3 = 15* Math.floor(vis.final1a/20) + 10;
    // var x4 = 15 * (vis.final1a % 20) +10;
    // var y5 = 15* Math.floor(vis.final1a/20) + 25;
    // var x6 = 4;
    // var y7 = 15* Math.floor(vis.final1b/20) + 18;
    // var x8 = 15 * (vis.final1b % 20) + 4;
    //
    // vis.right.append("path")
    //     .attr("class", "outline")
    //     .attr("d", "M" + x1 + " " + y1 + " H " + x2 + " V " + y3 + " H " + x4
    //         + " V " + y5 + " H " + x6 + " V " + y7 + " H " + x8 + " V " + y1)
    //     .attr("stroke", "black")
    //     .attr("fill", "transparent");
    //
    // vis.right.append("text")
    //     .attr("class", "desc")
    //     .attr("x", 0)
    //     .attr("y", y5 +20)
    //     .text("these blocks are the number of hours different in one year. add context");


    vis.button = vis.legend.append("rect")
        .attr("fill", "red")
        .attr("width", 18)
        .attr("height", 18)
        .attr("x", 450)
        .attr("y", 0)
        .on("click", function(d) {
            if (!vis.clicked) {
                vis.showSecond();
            }
        });

    vis.legend.append("text")
        .attr("class", "desc")
        .attr("x", 500)
        .attr("y", 15)
        .text("Click to Add Activity 2");
}

DiffVis.prototype.showSecond = function() {
    var vis = this;

    vis.right.selectAll(".desc").remove();
    vis.right.selectAll(".blank").remove();
    vis.right.selectAll(".outline").remove();

    var array2a = Array(Math.round(vis.total2a)).fill(0);
    var array2b = Array(Math.round(vis.total2b)).fill(0);

    var timetotal = 8000;
    var time1 = timetotal/array2a.length;
    var time2 = timetotal/array2b.length;

    array2a.forEach(function(d, j) {
        setTimeout(function() {
            // console.log(i);
            vis.left.append("rect")
                .attr("class", "square1a")
                .attr("fill", "red")
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * ((vis.finala + j) % 24))
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor((vis.finala+j)/24)+10);
        },time1 * j);
    });


    array2b.forEach(function(d, j) {
        setTimeout(function() {
            // console.log(i);
            vis.right.append("rect")
                .attr("class", "square1a")
                .attr("fill", "red")
                .attr("width", vis.boxWidth)
                .attr("height", vis.boxWidth)
                .attr("x", (vis.boxWidth+vis.boxMargin) * ((vis.finalb+j) % 24)+vis.sideMargin)
                .attr("y",(vis.boxWidth+vis.boxMargin)* Math.floor((vis.finalb+j)/24)+10);
        },time2 * j);
    });

    vis.finala += array2a.length;
    vis.finala += array2b.length;

    vis.showDetails();
}

DiffVis.prototype.calMove = function () {

    var pos = 0;
    var id = setInterval(frame, 5);

    //
    // function frame() {
    //     if (pos == 350) {
    //         clearInterval(id);
    //     } else {
    //         pos++;
    //         elem.style.top = pos + 'px';
    //         elem.style.left = pos + 'px';
    //     }
    // }
}

