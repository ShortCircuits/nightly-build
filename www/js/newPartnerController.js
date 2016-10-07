.controller('PartnerCtrl', function($scope, $http, MyShift, UserService, PartnerService, $ionicModal, Maps) {

  $scope.$on('$ionicView.enter', function() {
    if (!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
    PartnerService.getPartnerProfile();

  });

  $scope.$on("update", function() {
    $scope.data = {
      canVote    : PartnerService.canVote(),
      canApprove : PartnerService.canApprove(),
      partnerInfo: PartnerService.getPartnerProfile()

    }
  })

  // only go in here if the user has reached this page through our connect function
  var ex = PartnerService.getCode();
  if (ex === 'abc') {

    PartnerService.filterMyPickups();

    // MyShift.getAllPickups()
    //   .then(function(shifts) {
    //     $scope.myPickupShifts = shifts;
    //     $scope.myApprovedShifts = $scope.myPickupShifts.filter(function(shift) {
    //       return shift.approved;
    //     })

    //     // Check to see if user can vote on reps for the other user
    //     var currentUser = Maps.getUser();
    //     var currentTime = new Date();
    //     $scope.myApprovedShifts.forEach(function(shift) {
    //       var shiftTime = new Date(shift.shift_end);
    //       // and not in the id of user is not in voted array :: TODO
    //       if (!shift.voted && shift.approved && currentUser === shift.shift_owner && currentTime > shiftTime) {
    //         $scope.canVote = true;
    //       }else{
    //         $scope.canVote = false;
    //       }
    //     })
    //     console.log("My approved shifts ", $scope.myApprovedShifts)
    //     $scope.myPickupShifts.forEach(function(shift) {
    //       // and not in the id of user is not in voted array :: TODO
    //       if (!shift.approved && currentUser === shift.shift_owner) {
    //         $scope.canApprove = true;
    //       }
    //     })
    //   })

    //this needs better naming
    // console.log("userId : ", userId);
    // console.log("this is the shiftId: ", shiftId);
    // var currShift;

    $scope.upVote = function(){
      PartnerService.upVote();
    }

    // $scope.upVote = function() {
    //   Partner.vote(pickupShiftId, 'positive')
    //     .then(function(res) {
    //       alert("successfully upvoted this partner")
    //       $scope.canVote = false;
    //       //update the status of the local shitf so it cant be voted on again
    //       currShift = $scope.myPickupShifts.filter(function(shift){
    //         return shift._id === pickupShiftId
    //       })
    //       currShift.voted = false;
    //     })
    //     .catch(function(err) {
    //       alert("could not upvote this partner")
    //     })
    // }

    $scope.downVote = function(){
      PartnerService.downVote();
    }

    // $scope.downVote = function() {
    //   Partner.vote(pickupShiftId, 'negative')
    //     .then(function(res) {
    //       alert("successfully downvoted this partner")
    //       $scope.canVote = false;
    //       //update the status of the local shitf so it cant be voted on again
    //       currShift = $scope.myPickupShifts.filter(function(shift){
    //         return shift._id === pickupShiftId
    //       })
    //       currShift.voted = false;
    //     })
    //     .catch(function(err) {
    //       alert("could not downvote this partner")
    //     })
    // }

    $scope.reject = function(){
      PartnerService.reject();
    }

    // $scope.reject = function() {
    //   // console.log("this is the shiftId inside: ", shiftId);
    //   // document.getElementById("approveShift").style.display = "none";
    //   // document.getElementById("rejectShift").style.display = "none";
    //   $scope.canApprove = false;
    //   $http({
    //     method: 'PATCH',
    //     url: 'https://shift-it.herokuapp.com/shiftsreject',
    //     data: {
    //       shift_id: shiftId,
    //       requester: userId
    //     }
    //   }).then(function(response) {
    //     console.log("successfully added user to restricted.", response);
    //   }).catch(function(err) {
    //     console.log("Error adding to restricted: ", err);
    //   });

    //   $http({
    //     method: 'PATCH',
    //     url: 'https://shift-it.herokuapp.com/pickupreject',
    //     data: {
    //       pickup_shift_id: pickupShiftId
    //     }
    //   }).then(function successCallback(response) {
    //     console.log("reject return: ", response.data);
    //     alert("You have successfully rejected the shift.");

    //   }, function errorCallback(response) {
    //     alert("Could not reject the shift", response)
    //   });
    // };

    $scope.approve = function(){
      PartnerService.approve();
    }

    // $scope.approve = function() {
    //   // console.log("this is the shiftId inside the approve: ", shiftId);
    //   document.getElementById("noticeMsg").innerHTML = 'A shift is waiting your approval';
    //   // document.getElementById("approveShift").style.display = "none";
    //   // document.getElementById("rejectShift").style.display = "none";
    //   $scope.canApprove = false;
    //   $http({
    //     method: 'PATCH',
    //     url: 'https://shift-it.herokuapp.com/pickup',
    //     data: {
    //       pickup_shift_id: pickupShiftId,
    //       shift_id: shiftId
    //     }
    //   }).then(function successCallback(response) {
    //     console.log("approve return: ", response.data);
    //     alert("You have successfully approved the shift.");

    //   }, function errorCallback(response) {
    //     alert("Could not approve the shift", response)
    //   });
    // };

  } else {
    console.log("Thy should not be here at this point of time and space");
  }

})