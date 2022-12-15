
class ValveHandler {
    constructor(skPlugin, config) {
        console.log("ValveHandler ctor", config)
        this.skPlugin = skPlugin;
        this.config = config;
        //this.id = _.camelCase(config.name);
        // this.id = _.camelCase(config.name); // WTF?

        console.log("ValveHandler ctor ",this.config)
    }

    list() {
        return "this is list"
    }
}

module.exports = ValveHandler;
