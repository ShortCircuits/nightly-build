angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $interval, $timeout, UserService, $window, Maps) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    Maps.getMyPos().then(function(loc){
      var location = JSON.stringify(loc);
      console.log(location)
      localStorage.setItem("location", location);
    })

    // Form data for the login modal
    $scope.loginData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $interval(function() {
      $scope.badgeCount = $rootScope.badgeCount;
    }, 2000);
    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    $scope.authenticate = function(provider) {
      UserService.authenticate(provider);
    };

    $scope.logout = function() {
      UserService.logOut();
      $window.location = '#/lobby'
    };

    $rootScope.$on('userLoggedIn', function(data) {
      // here we will recieve the logged in user
      console.log(data);
      $scope.closeLogin();
      $window.location = "#/tab/map"
    });

    // will fire in case authentication failed
    $rootScope.$on('userFailedLogin', function() {

    });

  })
  // .controller('ProfileCtrl', function($scope, $http, $ionicModal, UserService, ProfileService) {

  //   $scope.$on('update', function() {
  //     $scope.data = {
  //       profile : ProfileService.getProfileData(),
  //       editProfile : ProfileService.getEditProfile(),
  //     }
  //   });

  //   $scope.$on('$ionicView.enter', function() {
  //     if (!UserService.isAuthenticated()) {
  //       window.location = '#/lobby'
  //     }
  //     ProfileService.getUserData();

  //     // Open and close the modal to edit Profile
  //     $ionicModal.fromTemplateUrl('templates/editProfile.html', {
  //       scope: $scope
  //     }).then(function(modal) {
  //       $scope.modal = modal;
  //     });

  //     // Triggered in the edit profile modal to close it
  //     $scope.closeEditProfile = function() {
  //       $scope.modal.hide();
  //     };

  //     // Open the edit profile modal
  //     $scope.openEditProfile = function() {
  //       ProfileService.fillEditProfile();
  //       $scope.modal.show();
  //     };

  //     // Functionality for editProfile modal
  //     $scope.submitProfile = function() {
  //       ProfileService.submitProfile()
  //       $scope.closeEditProfile();
  //     };

  //   });
  // })

// This controller handles the functionality for creating and posting a new shift.
.controller('CoverCtrl', function($rootScope, $scope, $ionicModal, UserService, CoverService) {
  
  $scope.$on("update", function() {
    $scope.data = {
      prize : CoverService.prize(),
      shift : CoverService.shift(),
      shiftDate : CoverService.shiftDate(),
      startTime : CoverService.startTime(),
      endTime : CoverService.endTime(),

    }
  })

  $scope.$on('$ionicView.enter', function() {
    // Code you want executed every time view is opened
    if (!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
    $scope.openDatePicker();
    CoverService.setHomeLocForShift();
    console.log('Opened!')
  });

  // This shows the prize picker modal
  $ionicModal.fromTemplateUrl('templates/prizeModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('prizeMode', function() {
    $scope.prizePicker();
  });

  // Function for the end shift time picker
  $scope.openTimePicker1 = function() {
    CoverService.openTimePicker1();
  };

  // Function for the start shift time picker
  $scope.openTimePicker2 = function() {
    CoverService.openTimePicker2();
  };

  // Function for the date picker
  $scope.openDatePicker = function() {
    CoverService.openDatePicker();
  };

  $scope.increment = function() {
    CoverService.increment();
  }

  $scope.decrement = function() {
    CoverService.decrement();
  }

  // Function to show the prize picker
  $scope.prizePicker = function() {
    $scope.modal.show();
  }

  // Function to submit the prize to the shift object
  $scope.addPrize = function(prize) {
    CoverService.addPrize();
    $scope.closePrize();
  };

  // Function to close the prize modal
  $scope.closePrize = function() {
    $scope.modal.hide();
  };

  $scope.postShift = function() {
    CoverService.postShift();
    $scope.data = {};
  }

})

.controller('PickupCtrl', function($scope, $location, $state, $http, Maps, Pickup, UserService, AvailableShifts, $ionicLoading) {

  $scope.$on('$ionicView.enter', function() {
    if (!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
  });
  $ionicLoading.show();
  // $scope.availableShifts = AvailableShifts.getShifts();
  $scope.myId = Maps.getUser();
  // assuming the stores are in place on the Maps factory
  $scope.availableShifts;
  // if there are no shifts available make another request;

    Maps.getMyPos().then(function(pos) {
      Maps.fetchStores().then(function(res) {
        $ionicLoading.hide();
        $scope.availableShifts = Maps.getShifts();
        $scope.availableShifts = $scope.availableShifts.filter(function(shift){
          return !shift.requested.includes($scope.myId)
        })
        // .filter(function(shift){
        //   return !shift.submitted_by === $scope.myId;
        // })
        $scope.availableShifts.filter(function(shift){
          console.log('shift subb by', shift.submitted_by)
          console.log('my id', $scope.myId)
          return !(shift.submitted_by === $scope.myId);
        })
        addPrizeNum();
      })
    })

  addPrizeNum()
  // make prize a number so it can be used to sortBy
  function addPrizeNum() {
    if ($scope.availableShifts) {
      $scope.availableShifts.map(function(shift) {
        shift.prizeNum = parseInt(shift.prize.slice(1));
      })
      console.log($scope.availableShifts)
    }
  }

  // scope for filter on the pickup page
  $scope.sortorder = 'shift.prize';

  $scope.pickupShift = function(shift) {
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
        console.log("shift requested")
      }
      // test if shift owner is claiming their own shift
      console.log("scope myid and shift owner ", $scope.myId, " " ,shift.submitted_by)
    if ($scope.myId != shift.submitted_by) {
      $scope.availableShifts.splice($scope.availableShifts.indexOf(shift), 1);
      Pickup.pickUpShift(theData).then(function(response) {
        
        alert("successfully requested a shift")
      }).catch(function(err) {
        alert("Could not request to pickup this shift, try refreshing the app")
      })
    } else {
      alert("Sorry, you cannot claim this shift.")
    }
  };
})

.controller('PartnerCtrl', function($scope, UserService, PartnerService, MyShift) {

  $scope.$on("update", function() {
    $scope.data = {
      canVote    : PartnerService.canVote(),
      canApprove : PartnerService.canApprove(),
      partnerInfo: PartnerService.getPartnerInfo()

    }
  })

  $scope.$on('$ionicView.enter', function() {
    if (!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
    // only go in here if the user has reached this page through our connect function
    var ex = MyShift.getCode();
    if (ex === 'abc') {


      PartnerService.filterMyPickups();
      // one function to set userID, shiftID, and pickupShiftID instead of three
      PartnerService.setPartnerInfo();      
      // PartnerService.setUserID();
      // PartnerService.setShiftID();
      // PartnerService.setPickupShiftID();
      PartnerService.getPartnerProfile();
      

      $scope.upVote = function(){
        PartnerService.upVote();
      }

      $scope.downVote = function(){
        PartnerService.downVote();
      }

      $scope.reject = function(){
        PartnerService.reject();
      }

      $scope.newApprove = function(){
        PartnerService.newApprove();
      }

    } else {
      console.log("Thy should not be here at this point of time and space");
    }

  });

})

// .controller('PartnerCtrl', function($scope, $http, MyShift, UserService, Partner, $ionicModal, Maps) {

//   $scope.$on('$ionicView.enter', function() {
//     if (!UserService.isAuthenticated()) {
//       window.location = '#/lobby'
//     }
//   });
//   $scope.myApprovedShifts;
//   $scope.canVote = false;
//   $scope.canApprove = false;
//   $scope.myPickupShifts;

//   // only go in here if the user has reached this page through our connect function
//   var ex = MyShift.getCode();
//   if (ex === 'abc') {
//     // possible get request to db to fetch facebook profile data
//     // var data;

//     // MyShift.GetRequests()
//     //   .then(function(reqs) {
//     //     data = reqs;
//     //   })
//     MyShift.getAllPickups().then(function(shifts) {
//       $scope.myPickupShifts = shifts;
//       $scope.myApprovedShifts = $scope.myPickupShifts.filter(function(shift) {
//         return shift.approved;
//       })

//       // Check to see if user can vote on reps for the other user
//       var currentUser = Maps.getUser();
//       var currentTime = new Date();
//       $scope.myApprovedShifts.forEach(function(shift) {
//         var shiftTime = new Date(shift.shift_end);
//         // and not in the id of user is not in voted array :: TODO
//         if (!shift.voted && shift.approved && currentUser === shift.shift_owner && currentTime > shiftTime) {
//           $scope.canVote = true;
//         }else{
//           $scope.canVote = false;
//         }
//       })
//       console.log("My approved shifts ", $scope.myApprovedShifts)
//       $scope.myPickupShifts.forEach(function(shift) {
//         // and not in the id of user is not in voted array :: TODO
//         if (!shift.approved && currentUser === shift.shift_owner) {
//           $scope.canApprove = true;
//         }
//       })
//     })

//     //this needs better namings
//     var userId = MyShift.getPartnerId()[0];
//     var shiftId = MyShift.getPartnerId()[1];
//     var pickupShiftId = MyShift.getPartnerId()[2];
//     console.log("userId : ", userId);
//     console.log("this is the shiftId: ", shiftId);
//     var currShift;
//     $scope.upVote = function() {
//       Partner.vote(pickupShiftId, 'positive')
//         .then(function(res) {
//           alert("successfully upvoted this partner")
//           $scope.canVote = false;
//           //update the status of the local shitf so it cant be voted on again
//           currShift = $scope.myPickupShifts.filter(function(shift){
//             return shift._id === pickupShiftId
//           })
//           currShift.voted = false;
//         })
//         .catch(function(err) {
//           alert("could not upvote this partner")
//         })
//     }

//     $scope.downVote = function() {
//       Partner.vote(pickupShiftId, 'negative')
//         .then(function(res) {
//           alert("successfully downvoted this partner")
//           $scope.canVote = false;
//           //update the status of the local shitf so it cant be voted on again
//           currShift = $scope.myPickupShifts.filter(function(shift){
//             return shift._id === pickupShiftId
//           })
//           currShift.voted = false;
//         })
//         .catch(function(err) {
//           alert("could not downvote this partner")
//         })
//     }

//     $scope.reject = function() {
//       // console.log("this is the shiftId inside: ", shiftId);
//       // document.getElementById("approveShift").style.display = "none";
//       // document.getElementById("rejectShift").style.display = "none";
//       $scope.canApprove = false;
//       $http({
//         method: 'PATCH',
//         url: 'https://shift-it.herokuapp.com/shiftsreject',
//         data: {
//           shift_id: shiftId,
//           requester: userId
//         }
//       }).then(function(response) {
//         console.log("successfully added user to restricted.", response);
//       }).catch(function(err) {
//         console.log("Error adding to restricted: ", err);
//       });

//       $http({
//         method: 'PATCH',
//         url: 'https://shift-it.herokuapp.com/pickupreject',
//         data: {
//           pickup_shift_id: pickupShiftId
//         }
//       }).then(function successCallback(response) {
//         console.log("reject return: ", response.data);
//         alert("You have successfully rejected the shift.");

//       }, function errorCallback(response) {
//         alert("Could not reject the shift", response)
//       });
//     };

//     $scope.approve = function() {
//       // console.log("this is the shiftId inside the approve: ", shiftId);
//       document.getElementById("noticeMsg").innerHTML = 'A shift is waiting your approval';
//       // document.getElementById("approveShift").style.display = "none";
//       // document.getElementById("rejectShift").style.display = "none";
//       $scope.canApprove = false;
//       $http({
//         method: 'PATCH',
//         url: 'https://shift-it.herokuapp.com/pickup',
//         data: {
//           pickup_shift_id: pickupShiftId,
//           shift_id: shiftId
//         }
//       }).then(function successCallback(response) {
//         console.log("approve return: ", response.data);
//         alert("You have successfully approved the shift.");

//       }, function errorCallback(response) {
//         alert("Could not approve the shift", response)
//       });
//     };

//     $scope.partnerInfo = {
//       name: "",
//       email: "",
//       phone: "",
//       userRep: "",
//       facebookPic: "",
//       shiftId: shiftId
//     };

//     $http({
//       method: 'GET',
//       url: 'https://shift-it.herokuapp.com/user/id/' + userId,
//     }).then(function(data) {
//       console.log("data here is: ", data)
//       var data = data.data;
//       $scope.partnerInfo.name = data.firstName + ' ' + data.lastName;
//       $scope.partnerInfo.email = data.email;
//       $scope.partnerInfo.facebookPic = data.profilePicture;
//       $scope.partnerInfo.phone = data.phone;
//       $scope.partnerInfo.userRepPos = data.rating.positive;
//       $scope.partnerInfo.userRepNeg = data.rating.negative;

//     }).catch(function(err) {
//       alert("Could not get partner profile.")
//     });

//   } else {
//     console.log("Thy should not be here at this point of time and space");
//   }

//   // The following code is for the messenger service!!!!!!!!!!!!!!!!!!!!!
//   // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   // !!!!!!!!!!!!!Not Implemented!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//   // $ionicModal.fromTemplateUrl('templates/messageModal.html', {
//   //   scope: $scope
//   // }).then(function(modal) {
//   //   $scope.modal = modal;
//   // });

//   // $scope.message = function() {
//   //   $scope.modal.show();
//   //   $http({
//   //     method: 'GET',
//   //     url: 'https://shift-it.herokuapp.com/messages/id/' + userId + '/partner/' + Maps.getUser(),
//   //   }).then(function(data) {
//   //     console.log("data here is: ", data)
//   //       // var data = data.data;
//   //       // $scope.partnerInfo.name = data.firstName + ' ' + data.lastName;
//   //       // $scope.partnerInfo.email = data.email;
//   //       // $scope.partnerInfo.facebookPic = data.profilePicture;
//   //       // $scope.partnerInfo.phone = data.phone;
//   //       // $scope.partnerInfo.userRep = "Awesome!";

//   //   }).catch(function(err) {
//   //     alert("Could not get partner profile.")
//   //   });
//   // }

//   // $scope.closeMessage = function() {
//   //   $scope.modal.hide();
//   // };

//   // $scope.sendMessage = function(message) {

//   //   var date = new Date();
//   //   console.log(date);
//   //   var messageBody = {
//   //     sent_by: Maps.getUser(),
//   //     sent_to: userId,
//   //     message: message,
//   //     read: false,
//   //     dtg: date
//   //   }
//   //   console.log("message body is: ", messageBody)

//   //   $http({
//   //     method: 'POST',
//   //     url: 'https://shift-it.herokuapp.com/messages',
//   //     data: messageBody
//   //   }).then(function(response) {
//   //     console.log("message submitted to database with shift data: ", messageBody);
//   //     alert("Your message has been sent!");
//   //     $scope.closeMessage();
//   //   }, function(error) {
//   //     console.log("error posting message to db")
//   //   })
//   // }
// })

.controller('ShiftController', function($scope, $rootScope, MyShift, $http, $state, UserService) {
  $scope.$on('$ionicView.enter', function() {
    if (!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
  });

  $scope.postedpending = [];
  $scope.postedunclaimed = [];
  $scope.postedapproved = [];
  $scope.pickedpending = [];
  $scope.pickedrejected = [];
  $scope.pickedapproved = [];
  
  MyShift.GetMyShifts()
  .then(function(shifts){
    console.log("shifts_posted: ", shifts);
    $scope.postedunclaimed = shifts.filter(function(x){
      return x.covered===false && x.requested.length<1;
    });
    $scope.postedpending = shifts.filter(function(x){
      return x.covered===false && x.requested.length>=1;
    });
    $scope.postedapproved = shifts.filter(function(x){
      return x.covered===true;
    });
  })
  .then(function(){
    if ($scope.postedpending.length > 0) {
      $scope.postedpending.forEach(function(shiftreq){
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

  MyShift.GetShiftsIPickedUp()
  .then(function(shifts){
    $scope.pickedrejected = shifts.filter(function(x){
      return x.rejected===true;
    });
    $scope.pickedpending = shifts.filter(function(x){
      return !x.rejected && x.approved===false ;
    });
    $scope.pickedapproved = shifts.filter(function(x){
      return x.approved===true;
    })
  });


  $scope.delete = function(shift) {
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
        $scope.postedunclaimed.filter(function(x){x.shift_id!==response.config.data._id});
        $rootScope.badgeCount = $scope.postedpending.length;
      }, function errorCallback(response) {
        alert("Could not delete the shift", response)
      });
    }
  };

  $scope.connect = function(claimant) {
    var userId = claimant.claimant_id;
    var shiftid = claimant.shift_id;
    var partName = claimant.claimant_name;
    var pickshift = claimant.pickup_id;
    MyShift.setPartnerId(userId, shiftid, 'abc', pickshift, partName);
    window.location = '#/tab/partner'
  };

  $scope.connectAfter = function(shift) {
    var userId = shift.covered_by;
    var shiftid = shift._id;
    var partName = shift.covered_by_name;
    var pickshift = shift.pickup_approved;
    MyShift.setPartnerId(userId, shiftid, 'abc', pickshift, partName);
    window.location = '#/tab/partner'
  };

})


