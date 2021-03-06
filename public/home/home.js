'use strict';

angular.module('myApp.home', [ 'ngRoute', 'myApp.home.service' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/home/:id', {
		templateUrl : 'home/home.html',
		controller : 'HomeCtrl'
	});
} ])

.controller('HomeCtrl', [ '$scope', '$routeParams', 'homeService', '$modal', function($scope, $routeParams, homeService, $modal) {

	$scope.toggleSwitch =function(_switch,state){
		homeService.toggleSwitch(_switch.gpio,state).then(function(res){
			_switch.state=res.data.state;
		});	
	} 

	var state = {};

	homeService.getState().then(function(res) {
		state = res.data;
		$scope.rooms = res.data.rooms;
		$scope.gpios = res.data.gpios;
		$scope.roomSelected = 0;

		for(var i in $scope.rooms){
			for(var j in $scope.rooms[i].switches){
				(function(i,j){
				homeService.getSwitchState($scope.rooms[i].switches[j].gpio).then(function(res){
					$scope.rooms[i].switches[j].state=res.data.state;
					console.log("%s %s %s %s",i,j,res.data.gpio,res.data.state);
				})
			})(i,j)
			}			
		}

	});

	$scope.getSwitches = function(index) {
		$scope.roomSelected = index;
	}

	$scope.openNewRoomModal = function() {
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'partials/new-room-modal.html',
			controller : 'NewRoomModalCtrl',
			resolve : {
				room : null
			}
		});

		modalInstance.result.then(function(modal) {
			var room = {
				name : modal.roomName,
				id : state.rooms.length,
				switches : []
			}
			state.rooms.push(room);

			homeService.setState(state).then(function(res) {
				$scope.rooms = state.rooms;
			}, function(res) {
				console.log(res);
			})

		}, function(res) {
			console.log(res);
		});
	}

	$scope.openNewSwitchModal = function() {
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'partials/new-switch-modal.html',
			controller : 'ModalInstanceCtrl',
			resolve : {
				room : function() {
					return $scope.rooms[$scope.roomSelected];
				},
				gpios : function() {
					return $scope.gpios;
				}
			}
		});

		modalInstance.result.then(function(modal) {

			var roomId = modal.room.id;

			var _switch = {
				name : modal.switchName,
				gpio : modal.gpio,
				id : state.rooms[roomId].switches.length
			}
			
			for(var i in state.gpios){
			    if(state.gpios[i]==modal.gpio){
			    	state.gpios.splice(i,1);
			        break;
			        }
			}
			
			state.rooms[roomId].switches.push(_switch);

			homeService.setState(state).then(function(res) {
				$scope.rooms = state.rooms;
				$scope.gpios = state.gpios;
			}, function(res) {
				console.log(res);
			})
		}, function() {

		});
	}

	$scope.openGpioDiagram = function() {
		var modalInstance = $modal.open({
			animation : $scope.animationsEnabled,
			templateUrl : 'partials/gpio.html'
		});
	}

	$scope.delSwitch = function(roomId,switchIndex) {
		console.log("deleting switch "+switchIndex+" from room "+roomId);
		state.gpios.push(Number(state.rooms[roomId].switches[switchIndex].gpio));
		state.rooms[roomId].switches.splice(switchIndex,1);
		updateState();
	}
	
	function updateState(){
		homeService.setState(state).then(function(res) {
			$scope.rooms = state.rooms;
			$scope.gpios = state.gpios;
		}, function(res) {
			console.log(res);
		})
	}

} ])

.controller('NewRoomModalCtrl', [ '$scope', '$modalInstance', 'room', function($scope, $modalInstance, room) {
	$scope.modal = {};
	if (room)
		$scope.modal.room = room;
	$scope.ok = function() {
		$modalInstance.close($scope.modal);
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
} ])

.controller('ModalInstanceCtrl', [ '$scope', '$modalInstance', 'room', 'gpios', function($scope, $modalInstance, room, gpios) {
	$scope.modal = {};
	$scope.gpios = gpios;
	if (room)
		$scope.modal.room = room;
	$scope.ok = function() {
		$modalInstance.close($scope.modal);
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
} ]);
