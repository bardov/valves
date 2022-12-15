

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
            
async function renderDevices() {
    let valves = await getDevices();
    console.log(valves)
    let html = '';
    valves.forEach(valve => {
        let htmlSegment = `<div class="valve">
                            <h2>${valve.name} ${valve.pin}
                            <button class="btn btn-primary">${valve.name}</button></h2>
                        </div>`;

        html += htmlSegment;
    });

    let container = document.getElementById('valvesDisplay');
    console.log("got container=", container)
    container.innerHTML = html;
}
            
renderDevices();

$(".btn").click(function(){
	$(this).toggleClass("btn-primary btn-danger");
});
