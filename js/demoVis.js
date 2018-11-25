DemoVis = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

DemoVis.prototype.initVis = function() {
    var vis = this;
    console.log(vis.data);

    vis.margin = {top: 40, right: 60, bottom: 60, left: 60};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.wrangleData();
}

DemoVis.prototype.wrangleData = function() {

}

// svg.append("g")
//     .attr("stroke", "#000")
//     .selectAll("rect")
//     .data(nodes)
//     .enter().append("rect")
//     .attr("x", d => d.x0)
//     .attr("y", d => d.y0)
//     .attr("height", d => d.y1 - d.y0)
//     .attr("width", d => d.x1 - d.x0)
//     .attr("fill", d => color(d.name))
//     .append("title")
//     .text(d => `${d.name}\n${format(d.value)}`);

