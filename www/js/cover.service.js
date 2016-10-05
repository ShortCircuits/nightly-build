(function(){
  "use strict";

  angular
    .module('starter')
    .factory('CoverService', CoverService);

  function CoverService($rootScope, $ionicModal, ionicDatePicker, ionicTimePicker, $http, UserService) {
    var home_store = null;
    var submitted_by_name = null;
    var shiftDate;
    var startTime;
    var endTime;
    var prize = 0;
    var shift = {
      covered : false
    };

    var convertMinutes = function(minutes) {
      if (minutes === 0) {
        return "00"
      }
      return minutes;
    };

    var ipObj1 = {
      callback: function(val) { //Mandatory
        shift.shift_start = new Date(val);
        shift.shift_end = new Date(val);
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        console.log("shiftData is: ", shift);
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        CoverService.openTimePicker1();
        shiftDate = shift.shift_start.getUTCDate() + " " + monthNames[shift.shift_start.getUTCMonth()] + " " + shift.shift_start.getUTCFullYear()

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
      from: new Date(2016, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(), //Optional
      mondayFirst: false, //Optional
      // disableWeekdays: [0],       //Optional
      closeOnSelect: false, //Optional
      templateType: 'popup' //Optional
    };

    var ipObj2 = {
      callback: function(val) { //Mandatory
        if (typeof(val) === 'undefined' || shift.shift_start === undefined) {
          alert('Please pick a shift date first!');
          return;
        } else {
          var splitStart = shift.shift_start.toString().split(' ');
          var selectedTime = new Date(val * 1000);
          splitStart[4] = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes()) + ":00";
          shift.shift_end = new Date(splitStart.join(' '));
          console.log(shift);
          console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
        }
        CoverService.prizePicker();
        endTime = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes());
      },
      inputTime: 50400, //Optional
      format: 12, //Optional
      step: 15, //Optional
      setLabel: 'Set2' //Optional
    };

    var ipObj3 = {
      callback: function(val) { //Mandatory
        if (typeof(val) === 'undefined' || shift.shift_start === undefined) {
          alert('Please pick a shift date first!');
          return;
        } else {
          var splitStart = shift.shift_start.toString().split(' ');
          var selectedTime = new Date(val * 1000);
          splitStart[4] = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes()) + ":00";
          shift.shift_start = new Date(splitStart.join(' '));
          console.log("our built time is: ", splitStart);
          console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
        }
        CoverService.openTimePicker2();
        startTime = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes());
      },
      inputTime: 50400, //Optional
      format: 12, //Optional
      step: 15, //Optional
      setLabel: 'Set2' //Optional
    };


    return {

      setHomeLocForShift : function() {
        $http({
          method: 'GET',
          url: 'https://shift-it.herokuapp.com/getProfileInfo'
        }).then(function successCallback(response) {
          home_store = response.data[0].home_store;
          submitted_by_name = response.data[0].firstName + " " + response.data[0].lastName;
          $rootScope.$broadcast('update');
        }, function errorCallback(response) {
          console.log("Failed to set home location in CoverCtrl");
        });
      },

      postShift : function(data) {
        if (shiftDate === undefined) {
          alert("Please enter a date for your shift!")
        } else if (startTime === undefined) {
          alert("Please enter a start time for your shift!")
        } else if (endTime === undefined) {
          alert("Please enter an end time for your shift!")
        } else {
          shift.shift_text_time = CoverService.makeTextTime(shift); 
          $http({
            method: 'POST',
            url: 'https://shift-it.herokuapp.com/shifts',
            data: shift
          }).then(function(response) {
            alert("Your shift has been added!");
            window.location = "#/tabs/map";
          }, function(error) {
            console.log("We apologize but we could not post your shift at this time, please reload the app and try again")
          })
        }
      },

      makeTextTime : function(data) {
        var textStart = data.shift_start;
        var textEnd = data.shift_end;
        var p1 = textStart.toDateString();
        var p2 = textStart.toLocaleTimeString();
        p1 = p1.slice(0, -5);
        p2 = p2.slice(0, -6) + p2.slice(-3);
        var p3 = textEnd.toLocaleTimeString();
        p3 = p3.slice(0, -6) + p3.slice(-3);
        return p1 + " from " + p2 + " to " + p3;
      },

      openDatePicker : function() {
        ionicDatePicker.openDatePicker(ipObj1);
      },

      openTimePicker1 : function() {
        ionicTimePicker.openTimePicker(ipObj3);
      },

      openTimePicker2 : function() {
        ionicTimePicker.openTimePicker(ipObj2);
      },

      increment : function() {
        prize += 5;
        $rootScope.$broadcast('update');
      },

      decrement : function() {
        if (prize > 0) {
          prize -= 5;
          $rootScope.$broadcast('update');
        }
      },

      prizePicker : function(modal) {
        modal.show();
      },

      // Function to submit the prize to the shift object
      addPrize : function(prizeAmount) {
        shift.prize = "$" + prizeAmount + ".00";
        console.log(shift);
        CoverService.closePrize();
      },

      // Function to close the prize modal
      closePrize : function() {
        $scope.modal.hide();
      },

      shift : function() {
        return shift;
      }

      prize : function() {
        return prize;
      }

    } 
  }
})();