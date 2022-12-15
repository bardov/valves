const Bacon = require('baconjs');
const SignalKPlugin = require('signalk-plugin-base');
const ValveHandler = require('./ValveHandler.js');

//let handler = new ValveHandler(this, device);

class Valves extends SignalKPlugin {

  constructor(app) {
    super(app, 'valves', 'Valves', 'Control valves')
    this.debug("Valves ctor")
    this.optObj({propName: 'valves', title: 'Controllable valves', 
                isArray: true, itemTitle: 'Valve'})
    this.optStr({propName: 'name', title: 'Valve name'})
    this.optInt({propName: 'pin', title: 'GPIO pin', 
                longDescription: 'Controlling pin'})
    this.optObjEnd();
    this.debug(this.options)
  }


  // Initialization of data streams and properties are done here...
  onPluginStarted() {
    this.debug("onPluginStarted")
    this.handlers = [];
    this.debug(this.options)

    for (var device of this.options.valves) {
      if (device.name) {
        this.debug(`Configuring device ${device.name} on pin ${device.pin}`);
        let handler = new ValveHandler(this, device);
        // this.subscribeVal(this.evtHeartbeat, handler.onHeartbeat, handler);
        this.handlers.push(handler);
      }
    }



    this.setStatus('Started');

          
     // This is for API demonstration only (see registerWithRouter())
     this.apiTestData = {};
     

  }


  onPluginStopped() {
     // Here is where you clean up things done in onPluginStarted() OTHER THAN
     // subscriptions created by calling subscribeVal() (those are cleaned up
     // automatically).
     this.debug("onPluginStoppef")
  }



  /**
   * This is where RESTul API call responses are defined...
   * @param {object} router An ExpressJS "Router" object
   * @see https://expressjs.com/en/guide/routing.html
   */
  registerWithRouter(router) {

    this.debug("Registering routes...");
    router.get("/api/valves", (req, res) => {
        if (this.running) {
          let jReturnVal = this.apiTestData;
          this.debug(`Returning JSON value ${JSON.stringify(jReturnVal)}`)
          res.json(jReturnVal);
        }
        else {
          res.status(503).send('Plugin not running');
        }
    });
  }


};


module.exports = function (app) {
  var plugin = new Valves(app);
  return plugin;
}