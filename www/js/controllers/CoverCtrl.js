angular.module('cover.controller', [])

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
    CoverService.resetFields();
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