angular.module("myApp.Auth")

.controller("logoutController", ["$scope", "$location", "userService", function($scope, $location, userService){
    
    userService.logout();
    
}])