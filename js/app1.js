// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['720kb.datepicker','ngRoute', 'demoControllers', 'demoServices']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/users', {
      templateUrl: 'partials/users.html',
      controller: 'UsersController'
    }).
    when('/tasks', {
      templateUrl: 'partials/tasks.html',
      controller: 'TasksController'
    }).
    when('/setting', {
      templateUrl: 'partials/setting.html',
      controller: 'SettingController'
    }).
    when('/add_user', {
      templateUrl: 'partials/add_user.html',
      controller: 'AddUserController'
    }). 
    when('/add_task', {
      templateUrl: 'partials/add_task.html',
      controller: 'AddTaskController'
    }).  
    when('/users/:userID', {
      templateUrl: 'partials/user_info.html',
      controller: 'UserInfoController'
    }).   
    when('/tasks/:taskID', {
      templateUrl: 'partials/task_info.html',
      controller: 'TaskInfoController'
    }).    
    when('/tasks/:taskID/edit', {
      templateUrl: 'partials/edit_task.html',
      controller: 'EditTaskController'
    }).        
    otherwise({
      redirectTo: '/setting'
    });
}]);