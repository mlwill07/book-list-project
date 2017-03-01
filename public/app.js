angular.module('myApp', ['ui.materialize', 'ngRoute'])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/home', {
            templateUrl: 'components/home/home.html',
            controller: 'homeController'
        })
        .when('/mylist', {
            templateUrl: 'components/mylist/mylist.html',
            controller: 'listController'
        })
        .when('/search', {
            templateUrl: 'components/search/search.html',
            controller: 'searchController'
        })
        .otherwise({
            redirectTo: '/home'
        })
}])

