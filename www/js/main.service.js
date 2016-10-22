(function() {
  "use strict";

  angular
    .module('main')
    .factory('Main', Main);

  function Main($http) {

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
      getMyStore: function() {
        return $http.get('https://shift-it.herokuapp.com/getProfileInfo')
          .then(function(response) {
            if(response.data[0].home_store){
              myStore = response.data[0].home_store.storeId;
              return myStore;
            }else{
              alert("Please set your home store by selecting a pin on the map");
              return;
            }
          });
      },

      whoAmI: function() {
        return $http.get('https://shift-it.herokuapp.com/whoami')
          .then(function(response) {
            var loggedInUser = response.data; // is this needed?
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

      // Expects location to
      fetchStores: function() {
        return $http.get('https://shift-it.herokuapp.com/shifts/lat/' + location.lat + '/lng/' + location.lng + '/rad/5000')
          .then(function(response) {
            stores = response.data;
            shifts = stores.results.filter(function(store) {
              if (store.shifts) return true;
            }).map(function(shift) {
              return shift.shifts;
            }).reduce(function(a, b) {
              return a.concat(b);
            }, []);
            return $http.get('https://shift-it.herokuapp.com/whoami')
              .then(function(response) {
                var loggedInUser = response.data; // ??
                user = response.data;
                shifts = shifts.filter(function(shift) {
                  return !shift.requested.includes(user)
                });
                return stores;
              });
          });
      },

      setMyStore: function(myStoreObj) {
        var myStore = new Promise(
          function(resolve, reject) {
            $http({
              method: 'PATCH',
              url: 'https://shift-it.herokuapp.com/users',
              data: {
                home_store: myStoreObj
              }
            }).then(function(response) {
              resolve(response.data);
            }, function(response) {
              reject("Please log in to set your home store.");
            })
          })
        return myStore;
      },

      searchByZip: function(zipOrCity) {
        return $http.get('https://shift-it.herokuapp.com/areaSearch/address/' + zipOrCity)
          .then(function(response) {
            location.lat = response.data.location.lat;
            location.lng = response.data.location.lng;
            stores = response.data;
            shifts = stores.results.filter(function(store) {
              if (store.shifts) return true;
            }).map(function(shift) {
              return shift.shifts;
            }).reduce(function(a, b) {
              return a.concat(b);
            }, []);
            return stores;
          });
      },

      getShifts: function() {
        return shifts;
      },

      addShift: function(shift) {
        shifts.push(shift)
      },

      getStores: function() {
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
      setLocation: function(loc) {
        location = loc;
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
  };
})()