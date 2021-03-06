(function() {
  "use strict";

  angular
    .module('starter')
    .factory('PickupService', PickupService);

  function PickupService($rootScope, $http, Main, $ionicLoading, UserService) {

    var myId;
    var availableShifts;

    var getShiftsNearMe = function() {
      if(Main.getLocation){ //??
        var locObj = JSON.parse(localStorage.getItem("location"));
        Main.setLocation(locObj);

        Main.fetchStores().then(function(res) {
          myId = UserService.getUser()._id;
          availableShifts = Main.getShifts();
          availableShifts = availableShifts.filter(function(shift) {
            if (shift.submitted_by === myId) return false;
            if (shift.restricted.includes(myId)) return false;
            if (shift.requested.includes(myId)) return false;
            return true;
          });
          addPrizeNum();
          $rootScope.$broadcast('update');
          $ionicLoading.hide();
          return;
        })
      }
    };

    var pickUpShift = function(theData) {
      var post = new Promise(
        function(resolve, reject) {
          $http({
            method: 'POST',
            url: 'https://shift-it.herokuapp.com/pickup',
            data: theData
          }).then(function(response) {
            resolve(response.data);
          }, function(response) {
            if (response.status === 403) {
              alert("You have reached your pickup limit.")
            } else {
              reject(response)
            }
          });
        })
      return post;
    };

    var addPrizeNum = function() {
      if (availableShifts) {
        availableShifts.map(function(shift) {
          shift.prizeNum = parseInt(shift.prize.slice(1));
        })
      }
    };

    return {

      pickupShift: function(shift) {
        var theData = {
          shift_id: shift._id,
          shift_owner: shift.submitted_by,
          shift_owner_name: shift.submitted_by_name,
          shift_where: shift.home_store.address,
          shift_when: shift.shift_text_time,
          shift_prize: shift.prize,
          shift_start: shift.shift_start,
          shift_end: shift.shift_end,
          voted: false
        };
        var notifyUser = function() {
            //Needs to go to different page
            window.location = "#/tab/map";
          }
          // test if shift owner is claiming their own shift
        if (myId != shift.submitted_by) {
          availableShifts.splice(availableShifts.indexOf(shift), 1);
          pickUpShift(theData).then(function(response) {
            alert("successfully requested a shift")
          }).catch(function(err) {
            alert("Could not request to pickup this shift, try refreshing the app")
          })
        } else {
          alert("Sorry, you cannot claim this shift.")
        }
      },

      pickUpShift: function(theData) {
        return pickUpShift(theData);
      },

      getShiftsNearMe: function() {
        getShiftsNearMe();
      },

      availableShifts: function() {
        return availableShifts;
      },
    }
  }
})();