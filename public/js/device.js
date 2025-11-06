const socket = io();

const statusEl = document.getElementById("status");

function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
}

if (navigator.geolocation) {
  setStatus("Requesting location permission...");
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
      setStatus(`Sharing: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    },
    (error) => {
      console.error(error);
      setStatus("Error: " + error.message);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
  );
} else {
  setStatus("Geolocation is not supported by this browser.");
}


