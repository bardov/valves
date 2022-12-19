

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

function addElement(name, pin, state) {
    console.log("addElement entered", pin, state)
    // create a new div element
    const textDiv = document.createElement("div");
    //textDiv.textContent = name
    textDiv.innerHTML = `<h2>${name}</h2>`

    const newDiv = document.createElement("div");
    const switch_name = `opencloseswitch${pin}`
    newDiv.className = "opencloseswitch"

    var newCheckBox = document.createElement('input');
    newCheckBox.className="opencloseswitch-checkbox"
    newCheckBox.type = 'checkbox';
    newCheckBox.name="opencloseswitch" 
    newCheckBox.checked = state
    newCheckBox.id = switch_name; // need unique Ids!
    newCheckBox.tabIndex = 0
    newCheckBox.addEventListener("click", function() {
        toggle(pin);
    });

    var newCheckBoxLabel = document.createElement('label')
    newCheckBoxLabel.className = "opencloseswitch-label"
    newCheckBoxLabel.htmlFor = switch_name

    var span1 = document.createElement('span')
    span1.className = "opencloseswitch-inner"  

    var span2 = document.createElement('span')
    span2.className = "opencloseswitch-switch"
    newCheckBoxLabel.appendChild(span1)
    newCheckBoxLabel.appendChild(span2)
    // add the text node to the newly created div
    newDiv.appendChild(newCheckBox);
    newDiv.appendChild(newCheckBoxLabel)

    // add the newly created element and its content into the DOM
    const currentDiv = document.getElementById('createdValvesDisplay')
    document.body.insertBefore(textDiv, currentDiv);
    document.body.insertBefore(newDiv, currentDiv);

    console.log("addElement exit")
  }

async function createDevices() {
    let valves = await getDevices();
    console.log("creating devices", valves)
    valves.forEach(valve => {
        addElement(valve.name, valve.pin, valve.state)
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
                                <input class="opencloseswitch-checkbox" type="checkbox" name="opencloseswitch" value=${valve.state} id=${switch_name} onclick="toggle(${valve.pin})" tabindex="0">
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
            
//renderDevices()
createDevices()


