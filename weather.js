const API_KEY = "6ed570ac911dad2a255e2965a53ced74";
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");

function fetchWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) return alert("Enter a city name");

  // Current Weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      showWeather(data);
      showMap(data.coord.lat, data.coord.lon);
      fetchForecast(city);
    })
    .catch(() => alert("City not found"));
}

function showWeather(data) {
  weatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="weather-icon">
    <p><strong>${data.weather[0].description}</strong></p>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
  `;
}

function fetchForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      let html = "<h3>3-Day Forecast</h3>";
      const used = new Set();
      data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!used.has(date) && used.size < 3) {
          used.add(date);
          html += `
            <div style="background:#fff3; margin:10px; padding:10px; border-radius:8px;">
              <strong>${date}</strong><br>
              <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png" width="50">
              <p>${entry.weather[0].description}</p>
              <p>${entry.main.temp}°C</p>
            </div>
          `;
        }
      });
      forecastDiv.innerHTML = html;
    });
}

function showMap(lat, lon) {
  document.getElementById("map").innerHTML = "";
  const map = L.map("map").setView([lat, lon], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  L.marker([lat, lon]).addTo(map).bindPopup("Location").openPopup();
}
