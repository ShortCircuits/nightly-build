angular.module('main', ['ionic', 'satellizer', 'maps.controller', 'starter.directives']);
angular.module('profile', ['ionic', 'satellizer', 'profile.controller']);
angular.module('starter', ['ionic', 'satellizer', 'ionic-datepicker', 'ionic-timepicker', 'starter.controllers', 'starter.directives','main', 'profile', 'cover.controller'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider, ionicTimePickerProvider, $authProvider) {
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
///////////////////////////////////////////////////
// Remove this if statement for deployed version //
///////////////////////////////////////////////////
  // if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
  //   commonConfig.redirectUri = 'http://localhost:8100/';
  // }
///////////////////////////////////////////////////
//    Must be there for the app build though     //
///////////////////////////////////////////////////
  $authProvider.facebook(angular.extend({}, commonConfig, {
    clientId: '1169374106434305',
    url: 'https://shift-it.herokuapp.com/auth/facebook'
  }));

  $stateProvider

  .state('lobby', {
    url: '/lobby',
    templateUrl: 'templates/lobby.html',
    controller: 'AppCtrl'
  })

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  .state('tab.pickup-list', {
    url: '/pickup-list',
    views: {
      'tab-pickup-list': {
        templateUrl: 'templates/pickup-list.html',
        controller: 'PickupCtrl'
      }
    }
  })

  .state('tab.cover', {
    url: '/cover2',
    views: {
      'tab-cover': {
        templateUrl: 'templates/cover.html',
        controller: 'CoverCtrl'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    cache: false,
    views: {
      'tab-map': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.myshifts', {
    url: '/myshifts',
    cache: false,
    views: {
      'tab-myshifts': {
        templateUrl: 'templates/myshifts.html',
        controller: 'ShiftController'
      }
    }
  })

  .state('tab.partner', {
    url: '/partner',
    views: {
      'tab-myshifts': {
        templateUrl: 'templates/partner.html',
        controller: 'PartnerCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/settings.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-settings': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('lobby');
});
