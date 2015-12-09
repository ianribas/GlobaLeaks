var adminLoginHelper = require('./helpers/admin-login-helper')

describe('admin preferences', function() {
  beforeAll(function() {
    adminLoginHelper.login();
  });

  it('should show preferences of admin user', function() {
    browser.setLocation('user/preferences');
    expect(element(by.partialButtonText('Save')).isPresent()).toBe(true);
  });

  it('should allow to save preferences', function() {
    browser.setLocation('user/preferences');
    element(by.partialButtonText('Save')).click();

    // TODO Check ok ...
  });
});
