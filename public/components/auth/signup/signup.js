angular.module("myApp.Auth")

.controller("signupController", ["$scope", "$location", "userService", function($scope, $location, userService){
    
    $scope.user = {};
    $scope.passwordMessage = "";
    
    
    $scope.signup = function(user) {
        if($scope.user.password !== $scope.user.passwordRepeat) {
            $scope.passwordMessage = "Passwords do not match."
        } else {
            $scope.signupForm.$setUntouched();
            
            userService.signup(user).then(function(response){
                $location.path('/login');
            }, function(response){
                alert("There was a problem: " + response.data)
            })
 
        }
            
        
    }
}])