DemoVis = function() {
    console.log("hello?");
    this.initVis();
};

DemoVis.prototype.initVis = function() {
    var vis = this;


    vis.maxWidth = Math.min ($(window).width()-60, 900);
    vis.maxHeight = $(window).height() - ($('#demoheader').height()+$('#demoinfo').height()+$('#instructions').height());
    console.log(vis.maxHeight);
    vis.margin = { top: 1, right: 1, bottom: 6, left: 1 };
    vis.width = vis.maxWidth- vis.margin.left - vis.margin.right;
    vis.height = vis.maxHeight - vis.margin.top - vis.margin.bottom-100;
    vis.formatNumber = d3.format(',.0f');
    vis.format = d => `${vis.formatNumber(d)} Respondents`;
    vis.color = d3.scaleOrdinal([
        "#15537d",'#629fca',
        '#bd0026','#f03b20','#fd8d3c','#fecc5c','#fbff8b',
        '#31a354','#a1d99b','#e5f5e0',
        '#dd1c77','#c994c7','#e7e1ef',
        '#54278f','#756bb1','#9e9ac8','#bcbddc','#dadaeb','#f2f0f7',
    ]);

    let sidemargins = ($(window).width() - vis.maxWidth)/2;
    let topmargin = (vis.height-(vis.height + vis.margin.top + vis.margin.bottom))/2 + 25;
        // (vis.height + vis.margin.top + vis.margin.bottom)+ 150);

    // console.log($("#demovis").width());
    // console.log(sidemargins);
    $("#demovis").css("padding-left", sidemargins + "px");
    $("#demovis").css("padding-top", topmargin + "px");

    d3.select("#demovis").append("canvas")
        .attr("class", "demovis")
        .attr('width', 960)
        .attr('height',vis.height + vis.margin.top + vis.margin.bottom);

    d3.select("#demovis").append("svg")
        .attr("class", ".demovis .demo");

    vis.svg = d3.select('#demovis svg')
        .attr('width', vis.width + vis.margin.left + vis.margin.right)
        .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
        .attr("x", 0)
        .attr("y", 0)
        .append('g')
        .attr('transform', `translate(${vis.margin.left},${vis.margin.top})`);


    vis.sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([vis.width, vis.height]);


    vis.path = vis.sankey.link();
    vis.freqCounter = 1;


    d3.json('data/demo.json', (demo) => {
        vis.sankey
            .nodes(demo.nodes)
            .links(demo.links)
            .layout(0);

        vis.link = vis.svg.append('g').selectAll('.link')
            .data(demo.links)
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', vis.path)
            .style('stroke-width', d => Math.max(1, d.dy))
            .sort((a, b) => b.dy - a.dy)
            .on('mouseover', function(d) {
                $("#demoinfo").html("Out of respondents who are " + convertName(d.source.name) + ", "
                + d.value + " are also "
                + convertName(d.target.name) + ".")
                    .append('<br/>')
                    .append("Respondents who are " + convertName(d.source.name) + " and " +
                    convertName(d.target.name) + " make up "
                    +  Math.floor(100*(d.value/10223)) + "% of all respondents");
            })
            .on('mouseout', function(d) {
                // console.log(d);
                $("#demoinfo").text("");
            });;

        vis.link.append('title')
            .text(d => `${d.source.name} → ${d.target.name}\n${vis.format(d.value)}`);

        vis.node = vis.svg.append('g').selectAll('.node')
            .data(demo.nodes)
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .call(d3.drag()
                .subject(d => d)
                .on('start', function () { this.parentNode.appendChild(this); })
                .on('drag', dragmove))
            .on('mouseover', function(d) {
                $("#demoinfo").text(d.value + " respondents or " + Math.floor(100*(d.value/10223)) + " % of all respondents are " + convertName(d.name));
            })
            .on('mouseout', function(d) {
                $("#demoinfo").text("");
            });

        vis.node.append('rect')
            .attr('height', d => d.dy)
            .attr('width', vis.sankey.nodeWidth())
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
            .attr('x', 6 + vis.sankey.nodeWidth())
            .attr('text-anchor', 'start');


        function dragmove(d) {
            d3.select(this).attr('transform', `translate(${d.x},${d.y = Math.max(0, Math.min(vis.height - d.dy, d3.event.y))})`);
            vis.sankey.relayout();
            vis.link.attr('d', vis.path);
        }

        const linkExtent = d3.extent(demo.links, d => d.value);
        const frequencyScale = d3.scaleLinear().domain(linkExtent).range([0.05, 1]);
        const particleSize = d3.scaleLinear().domain(linkExtent).range([1, 5]);


        demo.links.forEach((link) => {
            link.freq = frequencyScale(link.value);
            link.particleSize = 2;
            link.particleColor = d3.scaleLinear().domain([0, 1])
                .range([link.source.color, link.target.color]);
        });

        const t = d3.timer(tick, 1000);
        let particles = [];


        function tick(elapsed, time) {
            particles = particles.filter(d => d.current < d.path.getTotalLength());

            vis.svg.selectAll('.link')
                .each(
                    function (d) {
                        // if (d.freq < 1) {
                        for (let x = 0; x < 2; x += 1) {
                            const offset = (Math.random() - 0.5) * (d.dy - 4);
                            if (Math.random() < d.freq) {
                                const length = this.getTotalLength();
                                particles.push({ link: d, time: elapsed, offset, path: this, length, animateTime: length, speed: 0.5 + (Math.random()) });
                            }
                        }
                        // }
                        /*
                            else {
                              for (var x = 0; x<d.freq; x++) {
                                var offset = (Math.random() - .5) * d.dy;
                                particles.push({link: d, time: elapsed, offset: offset, path: this})
                              }
                            }
                        */
                    });

            particleEdgeCanvasPath(elapsed);
        }

        function particleEdgeCanvasPath(elapsed) {
            const context = d3.select('#demovis canvas')
                .attr("x", 0)
                .attr("y", 0)
                .node().getContext('2d');

            context.clearRect(0, 0, 1000, 1000);

            context.fillStyle = 'gray';
            context.lineWidth = '1px';
            for (const x in particles) {
                if ({}.hasOwnProperty.call(particles, x)) {
                    const currentTime = elapsed - particles[x].time;
                    // var currentPercent = currentTime / 1000 * particles[x].path.getTotalLength();
                    particles[x].current = currentTime * 0.15 * particles[x].speed;
                    const currentPos = particles[x].path.getPointAtLength(particles[x].current);
                    context.beginPath();
                    context.fillStyle = particles[x].link.particleColor(0);
                    context.arc(currentPos.x, currentPos.y + particles[x].offset, particles[x].link.particleSize, 0, 2 * Math.PI);
                    context.fill();
                }
            }
        }

    });


    function convertName(name) {
        if (name == "Mixed") {
            return "mixed race";
        }
        else if (name == "Metro") {
            return "located in a city";
        }
        else if (name == "Non-Metro") {
            return "not located in a city";

        }
        else if (name == "15 to 24") {
            return "15-24 years old";

        }
        else if (name == "25 to 34") {
            return "25-34 years old";

        }
        else if (name == "35 to 44") {
            return "35-44 years old";

        }
        else if (name == "45 to 54") {
            return "45-54 years old";

        }
        else if (name == "55 to 64") {
            return "55-64 years old";

        }
        else if (name == "65+") {
            return "65+ years old";

        }
        else {
            return name.toLowerCase();
        }
    }

};