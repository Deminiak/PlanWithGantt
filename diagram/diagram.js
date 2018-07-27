'use strict';

angular.module('myApp.diagram', ['ngRoute'])


.controller('View1Ctrl', function($scope, $http) {
    if(window.localStorage.getItem("gitlab")==undefined)
    {
        window.location.href = "http://localhost:8000/auth.html";
    }

    $scope.gosend = function () {
        window.localStorage.setItem("test",JSON.stringify(gantt.serialize('json')));
        window.location.href = "http://localhost:8000/#!/send";
    };
    $scope.goback = function () {
        window.location.href = "http://localhost:8000/#!/project";
    };

});