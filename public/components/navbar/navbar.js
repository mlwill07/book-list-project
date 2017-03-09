angular.module('myApp')

.directive('navbar', ['userService', function(userService){
    return {
        templateUrl: 'components/navbar/navbar.html',
        controller: function($scope) {
            $scope.auth = userService
        }
    }
}])