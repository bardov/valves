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
    this.handlers = {};
    this.debug(this.options)

    for (var device of this.options.valves) {
      if (device.name) {
        this.debug(`Configuring ${device.name} on pin ${device.pin}`);
        let handler = new ValveHandler(this, device);
        // this.subscribeVal(this.evtHeartbeat, handler.onHeartbeat, handler);
        this.handlers[device.pin] = handler;
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
     this.debug("onPluginStopped")
  }
  getHandler(pin) {
    var handler = this.handlers[pin]
    if (handler === undefined){
      throw `Cannot find handler for ${pin}`
    }
    return handler
  }

  registerWithRouter(router) {
    this.debug("Registering routes...");
    router.get("/api/devices", (req, res) => {
        if (this.running) {
          this.debug("fetching devices!")
          let jReturnVal = [];
          for (var key in this.handlers) {
            var handler = this.handlers[key] 
            let jval = {}
            jval["name"] = handler.device.name
            jval["pin"] = handler.device.pin
            jval["state"] = handler.state
            jReturnVal.push(jval);
          }
          this.debug(`Returning JSON value ${JSON.stringify(jReturnVal)}`)
          res.json(jReturnVal);
        }
        else {
          res.status(503).send('Plugin not running');
        }
      })
    router.get("/api/state", (req, res) => {
      console.log("request: ", req.query)
      this.debug("get state api: ",req, res, req.pin, req.body)
        if (this.running) {          
          let jReturnVal = {};
          var handler = this.handlers[req.query.pin]
          console.log("return pin state of ", handler.device)
          jReturnVal["pin"] = handler.pin
          jReturnVal["state"] = handler.get_pin_state()
          this.debug(`Returning JSON value ${JSON.stringify(jReturnVal)}`)
          res.json(jReturnVal);
        }
        else {
          res.status(503).send('Plugin not running');
        }
      })
    router.get("/api/set_state", (req, res) => {
        if (this.running) {
          this.debug("set state api for pin ", req.query)
          try {
            var handler = this.getHandler(req.query.pin)
          } catch (e) {
              console.error(e);
              res.status(503).send('device not found');
          }

          this.debug("found handler ", handler.pin)
          var state = handler.toggle_pin_state() 
          res.json({state})
        }
        else {
          res.status(503).send('Plugin not running');
        }

      })
  }

};


module.exports = function (app) {
  var plugin = new Valves(app);
  return plugin;
}