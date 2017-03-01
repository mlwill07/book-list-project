angular.module('myApp')

.controller('homeController', ['$scope', 'bookService', function($scope, bookService){
    
    $scope.query = 'Fiction';
    
    $scope.subjects = ["Biography", "Chick Lit", "Classics", "Contemporary", "Crime", "Fantasy", "Fiction", "Historical Fiction", "History", "Horror", "Memoir", "Mystery", "Nonfiction", "Paranormal", "Romance", "Science", "Science Fiction", "Suspense", "Spirituality", "Sports", "Thriller", "Travel"]
    
    $scope.assignQuery = function(query) {
        $scope.query = query;
        $scope.getNewReleases(query);
    }
    
    $scope.getNewReleases = function(query){
        bookService.getNewReleases(query).then(function(response){
        $scope.newReleases = response;
        
    })
    }
    
    $scope.data = {};
    
    $scope.addBook = function(book, userInput){ 
        var newBook = {
            title: book.title,
            subtitle: book.subtitle,
            authors: book.authors,
            description: book.description,
            imgUrl: book.imageLinks.thumbnail,
            pub_date: book.publishedDate,
            publisher: book.publisher,
            infoLink: book.infoLink,
            isbn_10: book.industryIdentifiers[0].identifier,
            listType: userInput.listType,
            user_comment: userInput.user_comment
        }
        bookService.addBook(newBook).then(function(response){
            
        })
        
    }
    
    $scope.getNewReleases($scope.query);
    
    $scope.search= {};
    
    $scope.bookSearch = function(search) {
        $scope.query = "Search"
        bookService.bookSearch(search)
            .then(function(response){
            $scope.newReleases = response.data.items
        })
    }
}])


