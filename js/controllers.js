'use strict';

todoList.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage) {

    $scope.todos = todoStorage.get();
    $scope.newTodo = '';

    $scope.addTodo = function() {
        // this function gets called by the ng-submit directive on the new todo form
    };
});
