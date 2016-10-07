(function() {
  "use strict";

  angular
    .module('profile')
    .factory('ProfileService', ProfileService);

  function ProfileService($rootScope, $http) {

    var profileData = {};

    var editProfile = {};

    var formatPhoneNumber = function(phone) {
      var s2 = ("" + phone).replace(/\D/g, '');
      var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
      return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
    };

    return {

      getUserData: function() {
        $http({
          method: 'GET',
          url: 'https://shift-it.herokuapp.com/getProfileInfo'
        }).then(function successCallback(response) {
          profileData = response.data[0];
          $rootScope.$broadcast('update');
        }, function errorCallback(response) {
          alert("There was a problem with the server, please try again later.");
        });
      },

      submitProfile: function() {
        editProfile.phone = formatPhoneNumber(editProfile.phone);
        if (!editProfile.phone) {
          // Match fail
          alert("Please check your phone number and try again.");
        } else {
          // Match pass
          $http({
            method: 'PATCH',
            url: 'https://shift-it.herokuapp.com/users',
            data: editProfile,
          }).then(function successCallback(response) {
            profileData = response.data;
            $rootScope.$broadcast('update');
          }, function errorCallback(response) {
            alert("Failure to update profile");
          })
        }
      },

      fillEditProfile: function() {
        editProfile.firstName = profileData.firstName;
        editProfile.lastName = profileData.lastName;
        editProfile.email = profileData.email;
        editProfile.phone = profileData.phone || '';
      },

      getProfileData: function() {
        return profileData;
      },

      getEditProfile: function() {
        return editProfile;
      }

    }

  };
})();