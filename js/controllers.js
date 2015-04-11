var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('AddUserController', ['$scope', '$http', 'Users', '$window' , function($scope, $http, Users, $window) {

    $scope.user_name = '';
    $scope.user_email = '';
    $scope.added_user_name = '';
    $scope.empty_user = false;
    $scope.empty_email = false;
    $scope.addSuccess = false;
    $scope.duplicateEmail = false;

    // var judgeEmailUnique = function(email, function (){
    // 	var res = true;
    //  	var users = {};
    //  	Users.get_users_data(function(data){
    //   	users = data.data;
    //   	console.log("1");
    //   	for(var i = 0; i < users.length; i++){
    //   		console.log("2");
    //   		if(email === users[i].email){
    //   			res = false;
    //   			console.log("3");
    //   			break;
    //   		}
    //   	}
    //   	if(res){
    // 			console.log("unique!!!");
    // 			$scope.duplicateEmail = false;
    // 			$scope.added_user_name = $scope.user_name;
    // 			$scope.addSuccess = true;
    // 			$scope.user_name = '';
    // 		 	$scope.user_email = '';
    // 		 	return;
    // 		}
    // 		else{
    // 			console.log("duplicate!");
    // 			$scope.addSuccess = false;
    // 			$scope.duplicateEmail = true;
    // 			return;
    // 		}
    // 	});
    // });

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

demoControllers.controller('UsersController', ['$scope', '$http', '$window', 'Users', function($scope, $http, $window, Users) {
    // Users.get().success(function(data){
    // 	$scope.users = data.data;
    // });
    Users.get_users_data(function(data){$scope.users = data.data;
    });
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
                if(taskArray[i].assignedUser == userID){
                    completedTasks.push(taskArray[i]);
                }
            }
            callback(completedTasks);
        }
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
                        console.log("I splice!")
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
            getCompletedTasksFromUserID($scope.user_id, $scope.tasksData, function(completedTasks){
                $scope.completedTasks = completedTasks;
                $scope.show = true;
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

    function getTaskFromID (taskID, taskArray, callback){
        for(var i in taskArray){
            if(taskID === taskArray[i]._id){
                callback(taskArray[i]);
                break;
            }
        }
    }

    function getUserFromID (userID, userArray, callback){
        for(var i in userArray){
            if(userID === userArray[i]._id){
                callback(userArray[i]);
                break;
            }
        }
    }

    Tasks.get_tasks_data(function(data){
        $scope.tasksData = data.data;
        getTaskFromID($scope.task_id, $scope.tasksData, function(task){
            $scope.task = task;
            $scope.task_name = $scope.task.name;
            $scope.task_deadline = $scope.task.deadline;
            $scope.task_description = $scope.task.description;
            Users.get_users_data(function(userData){
                $scope.usersData = userData.data;
            });
        });
    });

    $scope.editTaskInfo = function(){

    }

}]);

demoControllers.controller('TasksController', ['$scope', '$http', '$window', 'Tasks', function($scope, $http, $window, Tasks) {
    var n = 0;
    Tasks.get_tasks_data(function(data){$scope.tasks = data.data;});
    $scope.next = function(){
        n = n+10;
        $scope.n = n;
    };
    $scope.prev = function(){
        if(n>=10)
            n = n-10;
        $scope.n = n;
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


/////////////// DRAFT /////////////////////////////////

// $scope.completeTask = function(taskID){
// 	for(var k in $scope.pendingTasks){
// 		if($scope.pendingTasks[k]._id === taskID){
// 			$scope.completedTasks.push($scope.pendingTasks.splice(k, 1)[0]);
// 			// var msgForTasks = {"completed": true,"name": $scope.task_name, "description": $scope.task_description, "asssignedUserName": $scope.assigned_user_name, "deadline": $scope.task_deadline};
// 			// Tasks.
// 			break;
// 		}
// 	}
// }