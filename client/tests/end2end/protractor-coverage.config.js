var config = require('./protractor.config.js').config;

// Still no quite sure why protractor coverage needs this, but ...
config.specs = config.specs.map(function(specfile) {
  return "tests/end2end/" + specfile;
});

config.troubleshoot = true;
config.directConnect = true;

// We shuld run this on chrome and use the console plugin to fail
// on client side errors and exceptions. But running tests on chrome
// locally on Travis CI is not simple
config.capabilities = {
  'browserName': 'chrome',
  'chromeOptions': {
    'args': ['no-sandbox']
  }
};

config.plugins = [{
  package: 'protractor-console-plugin',
  logWarnings: true,
  failOnWarning: false,
  failOnError: true,
  exclude: ['favicon.ico', 'glyphicons-halflings-regular']
}];

  //config.onPrepare: function() {
  //    var SpecReporter = require('jasmine-spec-reporter');
  //    // add jasmine spec reporter
  //    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  // }

exports.config = config;

if (process.env.TRAVIS && process.env.TRAVIS_BUILD_DIR) {
  exports.config.capabilities.chromeOptions.binary = process.env.TRAVIS_BUILD_DIR + '/chrome-linux/chrome';
}
