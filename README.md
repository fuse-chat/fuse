# fuse

Geolocation + group based chat

# Table of Contents

* Setup
  * Environment
  * Repo
  * Database
* Testing
* Running locally
* Contributors

# Setup

This sections describes initial developer setup and useful tips.

## Environment

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

## Repo

* Clone the repo `git clone git@github.com:fuse-chat/fuse.git` 

## Database

* Install MongoDB (`sudo apt-get install mongodb` for ubuntu or [this](https://docs.mongodb.org/manual/installation/) otherwise) for database management
* Run `mongod --dbpath=<path of your choice>` to start the mongodb db server.

### Using mongo from the command line

The database URL path we use is `localhost:27017/fuse`

* From the command line, run: `mongo localhost:27017/fuse`
* You will enter the mongo console, and the prompt will turn into `>`
* Use the fuse database by typing at the prompt: `use fuse`

#### Basics

Two of our collections are `groups` and `user`. You can work on them like so:

* db.groups.find()
* db.user.drop()

More details at the reference: [https://docs.mongodb.org/manual/reference/](https://docs.mongodb.org/manual/reference/)

# Testing

* All tests can be found in the `test/` folder.
* To run the tests, ensure that you have installed everything (npm install), then run `./node_modules/mocha/bin/mocha --recursive` from the main folder.

# Running locally

* `git pull --rebase origin master` to get the latest
* Run `npm install` and `bower install` to install dependencies (please do this regularly)
* Run nodemon with the harmony flag (allows ES6 features) `nodemon --harmony app.js` to start the server locally!
* Visit `localhost:3000` in your browser
