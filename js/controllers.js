'use strict';

todoList.controller('TodoCtrl', function TodoCtrl($scope, todoStorage) {

    $scope.todos = todoStorage.get();

    $scope.addTodo = function() {
        // this function gets called by the ng-submit directive on the new todo form
    };
});
