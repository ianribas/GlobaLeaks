var adminLoginHelper = require('./helpers/admin-login-helper')

describe('admin receivers', function() {
  beforeAll(function() {
    adminLoginHelper.login();
  });

  // afterEach(function() {
  //   browser.manage().logs().get('browser').then(function(browserLog) {
  //     // expect(browserLog.length).toEqual(0);
  //     // Uncomment to actually see the log.
  //     console.log('log: ' + require('util').inspect(browserLog));
  //   });
  // });

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
      return element(by.partialButtonText('Add')).click();
      // return element(by.css('[data-ng-click="add_user()"]')).click();
    };

    add_receiver("receiver2", "Recipient 2", "globaleaks-receiver2@mailinator.com").then(function() {
      add_receiver("receiver3", "Recipient 3", "globaleaks-receiver3@mailinator.com");

      expect(element(by.id('user-1')).getInnerHtml()).toContain("Recipient 1");
      expect(element(by.id('user-2')).getInnerHtml()).toContain("Recipient 2");
      expect(element(by.id('user-3')).getInnerHtml()).toContain("Recipient 3");


      browser.setLocation('admin/receivers');
      expect(element(by.id('receiver-0')).getInnerHtml()).toContain("Recipient 1");
      expect(element(by.id('receiver-1')).getInnerHtml()).toContain("Recipient 2");
      expect(element(by.id('receiver-2')).getInnerHtml()).toContain("Recipient 3");
    });
  });

  it('should list users', function() {
    browser.setLocation('admin/users');
    expect(element(by.id('user-0')).getInnerHtml()).toContain("Admin");
    expect(element(by.id('user-1')).getInnerHtml()).toContain("Recipient 1");
    expect(element(by.id('user-2')).getInnerHtml()).toContain("Recipient 2");
    expect(element(by.id('user-3')).getInnerHtml()).toContain("Recipient 3");
  });

  it('should list receivers', function() {
    browser.setLocation('admin/receivers');
    expect(element(by.id('receiver-0')).isPresent()).toBe(true);
    expect(element(by.id('receiver-0')).getInnerHtml()).toContain("Recipient 1");
  });

  it('should allow to edit a user', function() {
    browser.setLocation('admin/users');
    var userElem = element(by.id('user-1'));

    expect(userElem.isPresent()).toBe(true);

    userElem.element(by.partialButtonText('Edit')).click();

    var tipExpirationThreshold = userElem.element(by.model('user.description'));
    tipExpirationThreshold.clear();
    tipExpirationThreshold.sendKeys('Test description');
    userElem.element(by.partialButtonText('Save')).click();

    userElem.element(by.partialButtonText('Edit')).click();

    expect(userElem.element(by.model('user.description')).getAttribute('value')).toBe('Test description');

  });

  it('should allow to edit a receiver', function() {
    browser.setLocation('admin/receivers');
    var receiverElem = element(by.id('receiver-0'));

    expect(receiverElem.isPresent()).toBe(true);
    receiverElem.element(by.partialButtonText('Edit')).click();
    var tipExpirationThreshold = receiverElem.element(by.model('receiver.tip_expiration_threshold'));
    tipExpirationThreshold.clear();
    tipExpirationThreshold.sendKeys('70');

    // Add recipient to context 3.
    receiverElem.all(by.css('[data-ng-click="toggle(context)"]'))
    .then(function(contexts){
      // Select all unselected contexts
      contexts[1].click();
      // Click three times to exercise toggle behavior.
      contexts[2].click();
      contexts[2].click();
      contexts[2].click();
    });

    receiverElem.element(by.partialButtonText('Save')).click();
    receiverElem.element(by.partialButtonText('Edit')).click();

    expect(receiverElem.element(by.model('receiver.tip_expiration_threshold')).getAttribute('value')).toBe('70');
    // Validate all contexts are selected.
    receiverElem.all(by.css('[data-ng-show="isSelected(context)"]'))
    .then(function(contexts){
      expect(contexts.length).toBe(3);
    });

  });

  // it('should allow editing a receiver');
});
