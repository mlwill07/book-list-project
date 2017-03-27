angular.module("myApp.Auth", ["ngRoute", "ngStorage"])

.config(["$routeProvider", function($routeProvider){
    $routeProvider
        .when("/signup", {
            templateUrl: "components/auth/signup/signup.html",
            controller: "signupController"
        })
        .when("/login", {
            templateUrl: "components/auth/login/login.html",
            controller: "loginController"
        })
        .when("/forgot", {
            templateUrl: "components/auth/forgot/forgot.html",
            controller: "forgotController"
        })
        .when("/reset/:resetToken", {
            templateUrl: "components/auth/reset/reset.html",
            controller: "PasswordResetController"
        })
        .when("/logout", {
            template: "",
            controller: "logoutController"
        })       
}])

.service("tokenService", ["$localStorage", function($localStorage){
    this.setToken = function(token) {
        $localStorage.token = token
    }
    
    this.getToken = function() {
        return $localStorage.token
    }
    
    this.removeToken = function() {
        delete $localStorage.token
    }
}])

.service("userService", ["tokenService", "$location", "$http", "$localStorage", function(tokenService, $location, $http, $localStorage){
    this.user = $localStorage.user
    
    this.signup = function(user) {
        return $http.post('/auth/signup', user)
    }
    
    this.login = function(user) {
        return $http.post('/auth/login', user).then(function(response){
            tokenService.setToken(response.data.token);
            $localStorage.user = response.data.user;
            return response.data
        })
    }
    
    this.logout = function() {
        tokenService.removeToken();
        delete $localStorage.user;
        $location.path('/');
    }
    
    this.isAuthenticated = function() {
        return !!tokenService.getToken();
    }

    this.forgotPassword = function(email) {
        $http.post("/auth/forgot", {email: email}).then(function(response) {
            return response.data;
        })
    }

    this.resetForgottenPassword = function(password, resetToken) {
        return $http.post('/auth/reset', {password: password, resetToken: resetToken}).then(function(response){
            return response.data.message
        })
    }


}])

.service('authInterceptor', ["$q", "$location", "tokenService", function($q, $location, tokenService){
    this.request = function(config) {
        var token = tokenService.getToken();

        if(token && config.url.indexOf("www.googleapis.com") === -1) {
            config.headers = config.headers || {};
            config.headers.Authorization = "Bearer " + token
        }
        return config
    }
    
    this.responseError = function(response) {
        if (response.status === 401) {
            tokenService.removeToken();
            $location.path('/login')
        }
        return $q.reject(response);
    }
}])


.config(["$httpProvider", function($httpProvider){
    $httpProvider.interceptors.push('authInterceptor')
}])