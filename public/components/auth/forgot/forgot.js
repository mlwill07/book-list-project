angular.module("myApp.Auth")

    .controller("forgotController", ["$scope", "$location", "userService", function($scope, $location, userService) {
        $scope.email = ''
        $scope.forgotPassword = function(email) {
            userService.forgotPassword(email)
        }

    }])