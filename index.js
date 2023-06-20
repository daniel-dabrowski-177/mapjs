let lat1;
let lng1;
let display_name1;

let lat2;
let lng2;
let display_name2;

// Autocomplete Input
// minimal configure

new Autocomplete("search1", {
  // default selects the first item in
  // the list of results
  selectFirst: false,

  // The number of characters entered should start searching
  howManyCharacters: 1,

  // onSearch
  onSearch: ({ currentValue }) => {
    const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
      currentValue
    )}`;

    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.features);
          console.log(api);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  // nominatim GeoJSON format parse this part turns json into the list of
  // records that appears when you type.
  onResults: ({ currentValue, matches, template }) => {
    const regex = new RegExp(currentValue, "gi");

    // if the result returns 0 we
    // show the no results element
    return matches === 0
      ? template
      : matches
          .map((element) => {
            return `
          <li class="loupe">
            <p>
              ${element.properties.display_name.replace(
                regex,
                (str) => `<b>${str}</b>`
              )}
            </p>
          </li> `;
          })
          .join("");
  },

  // we add an action to enter or click
  onSubmit: ({ object }) => {
    // remove all layers from the map
    map.eachLayer(function (layer) {
      if (!!layer.toGeoJSON) {
        map.removeLayer(layer);
      }
    });

    const { display_name } = object.properties;
    const [lng, lat] = object.geometry.coordinates;
    const marker = L.marker([lat, lng], {
      title: display_name,
    });

    marker.addTo(map).bindPopup(display_name);
    map.setView([lat, lng], 8);

    display_name1 = display_name;
    sessionStorage.setItem("display_name1", display_name);
    lat1 = lat;
    sessionStorage.setItem("lat1", lat);
    lng1 = lng;
    sessionStorage.setItem("lng1", lng);
  },

  // get index and data from li element after
  // hovering over li with the mouse or using
  // arrow keys ↓ | ↑
  onSelectedItem: ({ index, element, object }) => {
    console.log("onSelectedItem:", index, element, object);
  },

  // the method presents no results element
  noResults: ({ currentValue, template }) =>
    template(`<li>No results found: "${currentValue}"</li>`),
});

///////////////////////////////////////////////////////////////////////////////////////////////////

new Autocomplete("search2", {
  // default selects the first item in
  // the list of results
  selectFirst: false,

  // The number of characters entered should start searching
  howManyCharacters: 1,

  // onSearch
  onSearch: ({ currentValue }) => {
    const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
      currentValue
    )}`;

    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.features);
          console.log(api);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  // nominatim GeoJSON format parse this part turns json into the list of
  // records that appears when you type.
  onResults: ({ currentValue, matches, template }) => {
    const regex = new RegExp(currentValue, "gi");

    // if the result returns 0 we
    // show the no results element
    return matches === 0
      ? template
      : matches
          .map((element) => {
            return `
          <li class="loupe">
            <p>
              ${element.properties.display_name.replace(
                regex,
                (str) => `<b>${str}</b>`
              )}
            </p>
          </li> `;
          })
          .join("");
  },

  // we add an action to enter or click
  onSubmit: ({ object }) => {
    // remove all layers from the map
    map.eachLayer(function (layer) {
      if (!!layer.toGeoJSON) {
        map.removeLayer(layer);
      }
    });

    const { display_name } = object.properties;
    const [lng, lat] = object.geometry.coordinates;
    const marker = L.marker([lat, lng], {
      title: display_name,
    });

    marker.addTo(map).bindPopup(display_name);
    map.setView([lat, lng], 8);

    display_name2 = display_name;
    sessionStorage.setItem("display_name2", display_name);
    lat2 = lat;
    sessionStorage.setItem("lat2", lat);
    lng2 = lng;
    sessionStorage.setItem("lng2", lng);
  },

  // get index and data from li element after
  // hovering over li with the mouse or using
  // arrow keys ↓ | ↑
  onSelectedItem: ({ index, element, object }) => {
    console.log("onSelectedItem:", index, element, object);
  },

  // the method presents no results element
  noResults: ({ currentValue, template }) =>
    template(`<li>No results found: "${currentValue}"</li>`),
});

////////////////////////////////////////////////////////////////////

display_name1 = sessionStorage.getItem("display_name1");
display_name2 = sessionStorage.getItem("display_name2");

lat1 = sessionStorage.getItem("lat1");
lat2 = sessionStorage.getItem("lat2");

lng1 = sessionStorage.getItem("lng1");
lng2 = sessionStorage.getItem("lng2");

// Map Renderer
let a = L.latLng(lat1, lng1);
let b = L.latLng(lat2, lng2);

var map = L.map("map", {
  center: [50.06143, 19.93658],
  zoom: 12,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OSM",
}).addTo(map);

var routeControl = L.Routing.control({
  waypoints: [a, b],
  routeWhileDragging: false,
  autoRoute: true,
  useZoomParameter: false,
  draggableWaypoints: false,
  show: false,
  addWaypoints: false,
}).addTo(map);

///////////////////////////////////////////////////////////////////////////

routeControl.on("routesfound", function (e) {
  var routes = e.routes;
  var summary = routes[0].summary;

  let start = document.querySelector(".start");
  start.textContent = display_name1;

  let direction = document.querySelector(".direction");
  direction.textContent = display_name2;

  let distance = document.querySelector(".distance");
  distance.textContent = Math.round(summary.totalDistance / 1000);

  let time = document.querySelector(".time");
  time.textContent = Math.round((summary.totalTime / 3600) * 60);

  let cost = document.querySelector(".cost");
});

//////////////////////////////////////////////////////////////////////////

// Create history element
let route = document.createElement("li");
route.classList.add("route");

let from = document.createElement("div");
from.classList.add("from");
from.textContent = display_name1;
route.append(from);

let p = document.createElement("p");
p.textContent = "-";
route.append(p);

let to = document.createElement("div");
to.classList.add("to");
to.textContent = display_name2;
route.append(to);

console.log(route);

let routesContainer = document.querySelector(".routes-container");
routesContainer.append(route);

let startArr = [];
let dirArr = [];

startArr.push(display_name1);
startArr.push(display_name1);
startArr = JSON.stringify(startArr);

dirArr.push(display_name1);
dirArr.push(display_name1);
dirArr = JSON.stringify(dirArr);

sessionStorage.setItem("startArr", startArr);
startArr = sessionStorage.getItem("startArr");

sessionStorage.setItem("dirArr", dirArr);
dirArr = sessionStorage.getItem("dirArr");
