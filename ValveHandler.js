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
        this.toggle_pin_state()
        console.log(`ValveHandler toggled pin ${device.pin} to ${this.state}`)
    }

    get_pin_state() {
        return this.gpio.readSync()
    }

    toggle_pin_state() {
        var current_state = this.state
        this.gpio.writeSync(this.state ^ 1)
        this.state = this.get_pin_state()

        console.log(`set pin ${this.pin} from state ${current_state} to ${this.state}`)
        return this.state
    }
}

module.exports = ValveHandler;
