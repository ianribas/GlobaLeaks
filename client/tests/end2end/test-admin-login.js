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

    expect(browser.getLocationAbsUrl()).toContain('/admin/landing');
  });
});
