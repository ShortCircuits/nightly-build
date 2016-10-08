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
          center: new google.maps.LatLng(30.268944599999998, -97.7410366),
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

.factory('MyShift', function($http) {
  var BASE_URL = 'https://shift-it.herokuapp.com/';
  var mishifts = [];
  var myRequests = [];
  var partnerId;
  var partnerName;
  var shiftId;
  var pickShiftId;
  var codea = null;
  var allPickups;

  return {
    GetRequests: function() {
      return $http({
        method: 'GET',
        url: BASE_URL + 'pickup'
      }).then(function(response) {
        myRequests = response.data;
        return myRequests;
      });
    },
    GetMyShifts: function() {
      return $http({
        method: 'GET',
        url: BASE_URL + 'myshifts'
      }).then(function(response) {
        something = response.data;
        return something;
      });
    },
    GetShiftsIPickedUp: function() {
      return $http({
        method: 'GET',
        url: BASE_URL + 'shiftsIPickedUp'
      }).then(function(response) {
        iamworking = response.data;
        return iamworking;
      });
    },
    getRequesters: function(shiftId) {
      return $http.get(BASE_URL + 'requestsByShift/' + shiftId)
        .then(function(response) {
          return response.data;
        })
    },
    setPartnerId: function(id, shift, code, pickShift, partName) {
      partnerId = id;
      shiftId = shift;
      codea = code;
      pickShiftId = pickShift;
      partnerName = partName;
    },
    getPartnerId: function() {
      return [partnerId, shiftId, pickShiftId, partnerName]
    },
    getCode: function() {
      var something = codea;
      codea = null;
      return something;
    },

    getAllPickups: function() {
      return $http.get(urlbase + 'allpickups')
        .then(function(response) {
          return response.data;
        });
    },
  }
})

.factory('Partner', function($http) {

  return {
    vote: function(shift, rep) {
      var voteRep = new Promise(
        function(resolve, reject) {
          $http({
            method: 'PATCH',
            url: 'https://shift-it.herokuapp.com/rateuser',
            data: {
              'pickup_shift_id': shift,
              'rep': rep
            }
          }).then(function(response) {
            console.log("got response", response.data)
            resolve(response);
          }, function(response) {
            console.log(response)
            reject(response)
          })
        })
      return voteRep;
    }
  }
})