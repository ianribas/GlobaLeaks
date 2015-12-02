var utils = require('./utils.js');
var adminLoginHelper = require('./helpers/admin-login-helper')

describe('admin add users', function() {
  beforeAll(function() {
    adminLoginHelper.login();
  });

  it('should add new users', function() {
    browser.setLocation('admin/users');

    var add_user = function(username, role, roleSelector, name, address) {
      var deferred = protractor.promise.defer();
      element(by.model('new_user.username')).sendKeys(username);
      element(by.model('new_user.name')).sendKeys(name);
      element(by.model('new_user.email')).sendKeys(address);
      element(by.model('new_user.role')).element(by.xpath(".//*[text()='" + roleSelector + "']")).click();
      element(by.css('[data-ng-click="add_user()"]')).click().then(function() {
         utils.waitUntilReady(element(by.xpath(".//*[text()='" + name + "']")));
         deferred.fulfill();
      });
      return deferred.promise;
    };

    add_user("receiver2", "receiver", "Recipient", "Recipient 2", "globaleaks-receiver2@mailinator.com").then(function() {
      add_user("receiver3", "receiver", "Recipient", "Recipient 3", "globaleaks-receiver3@mailinator.com").then(function() {
        add_user("custodian1", "custodian", "Custodian", "Custodian 1", "globaleaks-custodian1@mailinator.com")
        .then(function(){
          expect(element(by.id('user-1')).getInnerHtml()).toContain("Custodian 1");
          expect(element(by.id('user-2')).getInnerHtml()).toContain("Recipient 1");
          expect(element(by.id('user-3')).getInnerHtml()).toContain("Recipient 2");
          expect(element(by.id('user-4')).getInnerHtml()).toContain("Recipient 3");
        });
      });
    });
  });

  it('should list users', function() {
    browser.setLocation('admin/users');
    expect(element(by.id('user-0')).getInnerHtml()).toContain("Admin");
    expect(element(by.id('user-1')).getInnerHtml()).toContain("Custodian 1");
    expect(element(by.id('user-2')).getInnerHtml()).toContain("Recipient 1");
    expect(element(by.id('user-3')).getInnerHtml()).toContain("Recipient 2");
    expect(element(by.id('user-4')).getInnerHtml()).toContain("Recipient 3");
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
});
