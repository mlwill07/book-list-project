angular.module('myApp', ['ui.materialize', 'ngRoute', 'myApp.Auth'])

.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'components/home/home.html',
            controller: 'homeController'
        })
        .when('/mylist', {
            templateUrl: 'components/myList/mylist.html',
            controller: 'listController'
        })
        .when('/search', {
            templateUrl: 'components/search/search.html',
            controller: 'searchController'
        })
//        .when('/myprofile', {
//            templateUrl: 'components/profile/profile.html',
//            controller: 'profileController'
//        })
        .otherwise({
            redirectTo: '/'
        })
    
    
}])

