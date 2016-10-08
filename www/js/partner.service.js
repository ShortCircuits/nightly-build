(function() {
	"use strict";

	angular
		.module('starter')
		.factory('PartnerService', PartnerService);

	function PartnerService($rootScope, $http, MyShiftsService, Main) {

		// data used by voting
		var myApprovedShifts;
		var canVote = false;
		var canApprove = false;
		var myPickupShifts;
		var codea;

		// data used by getPartnerProfile function
		var partnerInfo = {};

		// data used in accept or reject functionality
		var userId;
		var shiftId;
		var pickupShiftId;
		var requesterName;
		var currShift;

		var vote = function(shift, rep) {
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
						console.log("got response", response.data)
						resolve(response);
					}, function(response) {
						console.log(response)
						reject(response)
					})
				})
			return voteRep;
		};


		return {

			setPartnerInfo: function() {
				userId = MyShiftsService.getPartnerId()[0];
				shiftId = MyShiftsService.getPartnerId()[1];
				pickupShiftId = MyShiftsService.getPartnerId()[2];
				requesterName = MyShiftsService.getPartnerId()[3];
			},
			setUserID: function() {
				userId = MyShiftsService.getPartnerId()[0];
			},
			setShiftID: function() {
				shiftId = MyShiftsService.getPartnerId()[1];
			},
			setPickupShiftID: function() {
				pickupShiftId = MyShiftsService.getPartnerId()[2];
			},
			setRequesterName: function() {
				requesterName = MyShiftsService.getPartnerId()[3];
			},
			filterMyPickups: function() {
				MyShiftsService.getAllPickups()
					.then(function(shifts) {
						myPickupShifts = shifts;
						myApprovedShifts = myPickupShifts.filter(function(shift) {
								return shift.approved;
							})
							// Check to see if user can vote on reps for the other user
						var currentUser = Main.getUser();
						var currentTime = new Date();
						myApprovedShifts.forEach(function(shift) {
							var shiftTime = new Date(shift.shift_end);
							// and not in the id of user is not in voted array :: TODO
							if (!shift.voted && shift.approved && currentUser === shift.shift_owner && currentTime > shiftTime) {
								canVote = true;
							} else {
								canVote = false;
							}
						})
						console.log("My approved shifts ", myApprovedShifts)
						myPickupShifts.forEach(function(shift) {
							// and not in the id of user is not in voted array :: TODO
							if (!shift.approved && currentUser === shift.shift_owner) {
								canApprove = true;
							}
						})
						$rootScope.$broadcast('update');
					})
			},
			upVote: function() {
				vote(pickupShiftId, 'positive')
					.then(function(res) {
						alert("successfully upvoted this partner")
						canVote = false;
						//update the status of the local shitf so it cant be voted on again
						currShift = myPickupShifts.filter(function(shift) {
							return shift._id === pickupShiftId
						})
						currShift.voted = false;
						$rootScope.$broadcast('update');
					})
					.catch(function(err) {
						alert("could not upvote this partner")
					})
			},
			downVote: function() {
				vote(pickupShiftId, 'negative')
					.then(function(res) {
						alert("successfully downvoted this partner")
						canVote = false;
						//update the status of the local shitf so it cant be voted on again
						currShift = myPickupShifts.filter(function(shift) {
							return shift._id === pickupShiftId
						})
						currShift.voted = false;
						$rootScope.$broadcast('update');
					})
					.catch(function(err) {
						alert("could not downvote this partner")
					})
			},
			reject: function() {
				// console.log("this is the shiftId inside: ", shiftId);
				// document.getElementById("approveShift").style.display = "none";
				// document.getElementById("rejectShift").style.display = "none";
				canApprove = false;
				$http({
					method: 'PATCH',
					url: 'https://shift-it.herokuapp.com/shiftsreject',
					data: {
						shift_id: shiftId,
						requester: userId
					}
				}).then(function(response) {
					console.log("successfully added user to restricted.", response);
				}).catch(function(err) {
					console.log("Error adding to restricted: ", err);
				});

				$http({
					method: 'PATCH',
					url: 'https://shift-it.herokuapp.com/pickupreject',
					data: {
						pickup_shift_id: pickupShiftId
					}
				}).then(function successCallback(response) {
					console.log("reject return: ", response.data);
					$rootScope.$broadcast('update');
					alert("You have successfully rejected the shift.");

				}, function errorCallback(response) {
					alert("Could not reject the shift", response)
				});
			},
			approve: function() {
				// console.log("this is the shiftId inside the approve: ", shiftId);
				// document.getElementById("noticeMsg").innerHTML = 'A shift is waiting your approval';
				// document.getElementById("approveShift").style.display = "none";
				// document.getElementById("rejectShift").style.display = "none";
				canApprove = false;
				$http({
					method: 'PATCH',
					url: 'https://shift-it.herokuapp.com/pickup',
					data: {
						pickup_shift_id: pickupShiftId,
						shift_id: shiftId
					}
				}).then(function successCallback(response) {
					console.log("approve return: ", response.data);
					$rootScope.$broadcast('update');
					alert("You have successfully approved the shift.");

				}, function errorCallback(response) {
					alert("Could not approve the shift", response)
				});
			},
			newApprove: function() {
				canApprove = false;
				var obj = {
					'shiftId': shiftId,
					'pickupId': pickupShiftId,
					'requesterId': userId,
					'requesterName': requesterName
				};
				console.log("newApprove called, data: ", obj);
				$http({
					method: 'PATCH',
					url: 'https://shift-it.herokuapp.com/approval',
					data: obj
				}).then(function successCallback(response) {
					$rootScope.$broadcast('update');
					alert("You have successfully approved the shift.");
      		window.location = '#/tab/myshifts';
				}, function errorCallback(response) {
					alert("Could not approve the shift", response)
      		window.location = '#/tab/myshifts';
				});
			},
			// code which stops someone from accessing /partner directly
			getCode: function() {
				var something = codea;
				codea = null;
				return something;
			},
			myApprovedShifts: function() {
				return myApprovedShifts;
			},
			getPartnerInfo: function() {
				return partnerInfo;
			},
			canVote: function() {
				return canVote;
			},
			canApprove: function() {
				return canApprove;
			},
			myPickupShifts: function() {
				return myPickupShifts;
			},
			getPartnerProfile: function() {
				partnerInfo = {};
				$http({
					method: 'GET',
					url: 'https://shift-it.herokuapp.com/user/id/' + userId,
				}).then(function(response) {
					console.log("data here is: ", response)
					var data = response.data;
					partnerInfo.name = data.firstName + ' ' + data.lastName;
					partnerInfo.email = data.email;
					partnerInfo.facebookPic = data.profilePicture;
					partnerInfo.phone = data.phone;
					partnerInfo.userRepPos = data.rating.positive;
					partnerInfo.userRepNeg = data.rating.negative;
					$rootScope.$broadcast('update');
				}).catch(function(err) {
					alert("Could not get partner profile.")
				});
			}

		}

	}
})();