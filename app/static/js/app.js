// select the region
let region = d3.select("#region");

// add an event listener for a CHANGE
region.on("change", function () {
  //  console.log("Event Listener heard!! YAY!");

  // on change, do work
  doWork();
});

// get the new data
function doWork() {
  let inp_region = region.property("value");

  // grab the data
  let url = `/api/v1.0/${inp_region}`;

  // make request
  d3.json(url).then(function (data) {
    console.log(data);

    makeMap(data);
    makeBar(data);
    makeSunburst(data);
    makeBox(data);
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
    let marker = L.marker(location).bindPopup(`<h3>Magnitude: ${row.mag}</h3><br><h3>Date: ${row.month} ${row.dy}, ${row.yr}</h3`);
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
    orientation: "v",
    marker: {
      color: "#7DBA91"
    }
  }

  // Data array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: `Number of Tornados by State`,
    margin: { l: 50 },
    // colorway: ["#7DBA91", "#277A8C", "#3F908E", "#1B6488", "#5AA590", "#244B7F"],
    yaxis: {
      title: 'Number of tornadoes'}}

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", traces, layout);

}


function makeBox(data) {
  let traces = [];
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

  for (let i = 0; i < months.length; i++){

    let month = months[i];

    let trace = {
        y: data.box_data.filter(row=>row.month===month).map(row=>row.magnitude),
        type: "box",
        name: month,
          }

    traces.push(trace);

  }


    let layout = {
        title: `Tornado Magnitudes by Month`,
        margin: { l: 200 },
        colorway: ["#7DBA91", "#277A8C", "#3F908E", "#1B6488", "#5AA590", "#244B7F"],
        yaxis: {
          title: 'Magnitude of tornadoes'}
    }

    Plotly.newPlot("box", traces, layout)
}


function makeSunburst(data) {
  let trace = {
    "type": "sunburst",
    "labels": data.sunburst_data.map(row => row.label),
    "parents": data.sunburst_data.map(row => row.parent),
    "values":  data.sunburst_data.map(row => row.num_tornados),
    "leaf": {"opacity": 0.4},
    "marker": {"line": {"width": 2}},
    "branchvalues": 'total'
  }

  let traces = [trace];

  let layout = {
    "margin": {"l": 0, "r": 0, "b": 0},
    title: `Tornados by State and Region`,
    colorway: ["#7DBA91", "#277A8C", "#3F908E", "#1B6488", "#5AA590", "#244B7F"]
  }

  Plotly.newPlot("sunburst", traces, layout)
}
// INITIALIZE plot on page load
doWork();