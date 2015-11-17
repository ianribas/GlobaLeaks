var adminLoginHelper = require('./helpers/admin-login-helper')

describe('tips overview', function() {
  beforeAll(function() {
    adminLoginHelper.login();
  });

  it('should show list of tips', function() {
    browser.setLocation('admin/overview/tips');

    var tipList = element(by.id('tipListBody'));
    expect(tipList.isPresent()).toBe(true);
    tipList.$$('tr').then(function(lines){
      expect(lines[0].getInnerHtml()).toContain('Context 1');
    });
  });
});
