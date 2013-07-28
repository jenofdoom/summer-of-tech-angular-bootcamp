summer-of-tech-js-bootcamp
==========================

This JavaScript tutorial for Summer of Tech 2013 Bootcamps is based heavily on the [AngularJS example](https://github.com/tastejs/todomvc/tree/gh-pages/architecture-examples/angularjs) on the [todomvc](http://todomvc.com/architecture-examples/angularjs/) site. This version is stripped down somewhat - it's an introduction as opposed to a features demo.

The [master branch of this repo](https://github.com/jenofdoom/summer-of-tech-js-bootcamp) contains the 'stub' of our todo application. It's a starting point, it doesn't totally work yet. Making it work is up to you. Read on to find out how to accomplish this.

If you get stuck you can refer to the example application, for which [there is an 'example' branch in this repo](https://github.com/jenofdoom/summer-of-tech-js-bootcamp/tree/example).

Instructions
------------

### Clone the application locally

1. Open up a terminal. In your home directory, create a directory with the following command: `mkdir js-bootcamp`
2. Move into the new directory with the command `cd js-bootcamp`
3. Clone the repository with `git clone https://github.com/jenofdoom/summer-of-tech-js-bootcamp.git`

### Look at what's set up already

1. In a text editor, open up the `index.html` and the three javascript files within the `/js` directory.
2. In your browser (I recommend Firefox with [Firebug](https://addons.mozilla.org/en-US/firefox/addon/firebug/) installed, but Chrome should work too), browse locally for index.html (using the Open File command in the File menu in Firefox). We're using Open File because for the purposes of this bootcamp we aren't worrying about setting up a local server. For future reference, the 'proper' thing to have done would have been to run a local web server and serve the files through that - Apache or node.js could have done this for us.
3. You should see a page with an input box and a title and not much else. If you type some text into the input box and hit 'add', nothing will happen.

For our to-do application we're going to have to be able to remember the to-do items that our users tell us about. As you've learned, the majority of websites are backed by a database for storage. JavaScript is not usually really designed to talk to a database, because it resides not on the server, but on the individual user's browser (there are definitely some exceptions to this but broadly speaking it's true). So that leaves us with a couple of options for storing the to-do items.

One method would be to talk to a server-side language like Python or Ruby and let it handle talking to the database on the server. That would be using an API. The other method, which is what we'll be using, is to use HTML5 localstorage. This is a great lightweight solution that lets us store a small amount of data on the user's machine, the only downside of which is that you won't be able to carry your todo list from one computer to another.

Our application already has an AngularJS 'service' to talk to localstorage set up. You can see it in `services.js`, there are two parts to it - one part is the 'put' action, which sotres all the todos after it has translated them into a data serialisation format called JSON. The other is the 'get' action, which returns a list of all the todos we have stored, translating them back from JSON as it does it. The JSON format is required because localstorage is quite crude compared to a proper database - it can only store simple strings. We don't need to make any changes to the stoage service, you can close the `services.js` file now.

We also already have a very basic application set up in `app.js`. Angular sets itself up in very modular way. Our `app.js` just contains one line of code to define our application, which is called `todoList`. We don't need to make any changes to `app.js`, you can close it down (in a more advanced application with multiple pages, we'd have more logic in this file). The other place we define this application is in the html itself - if you look near the top of `index.html` you will see on the html element we define an attribure like so: `ng-app="todoList"` - this links this html page to the Angular application.

So where are we going to put the majority of the code in our application? That goes into the controller. We link the HTML to a specific named controller with the `ng-controller="TodoCtrl"` attribute on the div element a little further down. Everything that is inside that div can be associated with the `TodoCtrl` controller, which is set up in our remaining js file, `controllers.js`.

In this file, you can see that we have some basic setup for the controller, which pulls in a couple of things we'll need: `$scope` is an Angular service we can use to expose data to the HTML template, and `todoStorage`, which is our custom localstorage service. We also already have a few lines of code, let's look at what those do:

    $scope.todos = todoStorage.get();

This is using the localstorage service to fetch a list of all the todos. But it's going to be an empty list for now until we can make saving a todo work. We can see that it's empty right now because we're outputting it in our template, using an AngularJS templating feature. We wrap the variable we want to output in double curly braces, like so:

    {{ todos }}

We don't need to use the `$scope.` part when we refer to it, because all references in the template MUST be from the $scope. Right now the only thing that is being displayed is an empty list, `[]`. Let's make saving a todo work so we can see some proper output there.

### Making the addTodo function work

The other snippet of code we have already set up in `controllers.js` is a function, `addTodo`, which currently looks like this:

    $scope.addTodo = function() {
        // this function gets called by the ng-submit directive on the new todo form
    };

As you can see, right now it does nothing. It gets run whenever the `todo-form` gets submitted (either by pressing the 'add' button, or by hitting enter while the input box has focus).

### Looping through all the todos to display them

### Removing a todo

### Marking a todo as completed

### Styling the application

### Further functionality
