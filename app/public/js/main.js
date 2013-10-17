/*global d3*/
(function (){
  'use strict';

  var app = {};

  // function name(d) { return d.name; }
  function group(d) { return d.group; }

  var color = d3.scale.category10();
  function colorByGroup(d) { return color(group(d)); }

  function start() {
    link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
    link.enter().insert("line", ".node").attr("class", "link");
    link.exit().remove();

    node = node.data(force.nodes(), function(d) { return d.id;});
    node.enter().append("circle")
      .attr("class", function(d) { return "node " + d.id; })
      .attr("r", 8)
      .attr('fill', colorByGroup);
    node.exit().remove();

    force.start();
  }

  function tick() {
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

  var width = $(window).width(),
      height = $(window).height();

  var nodes = [],
      links = [];

  var force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .charge(-400)
      .linkDistance(120)
      .size([width, height])
      .on("tick", tick);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var node = svg.selectAll(".node"),
      link = svg.selectAll(".link");

  // 1. Add three nodes and three links.
  setTimeout(function() {
    var a = {id: "a", group: 1}, b = {id: "b", group: 1}, c = {id: "c", group: 2};
    nodes.push(a, b, c);
    links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});
    start();
  }, 0);

  // 2. Remove node B and associated links.
  setTimeout(function() {
    nodes.splice(1, 1); // remove b
    links.shift(); // remove a-b
    links.pop(); // remove b-c
    start();
  }, 3000);

  // Add node B back.
  setTimeout(function() {
    var a = nodes[0], b = {id: "b", group: 1}, c = nodes[1];
    nodes.push(b);
    links.push({source: a, target: b}, {source: b, target: c});
    start();
  }, 6000);

  app.nodes = nodes;
  app.links = links;

  // var svg = d3.select('#viz')
  //     .append('svg')
  //     .attr('width', width)
  //     .attr('height', height);

  // var node, link;

  // var voronoi = d3.geom.voronoi()
  //     .x(function(d) { return d.x; })
  //     .y(function(d) { return d.y; })
  //     .clipExtent([[-10, -10], [width+10, height+10]]);

  // function recenterVoronoi(nodes) {
  //   var shapes = [];
  //   voronoi(nodes).forEach(function(d) {
  //     if (!d.length) {
  //       return;
  //     }

  //     var n = [];
  //     d.forEach(function(c) {
  //       n.push([ c[0] - d.point.x, c[1] - d.point.y ]);
  //     });
  //     n.point = d.point;
  //     shapes.push(n);
  //   });
  //   return shapes;
  // }

  // var force = d3.layout.force()
  //     .charge(-2000)
  //     .friction(0.3)
  //     .linkDistance(50)
  //     .size([width, height]);

  // function updateGraph(data) {
  //   data.nodes.forEach(function(d, i) {
  //     d.id = i;
  //   });

  //   link = svg.selectAll('.link')
  //       .data( data.links )
  //     .enter().append('line')
  //       .attr('class', 'link')
  //       .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  //   node = svg.selectAll('.node')
  //       .data( data.nodes )
  //     .enter().append('g')
  //       .attr('title', name)
  //       .attr('data-id', function(d, i) {
  //         return i;
  //       })
  //       .attr('data-group', function(d, i) {
  //         return d.group;
  //       })
  //       .attr('class', 'node')
  //       .call( force.drag );

  //   node.append('circle')
  //       .attr('r', 30)
  //       .attr('fill', colorByGroup)
  //       .attr('fill-opacity', 0.5);

  //   node.append('circle')
  //       .attr('r', 4)
  //       .attr('stroke', 'black');

  //   force.on('tick', function() {
  //     node.attr('transform', function(d) { return 'translate('+d.x+','+d.y+')'; })
  //         .attr('clip-path', function(d) { return 'url(#clip-'+d.index+')'; });

  //     link.attr('x1', function(d) { return d.source.x; })
  //         .attr('y1', function(d) { return d.source.y; })
  //         .attr('x2', function(d) { return d.target.x; })
  //         .attr('y2', function(d) { return d.target.y; });

  //     var clip = svg.selectAll('.clip')
  //         .data( recenterVoronoi(node.data()), function(d) { return d.point.index; } );

  //     clip.enter().append('clipPath')
  //         .attr('id', function(d) { return 'clip-'+d.point.index; })
  //         .attr('class', 'clip');
  //     clip.exit().remove();

  //     clip.selectAll('path').remove();
  //     clip.append('path')
  //         .attr('d', function(d) { return 'M'+d.join(',')+'Z'; });
  //   });

  //   force
  //     .nodes( data.nodes )
  //     .links( data.links )
  //     .start();

  //   app.data = data;
  // }

  // d3.json('mini.json', function(err, data) {
  //   if (data) {
  //     updateGraph(data);
  //   }
  // });

  $(function() {
    // $('.node').dblclick(function() {
    //   var id = $(this).data("id");
    //   var group = $(this).data("group");
    //   console.log(id, group, this);

    //   // New node
    //   app.data.nodes.push({
    //     name: "new",
    //     group: group
    //   });

    //   // Connect new node to the clicked node
    //   app.data.links.push({
    //     source: id,
    //     target: app.data.nodes.length - 1,
    //     value: 1
    //   });

    //   updateGraph(app.data);
    // });

    // Expose data for debugging
    window.app = app;
  });

})();