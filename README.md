# fuse

Geolocation + group based chat

# Initial setup

* Install node (and npm) using [`nvm`](https://github.com/creationix/nvm)
* Setup your computer to use node v4.2.1 or higher

````bash
$ nvm install 4.2.1
$ nvm use 4.2.1
$ nvm alias default 4.2.1
````

* Install bower (`npm install -g bower`) for getting front-end components easily
* Install nodemon (`npm install -g nodemon`) for reloading node apps automatically on changes
* Install the Less CSS compiler (`npm install -g lessc`) for compiling `.less` to `.css` manually, if needed sometimes.

# Running locally

* Clone the repo `git clone git@github.com:fuse-chat/fuse.git` and switch to the root of the project
* Run `npm install` and `bower install` to install dependencies
* Run `nodemon app.js` to start the server locally!
* Visit `localhost:3000` in your browser
