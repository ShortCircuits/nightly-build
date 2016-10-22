angular.module('starter.directives', [])

.directive('map', function(Main) {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function($scope, $element, $attr) {

      function initialize() {

        var mapOptions = {}
        var location = Main.getLocation();

        if(location){
          mapOptions = {
            center: new google.maps.LatLng(location.lat,location.lng),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
        }else{
          mapOptions = {
            center: new google.maps.LatLng(30.316544599999998, -97.8210366),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
        }

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        $scope.onCreate({
          map: map
        });

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener(document.getElementById("map"), 'mousedown', function(e) {
          e.preventDefault();
          return false;
        });
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
})

.factory('Partner', function($http) {

  return {
    vote: function(shift, rep) {
      var voteRep = new Promise(
        function(resolve, reject) {
          $http({
            method: 'PATCH',
            url: 'https://shift-it.herokuapp.com/rateuser',
            data: {
              'pickup_shift_id': shift,
              'rep': rep
            }
          }).then(function(response) {
            resolve(response);
          }, function(response) {
            reject(response)
          })
        })
      return voteRep;
    }
  }
})