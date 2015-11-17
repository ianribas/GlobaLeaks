var adminLoginHelper = require('./helpers/admin-login-helper')

describe('admin add receivers', function() {
  beforeAll(function() {
    adminLoginHelper.login();
  });

  afterEach(function() {
    browser.manage().logs().get('browser').then(function(browserLog) {
      // expect(browserLog.length).toEqual(0);
      // Uncomment to actually see the log.
      var filtered = browserLog.filter(function(el) {return el.level && el.level.name && ['INFO', 'WARNING'].indexOf(el.level.name) == -1;});
      console.log('log: ' + require('util').inspect(filtered));
    });
  });

  it('should add new receivers', function() {
    browser.setLocation('admin/users');

    var add_receiver = function(username, name, address) {
      element(by.model('new_user.username')).sendKeys(username);
      element(by.model('new_user.name')).sendKeys(name);
      element(by.model('new_user.email')).sendKeys(address);
      // element(by.model('new_user.role')).sendKeys('custodian');
      element(by.model('new_user.role')).all(by.tagName('option'))
      .then(function(options){
        // Click on third option, Recipient.
        options[2].click();
      });
      return element(by.css('[data-ng-click="add_user()"]')).click();
    };

    add_receiver("receiver2", "Recipient 2", "globaleaks-receiver2@mailinator.com").then(function() {
      add_receiver("receiver3", "Recipient 3", "globaleaks-receiver3@mailinator.com");
    });
  });

  it('should list receivers', function() {
    browser.setLocation('admin/receivers');
    expect(element(by.css('.receiverList')).isPresent()).toBe(true);
    expect(element(by.id('receiver-0')).isPresent()).toBe(true);
  });

  // it('should allow editing a receiver');
});
