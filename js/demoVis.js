DemoVis = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;

    this.initVis();
}

DemoVis.prototype.initVis = function() {
    var vis = this;
    vis.margin = {top: 40, right: 60, bottom: 60, left: 60};

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    vis.sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([vis.width, vis.height]);

    vis.path = vis.sankey.link();

    vis.wrangleData();
}

DemoVis.prototype.wrangleData = function() {
    var vis = this;
    console.log(vis.data);

    //format
    //gender - age group - employment - city - race
    //g: 1(f)/2(m)
    //age: 1/2/3/4/5/6
    //employ: 1(employed-working)/2(employed-absent)/3(unemp-looking)/4(unemp-layoff)/5(not in market)
    //city:1(metro)/2(not-metro)/3(na)
    //race: 1(white)/2(black)/3(Native)/4(AAPI)/5(Mixed)
    vis.disaggr = {};

    var cat, age_cat, emp_cat, city_cat, race_cat;

    // if (vis.startCat == "gender") {
    //     for (var g = 1; g <=2; g++){
    //         cat = g + "-";
    //
    //         for (var age = 1; age <=6; age++) {
    //             age_cat = cat +  age + "-";
    //
    //             for (var emp = 1; emp <= 5; emp++){
    //                 emp_cat = age_cat + emp + "-";
    //
    //                 for (var city = 1; city <= 3; city++){
    //                     city_cat = emp_cat + city + "-";
    //
    //                     for (var race = 1; race <= 5; race++){
    //                         race_cat = city_cat + race;
    //                         vis.disaggr[race_cat] = 0;
    //                     }
    //                 }
    //             }
    //
    //         }
    //     }
    // }
    //
    //
    // vis.data.forEach(function (entry, i){
    //     cat = "";
    //     // console.log(entry);
    //
    //     //gender
    //     if (entry["Sex"] == "Female"){
    //         cat += "1-";
    //     }
    //     else {
    //         cat += "2-";
    //     }
    //     //age category
    //     if (parseInt(entry["Age"]) <=24){
    //         cat += "1-";
    //     }
    //     else if (parseInt(entry["Age"]) <=34){
    //         cat += "2-";
    //     }
    //     else if (parseInt(entry["Age"]) <=44){
    //         cat += "3-";
    //     }
    //     else if (parseInt(entry["Age"]) <=54){
    //         cat += "4-";
    //     }
    //     else if (parseInt(entry["Age"]) <=64){
    //         cat += "5-";
    //     }
    //     else {
    //         cat += "6-";
    //     }
    //
    //     //employment
    //     if (entry["Labor force status"] == "Employed - at work"){
    //         cat += "1-";
    //     }
    //     else if (entry["Labor force status"] == "Employed - absent"){
    //         cat += "2-";
    //     }
    //     else if (entry["Labor force status"] == "Unemployed - looking"){
    //         cat += "3-";
    //     }
    //     else if (entry["Labor force status"] == "Unemployed - on layoff"){
    //         cat += "4-";
    //     }
    //     else if (entry["Labor force status"] == "Not in labor force"){
    //         cat += "5-";
    //     }
    //
    //     //city
    //     if (entry["Metropolitan status"] == "Metropolitan"){
    //         cat += "1-";
    //     }
    //     else if (entry["Metropolitan status"]== "Non-metropolitan"){
    //         cat += "2-";
    //     }
    //     else {
    //         cat += "3-";
    //     }
    //
    //     //race
    //     if (entry["Race"] == "1" || entry["Race"] == "2"
    //         || entry["Race"] == "3" || entry["Race"] == "4") {
    //
    //         cat += entry["Race"]
    //     }
    //     else if (entry["Race"] == "4") {
    //         cat += "4"
    //     }
    //     else {
    //         cat += "5"
    //     }
    //
    //     vis.disaggr[cat] += 1;
    //
    // });

// console.log(vis.disaggr);

    // if (vis.startCat == "gender") {
    //
    // }

    vis.sankeyData = {
        "nodes" : ["Female", "Male",
            "Employed - Working", "Employed - Absent", "Unemployed - Looking", "Unemployed - Layoff", "Not in Job Market",
            "White", "Black", "Native", "AAPI", "Mixed",
            "Metro", "Non-Metro", "N/A",
            "15 to 24", "25 to 34", "35 to 44", "45 to 54", "55 to 64", "65+"],
        "links" : []
    };

    for (var i = 0; i < 2; i++) {
        for (var j = 2; j < 7; j++) {
            var link = {
                "source": vis.sankeyData.nodes[i],
                "target": vis.sankeyData.nodes[j],
                "value": 0
            };
            vis.sankeyData.links.push(link);

        }
    }

    for (var i = 2; i< 7; i++) {
        for (var j = 7; j < 12; j++) {
            var link = {
                "source": vis.sankeyData.nodes[i],
                "target": vis.sankeyData.nodes[j],
                "value": 0
            };
            vis.sankeyData.links.push(link);

        }

    }

    for (var i = 7; i< 12; i++) {
        for (var j = 12; j < 15; j++) {
            var link = {
                "source": vis.sankeyData.nodes[i],
                "target": vis.sankeyData.nodes[j],
                "value": 0
            };
            vis.sankeyData.links.push(link);

        }

    }

    for (var i = 12; i< 15; i++) {
        for (var j = 15; j < 21; j++) {
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

        var link1= (parseInt(entry["Sex"]) - 1)*5 + (parseInt(entry["Labor force status"]) -1);
        var link2 = 10 + (parseInt(entry["Labor force status"]) - 1)*5 + (parseInt(entry["Race"])-1);
        var link3 = 35 + (parseInt(entry["Race"]) - 1)*3 + (parseInt(entry["Metro status"])-1);
        var link4 = 50 + (parseInt(entry["Metro status"]) - 1)*3 + (parseInt(entry["Age"])-1);



        vis.sankeyData.links[link1].value++;
        vis.sankeyData.links[link2].value++;
        vis.sankeyData.links[link3].value++;
        vis.sankeyData.links[link4].value++;

    });

    console.log(vis.sankeyData);

    vis.drawSankey();
}

DemoVis.prototype.drawSankey = function() {
    var vis = this;

    sankey
        .nodes(vis.sankeyData.nodes)
        .links(vis.sankeyData.links)
        .layout(32);

    vis.link = svg.append("g").selectAll(".link")
        .data(vis.sankeyData.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

}