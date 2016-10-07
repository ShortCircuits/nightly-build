(function() {
	"use strict";

	angular
		.module('starter')
		.factory('MyShiftsService', MyShiftsService);

	function MyShiftsService($rootScope, $http, MyShift, Maps) {

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
    getRequesters: function(shiftId){
      return $http.get(BASE_URL+'requestsByShift/'+shiftId)
      .then(function(response) {
        return response.data;
      })
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
      return $http({
          method: 'GET',
          url: BASE_URL+'allpickups'
      }).then(function(response) {
        allPickups = response.data;
        return allPickups;
      });
    },
  }
	

	}
})();