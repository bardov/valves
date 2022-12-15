
class ValveHandler {
    constructor(skPlugin, device) {
        console.log("ValveHandler ctor", device)
        this.skPlugin = skPlugin;
        this.device = device;
        console.log("ValveHandler ctor ",this.device)
    }

    list() {
        console.log("list: ", this.config)
        fetch("/plugins/valves/api/devices")
            .then((res) => {
              return res.json()
            })
            .then(
              (data) => {
                this.setState({
                  isLoaded: true,
                  error: null,
                  devices: data,
                });
              },
              (error) => {
                this.setState({
                  isLoaded: true,
                  error,
                  devices: null
                });
              }
            )

        console.log("list: fetch result=", res)
        console.log("list: fetch data=", data)

        return `this is valve ${this.config.name} ${this.config.pin}`
    }
}

module.exports = ValveHandler;
