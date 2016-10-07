angular.module('profile.controller', [])

.controller('ProfileCtrl', function($scope, $http, $ionicModal, UserService, ProfileService) {

  $scope.$on('update', function() {
    $scope.data = {
      profile: ProfileService.getProfileData(),
      editProfile: ProfileService.getEditProfile(),
    }
  });

  $scope.$on('$ionicView.enter', function() {
    if (!UserService.isAuthenticated()) {
      window.location = '#/lobby'
    }
    ProfileService.getUserData();

    // Open and close the modal to edit Profile
    $ionicModal.fromTemplateUrl('templates/editProfile.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the edit profile modal to close it
    $scope.closeEditProfile = function() {
      $scope.modal.hide();
    };

    // Open the edit profile modal
    $scope.openEditProfile = function() {
      ProfileService.fillEditProfile();
      $scope.modal.show();
    };

    // Functionality for editProfile modal
    $scope.submitProfile = function() {
      ProfileService.submitProfile()
      $scope.closeEditProfile();
    };

  });
})