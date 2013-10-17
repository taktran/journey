// Server to connect to hardware

'use strict';

var Primus = require('primus'),
    http = require('http');

var server = http.createServer(),
  primus = new Primus(server, {
    transformer: 'sockjs'
  });

primus.on('connection', function(spark) {
  console.log('connection:\t', spark.id);

  spark.on('data', function(data) {
    spark.write("Server says '" + data + "'");
  });
});

primus.on('disconnection', function(spark) {
  console.log('disconnection:\t', spark.id);
});

console.log(' [*] Listening on 0.0.0.0:9999' );
server.listen(9999, '0.0.0.0');