//var utils = require('./utils.js');
var adminLoginHelper = require('./helpers/admin-login-helper')

describe('admin login', function() {
  beforeAll(function() {
    adminLoginHelper.forceLogin();
  });

  it('should login as admin', function() {
    expect(browser.getLocationAbsUrl()).toContain('/admin/landing');
  });

  it('should go to landing page if already logged in', function() {

    browser.setLocation('/admin');

    // element(by.xpath('//button[contains(., "Log in")]')).click().then(function() {
    //   utils.waitForUrl('/admin/landing');
    // });
    expect(browser.getLocationAbsUrl()).toContain('/admin/landing');
  });
});
