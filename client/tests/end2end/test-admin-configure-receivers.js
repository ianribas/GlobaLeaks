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

  it('should list receivers', function() {
    browser.setLocation('admin/receivers');
    expect(element(by.id('receiver-0')).isPresent()).toBe(true);
    expect(element(by.id('receiver-0')).getInnerHtml()).toContain("Recipient 1");
  });

  it('should allow to edit a receiver', function() {
    browser.setLocation('admin/receivers');
    var receiverElem = element(by.id('receiver-2'));

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
      contexts[1].click();
      // Click three times to exercise toggle behavior.
      contexts[2].click();
      contexts[2].click();
    });

    receiverElem.element(by.partialButtonText('Save')).click();
    receiverElem.element(by.partialButtonText('Edit')).click();

    expect(receiverElem.element(by.model('receiver.tip_expiration_threshold')).getAttribute('value')).toBe('70');
  });
});
