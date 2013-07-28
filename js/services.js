'use strict';

todoList.factory('todoStorage', function () {
    var STORAGE_ID = 'todoList';

    return {
        get: function() {
            return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]'); // returns what's in storage OR an empty list
        },

        put: function(todos) {
            localStorage.setItem(STORAGE_ID, JSON.stringify(todos)); // encodes items as JSON and saves to localstorage
        }
    };
});
