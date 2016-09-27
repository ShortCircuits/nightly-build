angular.module('starter.directives', [])

.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {


        var mapOptions = {
          center: new google.maps.LatLng(30.2798807, -97.7201470999999),
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  
        $scope.onCreate({map: map});

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });
    
      }

      if (document.readyState === "complete") {
        initialize();
      } else {

        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
})
/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {

  // Some fake testing data
  var friends = [
    { id: 0, name: 'mr. Doug' },
    { id: 1, name: 'Jimmy' },
    { id: 2, name: 'Chad le Griff' },
    { id: 3, name: 'Anjum Ketchum' },
    { id: 4, name: 'turbo ninja' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('Maps',  function(){

  var locations = undefined;
  var map = undefined;
  // prolly needs to be in the rootscope
  var user = undefined;
  var approvedShift = false;
  var notificationMsg = "";
  var userApprovals;

    return {
      setApproved: function(){
        approvedShift = true;
      },
      getApproved: function(){
        return approvedShift;
      },
      getNotificationMsg: function(){
        if(!approvedShift){
          return "Your shift request has been approved"
        }
        return notificationMsg
      },
      getUser: function(){
        return user;
      },
      setUser: function(leUser){
        user = leUser;
      },
      getLocation: function (){
        return locations;
      },
      setLocation: function (loc){
        locations = loc;
      },
      getMap: function(){
        return map;
      },
      setMap: function(mapObj){
        map = mapObj;
      },
      setApprovals: function(shift){
        userApprovals = shift;
      },
      getApprovals: function(){
        return userApprovals;
      }
    }

})

.factory('Profile', function() {

  // profile data
  var profileInfo = {
      "name": 'Oscar',
      "email": 'Oscar@gmail.com',
      "phone": '555-555-5555',
      "mainshop": '23',
      "secondaryShop": '44'
  };

  return {
    all: function() {
      return profileInfo;
    },
    get: function() {
      return profileInfo;
    },
    set: function(profileData) {
      profileInfo.name          = profileData.name
      profileInfo.phone         = profileData.phone
      profileInfo.email         = profileData.email
      profileInfo.mainshop      = profileData.mainshop
      profileInfo.secondaryShop = profileData.secondaryShop
    },
    retrieveProfile: function() {
      console.log("retrieveProfileData: ", profileData);
      profileInfo = profileData;
      console.log("profileInfo: ", profileInfo);
    }
  }

})

.factory('AvailableShifts', function(){

  //simplified version of the factory / currently all shifts cramed into one array
  var availableShifts = [];

  return {
    // no select by store for now :: TODO
    getShifts: function(store){
      return availableShifts;
    },
    addShift: function(shift){
      // each shift should have UUID so we can eliminate duplicates from the list
      availableShifts.push(shift)
    }
  }
})



