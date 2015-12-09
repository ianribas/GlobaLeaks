var config = require('./protractor.config.js').config;

var browser_capabilities = JSON.parse(process.env.SELENIUM_BROWSER_CAPABILITIES);
browser_capabilities['name'] = 'GlobaLeaks-E2E';
browser_capabilities['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
browser_capabilities['build'] = process.env.TRAVIS_BUILD_NUMBER;

config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;
config.capabilities = browser_capabilities;
config.baseUrl = 'http://localhost:9000/';


exports.config = config;