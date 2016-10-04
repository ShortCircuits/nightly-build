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

.factory('Maps', function($http) {

  var location;
  var map = undefined;
  var user = undefined;
  var approvedShift = false;
  var notificationMsg = "";

  var userApprovals; //all the pickup shifts
  var shifts;
  var stores;
  var myStore;

  return {
    getMyStore: function(){
      return $http.get('https://shift-it.herokuapp.com/getProfileInfo')
        .then(function(response) {
          myStore = response.data[0].home_store.storeId;
          return myStore;
        });
    },

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
    // also populates the shifts;

    // $scope.availableShifts = $scope.availableShifts.filter(function(shift){
    //       return !shift.requested.includes($scope.myId)
    //     });
    fetchStores: function(){
      return $http.get('https://shift-it.herokuapp.com/shifts/lat/' + location.lat + '/lng/' + location.lng + '/rad/5000')
        .then(function(response) {
          stores = response.data;
          shifts = stores.results.filter(function(store){
            // console.log("store is: ", store)
            if (store.shifts) return true;
          }).map(function(shift){
            return shift.shifts;
          }).reduce(function(a, b) {
            return a.concat(b);
          }, []);
          return $http.get('https://shift-it.herokuapp.com/whoami')
            .then(function(response) {
              loggedInUser = response.data;
              user = response.data;
              shifts = shifts.filter(function(shift){
                console.log("user: ", user)
                return !shift.requested.includes(user)
              });
            });
          console.log("the shifts are here: ", shifts)
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
          stores = response.data;
          shifts = stores.results.filter(function(store){
            if (store.shifts) return true;
          }).map(function(shift){
            return shift.shifts;
          }).reduce(function(a, b) {
            return a.concat(b);
          }, []);
          return stores;
        });
    },

    getShifts: function(){
      return shifts;
    },

    addShift: function(shift){
      shifts.push(shift)
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
    getHomeStore: function() {
      return myStore;
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
  // var availableShifts = [];

  return {
    availableShifts: [],
    // no select by store for now :: TODO
    getShifts: function(store) {
      return this.availableShifts;
    },
    addShift: function(shift) {
      // each shift should have UUID so we can eliminate duplicates from the list
      this.availableShifts.push(shift)
    }
  }
})

.factory('MyShift', function($http) {
  var BASE_URL = 'https://shift-it.herokuapp.com/';
  var mishifts = [];
  var myRequests = [];
  var partnerId;
  var shiftId;
  var pickShiftId;
  var codea = null;
  var allPickups;

  return {
    GetRequests: function(){
      return $http({
          method: 'GET',
          url: BASE_URL+'pickup'
      }).then(function(response) {
        myRequests = response.data;
        return myRequests;
      });
    },
    GetMyShifts: function(){
      return $http({
          method: 'GET',
          url: BASE_URL+'myshifts'
      }).then(function(response) {
        something = response.data;
        return something;
      });
    },
    GetShiftsIPickedUp: function(){
      return $http({
          method: 'GET',
          url: BASE_URL+'shiftsIPickedUp'
      }).then(function(response) {
        iamworking = response.data;
        return iamworking;
      });
    },
    setPartnerId: function(id, shift, code, pickShift){
      partnerId = id;
      shiftId = shift;
      codea = code;
      pickShiftId = pickShift;
    },
    getPartnerId: function(){
      return [partnerId, shiftId, pickShiftId]
    },
    getCode: function(){
      var something = codea;
      codea = null;
      return something;
    },
    getAllPickups: function(){
      return $http({
          method: 'GET',
          url: BASE_URL+'allpickups'
      }).then(function(response) {
        allPickups = response.data;
        return allPickups;
      });
    },
  }

})

.factory('Pickup', function($http) {
  
  return {

    pickUpShift: function(theData){
      var post = new Promise(
        function(resolve, reject){
          $http({
            method: 'POST',
            url: 'https://shift-it.herokuapp.com/pickup',
            data: theData
          }).then(function (response) {
            console.log("got response", response.data)
            resolve(response.data);
          }, function (response) {
            reject(response)
        });
      })
      return post;
    }
  }
})

.factory('Partner', function($http) {
  
  return {
    vote: function(shift, rep){
      var voteRep = new Promise(
        function(resolve, reject){
          $http({
            method: 'PATCH',
            url: 'https://shift-it.herokuapp.com/rateuser',
            data: {
              'pickup_shift_id': shift,
              'rep': rep
            }
          }).then(function (response) {
             console.log("got response", response.data)
             resolve(response);
          }, function (response) {
            console.log(response)
            reject(response)
          }) 
      })
    return voteRep;
    }
  }
})









