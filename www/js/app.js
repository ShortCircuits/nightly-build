angular.module('starter', ['ionic','satellizer', 'ionic-datepicker', 'ionic-timepicker', 'starter.controllers', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider, ionicTimePickerProvider, $authProvider ) {
var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

  var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 12,
      step: 15,
      setLabel: 'Set',
      closeLabel: 'Close'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);

    //this is for Satellizer and providing our authorization functionality
    var commonConfig = {
        popupOptions: {
        location: 'no',
        toolbar: 'yes',
        width: window.screen.width,
        height: window.screen.height
                        }
    };

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
        	commonConfig.redirectUri = 'http://localhost:8100/';
    }
    $authProvider.facebook(angular.extend({}, commonConfig, {
        clientId: '1169374106434305',
        url: 'https://shift-it.herokuapp.com/auth/facebook',
    }));	

$stateProvider

.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.cover', {
    url: '/cover',
    views: {
      'menuContent': {
        templateUrl: 'templates/cover.html',
        controller: 'CoverCtrl'
      }
    }
  })

  .state('app.friends', {
    url: '/friends',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsCtrl'
      }
    }
  })

  .state('app.friend-detail', {
    url: '/friend/:friendId',
    views: {
      'menuContent': {
        templateUrl: 'templates/friend-detail.html',
        controller: 'FriendDetailCtrl'
      }
    }
  })

  .state('app.partner', {
    url: '/partner',
    views: {
      'menuContent': {
        templateUrl: 'templates/partner.html',
        controller: 'PartnerCtrl'
      }
    }
  })

  .state('app.tab', {
    url: "/tab",
    views: {
      'menuContent': {
        templateUrl: "templates/tabs.html"
      }
    }
  })

  .state('app.tab.pickup-list', {
    url: '/pickup-list',
    views: {
      'tab-pickup-list': {
        templateUrl: 'templates/pickup-list.html',
        controller: 'PickupCtrl'
      }
    }
  })
  // Each tab has its own nav history stack:

  .state('app.tab.cover', {
    url: '/cover2',
    views: {
      'tab-cover': {
        templateUrl: 'templates/cover.html',
        controller: 'CoverCtrl'
      }
    }
  })

  .state('app.tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/settings.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('app.tab.myshifts', {
    url: '/myshifts',
    views: {
      'tab-myshifts': {
        templateUrl: 'templates/myshifts.html',
        controller: 'MyShiftsCtrl'
      }
    }
  })


	// // .state('app', {
 // //    url: '/app',
 // //    abstract: true,
 // //    templateUrl: 'templates/menu.html',
 // //    controller: 'AppCtrl'
 // //  })

 // //  .state('app.profile', {
 // //    url: '/profile',
 // //    views: {
 // //      'menuContent': {
 // //        templateUrl: 'templates/profile.html',
 // //        controller: 'ProfileCtrl'
 // //      }
 // //    }
 // //  })
 //  .state('tab', {
 //      url: "/tab",
 //      abstract: true,
 //      templateUrl: "templates/tabs.html"
 //    })

 //  // .state('app.tab', {
 //  //   url: "/tab",
 //  //   views: {
 //  //     'menuContent': {
 //  //       templateUrl: "templates/tabs.html"
 //  //     }
 //  //   }
 //  // })

 //  .state('tab.pickup-list', {
 //    url: '/pickup-list',
 //    views: {
 //      'tab-pickup-list': {
 //        templateUrl: 'templates/pickup-list.html',
 //        controller: 'PickupCtrl'
 //      }
 //    }
 //  })
 //  // Each tab has its own nav history stack:

 //  .state('tab.cover', {
 //    url: '/cover2',
 //    views: {
 //      'tab-cover': {
 //        templateUrl: 'templates/cover.html',
 //        controller: 'CoverCtrl'
 //      }
 //    }
 //  })

 //  .state('tab.map', {
 //    url: '/map',
 //    views: {
 //      'tab-map': {
 //        templateUrl: 'templates/map.html',
 //        controller: 'MapCtrl'
 //      }
 //    }
 //  })

 //  .state('app', {
 //    url: '/app',
 //    abstract: true,
 //    templateUrl: 'templates/menu.html',
 //    controller: 'AppCtrl'
 //  })

 //  .state('app.profile', {
 //    url: '/profile',
 //    views: {
 //      'menuContent': {
 //        templateUrl: 'templates/profile.html',
 //        controller: 'ProfileCtrl'
 //      }
 //    }
 //  })



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/tab/map');
})	