// node module requires
const express = require('express')
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// view engine setup - currently uses Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware
// see: http://expressjs.com/guide/using-middleware.html
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// main routes
app.use('/', require('./routes/index'));
app.use('/api/1/groups', require('./routes/api/1/groups'));

// if none of routes above match
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// export app in case other files want to use it
module.exports = app;

// socket.io events
io.on('connection', function(socket) {
  socket.on('chat message', function(obj) {
    console.log('message: ' + obj.message.body);
  });
});

io.on('connection', function(socket) {
  socket.on('chat message', function(obj) {
    io.emit('chat message', obj);
  });
});

// start the server
http.listen(3000, function(){
  console.log('listening on *:3000');
});
