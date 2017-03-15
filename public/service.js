angular.module('myApp')

.service('bookService', ['$http', function($http){
    
    this.newReleases = [];
    
    this.getNewReleases = function(query){
        var subject = query.split(" ").join("+").toString().toLowerCase();
       return $http.get("https://www.googleapis.com/books/v1/volumes?q=subject:" + '"'+ subject +'"'+ "&orderBy=newest&maxResults=30&printType=books&langRestrict=en&key=AIzaSyAJwYZSbsQSlVHT_6rxE3-weiY6nyCG7tA").then(function(response){
           this.newReleases = response.data.items;
           return this.newReleases
       })
    }
    
    this.getMyBooks = function() {
        return $http.get("/api/books")
    }
    
    this.addBook = function(book) {
        var listType = book.listType;
        console.log("addbooks")
        return $http.post("/api/books/user/" + listType, book).then(function(response){
            console.log(response)
        })
        
    }
    
    this.deleteBook = function(book) {
        return $http.delete("/books/" + book._id)
    }
    
    this.editBook = function(book, data){
        data.bookId = book._id
        return $http.put("/api/books/user/" + data.listType, data)
        .then(function(response){
            response = response.data;
            return response
        })
    }
    
    this.bookSearch = function(search) {
        var query = "";
        if(search.keywords) {
            query += search.keywords.split(" ").join("+").toString().toLowerCase();
        } 
        if(search.keywords && search.intitle) {
            query += "&intitle:" + search.intitle.split(" ").join("+").toString().toLowerCase();
        } else if(search.intitle) {
            query += "intitle:" + search.intitle.split(" ").join("+").toString().toLowerCase();
        }
        if((search.keywords || search.intitle) && search.inauthor) {
            query += "&inauthor:" + search.inauthor.split(" ").join("+").toString().toLowerCase();
        } else if(search.inauthor){
            query += "inauthor:" + search.inauthor.split(" ").join("+").toString().toLowerCase();
        }
        
        return $http.get("https://www.googleapis.com/books/v1/volumes?q=" + query +  "&maxResults=30&printType=books&langRestrict=en&key=AIzaSyAJwYZSbsQSlVHT_6rxE3-weiY6nyCG7tA")
    }
    
}])