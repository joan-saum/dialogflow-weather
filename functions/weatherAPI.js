// @flow

const http = require('http');

const host = 'api.worldweatheronline.com';
const wwoApiKey = '8ca019fd4b334a58af6165850182510';
const language = 'fr';

module.exports = {

  getWeatherFromCityAndDate(city, date) {
    return new Promise((resolve, reject) => {
      const path = `${'/premium/v1/weather.ashx?format=json&num_of_days=1'
      + '&q='}${encodeURIComponent(city)}&key=${wwoApiKey}&date=${date}&lang=${language}`;

      // Make the HTTP request to get the weather
      http.get({ host, path }, (res) => {
        let body = '';

        res.on('data', (d) => { body += d; });
        res.on('end', () => {
          const response = JSON.parse(body);

          if (!response.data.weather) {
            reject(new Error('Il semblerait qu\'il y ai un problème de temps sur ces entrées...'));
            return;
          }

          const forecast = response.data.weather[0];
          const condition = forecast.hourly[0][`lang_${language}`][0].value.toLowerCase();
          const formatDate = date.substring(0, 10);
          let output = '';

          if (date) {
            output += `Pour ${formatDate}, à ${city}, la température sera entre ${forecast.mintempC}°C`
            + ` et ${forecast.maxtempC}°C et il fera ${condition}`;
          } else {
            output += `Actuellement à ${city}, la température est entre ${forecast.mintempC}°C`
            + ` et ${forecast.maxtempC}°C et il fait ${condition}`;
          }

          resolve(output);
        });
        res.on('error', (error) => {
          reject(error);
        });
      });
    });
  },
};
