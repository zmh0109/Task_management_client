// var utApp = angular.module('utApp', ['ngRoute', 'utControllers', 'utServices']);

// utApp.run(function($rootScope) {
//     $rootScope.$on('$viewContentLoaded', function () {
//         $(document).foundation();
//     });
// });

// utApp.config(['$routeProvider', function($routeProvider){
//   $routeProvider,
//     when('/users', {
//       templateUrl: './partials/users.html',
//       controller: 'usersCtrl'
//     }).
//     when('/tasks', {
//       templateUrl: './partials/tasks.html',
//       controller: 'tasksCtrl'
//     }).    
//     otherwise(
//         redirectTo: '/users'
//       );
// }]);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/firstview', {
    templateUrl: 'partials/firstview.html',
    controller: 'FirstController'
  }).
  when('/secondview', {
    templateUrl: 'partials/secondview.html',
    controller: 'SecondController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/llamalist', {
    templateUrl: 'partials/llamalist.html',
    controller: 'LlamaListController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);