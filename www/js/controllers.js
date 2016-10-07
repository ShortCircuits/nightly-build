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

    // variable to determine if user is logged in or not
    $scope.loggedIn = UserService.isAuthenticated();
    console.log("im logged in: ", $scope.loggedIn);

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

.controller('PickupCtrl', function($scope, UserService, $ionicLoading, PickupService) {

  $scope.sortorder = 'shift.prize';

  $scope.availableShifts;

  $scope.$on('$ionicView.enter', function() {
    if (!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
    $ionicLoading.show();
    PickupService.getShiftsNearMe()
  

  });

  $scope.$on('update', function() {
    $scope.availableShifts = PickupService.availableShifts();
  });

  $scope.pickupShift = function(shift) {
    PickupService.pickupShift(shift);
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


