// Server to connect to hardware

'use strict';

var five = require("johnny-five");

five.Board({
  port: "/dev/cu.usbmodem621" // tmac top usb
  // port: "/dev/cu.usbmodem411" // tmac bottom usb
}).on("ready", function() {

  // --------------------------------------------
  // Hardware setup
  // --------------------------------------------

  var rgb = new five.Led.RGB([ 9, 10, 11 ]);

  // --------------------------------------------
  // Real time connection
  // --------------------------------------------

  var Primus = require('primus'),
      http = require('http');

  var server = http.createServer(),
    primus = new Primus(server, {
      transformer: 'sockjs'
    });

  primus.on('connection', function(spark) {
    console.log('connection:\t', spark.id);

    spark.on('data', function(data) {
      console.log(data);

      rgb.color(data);
    });
  });

  primus.on('disconnection', function(spark) {
    console.log('disconnection:\t', spark.id);
  });

  console.log(' [*] Listening on 0.0.0.0:9999' );
  server.listen(9999, '0.0.0.0');

});
