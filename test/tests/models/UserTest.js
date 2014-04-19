describe('User', function() {
  beforeEach(module('app'));

  describe('isAdmin', function() {
    it('should return false if the roles array does not have an admin entry', inject(function(User) {
      var user = new User();
      user.roles = ['not admin'];
      expect(user.isAdmin()).to.be.falsey;
    }));

    it('should return true if the roles array has an admin entry', inject(function(User) {
      var user = new User();
      user.roles = ['admin'];
      expect(user.isAdmin()).to.be.true;
    }));
  });

  describe('isBoard', function() {
    it('should return false if the roles array does not have a board entry', inject(function(User) {
      var user = new User();
      user.roles = ['not board'];
      expect(user.isBoard()).to.be.falsey;
    }));

    it('should return true if the roles array has an board entry', inject(function(User) {
      var user = new User();
      user.roles = ['board'];
      expect(user.isBoard()).to.be.true;
    }));
  });
})