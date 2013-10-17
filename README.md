# Journey

Code for "[A journey through modern day web development](https://slid.es/taktran/modern-day-web-dev)" presentation.

A website built using [generator-starttter](https://github.com/taktran/generator-starttter).

## Development

Start the server

    grunt

View the site at [http://localhost:7770](http://localhost:7770), or your local (internal) ip address (useful for testing on other devices). You can also run

    grunt open

To run the site on another port, use the `port` flag eg,

    grunt --port=3000

To run the site using a different livereload port (default is `35729`), use the `lrp` flag (prevents this error: `Fatal error: Port 35729 is already in use by another process.`) eg,

    grunt --lrp=35720

## Hardware

To enable the hardware features

1. Set up the arduino
  * [Photoresister](https://github.com/rwaldron/johnny-five/blob/master/docs/photoresistor.md) (pin A3)
  * Pressure sensor, with similar set up to photoresister, except on pin A4
  * RGB light - pins 9, 10, 11
2. Find your arduino port, and update the port in `bin/hardware-server.js` (some machines don't require it though):

        five.Board({
          port: "port name from"
        });

3. Start the hardware server

        node bin/hardware-server.js

4. Check the `Hardware` check box on the front end to enable features

To start the RGB lights demo

    node bin/rbg-lights.js

## Testing

Uses [karma](http://karma-runner.github.io/) and [jasmine](http://pivotal.github.io/jasmine/).

Karma is run automatically when `grunt` is called. To run it manually

    karma start config/karma.conf.js

For continuous integration, run

    grunt ci:test

    # Or,

    npm test
