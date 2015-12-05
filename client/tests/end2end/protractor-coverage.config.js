exports.config = {
  framework: 'jasmine2',

  baseUrl: 'http://127.0.0.1:8082/',

  troubleshoot: true,
  directConnect: true,

  specs: [
    'tests/end2end/test-init.js',
    'tests/end2end/test-admin-perform-wizard.js',
    'tests/end2end/test-admin-login.js',
    'tests/end2end/test-admin-configure-node.js',
    'tests/end2end/test-admin-configure-users.js',
    'tests/end2end/test-admin-configure-contexts.js',
    'tests/end2end/test-admin-configure-receivers.js',
    'tests/end2end/test-receiver-first-login.js',
    'tests/end2end/test-globaleaks-process.js',
    'tests/end2end/test-admin-stats.js',
    'tests/end2end/test-admin-submission-overview.js'
  ],

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['no-sandbox']
    }
  },

  jasmineNodeOpts: {
    isVerbose: true
  },

  plugins: [{
    package: 'protractor-console-plugin',
    logWarnings: true,
    failOnWarning: false,
    failOnError: true,
    exclude: ['favicon.ico', 'glyphicons-halflings-regular']
  }],

  // onPrepare: function() {
  //    var SpecReporter = require('jasmine-spec-reporter');
  //    // add jasmine spec reporter
  //    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  // }
};

if (process.env.CHROME_BINARY_PATH) {
  exports.config.capabilities.chromeOptions.binary = process.env.CHROME_BINARY_PATH;
}
