

console.log("list_valves is running")

//const DeviceHandler = require('ValveHandler.js');
//let handler = new ValveHandler(this, device);
//let response = await fetch("/plugins/valves/api/devices")
/*             .then((response) => response.json())
            .then(
              (data) => {
                console.log("got data from fetch devices", data)
                return data
                },
              (error) => {
                console.log("caught an error of fetch devices", error)
              }
            ) */

async function getDevices() {
    let url = "/plugins/valves/api/devices"
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function getDeviceState(pin) {
    let url = `/plugins/valves/api/state/?pin=${pin}`
    try {
        let res = await fetch(url);
        console.log("getDeviceState got ", res)
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderSingleDevice(valve) {
    let pinState = await getDeviceState(valve.pin)
    let htmlSegment = `<div class="valve">
                            <h2>${valve.name} ${valve.pin} state ${pinState}
                            <button class="btn btn1">${valve.name}</button></h2>
                        </div>`

    return htmlSegment;
}

async function renderDevices() {
    let valves = await getDevices();
    console.log("rendering devices", valves)
    let html = '';
    valves.forEach(valve => {
//        html += renderSingleDevice(valve)
//      let pinState = await getDeviceState(valve.pin)
        let switch_name = `opencloseswitch${valve.pin}`
        let htmlSegment = `<div class="valve">
                            <h2>${valve.name} pin ${valve.pin} state ${valve.state}
                            <div class="opencloseswitch">
                                <input type="checkbox" name=${switch_name} class="opencloseswitch-checkbox" id="myopencloseswitch" tabindex="0" checked>
                                <label class="opencloseswitch-label" for="myopencloseswitch">
                                <span class="opencloseswitch-inner"></span>
                                <span class="opencloseswitch-switch"></span>
                            </label>
                            </div>
                        </div>`;

        html += htmlSegment;
    });

    let container = document.getElementById('valvesDisplay');
    console.log("got container=", container)
    container.innerHTML = html;
}
            
renderDevices();

/* $(".btn").click(function(){
	$(this).toggleClass("btn-primary btn-danger");
}); */
