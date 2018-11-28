DemoVis = function(_parentElement, _data, _selection){
    this.parentElement = _parentElement;
    this.data = _data;
    this.selection = _selection;

    this.initVis();
}

DemoVis.prototype.initVis = function() {
    var vis = this;
    vis.tree = [];
    vis.options = ["Sex", "Race", "Metro status", "Age", "Labor force status"];
    //gender / race / metro / age / employment

    // console.log(vis.data);
    // console.log(vis.data[0]);
    // console.log(vis.selection);
    vis.data.forEach(function(d) {
        vis.tree.push({
            "group": d[vis.options[vis.selection]]
        });
    });

    var a2 = JSON.parse(JSON.stringify(vis.tree));

    a2.sort(function (x, y) {
        if (x['name'] < y['name']) {
            return -1;
        }
        if (x['name'] > y['name']) {
            return 1;
        }
        return 0;
    });

}

DemoVis.prototype.wrangleData = function() {
}

DemoVis.prototype.drawSankey = function() {
//     }
}