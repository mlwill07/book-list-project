angular.module("myApp.Auth")

.controller("PasswordResetController", ["$scope", "$location", "$routeParams", "userService", function ($scope, $location, $routeParams, userService) {
    $scope.resetForgottenPassword = function(password, passwordRepeat) {
        if (password === passwordRepeat) {
            userService.resetForgottenPassword(password, $routeParams.resetToken).then(function(message) {
                alert(message);
                $location.path("/login");
            });
        }
    };
}]);