const socket = io();

const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markersById = {};
const deviceListEl = document.getElementById("device-list");

function updateDeviceList() {
  if (!deviceListEl) return;
  deviceListEl.innerHTML = "";
  Object.entries(markersById).forEach(([id, entry]) => {
    const li = document.createElement("li");
    const { latitude, longitude } = entry;
    li.textContent = `${id.slice(0, 6)}... → ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    deviceListEl.appendChild(li);
  });
}

function fitToAllMarkers() {
  const latLngs = Object.values(markersById).map((m) => m.marker.getLatLng());
  if (latLngs.length === 0) return;
  const bounds = L.latLngBounds(latLngs);
  map.fitBounds(bounds.pad(0.2), { animate: true });
}

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  if (markersById[id]) {
    markersById[id].marker.setLatLng([latitude, longitude]);
    markersById[id].latitude = latitude;
    markersById[id].longitude = longitude;
  } else {
    const marker = L.marker([latitude, longitude]).addTo(map);
    markersById[id] = { marker, latitude, longitude };
  }
  updateDeviceList();
  fitToAllMarkers();
});

socket.on("user-disconnected", (id) => {
  if (markersById[id]) {
    map.removeLayer(markersById[id].marker);
    delete markersById[id];
    updateDeviceList();
    fitToAllMarkers();
  }
});


