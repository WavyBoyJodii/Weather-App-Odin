const mainTempDisplay = document.querySelector('.temp');
const mainWeatherIcon = document.querySelector('.weather-icon');
const secondWeatherIcon = document.querySelector('.day2-weather-icon');
const thirdWeatherIcon = document.querySelector('.day3-weather-icon');
const cityDisplay = document.querySelector('.city');
const secondDay = document.querySelector('.day2-day-name');
const thirdDay = document.querySelector('.day3-day-name');
const secondTemp = document.querySelector('.day2-temp');
const thirdTemp = document.querySelector('.day3-temp');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search button');

const WEATHER_KEY = '9f17e3aae0634736b6200036232304';
const GIPHY_MAP = new Map();

async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_KEY}&q=${city}&days=3`,
      { mode: 'cors' }
    );
    const weatherObj = await response.json();
    console.log(weatherObj);

    mainTempDisplay.textContent = `${Math.round(weatherObj.current.temp_f)}°F`;
    cityDisplay.textContent = weatherObj.location.name;
    secondDay.textContent = getDayName(
      `${weatherObj.forecast.forecastday[1].date} EST`,
      'en-US'
    );
    thirdDay.textContent = getDayName(
      `${weatherObj.forecast.forecastday[2].date} EST`,
      'en-US'
    );
    secondTemp.textContent = `${Math.round(
      weatherObj.forecast.forecastday[1].day.avgtemp_f
    )}°F`;
    thirdTemp.textContent = `${Math.round(
      weatherObj.forecast.forecastday[2].day.avgtemp_f
    )}°F`;
    searchPic(weatherObj);
  } catch (error) {
    addError();
  }
}

searchInput.addEventListener('change', removeError);

searchBtn.addEventListener('click', () => {
  getForecast(searchInput.value);
  searchInput.textContent = '';
});

function addMapping(values, giphy) {
  values.forEach((value) => {
    GIPHY_MAP.set(value, giphy);
  });
}

addMapping([1000], 'Sunny day');
addMapping([1003, 1009], 'partly cloudy skies');
addMapping([1006], 'cloudy sky');
addMapping([1063, 1072, 1150, 1153, 1168, 1180, 1183, 1204, 1240], 'rainy day');
addMapping([1030, 1135, 1147], 'misty');
addMapping(
  [
    1066, 1069, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225,
    1237, 1249, 1252, 1258, 1261, 1264,
  ],
  'Snow Day'
);
addMapping([1087, 1273, 1276], 'Thunder Storm');
addMapping([1279, 1282], 'Thunder and snow');
addMapping([1171, 1186, 1189, 1195, 1201, 1246], 'Heavy Rain');

async function searchPic(weather) {
  const searching1 = GIPHY_MAP.get(weather.current.condition.code);
  const searching2 = GIPHY_MAP.get(
    weather.forecast.forecastday[1].day.condition.code
  );
  const searching3 = GIPHY_MAP.get(
    weather.forecast.forecastday[2].day.condition.code
  );
  console.log(searching1);
  mainWeatherIcon.src = '';
  const response1 = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=FqpTK8bHSV93nnubNKOSzRsLG02mKkHP&s=${searching1}`,
    { mode: 'cors' }
  );
  const giphyData1 = await response1.json();

  const response2 = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=FqpTK8bHSV93nnubNKOSzRsLG02mKkHP&s=${searching2}`,
    { mode: 'cors' }
  );
  const giphyData2 = await response2.json();

  const response3 = await fetch(
    `https://api.giphy.com/v1/gifs/translate?api_key=FqpTK8bHSV93nnubNKOSzRsLG02mKkHP&s=${searching3}`,
    { mode: 'cors' }
  );
  const giphyData3 = await response3.json();
  console.log(giphyData1);

  mainWeatherIcon.src = giphyData1.data.images.original.url;
  secondWeatherIcon.src = giphyData2.data.images.fixed_width_small.url;
  thirdWeatherIcon.src = giphyData3.data.images.fixed_width_small.url;
}

function addError() {
  searchInput.classList.add('error');
  searchInput.textContent = '';
  searchInput.placeholder = 'No Such City Exists';
}

function removeError() {
  searchInput.classList.remove('error');
}

function getDayName(dateStr, locale) {
  console.log(dateStr);
  const date = new Date(dateStr);
  console.log(date);
  return date.toLocaleDateString(locale, { weekday: 'long' });
}

fetch(
  'https://api.giphy.com/v1/gifs/translate?api_key=FqpTK8bHSV93nnubNKOSzRsLG02mKkHP&s=weatherman',
  { mode: 'cors' }
)
  .then((response) => response.json())
  .then((response) => {
    mainWeatherIcon.src = response.data.images.original.url;
    secondWeatherIcon.src = response.data.images.original.url;
    thirdWeatherIcon.src = response.data.images.original.url;
  });
