DemoVis = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

DemoVis.prototype.initVis = function() {
    var vis = this;

    vis.units = "Respondents";
    vis.formatNumber = d3.format(",.0f"),    // zero decimal places
        vis.format = function(d) { return vis.formatNumber(d) + " " + vis.units; },
        vis.color = d3.scaleOrdinal(d3.schemeCategory20);

    vis.margin = {top: 40, right: 60, bottom: 60, left: 60};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.graph = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([vis.width, vis.height]);

    vis.path = vis.graph.link();
    // console.log(vis.path);

    vis.wrangleData();
}

DemoVis.prototype.wrangleData = function() {
    var vis = this;
    // console.log(vis.data);

    //format
    //gender - age group - employment - city - race
    //g: 1(f)/2(m)
    //age: 1/2/3/4/5/6
    //employ: 1(employed-working)/2(employed-absent)/3(unemp-looking)/4(unemp-layoff)/5(not in market)
    //city:1(metro)/2(not-metro)/3(na)
    //race: 1(white)/2(black)/3(Native)/4(AAPI)/5(Mixed)
    vis.disaggr = {};

    var cat, age_cat, emp_cat, city_cat, race_cat;

    vis.sankeyData = {
        "nodes" : ["Female", "Male",
            "Employed",  "Unemployed", "Not in Job Market",
            "White", "Black", "Native", "AAPI", "Mixed",
            "Metro", "Non-Metro", "N/A",
            "15 to 24", "25 to 34", "35 to 44", "45 to 54", "55 to 64", "65+"],
        "nodesList": [],
        "links" : []
    };

    vis.sankeyData.nodes.forEach(function (entry){
        vis.sankeyData.nodesList.push({
            "name": entry
        })
    });
    // console.log(vis.sankeyData.nodesList);
    for (var i = 0; i < 2; i++) {
        for (var j = 2; j < 5; j++) {
            var link = {
                "source": vis.sankeyData.nodes[i],
                "target": vis.sankeyData.nodes[j],
                "value": 0
            };
            vis.sankeyData.links.push(link);

        }
    }

    for (var i = 2; i< 5; i++) {
        for (var j = 5; j < 10; j++) {
            var link = {
                "source": vis.sankeyData.nodes[i],
                "target": vis.sankeyData.nodes[j],
                "value": 0
            };
            vis.sankeyData.links.push(link);

        }

    }

    for (var i = 5; i< 10; i++) {
        for (var j = 10; j < 13; j++) {
            var link = {
                "source": vis.sankeyData.nodes[i],
                "target": vis.sankeyData.nodes[j],
                "value": 0
            };
            vis.sankeyData.links.push(link);

        }

    }

    for (var i = 10; i< 13; i++) {
        for (var j = 13; j < 19; j++) {
            var link = {
                "source": vis.sankeyData.nodes[i],
                "target": vis.sankeyData.nodes[j],
                "value": 0
            };
            vis.sankeyData.links.push(link);

        }

    }

    vis.data.forEach(function (entry){

        if (parseInt(entry["Age"]) <=24){
            entry["Age"] = 1;
        }
        else if (parseInt(entry["Age"]) <=34){
            entry["Age"] = 2;
        }
        else if (parseInt(entry["Age"]) <=44){
            entry["Age"] = 3;
        }
        else if (parseInt(entry["Age"]) <=54){
            entry["Age"] = 4;
        }
        else if (parseInt(entry["Age"]) <=64){
            entry["Age"] = 5;
        }
        else {
            entry["Age"] = 6;
        }

        if (parseInt(entry["Race"]) == 5){
            entry["Race"] = 4;
        }
        else if (parseInt(entry["Race"]) > 5){
            entry["Race"] = 5;
        };
        console.log(vis.sankeyData.links);
        //
        // var link1= (parseInt(entry["Sex"]) - 1)*5 + (parseInt(entry["Labor force status"]) -1);
        // var link2 = 10 + (parseInt(entry["Labor force status"]) - 1)*3 + (parseInt(entry["Race"])-1);
        // var link3 = 35 + (parseInt(entry["Race"]) - 1)*3 + (parseInt(entry["Metro status"])-1);
        // var link4 = 50 + (parseInt(entry["Metro status"]) - 1)*3 + (parseInt(entry["Age"])-1);
        //


        vis.sankeyData.links[link1].value++;
        vis.sankeyData.links[link2].value++;
        vis.sankeyData.links[link3].value++;
        vis.sankeyData.links[link4].value++;

    });

    var linksFinal = [];

    vis.sankeyData.links.forEach(function(entry) {
        if (entry.value != 0) {
            linksFinal.push(entry);
        }
    });

    // console.log(linksFinal);
    vis.sankeyData.links = linksFinal;

    var nodeMap = {};
    vis.sankeyData.nodesList.forEach(function(x) { nodeMap[x.name] = x; });
    vis.sankeyData.links = vis.sankeyData.links.map(function(x) {
        return {
            source: nodeMap[x.source],
            target: nodeMap[x.target],
            value: x.value
        };
    });

    console.log(vis.sankeyData);

    vis.drawSankey();
}

DemoVis.prototype.drawSankey = function() {
    var vis = this;

    vis.graph
        .nodes(vis.sankeyData.nodesList)
        .links(vis.sankeyData.links)
        .layout(32);

     vis.link = vis.svg.append('g').selectAll('.link')
        .data(vis.sankeyData.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', vis.path)
        .style('stroke-width', d => Math.max(1, d.dy))
        .sort((a, b) => b.dy - a.dy);

    vis.link.append('title')
        .text(d => `${d.source.name} → ${d.target.name}\n${vis.format(d.value)}`);


     vis.node = vis.svg.append('g').selectAll('.node')
        .data(vis.sankeyData.nodesList)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .call(d3.drag()
            .subject(d => d)
            .on('start', function () { this.parentNode.appendChild(this); })
            .on('drag', dragmove));

    vis.node.append('rect')
        .attr('height', d => d.dy)
        .attr('width', vis.graph.nodeWidth())
        .style('fill', (d) => {
            d.color = vis.color(d.name.replace(/ .*/, ''));
            return d.color;
        })
        .style('stroke', 'none')
        .append('title')
        .text(d => `${d.name}\n${vis.format(d.value)}`);


    vis.node.append('text')
        .attr('x', -6)
        .attr('y', d => d.dy / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .text(d => d.name)
        .filter(d => d.x < vis.width / 2)
        .attr('x', 6 + vis.graph.nodeWidth())
        .attr('text-anchor', 'start');

    function dragmove(d) {
        d3.select(this).attr('transform', `translate(${d.x},${d.y = Math.max(0, Math.min(vis.height - d.dy, d3.event.y))})`);
        vis.graph.relayout();
        vis.link.attr('d', vis.path);
    }
// //     vis.graph
//         .nodes(vis.sankeyData.nodesList)
//         .links(vis.sankeyData.links)
//         .layout(32);
//
//     vis.link = vis.svg.append("g").selectAll(".link")
//         .data(vis.sankeyData.links)
//         .enter().append("path")
//         .attr("class", "link")
//         .attr("d", vis.path)
//         .style("stroke-width", function(d) { return Math.max(1, d.dy); })
//         .sort(function(a, b) { return b.dy - a.dy; });
//
//     // add the link titles
//     vis.link.append("title")
//         .text(function(d) {
//             return d.source.name + " → " +
//                 d.target.name + "\n" + vis.format(d.value); });
//
//     // console.log(vis.sankeyData.nodesList);
//     // add in the nodes
//     vis.node = vis.svg.append("g").selectAll(".node")
//         .data(vis.sankeyData.nodesList)
//         .enter()
//         .append("g")
//         .attr("class", "node")
//         .attr("transform", function(d) {
//             return "translate(" + d.x + "," + d.y + ")"; })
//     .call(d3.drag()
//             .subject(d => d)
//             .on('start', function () { this.parentNode.appendChild(this); })
//             .on('drag', dragmove));
//
//
// // add the rectangles for the nodes
//     vis.node.append("rect")
//         .attr("height", function(d) { return d.dy; })
//         .attr("width", vis.graph.nodeWidth())
//         .style("fill", function(d) {
//             return d.color = vis.color[d.name.replace(/ .*/, "")]; })
//         .style("stroke", function(d) {
//             return d3.rgb(d.color).darker(2); })
//         .append("title")
//         .text(function(d) {
//             return d.name + "\n" + vis.format(d.value); });
//
// // add in the title for the nodes
//     vis.node.append("text")
//         .attr("x", -6)
//         .attr("y", function(d) { return d.dy / 2; })
//         .attr("dy", ".35em")
//         .attr("text-anchor", "end")
//         .attr("transform", null)
//         .text(function(d) { return d.name; })
//         .filter(function(d) { return d.x < vis.width / 2; })
//         .attr("x", 6 + vis.graph.nodeWidth())
//         .attr("text-anchor", "start");

// // the function for moving the nodes
//     function dragmove(d) {
//         d3.select(this).attr("transform",
//             "translate(" + (
//                 d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
//             ) + "," + (
//                 d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
//             ) + ")");
//         sankey.relayout();
//         vis.link.attr("d", path);
//     }
}
