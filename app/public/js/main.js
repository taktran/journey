/*global d3, Primus*/
(function (){
  'use strict';

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
      .attr('data-id', function(d, i) { return i; })
      .attr('data-group', function(d) { return d.group; })
      .attr("r", 20)
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
  function init() {
    var a = {id: "a", group: 1},
      b = {id: "b", group: 2},
      c = {id: "c", group: 3};
    nodes.push(a, b, c);
    links.push({source: a, target: b}, {source: a, target: c}, {source: b, target: c});
    start();
  }

  init();

  $(function() {

    // ----------------------------------------
    // Web sockets server
    // ----------------------------------------
    var PRIMUS_URL = 'http://localhost:9999/',
        primus = Primus.connect(PRIMUS_URL);

    primus.on('open', function open() {
      console.log('Connection open');
    });

    primus.on('error', function error(err) {
      console.error('Error:', err, err.message);
    });

    primus.on('reconnect', function () {
      console.log('Reconnect attempt started');
    });

    primus.on('reconnecting', function (opts) {
      console.log('Reconnecting in %d ms', opts.timeout);
      console.log('This is attempt %d out of %d', opts.attempt, opts.retries);
    });

    primus.on('end', function () {
      console.log('Connection closed');
    });

    primus.on('data', function message(data) {
      console.log(data);
    });

    // ----------------------------------------
    // Interaction
    // ----------------------------------------

    $('.node').dblclick(function() {
      var clickedNode = $(this).data('id'),
        clickedNodeGroup = $(this).data('group'),
        newNodeId = nodes.length - 1, // Last on list
        newNode = {id: newNodeId, group: clickedNodeGroup};

      nodes.push(newNode);
      links.push({source: clickedNode, target: newNode});

      primus.write("hello");

      start();
    });

    // ----------------------------------------
    // Debugging
    // ----------------------------------------

    window.app = {
      nodes: nodes,
      links: links
    };
  });

})();