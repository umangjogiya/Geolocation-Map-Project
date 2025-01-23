document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([0, 0], 13); // Initial map view
  // var polygon = L.polygon([
  //   [51.509, -0.08],
  //   [51.503, -0.06],
  //   [51.51, -0.047]
  //   ]).addTo(map);

  // Add Open Street Map 
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Elements
  const locationList = document.getElementById("location-list");
  const locationDetails = document.getElementById("location-details");
  const modeSelect = document.getElementById("mode-select");
  const submitButton = document.getElementById("submit-button");
  const savedActivities = document.getElementById("saved-activities");

  // Save form data to the localStorage
  function saveFormData(data) {
    let formDataList = JSON.parse(localStorage.getItem("formData")) || [];
    formDataList.push(data);
    localStorage.setItem("formData", JSON.stringify(formDataList));
    displaySavedFormData();
  }

  // Display the data
  function displaySavedFormData() {
    const formDataList = JSON.parse(localStorage.getItem("formData")) || [];
    savedActivities.innerHTML = ""; // Clear previous content

    formDataList.forEach((formData, index) => {
      const div = document.createElement("div");
      div.className = "form-data";
      div.innerHTML = `
        <p><strong>Activity ${index + 1}:</strong></p>
        <p>Mode: ${formData.mode}</p>
        <p>Speed: ${formData.speed} || Distance: ${formData.distance}</p>
        <p>Time: ${formData.time} || Pace: ${formData.pace}</p>
        <hr>
      `;
      savedActivities.appendChild(div);
    });
  }

  // Save location to localStorage
  function saveLocation(lat, lng) {
    let locations = JSON.parse(localStorage.getItem("locations")) || [];
    locations.push({ latitude: lat, longitude: lng });
    localStorage.setItem("locations", JSON.stringify(locations));
    displaySavedLocations();
  }

  // Display saved field locations data
  function displaySavedLocations() {
    const locations = JSON.parse(localStorage.getItem("locations")) || [];
    locations.forEach((loc) => {
      L.marker([loc.latitude, loc.longitude]).addTo(map)
        // .bindPopup(`Saved Location: Lat: ${loc.latitude}, Lng: ${loc.longitude}`)     // 
        .openPopup();
    });
  }

  // Submit button to save 
  submitButton.addEventListener("click", () => {
    const mode = modeSelect.value;
    const speed = document.getElementById("speed-input").value.trim();
    const distance = document.getElementById("distance-input").value.trim();
    const time = document.getElementById("time-input").value.trim();
    const pace = document.getElementById("pace-input").value.trim();

    if (!mode || !speed || !distance || !time || !pace) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    const formData = { mode, speed, distance, time, pace };
    saveFormData(formData);
  });

  // Show current location on the map
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude]).addTo(map)
          .bindPopup("You are here!")
          .openPopup();
      },
      () => {
        alert("Unable to retrieve your location");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }

  // Handle map click to save and display location
  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    L.marker([lat, lng]).addTo(map)
      .bindPopup("New Location")
      .openPopup();
    saveLocation(lat, lng);
    locationDetails.style.display = "block";
  });

  // page load to saved data and display to the map
  displaySavedFormData();
  displaySavedLocations();
});
