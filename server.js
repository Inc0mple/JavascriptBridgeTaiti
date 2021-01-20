const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);


//logger middleware code from https://codesource.io/creating-a-logging-middleware-in-expressjs/
server.use(function (req, res, next) {
    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      (current_datetime.getMonth() + 1) +
      "-" +
      current_datetime.getDate() +
      " " +
      (current_datetime.getHours() > 9
        ? current_datetime.getHours()
        : "0" + current_datetime.getHours()) +
      ":" +
      (current_datetime.getMinutes() > 9
        ? current_datetime.getMinutes()
        : "0" + current_datetime.getMinutes()) +
      ":" +
      (current_datetime.getSeconds() > 9
        ? current_datetime.getSeconds()
        : "0" + current_datetime.getSeconds());
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    let log = `[${method}:${url}] request received on ${formatted_date}. Status: ${status}`;
    console.log(log);
    next();
  });

// Need to implement a server-side game logger
let players = [];
io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
        console.log("Player 1 is " + socket.id)
    };

    socket.on('dealCards', function () {
        io.emit('dealCards');
    });

    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});

http.listen(3000, function () {
    console.log('Server started!');
});