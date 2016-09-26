describe('Friends Factory - Tests', function(){
    var Friends;
    beforeEach(module('starter.directives'));

    beforeEach(inject(function (_Friends_) {
        Friends = _Friends_;
    }));

  it('should get an instance of Frends factory', inject(function(Friends) {
      expect(Friends).toBeDefined();
  }));


  it('should have Jimmmy as friend with id 1', inject(function(Friends) {
      var oneFriend = {
          id: 1,
          name: 'Jimmy'
      };

      expect(Friends.get(1).name).toEqual(oneFriend.name);
  }));

  it('should have mr. Doug as friend with id 0', inject(function(Friends) {
      var oneFriend = {
          id: 0,
          name: 'mr. Doug'
      };

      expect(Friends.get(0).name).toEqual(oneFriend.name);
  }));


  it('should return all friends', inject(function(Friends) {
      expect(Friends.all().length).toEqual(5);
  }))

});


describe('Profile Factory - Tests', function(){
    var Profile;
    beforeEach(module('starter.directives'));

    beforeEach(inject(function (_Profile_) {
        Profile = _Profile_;
    }));

  it('should get an instance of Profile factory', inject(function(Profile) {
        expect(Profile).toBeDefined();
  })) 

    //test to see if profile name matches test data
  it('should have valid name data', inject(function(Profile){
        var testProfile = {
            name: 'Oscar',
            email: '',
            phone: '',
            mainshop: '',
            secondaryShop: ''
        };
        expect(Profile.get().name).toEqual(testProfile.name);
  }))

    it('should have valid email data', inject(function(Profile){
        var testProfile = {
            name: 'Oscar',
            email: 'Oscar@gmail.com',
            phone: '',
            mainshop: '',
            secondaryShop: ''
        };
        expect(Profile.get().email).toEqual(testProfile.email);
  }))

    it('should have valid phone number data', inject(function(Profile){
        var testProfile = {
            name: 'Oscar',
            email: 'Oscar@gmail.com',
            phone: '555-555-5555',
            mainshop: '',
            secondaryShop: ''
        };
        expect(Profile.get().phone).toEqual(testProfile.phone);
  }))

    it('should have valid main shop data', inject(function(Profile){
        var testProfile = {
            name: 'Oscar',
            email: 'Oscar@gmail.com',
            phone: '555-555-5555',
            mainshop: '23',
            secondaryShop: ''
        };
        expect(Profile.get().mainshop).toEqual(testProfile.mainshop);
  }))

        it('should have valid secondary shop data', inject(function(Profile){
        var testProfile = {
            name: 'Oscar',
            email: 'Oscar@gmail.com',
            phone: '555-555-5555',
            mainshop: '23',
            secondaryShop: '44'
        };
        expect(Profile.get().secondaryShop).toEqual(testProfile.secondaryShop);
  }))

  // test to see if set function is working in Profile factory
  it('should set new values to profile', inject(function(Profile) {
      var profileInfoTest = {
          "name": 'Bill',
          "phone": '819-202-2000',
          "email": 'Bill@gmail.com',
          "mainshop": 'austin',
          "secondaryShop": 'houston'
      };
        
      Profile.set(profileInfoTest);

      expect(Profile.get()).toEqual(profileInfoTest);
  }))

  it('should have a function named all', inject(function() {

    expect(typeof Profile.all).toBe("function");

  }))

  it('should have a function named get', inject(function() {

    expect(typeof Profile.get).toBe("function");

  }))

  it('should have a function named set', inject(function() {

    expect(typeof Profile.set).toBe("function");

  }))

  it('should have a function named retrieveProfile', inject(function() {

    expect(typeof Profile.retrieveProfile).toBe("function");

  }))

})

describe('Maps Factory - Tests', function(){
    var Maps;
    beforeEach(module('starter.directives'));

    beforeEach(inject(function (_Maps_) {
        Maps = _Maps_;
    }));
    
  it('should get an instance of Maps factory', inject(function(Maps) {
        expect(Maps).toBeDefined();
  }))

  it('should have a function getLocation', inject(function() {

    expect(typeof Maps.getLocation).toBe("function");

  }))

  it('should have a function setLocation', inject(function() {

    expect(typeof Maps.setLocation).toBe("function");

  }))

  it('should have a function named getMap', inject(function() {

    expect(typeof Maps.getMap).toBe("function");

  }))

  it('should have a function setMap', inject(function() {

    expect(typeof Maps.setMap).toBe("function");

  }))

});


describe('AvailableShifts Factory - Tests', function(){
    var AvailableShifts;
    beforeEach(module('starter.directives'));

    beforeEach(inject(function (_AvailableShifts_) {
        AvailableShifts = _AvailableShifts_;
    }));
  
  it('should get an instance of AvailableShifts factory', inject(function(Profile) {
        expect(AvailableShifts).toBeDefined();
  }))

  it('should have a function named getShifts', inject(function() {

    expect(typeof AvailableShifts.getShifts).toBe("function");

  }))

  it('should have a function named addShift', inject(function() {

    expect(typeof AvailableShifts.addShift).toBe("function");

  }))

  
});