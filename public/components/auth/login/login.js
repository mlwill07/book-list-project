angular.module("myApp.Auth")

.controller("loginController", ["$scope", "$location", "userService", function($scope, $location, userService){
    $scope.user = {}
    $scope.login = function(user) {
        userService.login(user).then(function(response){
            $location.path('/')
        }, function(response) {
            alert(response.data.message);
        })
    }
}])