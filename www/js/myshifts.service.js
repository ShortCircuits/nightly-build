(function() {
	"use strict";

	angular
		.module('starter')
		.factory('MyShiftsService', MyShiftsService);

	function MyShiftsService($rootScope, $http, Main) {

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

  var setPartnerId = function(id, shift, code, pickShift, partName){
    partnerId = id;
    shiftId = shift;
    codea = code;
    pickShiftId = pickShift;
    partnerName = partName;
  };

  var getPartnerId = function(){
    return [partnerId, shiftId, pickShiftId, partnerName]
  };

  return {
    GetMyShifts: function(){
      return $http.get(urlbase+'myshifts')
      .then(function(response) {return response.data;})
      .then(function(shifts){
        console.log("GetMyShifts ***********")
        shiftData.postedunclaimed = shifts.filter(function(x){
          return x.covered===false && x.requested.length<1;
        });
        shiftData.postedpending = shifts.filter(function(x){
          return x.covered===false && x.requested.length>=1;
        });
        shiftData.postedapproved = shifts.filter(function(x){
          return x.covered===true;
        });
        return shifts;
      })
      .then(function(){
        if (shiftData.postedpending.length > 0) {
          shiftData.postedpending.forEach(function(shiftreq){
            shiftreq.claimants = [];
            getRequesters(shiftreq._id)
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
        $rootScope.badgeCount = shiftData.postedpending.length;
        $rootScope.$broadcast('update');
        } else {
          $rootScope.badgeCount = shiftData.postedpending.length;
          $rootScope.$broadcast('update');
        }
      });
    },

    GetShiftsIPickedUp: function(){
      return $http.get(urlbase+'shiftsIPickedUp')
      .then(function(response) {return response.data;})
      .then(function(shifts){
        console.log("GetShiftsIPickedUp ***********")
        shiftData.pickedrejected = shifts.filter(function(x){
          return x.rejected===true;
        });
        shiftData.pickedpending = shifts.filter(function(x){
          return !x.rejected && x.approved===false ;
        });
        shiftData.pickedapproved = shifts.filter(function(x){
          return x.approved===true;
        });
        $rootScope.$broadcast('update');
      });
    },

    getShiftData: function(){
      return shiftData;
    },

    getRequesters: function(shiftId){
      return getRequesters(shiftId);
    },

    setPartnerId: function(id, shift, code, pickShift, partName){
      return setPartnerId(id, shift, code, pickShift, partName);
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
        return $http({
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
          $rootScope.badgeCount = shiftData.postedpending.length;
        }, function errorCallback(response) {
          alert("Could not delete the shift", response)
        });
      }
    }, 

    connect: function(claimant) {
      var userId = claimant.claimant_id;
      var shiftid = claimant.shift_id;
      var partName = claimant.claimant_name;
      var pickshift = claimant.pickup_id;
      setPartnerId(userId, shiftid, 'abc', pickshift, partName);
      window.location = '#/tab/partner';
    },

    connectAfter: function(shift) {
      var userId = shift.covered_by;
      var shiftid = shift._id;
      var partName = shift.covered_by_name;
      var pickshift = shift.pickup_approved;
      setPartnerId(userId, shiftid, 'abc', pickshift, partName);
      window.location = '#/tab/partner';
    }

  }
	
	}
})();