module.exports = function(io) {
  io.on('connection', (socket) => {
    socket.on('join chat', (params) => {
      socket.join(params.room1);
      socket.join(params.room2);
    });
  });
}