// select the dropdown
let dropdown = d3.select("#dropdown");

// add an event listener for a CHANGE
dropdown.on("change", function () {
  //  console.log("Event Listener heard!! YAY!");

  // on change, do work
  doWork();
});

// get the new data
function doWork() {
  let inp_state = dropdown.property("value");

  // grab the data
  let url = `/api/v1.0/${inp_state}`;

  // make request
  d3.json(url).then(function (data) {
    console.log(data);

    makeMap(data);
    makeBar(data);
    makeLine(data);
  });
}

function makeMap(data) {
  // Step 0: recreate the map html
  // Select the map_container div
  let mapContainer = d3.select("#map_container");

  // Empty the map_container div
  mapContainer.html("");

  // Append a div with id "map" inside the map_container div
  mapContainer.append("div").attr("id", "map");

  // Step 1: Define your BASE Layers

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Step 2: Create the OVERLAY (DATA) Layers
  // Create a new marker cluster group.
  let markerLayer = L.markerClusterGroup();
  let markers = [];

  // Loop through the data.
  for (let i = 0; i < data.map_data.length; i++){

    // Set the data location property to a variable.
    let row = data.map_data[i];

    // Get Lat/Long
    let latitude = row.slat;
    let longitude = row.slon;
    let location = [latitude, longitude];

    // Add a new marker to the cluster group, and bind a popup.
    let marker = L.marker(location).bindPopup(`<h3>${row.st}</h3>`);
    markerLayer.addLayer(marker);

    // for the heatmap
    markers.push(location);
  }

  let heatLayer = L.heatLayer(markers);

  // Step 3: Create the MAP object

  // Create a map object, and set the default layers.
  let myMap = L.map("map", {
    center: [32.7767, -96.7970],
    zoom: 4,
    layers: [street, markerLayer]
  });

  // Step 4: Add the Layer Controls (Legend goes here too)

  // Only one base layer can be shown at a time.
  let baseMaps = {
    Street: street,
    Topography: topo
  };

  // Overlays that can be toggled on or off
  let overlayMaps = {
    Markers: markerLayer,
    HeatMap: heatLayer
  };

  // Pass our map layers into our layer control.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

function makeBar(data) {

  // Trace for the Data
  let trace = {
    x: data.bar_data.map(row => row.state),
    y: data.bar_data.map(row => row.num_tornados),
    type: "bar",
    orientation: "v"
  }

  // Data array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: `Number of Tornados by State`,
    margin: { l: 200 }}

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", traces, layout);

}

// INITIALIZE plot on page load
doWork();

function makeLine(data) {
    let trace = {
        x: data.line_data.map(row => row.mo).reverse(),
        y: data.line_data.map(row=>row.mag).reverse(),
        type: "scatter"
    }

    let traces = [trace];

    let layout = {
        title: `Tornado Magnitudes by Month`,
        margin: { l: 200 }
    }

    Plotly.newPlot("line", traces, layout)
}
// INITIALIZE plot on page load
doWork();