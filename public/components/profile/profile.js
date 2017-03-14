angular.module('myApp')

.controller('profileController', ["$scope", "bookService", "userService", function($scope, bookService, userService){
   
    $scope.user = userService.user
    
}])