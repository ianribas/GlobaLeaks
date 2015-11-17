var adminLoginHelper = require('./helpers/admin-login-helper')

describe('admin statistics', function() {
  beforeAll(function() {
    adminLoginHelper.login();
  });

  it('should show a chart', function() {
    browser.setLocation('admin/stats');

    expect(element(by.id('chart')).isElementPresent(by.tagName('svg'))).toBe(true);
  });

  it('should go to previous week', function() {
    element(by.css('[data-ng-click="decrement_week()"]')).click();
    expect(element(by.id('chart')).isElementPresent(by.tagName('svg'))).toBe(true);
  });

  it('should return to next week', function() {
    element(by.css('[data-ng-click="increment_week()"]')).click();
    expect(element(by.id('chart')).isElementPresent(by.tagName('svg'))).toBe(true);
  });
});

describe('recent activities', function() {
  beforeAll(function() {
    adminLoginHelper.login();
  });

  it('should show a list of activities', function() {
    browser.setLocation('admin/activities');

    expect(element(by.id('RecentEventList')).isPresent()).toBe(true);
  });
});

describe('anomalies', function() {
  beforeAll(function() {
    adminLoginHelper.login();
  });

  it('should show a table of anomalies', function() {
    browser.setLocation('admin/anomalies');

    expect(element(by.id('AnomaliesHistoryTable')).isPresent()).toBe(true);
  });
});
