angular.module('myApp')

.controller('homeController', ['$scope', 'bookService', 'userService', function($scope, bookService, userService){
    
    $scope.auth = userService;
    console.log($scope.auth.isAuthenticated());
    
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
        
        for(var i = 0; i < book.industryIdentifiers.length; i++) {
            if (book.industryIdentifiers[i].type === "ISBN_13") {
                var isbn13 = book.industryIdentifiers[i].identifier
            } else if (book.industryIdentifiers[i].type === "ISBN_10") {
                var isbn10 = book.industryIdentifiers[i].identifier
            }
        }
        
        
        
        var newBook = {
            title: book.title,
            subtitle: book.subtitle,
            authors: book.authors,
            description: book.description,
            imgUrl: book.imageLinks.thumbnail,
            pub_date: book.publishedDate,
            publisher: book.publisher,
            infoLink: book.infoLink,
            listType: userInput.listType,
            isbn_10: isbn10,
            isbn_13: isbn13,
            user_comment: userInput.user_comment
        }
        
        $scope.data = {};
        
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


