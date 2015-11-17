
var forceLogin = function() {
  browser.get('/#/admin');

  element(by.model('loginUsername')).sendKeys('admin');
  element(by.model('loginPassword')).sendKeys('ACollectionOfDiplomaticHistorySince_1966_ToThe_Pr esentDay#');
  return element(by.xpath('//button[contains(., "Log in")]')).click();
};

var login = function() {
  browser.ignoreSynchronization = true;
  var ret = browser.wait(element(by.id('LoginRoleText')).getText,100)
    .then(function(text){
      if (!text.indexOf || text.indexOf('admin') == -1) {
        return forceLogin();
      }
      return true;
    },function(err) {
      return forceLogin();
    });
  browser.ignoreSynchronization = false;
  return ret;
};

module.exports = {
  forceLogin: forceLogin,
  login: login,
};