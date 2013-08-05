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
2. In your browser (I recommend Firefox with [Firebug](https://addons.mozilla.org/en-US/firefox/addon/firebug/) installed, but Chrome should work too), browse locally for `index.html` (using the Open File command in the File menu in Firefox). We're using Open File because for the purposes of this bootcamp we aren't worrying about setting up a local server. For future reference, the 'proper' thing to have done would have been to run a local web server and serve the files through that - Apache or node.js could have done this for us.
3. You should see a page with an input box and a title and not much else. If you type some text into the input box and hit 'add', nothing will happen.

For our to-do application to work we're going to have to be able to remember the to-do items that our users tell us about. As you've learned, the majority of websites are backed by a database for storage. JavaScript is not usually really designed to talk to a database, because it resides not on the server, but on the individual user's browser (there are definitely some exceptions to this but broadly speaking it's true). So that leaves us with a couple of options for storing the to-do items.

One method would be to talk to a server-side language like Python or Ruby and let it handle talking to the database on the server. That would be using an API. The other method, which is what we'll be using, is to use HTML5 localstorage. This is a great lightweight solution that lets us store a small amount of data on the user's machine, the only downside of which is that you won't be able to carry your todo list from one computer to another.

Our application already has an AngularJS 'service' to talk to localstorage set up. You can see it in `services.js`, there are two parts to it - one part is the 'put' action, which stores all the todos after it has translated them into a data serialisation format called JSON. The other is the 'get' action, which returns a list of all the todos we have stored, translating them back from JSON as it does it. The JSON format is required because localstorage is quite crude compared to a proper database - it can only store simple strings. We don't need to make any changes to the stoage service, you can close the `services.js` file now.

We also already have a very basic application set up in `app.js`. Angular sets itself up in very modular way. Our `app.js` just contains one line of code to define our application, which is called `todoList`. We don't need to make any changes to `app.js`, you can close it down (in a more advanced application with multiple pages, we'd have more logic in this file). The other place we define this application is in the html itself - if you look near the top of `index.html` you will see on the html element we define an attribute like so: `ng-app="todoList"` - this links this HTML page to the Angular application.

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

As you can see, right now it does nothing. It gets run whenever the `todo-form` gets submitted (either by pressing the 'add' button, or by hitting enter while the input box has focus). We can tell that it gets run because if we go look at the HTML, we can see there is an Angular directive that calls it on the form, like so: `ng-submit="addTodo()"`.

So what do we want to do when the form is saved? We want to take the string from the new todo input box, and save it into our list of todos. Convieniently, we have an easy way of getting the data from the input, because there is already an Angular 'model' directive attached to it, `ng-model="newTodo"` in the HTML. So we can just refer to $scope.newTodo in the controller. However we probably want to tidy up the data a little bit before storing.

We should get rid of any whitespace at the beginning or end of the variable. We can do this with a native javascript method, `trim()`. And let's create a new variable to refer to our cleaned up input.

  var newTodo = $scope.newTodo.trim();

From now on in the addTodo function we can use newTodo to refer to the data we're lokking to store. Now that we have gotten rid of any whitespace, is there any data left? '    thing     ' would have become 'thing', but '      ' would become '', which isnt' really worth storing. Let's not bother trying to store empty strings, we can just return from the function early, using an if statement to check if the todo has not (that's what the ! does) got a length.

  if (!newTodo.length) {
      return;
  }

If we got past that point okay, we should have a string of text to store into our todo list. First, we need to take the current list of todos, which is `$scope.todos`, and add the new one. `$scope.todos` is an array of objects, so we can add to it using another native JavaScript method, `push()`. This adds an item to the end of the array you call it on.

  $scope.todos.push({
      title: newTodo,
      completed: false
  });

You can see that inside our push statement we are making a new object. That's the part inside the curly braces. We give it a couple of properties, a title (which we set the value of to our new todo variable), and a completed status (which we set to be a boolean with a false state). JavaScript is 'loosely' typed - we don't have to specify that any particular variable or property is a particular type of thing, like an integer or a string - it will make an educated guess on our behalf depending on what we provide as input. We can use the completed status later so that we can 'check off' items on our list.

Now the list of todos has our new todo in it, we need to update the stored list. Rather than just adding the new item like we would do if we were talking to a database, we're just going to overwrite the entirety of the list with our updated copy. Because we already have our storage service set up, all we need to do is use an Angular method, `put`, like so:

  todoStorage.put($scope.todos);

Finally, the last thing we need to do is empty out the input box that still has the text of our new todo in it, so that we can immediately add another item. Because of the one to one binding between the input box and Angular's `$scope.newTodo`, all we need to do is set that to be an empty string:

  $scope.newTodo = '';

And that's it for our add new todo function. You can test that it's working by trying to add some todos - the data for them should show up on the page (although in quite a messy way - we'll look at tidying that up next), and we can tell it's being stored properly because if we referesh the page (or even close the browser and reopen the page) the list with our new items is still there.

### Looping through all the todos to display them

So now we have some todos, we can see they are being output in a very crude way in the HTML. The `$scope.todos` array is just being output via the `{{ todos }}` line in the HTML. Let's delete that line and replace it with something better. We should output the list into a suitable HTML structure, namely an unordered list, `ul`. Within the containing `ul` tags, we have one set of list item (`li`) tags per todo. And let's give the ul element a css ID so we can refer to it later.

  <ul id="todo-list">
      <li>
          todo text
      </li>
      <li>
          other todo text
      </li>
  </ul>

We have a problem though - we can't hand write each li tag ourselves because we don't know in advance how many todos there will be in the list. We need a better solution - we need Angular to create the markup for us, depending on how many items in the list there are. We can do this with a special Angular directive, `ng-repeat`, which is an attribute we will add to the section of markup we want to create repeatedly, the `li` tag. We then need to tell the ng-repeat directive what we want to iterate over (that's easy, we want to go through the `todos`), and what we want to call each item so we can refer to it through each iteration of the loop (it makes sense to call each individual item in the todos a `todo`).

  <li ng-repeat="todo in todos">
      {{ todo }}
  </li>

We're most of the way there now. Each todo gets it's own `li` element. However we don't want to just spit out the whole todo object, we only care about the title. We can refer to the title property of the object by seperating the property from the object with a period, e.g. `todo.title`. So, putting it all together, we should end up with a block in our HTML that looks something like this:

  <ul id="todo-list">
      <li ng-repeat="todo in todos">
          {{ todo.title }}
      </li>
  </ul>

### Removing a todo

Next up, removing a todo, seeing as a list we can only ever add things to and never remove things from sounds like a nightmare. This is pretty much the opposite of adding a todo, but in many ways it's quite similar. We'll need to have a function to update the list of todos, and then we'll need to update localstorage. One difference though, is that we need a way of refering to a specific todo that already exists inside the the array of todos.

For this reason, whenever we call the function, we will have to pass it an argument to tell it what todo we want to remove. The logical place to call this function from, then, is inside our list of todos. We'll give each todo a button that the user can click to remove it. So let's modify our template to add that:

  <li ng-repeat="todo in todos">
      {{ todo.title }}
      <button ng-click="removeTodo(todo)">✘</button>
  </li>

When the button gets clicked, the `removeTodo` function will be called, and that particular todo obect will be passed into it. That should be all we need in the template, now let's go and add the corresponding function into our controller. Create a new function after the addTodo function. Unlike the addTodo function, the parentheses after the function keyword aren't empty, because this time we're passing in an object and we should give it a name to use within the function. We can just call it `todo`.

  $scope.removeTodo = function(todo) {

  };

Now, within the function we need to remove this todo from the list of todos. In order to remove it we first need to work out where it is in the array. We can find out it's position using another native JavaScript method, `indexOf()`. When we run indexOf against an array, supplying an item we are looking for within the array, indexOf will return to us its numeric position within the array (or a -1 if it can't find it anywhere). Let's create a new variable to store the result of that in:

  var todoPosition = $scope.todos.indexOf(todo);

Now we know where it is in the array, we can use another built in array method to remove it, `splice()`. Splice takes two arguments, the first argument is the position in the array, and the second argument is how many items you want to remove from that point. We only ever want to remove one todo at once, so our second argument with be 1. The first argument will be the variable we stored a minute ago.

  $scope.todos.splice(todoPosition, 1);

Now we've updated our list of todos, the only thing remaining to do is update our localstorage version of them again.

  todoStorage.put($scope.todos);

### Marking a todo as completed

Our todo application can now add and remove todos. Another bit of functionality the might be nice would be the abilty to 'cross off' items without removing them totally - that's a much better way of showing that we have gotten something done! For this feature, we will obviously need a control on the page for each todo that we can interact with to mark it completed. We could use another button, but perhaps a better fit is a checkbox that we can tick to indicate that something is done. Let's modify the list block in our `index.html` to include this checkbox:

  <li ng-repeat="todo in todos">
      <label>
          <input type="checkbox">
          {{ todo.title }}
      </label>
      <button class="remove" ng-click="removeTodo(todo)">✘</button>
  </li>

Note that we're also adding in a label element - this is a good idea because it makes the markup more meangful by associating the text within the label tag (in this instance, the todo text) to the input element. It also make it so that you can click on the label text to control the checkbox, rather than just on the checkbox itself which is a bit fiddly to click on its own.

We already have a property on our todo object that we can use to tell if the todo is completed or not, we set it to false when we originally created the todo object. Now we just need to tie in this tickbox to that property. We can use `ng-model` again for that.

  <input type="checkbox" ng-model="todo.completed">

Great! We now have a way fo making the completed propety true or false by checking or unchecking the tickbox. But how do we display the fact that the todo is completed to the user? We should probably use some CSS styling. In fact, there is already a CSS rule set up, in `css/main.css`, that looks like the following:

  #todo-list .completed {
      text-decoration: line-through;
  }

In order for that to work, we're going to need to get that `completed` class into the HTML for that todo item in the list. We can do this using another Angular directive which is design to help us conditionally add classes to DOM elements, which unsuprisingly is called `ng-class`. We need to supply ng-class an object with the names of the classes as the properties, with a variable in the scope we want to evaluate as the value. If it evaluates as true, the class name will be added. If it's false, it won't be. And this will update itself dynamically as the scope variable we're evaluating changes. In our case this will look like so:

  <li ng-repeat="todo in todos" ng-class="{completed: todo.completed}">

That should work. Unfortunately, we have one bug... if we mark something as completed, and refresh the page, it won't remember that we marked it as completed. That's because we're not updating localStorage when something gets ticked or unticked. There are a few ways of making sure the stored version of the todos gets updates, but probably the simplest is for us to add one more function, that gets called whenever the checkbox gets clicked, like so:

  <input type="checkbox" ng-model="todo.completed" ng-click="updateCompleted()">

The function in the controller doesn't have to do very much, it just has to update the todos in localstorage.

  $scope.updateCompleted = function() {
      todoStorage.put($scope.todos);
  }

### Styling the application

So now we having a working application, we can set about making it look prettier. We have a few basic css rules set up in `css/main.css` already, but we can add to those to style the application further. At this point, you can either choose to attempt to style the app to look like the sample design in [css/example-design.png](https://raw.github.com/jenofdoom/summer-of-tech-js-bootcamp/master/css/example-design.png) or you can do your own thing and style it as you see fit.

### Further functionality

The todo application that this bootcamp is based on, over on [todomvc](http://todomvc.com/architecture-examples/angularjs/), is somewhat more sophisticated that our app as it currently stands. Go have a look at the functionality of that app and see if you can think about or even start building in some of those features. Note that you may have to alter some of your exisiting code as well - it's probably a good idea to do a commit of your working app (with git) before starting to build in new features. Here are some ideas for features to add:

* Filters to change if you want to see all todos, only uncompleted todos, or only completed todos
* A count of how many uncompleted todos are still outstnading at the bottom of the list
* A button that removes all todos that are marked as completed
* The ability to edit a todo
* The ability to mark a todo as 'urgent'

You may need to refer to the [docs for Angular](http://docs.angularjs.org/api) in order to find out what unfamiliar functions do.
