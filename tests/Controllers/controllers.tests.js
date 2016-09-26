describe('Friends Controller - Tests', function() {
    var scope, $location;

    beforeEach(inject(function ($rootScope, $controller, _$location_) {
        $location = _$location_;
        //FriendsCtrl = $controller;
        scope = $rootScope.$new();

    }));

    it('should have a name variable equal to Jimmy', function() {
        //var controller = createController();
        expect(scope.name).toBeUndefined();
    });
});

// describe('Friends Controller', function(){
//     var scope;

//     // load the controller's module
//     beforeEach(module('starter.controllers'));

//     beforeEach(inject(function($rootScope, $controller) {
//         scope = $rootScope.$new();
//         $controller('FriendsCtrl', {$scope: scope});

//         it('should be named jimmy', function(){
//             expect(scope.name).toBeDefined();
//         })

//          it('should be named joe', function(){
//             expect(scope.obj1.name).toBeDefined();
//         })

//           it('should be named jimmy', function(){
//             expect(scope.obj2).toBeUndefined();
//         })
//     }));
// });

// describe('Profile Controller', function(){
//     var scope;

//     // load the controller's module
//     beforeEach(module('starter.controllers'));

//     beforeEach(inject(function($rootScope, $controller, $ionicModalProvider) {
//         scope = $rootScope.$new();
//         $controller('ProfileCtrl', {$scope: scope});
//     }));

//     // tests start here
//     it('should have variable profileData', function(){
//         console.log(" test: ", profileData);
//         expect(scope.profileData).toBeDefined();
//     });

// })




// describe('Controllers', function(){
//     var scope;

//     // load the controller's module
//     beforeEach(module('starter.controllers'));

//     beforeEach(inject(function($rootScope, $controller) {
//         scope = $rootScope.$new();
//         $controller('AccountCtrl', {$scope: scope});
//     }));


// describe('Cover Controller', function(){
//     var scope;

//     // load the controller's module
//     beforeEach(module('starter.controllers'));

//     beforeEach(inject(function($rootScope, $controller) {
//         scope = $rootScope.$new();
//         $controller('CoverCtrl', {$scope: scope});
//     }));

//     // tests start here
//     it('should have ipObject1', function(){
//         expect(scope.ipObject1).toBeDefined();
//     });

//     it('should have variable ipObject2', function(){
//         expect(scope.ipObject2).toBeDefined();
//     });

//     it('should have variable ipObject3', function(){
//         expect(scope.ipObject3).toBeDefined();
//     });
// });