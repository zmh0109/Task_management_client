var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('AddUserController', ['$scope', '$http', 'Users', '$window' , function($scope, $http, Users, $window) {

  $scope.user_name = '';
  $scope.user_email = '';
  $scope.added_user_name = '';
  $scope.empty_user = false;
	$scope.empty_email = false;
  $scope.addSuccess = false;
  $scope.duplicateEmail = false;	

	function j1(email, callback){
		var res = true;
	 	var users = {};
	 	Users.get_users_data(function(data){
	  	users = data.data;
	  	// console.log("1");
	  	for(var i = 0; i < users.length; i++){
	  		// console.log("2");
	  		if(email === users[i].email){
	  			res = false;
	  			// console.log("3");
	  			break;
	  		}
	  	}
	  	callback(res);
	  });
	}	  	

	function j2(res, callback){
		if(res){
			// console.log("unique!!!");
			$scope.duplicateEmail = false;
			// $scope.added_user_name = $scope.user_name;
			// $scope.addSuccess = true; 			
			// $scope.user_name = '';
		  // $scope.user_email = '';
		 	var msg = {"name": $scope.user_name, "email": $scope.user_email};
		 	Users.post(msg, function(){
				$scope.added_user_name = $scope.user_name;
				$scope.addSuccess = true; 			
				$scope.user_name = '';
		 		$scope.user_email = '';
			});
		} 
		else{
			// console.log("duplicate!");
			$scope.addSuccess = false; 
			$scope.duplicateEmail = true;
			return;
		} 
	}

	// function sendUserData(msg){
	// 	Users.post(msg, function(){
	// 		$scope.added_user_name = $scope.user_name;
	// 		$scope.addSuccess = true; 			
	// 		$scope.user_name = '';
	// 	 	$scope.user_email = '';
	// 	});
	// }

  $scope.addUserInfo = function(){
  	if(($scope.user_email === '') && ($scope.user_name === '')){
  		$scope.empty_email = true;   
  		$scope.empty_user = true;
  		$scope.addSuccess = false;
  		$scope.duplicateEmail = false;
  		return;
  	}
  	else if(($scope.user_email === '')){
  		$scope.empty_email = true;
  		$scope.empty_user = false;
  		$scope.addSuccess = false;
  		$scope.duplicateEmail = false;
  		return; 
  	}
  	else if (($scope.user_name === '')){
  		$scope.empty_email = false;
  		$scope.empty_user = true;
  		$scope.addSuccess = false;
  		$scope.duplicateEmail = false;
  		return; 
  	}
  	else{
  		$scope.empty_user = false;
			$scope.empty_email = false;
			// judgeEmailUnique($scope.email);
			j1($scope.user_email, j2);
  	}
  }

}]);

demoControllers.controller('AddTaskController', ['$scope', '$http', '$window', 'Tasks', 'Users', function($scope, $http, $window, Tasks, Users) {

		$scope.task_description = '';
		$scope.task_name = '';
		$scope.assigned_user = {};
		$scope.assigned_user_name = '';
		$scope.task_deadline = '';
		$scope.empty_task = false;
		$scope.empty_deadline = false;
		$scope.addTaskSuccess = false;
		$scope.added_task_name = '';


		Users.get_users_data(function(data){
			$scope.users = data.data; 
		});

		function fetchUserTaskAndAppend(task_id, user_id, callback){
			Users.get_users_data(function(data){
				$scope.users = data.data; 
				for(var i in $scope.users){
					if($scope.users[i]._id===user_id){
						$scope.users[i].pendingTasks.push(task_id);
						callback($scope.users[i]);
						break;
					}
				}
			});	
		}

		function updateUserTask(user){
			var msg = {"name": user.name, "email": user.email, "pendingTasks": user.pendingTasks};
			Users.update(user._id, msg, function(){
			});
		}

		$scope.addTaskInfo = function(){		
			if(($scope.task_name === '') && ($scope.task_deadline === '')){
	  		$scope.empty_task = true;   
	  		$scope.empty_deadline = true;
	  		$scope.addTaskSuccess = false;
	  		return;
	  	}
	  	else if(($scope.task_name === '')){
	  		$scope.empty_task = true;
	  		$scope.empty_deadline = false;
	  		$scope.addTaskSuccess = false;
	  		return; 
	  	}
	  	else if (($scope.task_deadline === '')){
	  		$scope.empty_task = false;
	  		$scope.empty_deadline = true;
	  		$scope.addTaskSuccess = false;
	  		return; 
	  	}	
	  	else{
				var msg = {"name": $scope.task_name, "description": $scope.task_description, "assignedUserName": $scope.assigned_user.name, "assignedUser":$scope.assigned_user._id, "deadline": $scope.task_deadline};

				Tasks.post(msg, function(data){
					console.log(data.data._id);
					$scope.added_task_name = $scope.task_name;
					$scope.empty_task = false;
					$scope.empty_deadline = false;
					$scope.addTaskSuccess = true;				
					$scope.task_description = '';
					$scope.task_name = '';
					$scope.assigned_user_name = '';
					$scope.task_deadline = '';
					for(var i in $scope.users){
						if($scope.users[i]._id === $scope.assigned_user._id){
							// console.log($scope.assigned_user._id);
							// console.log($scope.task_id);
							fetchUserTaskAndAppend(data.data._id,$scope.assigned_user._id, updateUserTask);	
							break;
						}
					}
				});
	  	}
		}
}]);

demoControllers.controller('UsersController', ['$scope', '$http', '$window', 'Users', 'Tasks', function($scope, $http, $window, Users, Tasks) {
	$scope.usersData = [];
	$scope.tasksData = [];
	function getTaskFromID (taskID, taskArray, callback){
		for(var i in taskArray){
			if(taskID == taskArray[i]._id){
				callback(taskArray[i]);
				break;
			}
		}
	}	
	function getUserFromID (userID, userArray, callback){
		for(var j in userArray){
			var t = userArray[j]._id;
			if(userID == t){
				callback(userArray[j]);
				break;
			}
		}
	}	
	Users.get_users_data(function(data){
		$scope.usersData = data.data;		
	});

	$scope.deleteUser = function(userID){
		getUserFromID(userID, $scope.usersData, function(user){
			Users.delete_user(userID, function(){
				Users.get_users_data(function(data){
					$scope.usersData = data.data;
					Tasks.get_tasks_data(function(taskdata){
						$scope.tasksData = taskdata.data;
					});
					for(var i in user.pendingTasks){
						getTaskFromID(user.pendingTasks[i], $scope.tasksData, function(task){
							var msg4task = {"name":task.name, "deadline": task.deadline, "assignedUser":'', "assignedUserName":"unassigned"};
							Tasks.update(task._id, msg4task, function(){
								console.log("get task unassigned!");
							});
						});
					}
				});
			});
		});
	}
}]);

demoControllers.controller('TasksController', ['$scope', '$http', '$window', 'Tasks', 'Users', function($scope, $http, $window, Tasks, Users) {

	$scope.sortingMethods = ['dateCreated', 'deadline', 'name', 'assignedUserName'];
	$scope.sortingM = 'dateCreated';
	$scope.tasksData = [];
	$scope.usersData = [];
	$scope.tasksPending = [];
	$scope.tasksCompleted = [];
	$scope.tasksToShow = $scope.tasksPending;	
	$scope.isAscending = true;
	var n = 0;

	$scope.next = function(){
		if((n+10)<$scope.tasksToShow.length){
		    n = n+10;
		}
    $scope.n = n;
  };
  $scope.prev = function(){
    if(n>=10)
        n = n-10;
    $scope.n = n;
  }

	Tasks.get_tasks_data(function(data){
		$scope.tasksData = data.data;
		for(var i in $scope.tasksData){
			if($scope.tasksData[i].completed == true){
				$scope.tasksCompleted.push($scope.tasksData[i]);
			}
			else{
				$scope.tasksPending.push($scope.tasksData[i]);
			}
		}
		$scope.ascending($scope.sortingM);
		Users.get_users_data(function(userdata){
			$scope.usersData = userdata.data;
		});
	});
	$scope.ToshowPending = function(){
		$scope.tasksToShow = $scope.tasksPending;
	}
	$scope.ToshowCompleted = function(){
		$scope.tasksToShow = $scope.tasksCompleted;
	}
	$scope.ToshowAll = function(){
		$scope.tasksToShow = $scope.tasksData;
	}	
	function compareByDateCreated(a, b){
		var ka = new Date(a.dateCreated), kb = new Date(b.dateCreated);
		if(ka < kb) return -1;
		if(ka > kb) return 1;
		return 0;
	}
	function compareByDeadline(a, b){
		var ka = new Date(a.deadline), kb = new Date(b.deadline);
		if(ka < kb) return -1;
		if(ka > kb) return 1;
		return 0;		
	}
	function compareByName(a, b){
		var ka = a.name, kb = b.name;
		if(ka < kb) return -1;
		if(ka > kb) return 1;
		return 0;
	}
	function compareByAssignedUserName(a, b){
		var ka = a.assignedUserName, kb = b.assignedUserName;
		if(ka < kb) return -1;
		if(ka > kb) return 1;
		return 0;		
	}
	$scope.selectAndShow = function(sortingM){
		if($scope.isAscending == true)
			$scope.ascending(sortingM);
		else
			$scope.descending(sortingM);
	}
	$scope.ascending = function(sortingM){
		$scope.isAscending = true;
		if(sortingM == 'dateCreated'){
			$scope.tasksToShow.sort(compareByDateCreated);
		}
		else if (sortingM == 'deadline'){
			$scope.tasksToShow.sort(compareByDeadline);
		}
		else if (sortingM == 'name'){
			$scope.tasksToShow.sort(compareByName);
		} 
		else if(sortingM == 'assignedUserName'){
			$scope.tasksToShow.sort(compareByAssignedUserName);
		}
	}
	$scope.descending = function(sortingM){
		$scope.isAscending = false;
		if(sortingM == 'dateCreated'){
			$scope.tasksToShow.sort(compareByDateCreated).reverse();
		}
		else if (sortingM == 'deadline'){
			$scope.tasksToShow.sort(compareByDeadline).reverse();
		}
		else if (sortingM == 'name'){
			$scope.tasksToShow.sort(compareByName).reverse();
		} 
		else if(sortingM == 'assignedUserName'){
			$scope.tasksToShow.sort(compareByAssignedUserName).reverse();
		}		
	}

	function getTaskFromID (taskID, taskArray, callback){
		for(var i in taskArray){
			if(taskID == taskArray[i]._id){
				callback(taskArray[i]);
				break;
			}
		}
	}	
	function getUserFromID (userID, userArray, callback){
		for(var j in userArray){
			var t = userArray[j]._id;
			if(userID == t){
				callback(userArray[j]);
				break;
			}
		}
	}
	$scope.deleteTask = function(taskID){
		// console.log(taskID);
		getTaskFromID(taskID, $scope.tasksData, function(task){
			var task_index = $scope.tasksData.indexOf(task);
			var task_index_in_completed = $scope.tasksCompleted.indexOf(task);
			var task_index_in_pending = $scope.tasksPending.indexOf(task);

			if(task_index > -1)
				$scope.tasksData.splice(task_index, 1);
			if(task_index_in_completed > -1)
				$scope.tasksCompleted.splice(task_index_in_completed, 1);
			if(task_index_in_pending > -1)
				$scope.tasksPending.splice(task_index_in_pending, 1);

			Tasks.delete_task(taskID, function(){
				getUserFromID(task.assignedUser, $scope.usersData, function(user){
					var index = user.pendingTasks.indexOf(taskID);
					if(index > -1){
						user.pendingTasks.splice(index, 1);
						var msg4user = {"name": user.name, "email": user.email, "pendingTasks": user.pendingTasks};
						Users.update(user._id, msg4user, function(){
							console.log("update user pendingTasks");
						});
					}
				});	
			});
		});
	}
}]);

demoControllers.controller('UserInfoController', ['$scope', '$http', '$window', 'Users', 'Tasks', '$routeParams', 
	function($scope, $http, $window, Users, Tasks, $routeParams) {

		$scope.usersData = [];
		$scope.tasksData = [];
		$scope.user_id = $routeParams.userID;
		$scope.pendingTasks = [];
		$scope.completedTasks = [];
		$scope.show = false;
		$scope.user = {};

		function getUserFromID (userID, userArray, callback){
			for(var i in userArray){
				if(userID === userArray[i]._id){
					callback(userArray[i]);
					break;
				}
			}
		}

		function getTaskFromID (taskID, taskArray, callback){
			for(var i in taskArray){
				if(taskID === taskArray[i]._id){
					callback(taskArray[i]);
					break;
				}
			}
		}

		// get all the tasks that are completed and assigned to the user 
		function getCompletedTasksFromUserID(userID, taskArray, callback){
			var completedTasks = [];
			for(var i in taskArray){
				if(taskArray[i].assignedUser == userID && taskArray[i].completed == true){
						completedTasks.push(taskArray[i]);
					}
			}
			callback(completedTasks);
		}
		// first time load data and initialize
		// get $scope.usersData, $scope.tasksData, $scope.pendingTasks, $scope.user
		Users.get_users_data(function(data){
			$scope.usersData = data.data;
			getUserFromID($scope.user_id, $scope.usersData, function(user){
				$scope.user = user;
				Tasks.get_tasks_data(function(tasksData){
					$scope.tasksData = tasksData.data;
					for (var i in user.pendingTasks){
						getTaskFromID(user.pendingTasks[i], $scope.tasksData, function(task){
							$scope.pendingTasks.push(task);
						});
					}
				});
			});
		});

		$scope.completeTask = function(taskID){
			getTaskFromID(taskID, $scope.pendingTasks, function(task){
				var index = $scope.pendingTasks.indexOf(task);
				if(index > -1){
					// get rid of the task from pending tasks
					$scope.pendingTasks.splice(index, 1);
					// get rid of the task id from user.pendingTasks
					var ptskID = $scope.user.pendingTasks.indexOf(taskID);
					if(ptskID > -1){
						$scope.user.pendingTasks.splice(ptskID, 1);
						// console.log("I splice!")
					}
					// to send the updated info to both Tasks and Users
					var msgForTasks = {"completed": true, "name": task.name,"deadline": task.deadline, "assignedUser": $scope.user_id, "assignedUserName": $scope.user.name};
					var msgForUsers = {"name": $scope.user.name, "email": $scope.user.email, "pendingTasks": $scope.user.pendingTasks};

					Users.update($scope.user_id, msgForUsers, function(){
						console.log("success update user info");
					});
					Tasks.update(taskID, msgForTasks, function(){
						console.log("success update task info");
					});
				}
			});
		}

		$scope.showCompletedTasks = function(){
			// reload data first
			Tasks.get_tasks_data(function(data){
				$scope.tasksData = data.data;
				getCompletedTasksFromUserID($scope.user_id, $scope.tasksData, function(completedTasks){
					$scope.completedTasks = completedTasks;
					$scope.show = true;
				});
			});
		}
}]);

demoControllers.controller('TaskInfoController', ['$scope', '$http', '$window', 'Users', 'Tasks', '$routeParams', function($scope, $http, $window, Users, Tasks, $routeParams){

	$scope.task_id = $routeParams.taskID;	
	$scope.tasksData = [];
	$scope.task = {};

	function getTaskFromID (taskID, taskArray, callback){
		for(var i in taskArray){
			if(taskID === taskArray[i]._id){
				callback(taskArray[i]);
				break;
			}
		}
	}

	Tasks.get_tasks_data(function(data){
		$scope.tasksData = data.data;
		getTaskFromID($scope.task_id, $scope.tasksData, function(task){
			$scope.task = task;
			// console.log(task.name);
		});
	});
}]);

demoControllers.controller('EditTaskController', ['$scope', '$http', '$window', 'Users', 'Tasks', '$routeParams', function($scope, $http, $window, Users, Tasks, $routeParams){
	$scope.task_id = $routeParams.taskID;	
	$scope.tasksData = [];
	$scope.task = {};
	$scope.empty_task = false;
	$scope.empty_deadline = false;
	$scope.assigned_user = {};

	$scope.completed;
	$scope.editTaskSuccess = false;
	var oldUser = {};
	var newUser = {};

	Tasks.get_tasks_data(function(data){
		$scope.tasksData = data.data;
		getTaskFromID($scope.task_id, $scope.tasksData, function(task){
			$scope.task = task;
			$scope.task_name = $scope.task.name;
			$scope.task_deadline = $scope.task.deadline;
			$scope.task_description = $scope.task.description;
			$scope.completed = $scope.task.completed;
			console.log($scope.task.assignedUserName);

			Users.get_users_data(function(userData){
				$scope.usersData = userData.data;

				if($scope.task.assignedUser != ''){
					getUserFromID($scope.task.assignedUser, $scope.usersData, function(usr){
						oldUser = usr;
						$scope.assigned_user = usr;
					});
				}
				else{
					console.log("oldUser was not assigned!");
					oldUser = {};
					$scope.assigned_user = {};
				}
			});
		});
	});

	function getTaskFromID (taskID, taskArray, callback){
		for(var i in taskArray){
			if(taskID == taskArray[i]._id){
				callback(taskArray[i]);
				break;
			}
		}
	}	
	function getUserFromID (userID, userArray, callback){
		for(var j in userArray){
			var t = userArray[j]._id;
			if(userID == t){
				callback(userArray[j]);
				break;
			}
		}
	}
	function deleteEntryFromArray(entry, array){
		// if exit, delete; else, do nothing
		var index = array.indexOf(entry);
		if( index > -1){
			array.splice(index, 1);
		}
	}
	function addEntryToArray(entry, array){
		//if entry is already in, do nothing
		var index = array.indexOf(entry);
		if(index < 0){
			array.push(entry);
		}
	}
	function b(){ $scope.editTaskSuccess = true; }

	$scope.editTaskInfo = function(){
		if(($scope.task_name == '') && ($scope.task_deadline == '')){
	  		$scope.empty_task = true;   
	  		$scope.empty_deadline = true;
	  		$scope.editTaskSuccess = false;
	  		return;
	  	}
	  	else if(($scope.task_name == '')){
	  		$scope.empty_task = true;
	  		$scope.empty_deadline = false;
	  		$scope.editTaskSuccess = false;
	  		return; 
	  	}
	  	else if (($scope.task_deadline == '')){
	  		$scope.empty_task = false;
	  		$scope.empty_deadline = true;
	  		$scope.editTaskSuccess = false;
	  		return; 
	  	}	
	  	else{
	  		$scope.empty_task = false;
			$scope.empty_deadline = false;
			$scope.editTaskSuccess = false;
			var msg4task = {};
			var msg4OldUser = {};
			var msg4NewUser ={};
			// case 1: the job was, is, not assigned to anyone. No need to update Users
			if(Object.keys(oldUser).length == 0 && Object.keys($scope.assigned_user).length == 0){
				console.log("the job neither was nor is assigned to anyone.");
				msg4task = {"name": $scope.task_name, "description": $scope.task_description, "deadline": $scope.task_deadline, "completed": $scope.completed};
				Tasks.update($scope.task_id, msg4task, function(){
					b();
				});
			}
			// case 2: the job was not assigned but is. Just need to handle newUser
			else if(Object.keys(oldUser).length == 0){
				console.log("the job was not assigned but is.");

					newUser = $scope.assigned_user;
					msg4task = {"name": $scope.task_name, "description": $scope.task_description, "deadline": $scope.task_deadline, "assignedUser": newUser._id, "assignedUserName": newUser.name, "completed": $scope.completed};
					Tasks.update($scope.task_id, msg4task, function(){
						// case 2.1 the job is done. no need to add the newUser pendingTasks
						if($scope.completed == true){ 
							// now newUser becomes oldUser, newUser becomes empty. prepare for next call
							oldUser = newUser;
							newUser = {};
							b();
						}
						// case 2.2 need to update newUser info
						else{
							newUser.pendingTasks.push($scope.task_id);
							msg4NewUser = {"name": newUser.name, "email": newUser, "pendingTasks": newUser.pendingTasks};
							Users.update(newUser._id, msg4NewUser, function(){
								oldUser = newUser;
								newUser = {};
								b();
							});
						}
					});
			}
			// case 3: the job was, but is not assigned, handle oldUser only
			else if (Object.keys($scope.assigned_user).length == 0){
				console.log("the job was, but is not assigned.");
				msg4task = {"name": $scope.task_name, "description": $scope.task_description, "deadline": $scope.task_deadline, "assignedUser": "", "assignedUserName": "unassigned", "completed": $scope.completed};
				Tasks.update($scope.task_id, msg4task, function(){
					var index = oldUser.pendingTasks.indexOf($scope.task_id);
					if(index > -1){
						oldUser.pendingTasks.splice(index, 1);
						msg4OldUser = {"name": oldUser.name, "email": oldUser.email, "pendingTasks": oldUser.pendingTasks};
						Users.update(oldUser._id, msg4OldUser, function(){
							oldUser = newUser;
							newUser = {};
							b();
						});
					}
				});

			}
			// case 4: the job was, is assigned, handle both oldUser and newUser
			else{
				console.log("the job was, is assigned.");
					newUser = $scope.assigned_user;
					msg4task = {"name": $scope.task_name, "description": $scope.task_description, "deadline": $scope.task_deadline, "assignedUser": newUser._id, "assignedUserName": newUser.name, "completed": $scope.completed};
					Tasks.update($scope.task_id, msg4task, function(){
						// case 4.1 oldUser is newUser, just update one of them (here I choose newUser)
						if(oldUser._id == newUser._id){
							if($scope.completed == true){
								deleteEntryFromArray($scope.task_id, newUser.pendingTasks);
							}
							else{
								addEntryToArray($scope.task_id, newUser.pendingTasks);
							}
							msg4NewUser = {"name": newUser.name, "email": newUser.email, "pendingTasks": newUser.pendingTasks};
							Users.update(newUser._id, msg4NewUser, function(){
								oldUser = newUser;
								newUser = {};
								b();
							});
						} // case 4.2 oldUser and newUser are different
						else{
							// delete (or do nothing) the task from oldUser; add to newUser if not completed
							deleteEntryFromArray($scope.task_id, oldUser.pendingTasks);
							if($scope.completed == false){
								addEntryToArray($scope.task_id, newUser.pendingTasks);
							}
							msg4OldUser = {"name": oldUser.name, "email": oldUser.email, "pendingTasks": oldUser.pendingTasks};
							msg4NewUser = {"name": newUser.name, "email": newUser.email, "pendingTasks": newUser.pendingTasks};
							Users.update(oldUser._id, msg4OldUser, function(){});
							Users.update(newUser._id, msg4NewUser, function(){
								oldUser = newUser;
								newUser = {};
								b();
							});
						}
					});
			}	  		
	  	}
	}
}]);

demoControllers.controller('SettingController', ['$scope' , '$window','Users' , function($scope, $window, Users) {
  $scope.url = $window.sessionStorage.baseurl;
  // Users.test();
  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    // $scope.displayText = "URL set";
  };
}]);
