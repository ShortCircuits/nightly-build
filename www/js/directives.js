angular.module('starter.directives', [])

.directive('map', function() {
    return {
      restrict: 'E',
      scope: {
        onCreate: '&'
      },
      link: function($scope, $element, $attr) {
        function initialize() {

          var mapOptions = {
            center: new google.maps.LatLng(30.2798807, -97.7201470999999),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);

          $scope.onCreate({
            map: map
          });

          // Stop the side bar from dragging when mousedown/tapdown on the map
          google.maps.event.addDomListener($element[0], 'mousedown', function(e) {
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
    var friends = [{
      id: 0,
      name: 'mr. Doug'
    }, {
      id: 1,
      name: 'Jimmy'
    }, {
      id: 2,
      name: 'Chad le Griff'
    }, {
      id: 3,
      name: 'Anjum Ketchum'
    }, {
      id: 4,
      name: 'turbo ninja'
    }];

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

.factory('Maps', function($http) {

  var location;
  var map = undefined;
  var user = undefined;
  var approvedShift = false;
  var notificationMsg = "";
  var userApprovals;
  var stores;

  return {

    whoAmI: function() {
      return $http.get('https://shift-it.herokuapp.com/whoami')
        .then(function(response) {
          loggedInUser = response.data;
          user = response.data;
          return loggedInUser;
        });
    },

    getPickupNotifications: function() {
      return $http.get('https://shift-it.herokuapp.com/pickup')
        .then(function(response) {
          userApprovals = response.data;
          return userApprovals;
        });
    },

    getMyPos: function() {
      var pos = new Promise(
        function(resolve, reject) {
          navigator.geolocation.getCurrentPosition(function(pos) {
            location = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            };
            resolve(location);
          }, function(error) {
            console.log('Unable to get location: ' + error.message);
            reject(error.message)
          });
        })
      return pos;
    },

    fetchStores: function(){
      return $http.get('https://shift-it.herokuapp.com/shifts/lat/' + location.lat + '/lng/' + location.lng + '/rad/5000')
        .then(function(response) {
          stores = response.data;
          return stores;
        });
    },

    setMyStore: function(myStoreObj){
      var myStore = new Promise(
        function(resolve, reject) {
          $http({
              method: 'PATCH',
              url: 'https://shift-it.herokuapp.com/users',
              data: {
                home_store: myStoreObj
              }
            }).then(function (response) {
              console.log("response from fetching", response)
              resolve(response.data);
            }, function (response) {
              reject("Please log in to set your home store.");
            })
        })
      return myStore;
    },

    searchByZip: function(zipOrCity){
      return $http.get('https://shift-it.herokuapp.com/areaSearch/address/' + zipOrCity)
        .then(function(response) {
          return response.data;
        });
    },

    getStores: function(){
      return stores;
    },
    setApproved: function() {
      approvedShift = true;
    },
    getApproved: function() {
      return approvedShift;
    },
    getNotificationMsg: function() {
      if (!approvedShift) {
        return "Your shift request has been approved"
      }
      return notificationMsg
    },
    getUser: function() {
      return user;
    },
    setUser: function(leUser) {
      user = leUser;
    },
    getLocation: function() {
      return location;
    },
    getMap: function() {
      return map;
    },
    setMap: function(mapObj) {
      map = mapObj;
    },
    setApprovals: function(shift) {
      userApprovals = shift;
    },
    getApprovals: function() {
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
      profileInfo.name = profileData.name
      profileInfo.phone = profileData.phone
      profileInfo.email = profileData.email
      profileInfo.mainshop = profileData.mainshop
      profileInfo.secondaryShop = profileData.secondaryShop
    },
    retrieveProfile: function() {
      console.log("retrieveProfileData: ", profileData);
      profileInfo = profileData;
      console.log("profileInfo: ", profileInfo);
    }
  }

})

.factory('AvailableShifts', function() {

  //simplified version of the factory / currently all shifts cramed into one array
  var availableShifts = [];

  return {
    // no select by store for now :: TODO
    getShifts: function(store) {
      return availableShifts;
    },
    addShift: function(shift) {
      // each shift should have UUID so we can eliminate duplicates from the list
      availableShifts.push(shift)
    }
  }
})