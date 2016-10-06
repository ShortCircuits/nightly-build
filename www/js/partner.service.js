(function(){
  "use strict";

  angular
    .module('starter')
    .factory('PartnerService', PartnerService);

  function PartnerService($rootScope, $ionicModal, ionicDatePicker, ionicTimePicker, $http) {