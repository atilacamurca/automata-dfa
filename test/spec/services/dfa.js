'use strict';

describe('Service: dfa', function () {

  // load the service's module
  beforeEach(module('automataDfaApp'));

  // instantiate service
  var dfa;
  beforeEach(inject(function (_dfa_) {
    dfa = _dfa_;
  }));

  it('should do something', function () {
    expect(!!dfa).toBe(true);
  });

});
