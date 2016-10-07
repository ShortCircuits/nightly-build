(function() {
	"use strict";

	angular
		.module('starter')
		.factory('MyShiftsService', MyShiftsService);

	function MyShiftsService($rootScope, $http, Maps) {

  var urlbase = 'https://shift-it.herokuapp.com/';

  var shiftData = {
    postedpending : [],
    postedunclaimed : [],
    postedapproved : [],
    pickedpending : [], 
    pickedrejected : [],
    pickedapproved : []
  };

  var myRequests = [];
  var partnerId;
  var partnerName;
  var shiftId;
  var pickShiftId;
  var codea = null;
  var allPickups;

  var getRequesters = function(shiftId){
    return $http.get(urlbase+'requestsByShift/'+shiftId)
    .then(function(response) {return response.data;});
  };

  return {
    GetMyShifts: function(){
      return $http.get(urlbase+'myshifts')
      .then(function(response) {return response.data;})
      .then(function(shifts){
        shiftData.postedunclaimed = shifts.filter(function(x){
          return x.covered===false && x.requested.length<1;
        });
        shiftData.postedpending = shifts.filter(function(x){
          return x.covered===false && x.requested.length>=1;
        });
        shiftData.postedapproved = shifts.filter(function(x){
          return x.covered===true;
        });
      })
      .then(function(){
        if (shiftData.postedpending.length > 0) {
          shiftData.postedpending.forEach(function(shiftreq){
            shiftreq.claimants = [];
            MyShift.getRequesters(shiftreq._id)
            .then(function(pickups){
              pickups.forEach(function(pickup){
                var obj = {};
                obj.shift_id = shiftreq._id;
                obj.claimant_name = pickup.user_requested_name;
                obj.claimant_id = pickup.user_requested;
                obj.pickup_id = pickup._id;
                shiftreq.claimants.push(obj);
              });
            });
          });
        }
      });
    },

    GetShiftsIPickedUp: function(){
      return $http.get(urlbase+'shiftsIPickedUp')
      .then(function(response) {return response.data;})
      .then(function(shifts){
        shiftData.pickedrejected = shifts.filter(function(x){
          return x.rejected===true;
        });
        shiftData.pickedpending = shifts.filter(function(x){
          return !x.rejected && x.approved===false ;
        });
        shiftData.pickedapproved = shifts.filter(function(x){
          return x.approved===true;
        });
      });
    },

    getShiftData: function(){
      return shiftData;
    },

    getRequesters: function(){
      return getRequesters();
    },

    setPartnerId: function(id, shift, code, pickShift, partName){
      partnerId = id;
      shiftId = shift;
      codea = code;
      pickShiftId = pickShift;
      partnerName = partName;
    },

    getPartnerId: function(){
      return [partnerId, shiftId, pickShiftId, partnerName]
    },

    getCode: function(){
      var something = codea;
      codea = null;
      return something;
    },

    getAllPickups: function(){
      return $http.get(urlbase+'allpickups')
      .then(function(response) {return response.data;});
    },

    deleteShift: function(shift) {
    var deleteMe = confirm("Are you sure you wish to delete this shift?");
    if (deleteMe) {
      $http({
        method: 'DELETE',
        url: 'https://shift-it.herokuapp.com/shifts',
        data: {
          _id: shift._id
        },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(function successCallback(response) {
        shiftData.postedunclaimed.filter(function(x){
          x.shift_id!==response.config.data._id;
        });
        $rootScope.badgeCount = $scope.postedpending.length;
      }, function errorCallback(response) {
        alert("Could not delete the shift", response)
      });
    }
  }

  }
	
	}
})();