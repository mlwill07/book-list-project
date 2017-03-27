angular.module('myApp')

.controller('listController', ["$scope", "bookService", function($scope, bookService){
    $scope.futureList = [];
    $scope.currentList= [];
    $scope.pastList = [];
    
    $scope.getMyList = function(){
        bookService.getMyBooks()
            .then(function(response){
            $scope.readingList = response.data[0].readingList
        })
    }
        
    $scope.getMyList();
    
    $scope.data = {}
    
    $scope.updateList = function(book, data) {
        if(!data) {
            var data = {};
            data.listType = 'delete'
        }
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