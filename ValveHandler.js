const Gpio = require('onoff').Gpio;
// led on pin 16 BCM #23

function test(pin) {

    led.writeSync(current_value ^ 1);
    new_value = led.readSync()
    console.log(`toggled led, was ${current_value} now ${new_value}`)
}

class ValveHandler {
    constructor(skPlugin, device) {
        console.log("ValveHandler ctor", device)
        this.skPlugin = skPlugin;
        this.device = device;
        this.gpio = new Gpio(this.device.pin, 'out')
        this.state = this.get_pin_state()
        console.log("ValveHandler ctor ",this)
        this.toggle()
        console.log("ValveHandler toggled ", device.pin)
    }

    get_pin_state() {
        return this.gpio.readSync()
    }

    set_pin_state(new_state) {
        if (new_state != this.state){
            this.gpio.writeSync(new_state)
            this.state = this.get_pin_state()
        }
    }
   
    toggle() {
        let current_value = this.state
        this.set_pin_state(this.state ^ 1);
        console.log(`toggled led, was ${current_value} now ${this.state}`)
    }
}

module.exports = ValveHandler;
