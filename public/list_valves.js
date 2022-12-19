

console.log("list_valves is running")


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

async function setDeviceState(pin, new_state) {
    let url = `/plugins/valves/api/set_state/?pin=${pin}`
    try {
        let res = await fetch(url, {
            headers: {
              'Content-Type': 'application/json'
            },
          });
          var result = await res.json()
          new_state = result.state
    } catch (error) {
        console.log(error);
        return new_state ^ 1
    }
    console.log("setDeviceState got new state=", new_state)
    return new_state
}

async function renderSingleDevice(valve) {
    let pinState = await getDeviceState(valve.pin)
    let htmlSegment = `<div class="valve">
                            <h2>${valve.name} ${valve.pin} state ${pinState}
                            <button class="btn btn1">${valve.name}</button></h2>
                        </div>`

    return htmlSegment;
}

function addElement(switch_name, state) {
    // create a new div element
    const newDiv = document.createElement("div");
    var newCheckBox = document.createElement('input');
    newCheckBox.type = 'checkbox';
    newCheckBox.id = switch_name; // need unique Ids!
    newCheckBox.name="opencloseswitch" 
    newCheckBox.className="opencloseswitch-checkbox"
    newCheckBox.value = state

  
    // add the text node to the newly created div
    newDiv.appendChild(newCheckBox);
  
    // add the newly created element and its content into the DOM
    const currentDiv = document.getElementById('createdValvesDisplay')
    document.body.insertBefore(newDiv, currentDiv);
  }

async function createDevices() {
    let valves = await getDevices();
    console.log("creating devices", valves)
    valves.forEach(valve => {
        let switch_name = `opencloseswitch_${valve.pin}`
        addElement(switch_name, valve.state)
    })
}

async function renderDevices() {
    let valves = await getDevices();
    console.log("rendering devices", valves)
    let html = '';
    valves.forEach(valve => {
        let switch_name = `opencloseswitch${valve.pin}`
        let checked = valve.state
        console.log(`rendering ${valve.pin} as ${valve.state}`)
        let htmlSegment = `<div class="valve">
                            <h2>${valve.name} pin ${valve.pin} state ${valve.state}
                            <div class="opencloseswitch">
                                <input type="checkbox" onclick="toggle(${valve.pin})" value=${valve.state} name="opencloseswitch" class="opencloseswitch-checkbox" id=${switch_name} tabindex="0">
                                <label class="opencloseswitch-label" for=${switch_name}>
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

async function toggle(pin) {
    var elm = document.getElementById(`opencloseswitch${pin}`);
    var new_state = await setDeviceState(pin, elm.value ^ 1)
    console.log("current state", elm.value, "new state ", new_state)
    elm.value = new_state
}
            
renderDevices()
createDevices()


