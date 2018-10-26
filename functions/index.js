/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */

const functions = require('firebase-functions');
const { dialogflow } = require('actions-on-google');
const api = require('./weatherAPI');

const app = dialogflow({ debug: true });

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

app.intent('Default Welcome Intent', (conv) => {
  conv.ask('Bienvenue jeune voyageur! En quoi puis-je t\'aider ?');
});

app.intent('Default Fallback Intent', (conv) => {
  conv.ask('Je n\'ai pas compris ta demande.. essaye de la reformuler autrement');
});

app.intent('End', (conv) => {
  conv.close('J\'espère avoir pu t\'aider! A la prochaine!');
});

app.intent('Weather', (conv, { city, date }) => {
  if (!city) {
    conv.contexts.set('city-followup', 5, { date });
    return conv.ask('Il faudrait que tu me précise un endroit.. le monde est grand!');
  }

  return api.getWeatherFromCityAndDate(city, date).then((res) => {
    return conv.ask(res);
  }).catch(() => {
    return conv.ask('Oops, on a eu un problème Houston! Essaye autre chose');
  });
});

app.intent('Weather-city', (conv, { city }) => {
  const context = conv.contexts.get('city-followup');
  const date = context ? context.parameters.date : '';

  return api.getWeatherFromCityAndDate(city, date).then((res) => {
    return conv.ask(res);
  }).catch(() => {
    return conv.ask('Oops, on a eu un problème Houston! Essaye autre chose');
  });
});
