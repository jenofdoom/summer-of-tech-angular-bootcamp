'use strict';

todoList.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage) {

    $scope.todos = todoStorage.get();
    $scope.newTodo = '';

    $scope.addTodo = function() {
        var newTodo = $scope.newTodo.trim();
        if (!newTodo.length) {
            return;
        }

        $scope.todos.push({
            title: newTodo,
            completed: false
        });
        todoStorage.put($scope.todos);

        $scope.newTodo = '';
    };

    $scope.removeTodo = function(todo) {
        $scope.todos.splice($scope.todos.indexOf(todo), 1); // splice takes index of element to be removed, how many elements to remove
        todoStorage.put($scope.todos);
    };

    $scope.updateCompleted = function() {
        todoStorage.put($scope.todos);
    }
});
