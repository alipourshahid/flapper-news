var app = angular.module('flapperNews', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

 $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
      	postPromise: ['posts', function(posts){
      		return posts.getAll(); 
      	}]
      }
    })

	.state('posts', {
		url: '/posts/{id}',
	 	templateUrl: '/posts.html',
	 	controller: 'PostsCtrl',
	 	resolve: {
	 		post:['$stateParams', 'posts', function($stateParams, posts){
	 			return posts.get($stateParams.id); 
	 		}]
	 	}
	})

	.state('login', {
	  url: '/login',
	  templateUrl: '/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	})
	.state('register', {
	  url: '/register',
	  templateUrl: '/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	});

  $urlRouterProvider.otherwise('home');
}]);



app.controller('MainCtrl', [
'$scope',
'posts',
'auth', 
function($scope, posts, auth){
  $scope.posts = posts.posts;
  $scope.isLoggedIn = auth.isLoggedIn; 

$scope.addhttp = function(link){
	if (link.indexOf("http://") < 0){
		link = 'http://' + link; 
	}
	return link
};

$scope.addPost = function(){
	if (!$scope.title || $scope.title === '') {return;}
	posts.create({
		title: $scope.title,
		link: $scope.addhttp($scope.link),
		author: auth.currentUser
	});
	$scope.title = '';
	$scope.link = '';
};


$scope.incrementUpvotes = function(post){
	posts.upvote(post);
}

$scope.decreaseUpvotes = function(post){
	posts.downvote(post);
}

}]);





