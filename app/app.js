'use strict';

// Declare app level module which depends on views, and components
angular.module('converse', [
  'ngRoute',
  'ngSanitize',
  'converse.konnichiwa'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}]).

controller('ConverseController', ['$scope',function($scope ) {

}]);
