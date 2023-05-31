const API_KEY = "1ea934c058219b664274ecaee6cad097";

function getWeather(cityName) {
   const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const temperatureHigh = data.main.temp_max;
      const temperatureLow = data.main.temp_min;
      const forecast = data.weather[0].description;
      const humidity = data.main.humidity;

      // Convert temperature from Kelvin to Fahrenheit
      const temperatureHighF = (temperatureHigh - 273.15) * 9/5 + 32;
      const temperatureLowF = (temperatureLow - 273.15) * 9/5 + 32;

      // Display weather data on the page
      const weatherDataElem = document.getElementById("weather-data");
      weatherDataElem.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p><strong>High Temperature:</strong> ${temperatureHighF.toFixed(1)}°F</p>
        <p><strong>Low Temperature:</strong> ${temperatureLowF.toFixed(1)}°F</p>
        <p><strong>Forecast:</strong> ${forecast}</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
      `;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Handle form submission
const wformElem = document.querySelector('.weather-form');
wformElem.addEventListener('submit', (event) => {
  event.preventDefault();
  const cityName = document.getElementById('city-name-input').value;
  getWeather(cityName);
});

let song;
let playSong;

// Set Spotify credentials
const clientId = "3601611d1d054ff09cc0a7285504ca09";
const clientSecret = "bc962e70cc224966b6e5b1efb586c6b1";

const getToken = async () => {
  const result = await fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });

  // Access to the given data by the fetch request
  const data = await result.json();
  console.log(data.access_token);
  return data.access_token;
};

const getCityImage = async (city_name) => {
  // Get city image from an API or local data source
  const imageUrl = await fetchCityImage(city_name); // Replace with your own logic to fetch the image URL for the city
  if (imageUrl) {
    document.getElementById('city-image').setAttribute('src', imageUrl);
  } else {
    console.log(`No image found for ${city_name}`);
    document.getElementById('city-image').setAttribute('src', './images/default-image.jpg'); // Replace with the default image URL
  }
};

// Function to handle form submission
const formElem = document.getElementById('weather-form');
wformElem.addEventListener('submit', (event) => {
  event.preventDefault();
  const cityName = document.getElementById('city-name-input').value;
  getWeather(cityName);
  getCityImage(cityName);
});

const clickedEvent = async (imgIndex, itemIndex) => {
  // Get track name from the alt text in our img element
  let track = document.getElementsByTagName('img')[imgIndex].attributes[1].value;
  console.log(track);

  let token = await getToken();

  let headers = new Headers([
    ['Content-Type', 'application/json'],
    ['Accept', 'application/json'],
    ['Authorization', `Bearer ${token}`]
  ]);

  let request = new Request(`https://api.spotify.com/v1/search?q=${track}&type=track&limit=15`, {
    method: 'GET',
    headers: headers
  });

  let result = await fetch(request);
  let response = await result.json();
  console.log(response);

  song = response.tracks.items[itemIndex].preview_url;

  console.log(song);

  while (song == null) {
    itemIndex += 1;
    song = response.tracks.items[itemIndex].preview_url;
  }

  if (playSong) {
    stopSnippet();
  }

  songSnippet(song);
};

const getSong = (id, event) => {
  switch (id) {
    case 'fig-1':
      event.stopPropagation();
      clickedEvent(0, 0);
      break;
    case 'fig-2':
      event.stopPropagation();
      clickedEvent(1, 0);
      break;
    case 'fig-3':
      event.stopPropagation();
      clickedEvent(2, 0);
      break;
    case 'fig-4':
      event.stopPropagation();
      clickedEvent(3, 0);
      break;
    case 'fig-5':
      event.stopPropagation();
      clickedEvent(4, 0);
      break;
    case 'fig-6':
      event.stopPropagation();
      clickedEvent(5, 0);
      break;
  }
};

const songSnippet = (url) => {
  playSong = new Audio(url);
  return playSong.play();
};

const stopSnippet = () => {
    if (playSong) {
      playSong.pause();
    }
  };
