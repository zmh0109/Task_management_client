// js/services/todos.js
// angular.module('demoServices', [])
//         .factory('CommonData', function(){
//         var data = "";
//         return{
//             getData : function(){
//                 return data;
//             },
//             setData : function(newData){
//                 data = newData;                
//             }
//         }
//     })
//     .factory('Llamas', function($http, $window) {      
//         return {
//             get : function() {
//                 var baseUrl = $window.sessionStorage.baseurl;
//                 return $http.get(baseUrl+'/api/llamas');
//             }
//         }
//     })
//     ;

angular.module('demoServices', [])
    // .factory('CommonData', function(){
    //     var data = "";
    //     return{
    //         getData : function(){
    //             return data;
    //         },
    //         setData : function(newData){
    //             data = newData;                
    //         }
    //     }
    // })
    .factory('Users', function($http, $window) {      
        return {
            post: function(msg, callback) {
                var baseUrl = $window.sessionStorage.baseurl;
                $http.post(baseUrl+'/api/users', msg).success(function(){
                    callback();
                });
            },             
            get_users_data: function(callback){
                var baseUrl = $window.sessionStorage.baseurl;
                $http.get(baseUrl+'/api/users').success(function(data){
                        callback(data);
                });
            },
            update: function(userID, msg, callback){
                var baseUrl = $window.sessionStorage.baseurl;
                $http.put(baseUrl+'/api/users'+'/'+userID, msg).success(function(){
                        callback();
                });                
            }
            // get: function() {
            //     var baseUrl = $window.sessionStorage.baseurl;
            //     return $http.get(baseUrl+'/api/users');
            // },
        }
    })
    .factory('Tasks', function($http, $window) {      
        return {
            post: function(msg, callback) {
                var baseUrl = $window.sessionStorage.baseurl;
                $http.post(baseUrl+'/api/tasks', msg).success(function(data){
                    callback(data);
                });
            },  
            get_tasks_data: function(callback){
                var baseUrl = $window.sessionStorage.baseurl;
                $http.get(baseUrl+'/api/tasks').success(function(data){
                        callback(data);
                });
            },
            update: function(taskID, msg, callback){
                var baseUrl = $window.sessionStorage.baseurl;
                $http.put(baseUrl+'/api/tasks'+'/'+taskID, msg).success(function(){
                        callback();
                });                
            }
            // get: function() {
            //     var baseUrl = $window.sessionStorage.baseurl;
            //     return $http.get(baseUrl+'/api/tasks');
            // },
            // test: function(){
            //     console.log(123);
            // }
        }
    })
    ;
