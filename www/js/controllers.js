angular.module('starter.controllers', [])

  .controller('MapCtrl', function($scope, $rootScope, $ionicLoading, $timeout, $http, Maps, AvailableShifts, UserService) {
    $scope.myStoreInfo = {};
    $scope.map;
    $scope.infowindow = new google.maps.InfoWindow();
    $scope.location = Maps.getLocation();
    $scope.user;

    $scope.$on('$ionicView.enter', function() {
      if(!UserService.isAuthenticated() ) {
        window.location = '#/lobby'
      }
      $scope.notification();
      console.log('Opened!')
      ionic.trigger('resize');
    })
    $scope.show = function() {
      $ionicLoading.show({
        template: '<p>Loading please wait..</p><ion-spinner icon="lines"></ion-spinner>',
        noBackdrop: true
      });
    };

    $scope.hide = function() {
      $ionicLoading.hide();
    };

    $scope.show($ionicLoading);

    document.getElementById("pickupshift").style.display = 'none';
    document.getElementById("covermyshift").style.display = 'none';
    document.getElementById("loading").style.display = 'none';

    $timeout(function() {
      document.getElementById("pickupshift").style.display = 'block';
      document.getElementById("covermyshift").style.display = 'block';
      $scope.hide($ionicLoading);
      //document.getElementById("loading").style.display = 'none';

    }, 4000);

    window.cover = function() {
      window.location = "#/app/tab/pickup-list"
    }

    // sets the store the user works at :: TODO
    window.setMyStore = function(storeId, address) {
      var myStoreObj = {
        storeId: storeId,
        address: address
      }
      var confirmation = confirm("Set your home store as " + address + "?");
      if (confirmation) {
        Maps.setMyStore(myStoreObj).then(function (response) {
          console.log("home store set as: ", response)
        }).catch(function(res){
          alert(res)
        })
      }
    }

    // Notifications
    $scope.notification = function() {
      document.getElementById("notification").style.display = 'none';

      // Get user Id from server
      Maps.whoAmI()
        .then(function(user) {
          $scope.user = user;
          console.log("whoami endpoint returning: ", user)
        })
        .catch(function(err) {
          console.log("Could not get user id")
        })

      // Make request to the server too see if 
      // there are any notification for the user
      Maps.getPickupNotifications()
        .then(function(response) {
          if (response[0] && response[0].approved === true) {
            document.getElementById("noticeMsg").innerHTML = 'You have a shift approved';
            document.getElementById("accepto").setAttribute("onclick", "cover()")
          } else if (response[0] && response[0].approved === false) {
            $rootScope.badgeCount = response.length;
            document.getElementById("noticeMsg").innerHTML = 'A shift is waiting your approval';
            document.getElementById("accepto").setAttribute("onclick", "approve()")
          }
          if (response.length > 0) {
            // user has notification
            document.getElementById("notification").style.display = 'block';
          }
        })
        .catch(function(err) {
          console.log("Could not get user notifications")
        })
    };

    window.approve = function() {
      window.location = "#/tab/myshifts";
    };

    $scope.pickupShiftPage = function() {
      $location = "app.pickup-list"
    };

    // Pickup a shift page
    $scope.pickup = function() {
      
      $scope.show($ionicLoading);
      $scope.centerOnMe();
      document.getElementById("pickupshift").style.display = 'none';
      document.getElementById("covermyshift").style.display = 'none';
      // could be better needs to pickup data from controler 
      // if exists otherwise do another request
      Maps.fetchStores().then(function(stores){
        markerBuilder(stores);
        $scope.hide($ionicLoading);
      })
      
    };

    $scope.zipSearch = function(zipOrCity) {
      document.getElementById("pickupshift").style.display = 'none';
      document.getElementById("covermyshift").style.display = 'none';
      Maps.searchByZip(zipOrCity).then(function(response){
        centerOnSearch(response.location.lat, response.location.lng);
        markerBuilder(response)
        $scope.hide($ionicLoading);
      }).catch(function(err){
        alert("Could not get stores from the server, please try again later");
        $scope.hide($ionicLoading);
      })
    }

    $scope.mapCreated = function(map) {
      $scope.map = map;
    };

    function centerOnSearch(lat, lng) {
      $scope.map.setCenter(new google.maps.LatLng(lat, lng));
    }

    $scope.centerOnMe = function() {
      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      Maps.getMyPos().then(function(pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.lat, pos.lng));
        $scope.location = Maps.getLocation();
        Maps.fetchStores().then(function(res){
          $ionicLoading.hide();
        });
      })
    };

    $scope.centerOnMe();
    
    function markerBuilder(results, status) {
      for (var i = 0; i < results.results.length; i++) {
        createMarker(results.results[i]);
      }
    }

    function createMarker(place) {
      var loc = place.geometry.location;
      var icons = ''
      if (!place.shifts) {
        icons = 'img/marker-gray.png'
      }
      var marker = new google.maps.Marker({
        position: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        animation: google.maps.Animation.DROP,
        icon: icons
      });

      marker.setMap($scope.map);
      google.maps.event.addListener(marker, 'click', function() {
        var info = "";
        if (place.shifts) {
          place.shifts.forEach(function(shift) {
            var shiftObj = {};
            shiftObj.store = place.vicinity;
            shiftObj.start = shift.shift_start;
            shiftObj.end = shift.shift_end;
            shiftObj.postedby = shift.submitted_by;
            shiftObj.postedby_name = shift.submitted_by_name;
            shiftObj.prize = shift.prize;
            shiftObj.id = shift._id;
            AvailableShifts.addShift(shiftObj);
            info += "<li><p class='marker1'>" + place.name + 
              "</p><p class='marker2'>" + place.vicinity + 
              "</p><p class='marker3'>" + shift.submitted_by_name + " needs someone to cover a shift" +
              "</p><p class='marker4'>" + shift.shift_text_time + 
              "</p><p class='marker5'>Prize: " + shift.prize + 
              "</p><button class='marker6' onclick='window.location=\"#/tab/pickup-list\"'>Take shift</button></li>";
                      });
        } else {
          info = "<li>" + place.vicinity + "</li><br /><li>No shifts available for this store</li>"
        }
        // marker popup window
        $scope.infowindow.setContent(
          "<ul class='infowindow'><li><button onclick=\"setMyStore('" + place.place_id + "', '" + place.vicinity + "')\">Set this store as my store</button></li>" + info + "</ul>"
        );
        $scope.infowindow.open($scope.map, this);
      });
    }
  })

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $interval, $timeout, UserService, $window) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $interval(function(){
       $scope.badgeCount = $rootScope.badgeCount;
    },2000);
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

    // Hamburger button active state switcher
    // There is a bug when clicking on tab buttons while sidemenu is open,
    // the menu gets closed but the class doesnt toggle
    $scope.isActive = false;
    $scope.activeButton = function() {
      $scope.isActive = !$scope.isActive;
    }

  })
  .controller('ProfileCtrl', function($scope, $http, $ionicModal, Profile, Maps, UserService) {

    $scope.profileData = {};

    $scope.$on('$ionicView.enter', function() {
      if(!UserService.isAuthenticated()) {
        window.location = '#/lobby'
      }

      if (!Maps.getUser()) {
        // Need to decide -- how to handle not-logged-in
        alert("Not logged in, friend!");
      } else {
        // Code you want executed every time view is opened
        $http({
          method: 'GET',
          url: 'https://shift-it.herokuapp.com/getProfileInfo'
        }).then(function successCallback(response) {
          $scope.profileData = response.data[0];
        }, function errorCallback(response) {
          // redirect to login page if user tries to reach profile page when not logged in
        });
      }

      $scope.editProfileTempData = {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      };

      $scope.fillEditTemp = function() {
        $scope.editProfileTempData.firstName = $scope.profileData.firstName;
        $scope.editProfileTempData.lastName = $scope.profileData.lastName;
        $scope.editProfileTempData.email = $scope.profileData.email;
        $scope.editProfileTempData.phone = $scope.profileData.phone || '';
      };

      $scope.clearEditTemp = function() {
        $scope.editProfileTempData.firstName = '';
        $scope.editProfileTempData.lastName = '';
        $scope.editProfileTempData.email = '';
        $scope.editProfileTempData.phone = '';
      };

      // Functionality for editProfile modal
      $scope.submitProfile = function() {
        $http({
          method: 'PATCH',
          url: 'https://shift-it.herokuapp.com/users',
          data: $scope.editProfileTempData,
        }).then(function successCallback(response) {
          $scope.profileData = response.data;
          $scope.closeEditProfile();
        }, function errorCallback(response) {
          alert("Failure to update profile");
          $scope.closeEditProfile();
        })
      }

      // Open and close the modal to edit Profile
      $ionicModal.fromTemplateUrl('templates/editProfile.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the edit profile modal to close it
      $scope.closeEditProfile = function() {
        $scope.modal.hide();
        $scope.clearEditTemp();
      };

      // Open the edit profile modal
      $scope.openEditProfile = function() {
        $scope.fillEditTemp();
        $scope.modal.show();
      };

    })
  })

// This controller handles the functionality for creating and posting a new shift.
.controller('CoverCtrl', function($scope, $ionicModal, ionicDatePicker, ionicTimePicker, $http, UserService) {
  $scope.shiftData = {covered: false};
  $scope.prize = 0;

  $scope.setHomeLocForShift = function() {
    $http({
      method: 'GET',
      url: 'https://shift-it.herokuapp.com/getProfileInfo'
    }).then(function successCallback(response) {
      $scope.shiftData.home_store = response.data[0].home_store;
      $scope.shiftData.submitted_by_name = response.data[0].firstName + " " + response.data[0].lastName;
    }, function errorCallback(response){
      console.log("Failed to set home location in CoverCtrl");
    });
  }

  $scope.$on('$ionicView.enter', function() {
     // Code you want executed every time view is opened
      if(!UserService.isAuthenticated()) {
        window.location = '#/lobby'
      }
     $scope.openDatePicker();
     $scope.setHomeLocForShift();
     console.log('Opened!')
  })  
  // This is the Date picker modal popout, that initializes the shift_start and shift_end keys in the shift object
  // On a chosen date it sets both values to the chosen date with no time, and then it shows the first time picker
  var ipObj1 = {
    callback: function(val) { //Mandatory
      $scope.shiftData.shift_start = new Date(val);
      $scope.shiftData.shift_end = new Date(val);
      var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      console.log("shiftData is: ", $scope.shiftData);
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.openTimePicker1();
      $scope.shiftDate = $scope.shiftData.shift_start.getUTCDate() + " " + monthNames[$scope.shiftData.shift_start.getUTCMonth()] + " " + $scope.shiftData.shift_start.getUTCFullYear()

      // var month = dateObj.getUTCMonth() + 1; //months from 1-12
      // var day = dateObj.getUTCDate();
      // var year = dateObj.getUTCFullYear();
    },
    disabledDates: [ //Optional
      new Date(2016, 2, 16),
      new Date(2015, 3, 16),
      new Date(2015, 4, 16),
      new Date(2015, 5, 16),
      new Date('Wednesday, August 12, 2015'),
      new Date("08-16-2016"),
      new Date(1439676000000)
    ],
    from: new Date(2012, 1, 1), //Optional
    to: new Date(2016, 10, 30), //Optional
    inputDate: new Date(), //Optional
    mondayFirst: true, //Optional
    // disableWeekdays: [0],       //Optional
    closeOnSelect: false, //Optional
    templateType: 'popup' //Optional
  };

  // This function converts the minutes into a 2 digit number if 0 is chosen
  function convertMinutes(minutes) {
    if (minutes === 0) {
      return "00"
    }
    return minutes;
  }

  // This is the modal for the end shift time picker, it will update the shift object with the correct time in the
  // current time zone for the user. On submit it opens the prize picker modal.
  var ipObj2 = {
    callback: function(val) { //Mandatory
      if (typeof(val) === 'undefined' || $scope.shiftData.shift_start === undefined) {
        alert('Please pick a shift date first!');
        return;
      } else {
        var splitStart = $scope.shiftData.shift_start.toString().split(' ');
        var selectedTime = new Date(val * 1000);
        splitStart[4] = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes()) + ":00";
        $scope.shiftData.shift_end = new Date(splitStart.join(' '));
        console.log($scope.shiftData);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
      }
      $scope.prizePicker();
      $scope.endTime = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes());
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Set2'    //Optional
  };

  // This is the modal for the start shift time picker, it will update the shift object with the correct time in the
  // current time zone for the user. On submit it opens the end shift time picker modal.
  var ipObj3 = {
    callback: function(val) { //Mandatory
      if (typeof(val) === 'undefined' || $scope.shiftData.shift_start === undefined) {
        alert('Please pick a shift date first!');
        return;
      } else {
        var splitStart = $scope.shiftData.shift_start.toString().split(' ');
        var selectedTime = new Date(val * 1000);
        splitStart[4] = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes()) + ":00";
        $scope.shiftData.shift_start = new Date(splitStart.join(' '));
        console.log("our built time is: ", splitStart);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
      }
      $scope.openTimePicker2();
      $scope.startTime = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes());
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Set2'    //Optional
  };

  // This shows the prize picker modal
  $ionicModal.fromTemplateUrl('templates/prizeModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Function for the end shift time picker
  $scope.openTimePicker1 = function() {
    ionicTimePicker.openTimePicker(ipObj3);
  };

  // Function for the start shift time picker
  $scope.openTimePicker2 = function() {
    ionicTimePicker.openTimePicker(ipObj2);
  };

  // Function for the date picker
  $scope.openDatePicker = function() {
    ionicDatePicker.openDatePicker(ipObj1);
  };

  $scope.increment = function(){
    $scope.prize += 5;
  }

  $scope.decrement = function(){
    if($scope.prize > 0){
      $scope.prize -= 5;
    }
  }

  // Function to show the prize picker
  $scope.prizePicker = function() {
    $scope.modal.show();
  }

  // Function to submit the prize to the shift object
  $scope.addPrize = function(prize) {
    $scope.shiftData.prize = "$" + prize + ".00";
    console.log($scope.shiftData);
    $scope.closePrize();
  };

  // Function to close the prize modal
  $scope.closePrize = function() {
    $scope.modal.hide();
  };

  $scope.makeTextTime = function(data) {
    var textStart = data.shift_start;
    var textEnd = data.shift_end;
    var p1 = textStart.toDateString();
    var p2 = textStart.toLocaleTimeString();
    p2 = p2.slice(0,-6) + p2.slice(-3);
    var p3 = textEnd.toLocaleTimeString();
    p3 = p3.slice(0,-6) + p3.slice(-3);
    var p4 = textStart.toString().slice(-6);
    return p1 + " from " + p2 + " to " + p3 + p4;
  };

  // Setting a variable to the fully fleshed out shiftData
  var shift = $scope.shiftData;

  // Server call to insert the shift data into the database.
  $scope.postShift = function() {
    if($scope.shiftDate === undefined){
      alert("Please enter a date for your shift!")
    } else if($scope.startTime === undefined){
      alert("Please enter a start time for your shift!")
    } else if($scope.endTime === undefined){
      alert("Please enter an end time for your shift!")
    } else {
      console.log("shift sent to db");
      shift.shift_text_time = $scope.makeTextTime(shift);
      $http({
        method: 'POST',
        url: 'https://shift-it.herokuapp.com/shifts',
        data: shift
      }).then(function(response){
        console.log("shift submitted to database with shift data: ", shift);
        alert("Your shift has been added!");
        window.location = "#/tabs/map";
      }, function(error){
        console.log("error posting shift to db")
      })
    }
  }
})

.controller('PickupCtrl', function($scope, $location, $state, $http, Maps, Pickup, UserService) {

  $scope.$on('$ionicView.enter', function() {
    if(!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
  });

  // $scope.availableShifts = AvailableShifts.getShifts();
  $scope.myId = Maps.getUser();
  // assuming the stores are in place on the Maps factory
  $scope.availableShifts = Maps.getShifts();

  // if there are no shifts available make another request;
  if(!$scope.availableShifts){
    Maps.getMyPos().then(function(pos){
      Maps.fetchStores().then(function(res){
        $scope.availableShifts = Maps.getShifts();
        addPrizeNum()
      })
    })
  }
  addPrizeNum()
  function addPrizeNum(){
    if($scope.availableShifts){
      $scope.availableShifts.map(function(shift){
        shift.prizeNum = parseInt(shift.prize.slice(1));
      })
      console.log($scope.availableShifts)
    }
  }

  $scope.sortorder = 'shift.prize';

  $scope.pickupShift = function(shift) {
    var theData = {
      shift_id: shift._id,
      shift_owner: shift.submitted_by,
      shift_owner_name: shift.submitted_by_name,
      shift_where: shift.home_store.address,
      shift_when: shift.shift_text_time,
      shift_prize: shift.prize
    };
    var notifyUser = function() {
        //Needs to go to different page
        window.location = "#/tab/map";
        console.log("shift requested")
      }
      // test if shift owner is claiming their own shift
    if ($scope.myId != shift._id) {

      Pickup.pickUpShift(theData).then(function(response){
        alert("successfully requested a shift")
      }).catch(function(err){
        alert("Could not post shift to server, please try again later")
      })
    } else {
      alert("Sorry, you cannot claim this shift.")
    }

  };

})

.controller('PartnerCtrl', function($scope, $http, MyShift, UserService, Partner) {

  $scope.$on('$ionicView.enter', function() {
    if(!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
  });
  
  var ex = MyShift.getCode();

  if (ex === 'abc' ) {

    // possible get request to db to fetch facebook profile data
    var data; 

    MyShift.GetRequests()
    .then(function(reqs){
      data = reqs;
    // console.log("data : ", data);
    })

    //this needs better namings
    var userId = MyShift.getPartnerId()[0];
    var shiftId = MyShift.getPartnerId()[1];
    var pickupShiftId = MyShift.getPartnerId()[2]
    console.log("userId : ", userId);
    console.log("this is the shiftId: ", shiftId);

    $scope.upVote = function(){
      Partner.vote(pickupShiftId, 'positive')
      .then(function(res){
        alert("successfully upvoted this partner")
      })
      .catch(function(err){
        alert("could not upvote this partner")
      })
    }
    
    $scope.downVote = function(){
      Partner.vote(pickupShiftId, 'negative')
      .then(function(res){
        alert("successfully downvoted this partner")
      })
      .catch(function(err){
        alert("could not downvote this partner")
      })
    }

    $scope.reject = function() {
      // console.log("this is the shiftId inside: ", shiftId);
      document.getElementById("approveShift").style.display = "none";
      document.getElementById("rejectShift").style.display = "none";
      
      $http({
        method: 'PATCH',
        url: 'https://shift-it.herokuapp.com/shiftsreject',
        data: {
          shift_id: shiftId,
          requester: userId
        }
      }).then(function(response){
        console.log("successfully added user to restricted.", response);
      }).catch(function(err){
        console.log("Error adding to restricted: ", err);
      });

      $http({
        method: 'PATCH',
        url: 'https://shift-it.herokuapp.com/pickupreject',
        data: {
          shift_id: shiftId
        }
      }).then(function successCallback(response) {
        console.log("reject return: ", response.data);
        alert("You have successfully rejected the shift.");

      }, function errorCallback(response) {
        alert("Could not reject the shift", response)
      });
    };

    $scope.approve = function() {
      // console.log("this is the shiftId inside the approve: ", shiftId);
      document.getElementById("noticeMsg").innerHTML = 'A shift is waiting your approval';
      document.getElementById("approveShift").style.display = "none";
      document.getElementById("rejectShift").style.display = "none";

      $http({
        method: 'PATCH',
        url: 'https://shift-it.herokuapp.com/pickup',
        data: {
          shift_id: shiftId
        }
      }).then(function successCallback(response) {
        console.log("aprove return: ", response.data);
        alert("You have successfully approved the shift.");

      }, function errorCallback(response) {
        alert("Could not aprove the shift", response)
      });
    };

    $scope.partnerInfo = {
      name: "",
      email: "",
      phone: "",
      userRep: "",
      facebookPic: "",
      shiftId: shiftId
    };

    $http({
      method: 'GET',
      url: 'https://shift-it.herokuapp.com/user/id/' + userId,
    }).then(function(data) {
      
      var data = data.data;
      $scope.partnerInfo.name = data.firstName + ' ' + data.lastName;
      $scope.partnerInfo.email = data.email;
      $scope.partnerInfo.facebookPic = data.profilePicture;
      $scope.partnerInfo.phone = "555-867-5309";
      $scope.partnerInfo.userRep = "Awesome!";
      
    }).catch(function(err) {
      alert("Could not get partner profile.")
    });

  } else {
    console.log("gtfo");
  }
})

// wishfull sudo programming 
// if the shift has been approved, 
// if the shift end time is in the past
// if the current logged in user is the user who owns the pickuped the shift
// set the $scope or $rootscope to true for the voting buttons

.controller('MyShiftCtrl', function($scope, Maps, MyShift, $http, $state, UserService) {
  
  $scope.$on('$ionicView.enter', function() {
    if(!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
  });
  // variable to store response from /myshifts
  $scope.myshiftsArray = [];
  $scope.iamWorking = [];
  $scope.myId = Maps.getUser();
  $scope.requests = Maps.getApprovals();
  
  $scope.connect = function(userId, shiftid, pickshift){
    MyShift.setPartnerId(userId, shiftid, 'abc', pickshift);
    // $state.go('tab.myshifts');
    window.location = '#/tab/partner'
  };

  $scope.delete = function(shift){
    console.log("the shift I want to delete is: ", shift);
    var deleteMe = confirm("Are you sure you wish to delete this shift?");
    if(deleteMe){
      $http({
        method: 'DELETE',
        url: 'https://shift-it.herokuapp.com/shifts',
        data: {_id: shift._id},
        headers: {"Content-Type": "application/json"}
      }).then(function successCallback(response) {
        $scope.myshiftsArray = $scope.myshiftsArray.filter(function(sheeft){
          return sheeft._id !== response.config.data._id;
        });
        alert("You have successfully deleted the shift.");
      }, function errorCallback(response) {
        alert("Could not delete the shift", response)
      });
    }
  };
  
  // Function from MyShift factory which pulls shifts the user has posted - endpoint => /myshifts
  MyShift.GetMyShifts()
    .then(function(myshifts) {
      $scope.myshiftsArray = myshifts;
      $scope.requests.forEach(function(pending){
        $scope.myshiftsArray.forEach(function(shift){
          if(pending.shift_id === shift._id){
            pending.shift = shift;
          }
        })
      })
    }).catch(function(err){
       alert("Could not fetch your shifts.", err);
    });

  MyShift.GetShiftsIPickedUp()
    .then(function(shiftsToWork) {
      $scope.iamWorking = shiftsToWork;
    }).catch(function(err){
       alert("Could not fetch shifts you have picked up", err);
    });

})


