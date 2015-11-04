"use strict";

var expect = chai.expect;

describe('Authentication service', function() {

  var Authentication, $httpBackend, rootScope, $location, ReceiverTips;

  beforeEach(module('GLServices'));

  // Needed to mock $routeParams directly.
  beforeEach(function() {
    module(function($provide) {
      $provide.value('$routeParams', {});
    });
  });

  beforeEach(inject(function(_$httpBackend_, $rootScope, _$location_, _Authentication_, _ReceiverTips_) {
    $httpBackend = _$httpBackend_;
    rootScope = $rootScope;

    // Mock out $location methods.
    $location = _$location_;
    $location.path = sinon.stub();
    $location.search = sinon.spy();

    Authentication = _Authentication_;

    ReceiverTips = _ReceiverTips_;
  }));

  it('Should install login and logout methods on the root scope', function() {
    expect(rootScope.login).to.be.a('function');
    expect(rootScope.logout).to.be.a('function');
  });

  it('Should allow admin user to login', function() {
    $httpBackend.when('POST', 'authentication').respond({
      session_id: 'BIGHEXNUMBERTHISISFAKE',
      user_id: 'admin',
      username: 'Administrator name',
      role: 'admin',
      session: 'session data',
      state: 'enable',
      password_change_needed: false
    });

    $httpBackend.expectGET('preferences').respond({});

    expect(Authentication.role).to.not.exist;
    expect(Authentication.auth_landing_page).to.not.exist;

    rootScope.login('admin', 'wontbechecked');

    expect(rootScope.loginInProgress).to.be.true;

    $httpBackend.flush();

    expect(rootScope.loginInProgress).to.be.false;
    expect(Authentication.role).to.equal('admin');
    expect(Authentication.auth_landing_page).to.exist;
    expect($location.path).to.have.been.called;
    expect($location.path).to.have.been.calledWith(Authentication.auth_landing_page);
  });

  it('Should call callback after login', function() {
    $httpBackend.when('POST', 'authentication').respond({
      session_id: 'BIGHEXNUMBERTHISISFAKE',
      user_id: 'admin',
      username: 'Administrator name',
      role: 'admin',
      session: 'session data',
      state: 'enable',
      password_change_needed: false
    });

    $httpBackend.expectGET('preferences').respond({});

    var callback = sinon.spy();

    rootScope.login('admin', 'wontbechecked', callback);

    expect(rootScope.loginInProgress).to.be.true;

    $httpBackend.flush();

    expect(rootScope.loginInProgress).to.be.false;
    expect(callback).to.have.been.called;
  });

  it('Should allow admin user to logout', function() {
    Authentication.role = 'admin';
    Authentication.username = 'admin';
    Authentication.auth_landing_page = '/admin/landing';
    $location.path.returns('/admin/contexts');

    $httpBackend.when('DELETE', 'authentication').respond({});

    rootScope.logout();
    $httpBackend.flush();

    expect(Authentication.role).to.not.exist;
    expect(Authentication.username).to.not.exist;
    expect(Authentication.auth_landing_page).to.not.exist;

    expect($location.path).to.have.been.called;
    expect($location.path).to.have.been.calledWith('/admin');
    expect($location.search).to.not.have.been.called;
  });

  it('On logout, should clear local login information independently of server answer', function() {
    Authentication.role = 'admin';
    Authentication.username = 'admin';
    Authentication.auth_landing_page = '/admin/landing';

    $httpBackend.when('DELETE', 'authentication').respond({});

    rootScope.logout();

    expect(Authentication.role).to.not.exist;
    expect(Authentication.username).to.not.exist;
    expect(Authentication.auth_landing_page).to.not.exist;

    expect($location.path).to.have.been.called;
    expect($location.path).to.have.been.calledWith('/admin');

    $httpBackend.flush();
  });

  it('Should clear local login information if no longer authenticated', function() {
    Authentication.role = 'receiver';
    Authentication.auth_landing_page = '/receiver/tips';

    $httpBackend.when('GET', 'receiver/tips').respond(412, {"error_message": "Not Authenticated", "error_code": 30});

    $location.path.returns('/receiver/tips');
    rootScope.errors = [];

    ReceiverTips.query();

    $httpBackend.flush();

    expect(Authentication.role).to.not.exist;
    expect(Authentication.auth_landing_page).to.not.exist;
  });

  it('Should remember current path if no longer authenticated', function() {
    Authentication.role = 'receiver';
    Authentication.auth_landing_page = '/receiver/tips';

    $httpBackend.when('GET', 'receiver/tips').respond(412, {"error_message": "Not Authenticated", "error_code": 30});

    var source_path = '/receiver/tips';
    $location.path.returns(source_path);
    rootScope.errors = [];

    ReceiverTips.query();

    $httpBackend.flush();

    expect(Authentication.role).to.not.exist;
    expect(Authentication.auth_landing_page).to.not.exist;
    expect($location.path).to.have.been.calledWith('/login');
    expect($location.search).to.have.been.calledWith('src=' + source_path);
  });

  it('Should now the login endpoint to use', function() {
    // Normal conditions, defined by role.
    expect(Authentication.getLoginUri("admin", "/admin/landing")).to.equal("/admin");
    expect(Authentication.getLoginUri("admin", "/admin/mail")).to.equal("/admin");
    expect(Authentication.getLoginUri("admin", "/admin/overview/tips")).to.equal("/admin");
    expect(Authentication.getLoginUri("custodian", "/custodian/identityaccessrequests")).to.equal("/custodian");
    expect(Authentication.getLoginUri("receiver", "/receiver/tips")).to.equal("/login");
    expect(Authentication.getLoginUri("receiver", "/status/c52f56e2-9c2d-4b3e-b5c6-c5dbfdf45c73")).to.equal("/login");
    expect(Authentication.getLoginUri("receiver", "/user/preferences")).to.equal("/login");
    expect(Authentication.getLoginUri("whistleblower", "/submission")).to.equal("/");
    expect(Authentication.getLoginUri("whistleblower", "/status")).to.equal("/");
    expect(Authentication.getLoginUri("whistleblower", "/receipt")).to.equal("/");
    // Normal conditions defined by path
    expect(Authentication.getLoginUri(null, "/admin/landing")).to.equal("/admin");
    expect(Authentication.getLoginUri(null, "/admin/mail")).to.equal("/admin");
    expect(Authentication.getLoginUri(null, "/admin/overview/tips")).to.equal("/admin");
    expect(Authentication.getLoginUri(null, "/custodian/identityaccessrequests")).to.equal("/custodian");
    expect(Authentication.getLoginUri(null, "/receiver/tips")).to.equal("/login");
    expect(Authentication.getLoginUri(null, "/status/c52f56e2-9c2d-4b3e-b5c6-c5dbfdf45c73")).to.equal("/login");
    expect(Authentication.getLoginUri(null, "/receiver/preferences")).to.equal("/login");
    expect(Authentication.getLoginUri(null, "/status")).to.equal("/");
    // Is this a bug?
    expect(Authentication.getLoginUri(null, "/user/preferences")).to.equal("/login");
    // Strange, for the future conditions, showing the default.
    expect(Authentication.getLoginUri(null, "/submission")).to.equal("/login");
    expect(Authentication.getLoginUri(null, "/receipt")).to.equal("/login");
    expect(Authentication.getLoginUri(null, "/anythingreally")).to.equal("/login");
    // Conflicting conditions, role trumps path. Should not happen.
    expect(Authentication.getLoginUri("admin", "/receiver/tips")).to.equal("/admin");
    expect(Authentication.getLoginUri("admin", "/custodian/identityaccessrequests")).to.equal("/admin");
    expect(Authentication.getLoginUri("admin", "/status/c52f56e2-9c2d-4b3e-b5c6-c5dbfdf45c73")).to.equal("/admin");
    expect(Authentication.getLoginUri("admin", "/status")).to.equal("/admin");
    expect(Authentication.getLoginUri("custodian", "/receiver/tips")).to.equal("/custodian");
    expect(Authentication.getLoginUri("custodian", "/admin/contexts")).to.equal("/custodian");
    expect(Authentication.getLoginUri("custodian", "/status")).to.equal("/custodian");
    expect(Authentication.getLoginUri("receiver", "/admin/contexts")).to.equal("/login");
    expect(Authentication.getLoginUri("receiver", "/status/c52f56e2-9c2d-4b3e-b5c6-c5dbfdf45c73")).to.equal("/login");
    expect(Authentication.getLoginUri("receiver", "/user/preferences")).to.equal("/login");
    expect(Authentication.getLoginUri("whistleblower", "/admin/contexts")).to.equal("/");
    expect(Authentication.getLoginUri("whistleblower", "/receiver/tips")).to.equal("/");
    expect(Authentication.getLoginUri("whistleblower", "/custodian/identityaccessrequests")).to.equal("/");
  });
});
