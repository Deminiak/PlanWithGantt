'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.diagram',
  'myApp.project',
  'myApp.send',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
    $routeProvider
        .when('/diagram', {
        templateUrl: 'diagram/diagram.html',
        controller: 'View1Ctrl'
    })
        .when('/send', {
          templateUrl: 'send/send.html',
        controller: 'View2Ctrl'
    })
        .when('/project', {
        templateUrl: 'project/project.html',
        controller: 'View3Ctrl'})
        .otherwise({redirectTo: 'project'});

}]);
