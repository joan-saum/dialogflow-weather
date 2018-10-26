// @flow

/* eslint-disable arrow-body-style */

const assert = require('assert');

const api = require('../functions/weatherAPI');

describe('Weather API', () => {
  it('should return a response for date 2018-09-01', () => {
    return api.getWeatherFromCityAndDate('Paris', '2018-09-01')
      .then((res) => {
        assert.equal(res, 'Pour 2018-09-01, à Paris, la température sera entre 16°C et 24°C et il fera partiellement nuageux');
      }).catch((err) => {
        assert.fail(err, true, 'Should not be rejected', '');
      });
  });

  it('should return a response without a date', () => {
    return api.getWeatherFromCityAndDate('Paris', '')
      .then(() => {
        assert.ok(true);
      }).catch((err) => {
        assert.fail(err, true, 'Should not be rejected', '');
      });
  });

  it('should fail', () => {
    return api.getWeatherFromCityAndDate('zsrertguyujojuygf', 'rdtfgyuhimj')
      .then(() => {
        assert.fail(null, null, 'Should not be resolved', '');
      }).catch(() => {
        assert.ok(true);
      });
  });

  it('should handle an error because of old past date', () => {
    return api.getWeatherFromCityAndDate('Paris', '2018-07-07')
      .then(() => {
        assert.fail(null, null, 'Should not be resolved', '');
      }).catch(() => {
        assert.ok(true);
      });
  });
});
