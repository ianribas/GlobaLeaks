exports.config = {
  framework: 'jasmine2',

  baseUrl: 'http://127.0.0.1:8082/',

  troubleshoot: true,
  directConnect: false,

  specs: [
    'test-init.js',
    'test-admin-perform-wizard.js',
    'test-admin-login.js',
    'test-admin-configure-node.js',
    'test-admin-configure-users.js',
    'test-admin-configure-contexts.js',
    'test-admin-configure-receivers.js',
    'test-admin-preferences.js',
    'test-receiver-first-login.js',
    'test-globaleaks-process.js',
    'test-admin-stats.js',
    'test-admin-submission-overview.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    defaultTimeoutInterval : 60000
  }
};
