'use strict';

// Declare app level module which depends on views, and components
angular.module('converse', [
  'ngRoute',
  'converse.konnichiwa'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]);
