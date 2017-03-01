angular.module('myApp')

.controller('listController', ["$scope", "bookService", function($scope, bookService){
    $scope.futureList = [];
    $scope.currentList= [];
    $scope.pastList = [];
    
    $scope.getMyList = function(){
        bookService.getMyBooks()
            .then(function(response){
            $scope.futureList = response.data.filter(function(el) { return el.listType === "future"})
            $scope.currentList = response.data.filter(function(el) { return el.listType === "current"})
            $scope.pastList = response.data.filter(function(el) { return el.listType === "past"})
        })
    }
        
    $scope.getMyList();
    
    $scope.data = {}
    
    $scope.updateList = function(book, data) {
        bookService.editBook(book, data)
        .then(function(response){
            $scope.getMyList();
        })
    }
    
    $scope.deleteBook = function(book) {
        bookService.deleteBook(book)
        .then(function(response){
            $scope.getMyList();
        })
    }
    
}])