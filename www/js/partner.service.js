(function(){
  "use strict";

  angular
    .module('starter')
    .factory('PartnerService', PartnerService);

  function PartnerService($rootScope, $scope, $http, MyShift, UserService, $ionicModal, Maps) {
	  
		var myApprovedShifts;
	  var canVote = false;
	  var canApprove = false;
	  var myPickupShifts;
	  var codea;

	  

    MyShift.getAllPickups()
	    .then(function(shifts) {
	    	myPickupShifts = shifts;
	    	myApprovedShifts = myPickupShifts.filter(function(shift) {
	      	return shift.approved;
	    	})
	    	// Check to see if user can vote on reps for the other user
	      var currentUser = Maps.getUser();
	      var currentTime = new Date();
	      myApprovedShifts.forEach(function(shift) {
	        var shiftTime = new Date(shift.shift_end);
	        // and not in the id of user is not in voted array :: TODO
	        if (!shift.voted && shift.approved && currentUser === shift.shift_owner && currentTime > shiftTime) {
	          canVote = true;
	        } else {
	          canVote = false;
	        }
	      })
	      console.log("My approved shifts ", myApprovedShifts)
	      myPickupShifts.forEach(function(shift) {
	        // and not in the id of user is not in voted array :: TODO
	        if (!shift.approved && currentUser === shift.shift_owner) {
	          canApprove = true;
	        }
	      })
    	})



  	return {
  		// code which stops someone from accessing /partner directly
  		getCode: function(){
      	var something = codea;
      	codea = null;
      	return something;
    	},
  		myApprovedShifts: function(){
  			return myApprovedShifts;
  		},
  		canVote: function(){
  			return canVote;
  		},
  		canApprove: function(){
  			return canApprove;
  		},
  		myPickupShifts: function(){
  			return myPickupShifts;
  		},


		}

	}
})();