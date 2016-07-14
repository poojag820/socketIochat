var http = require('http');
var fs = require('fs');

//create server
var server = http.createServer(function(req,res){
  fs.readFile(__dirname + '/index.html',function(err,data){
    if(!err){
      // console.log(data);
      res.end(data);
    }
    else{
      console.log(err);
    }
  });

});

var users = [];
var userSocketObj  = {};

var io = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){
  console.log('user connectionc');

  socket.on('add user',function(data,callback){
    nickname = data.user;
    var userIndex = users.indexOf(nickname);
    if(userIndex == -1){
      socket.nickname = nickname;
      console.log('user'+' ' + socket.nickname + 'connection');
      users.push(nickname);
      userSocketObj[nickname] = socket;
      callback(false);
      updateUserInDOM();
    }
    else{
      callback(true);
    }
  });

  socket.on('disconnect',function(){
    console.log('user disconnect' + socket.nickname);
    users.splice(socket.nickname,1);
    updateUserInDOM();
  });

  socket.on('new message',function(data){
    //send message to all
    io.emit('new message',data);
  });

});



function updateUserInDOM(){
  io.emit('updateUsers',{'users':users});
}


server.listen(8000,function(){
  console.log('listening on port 8000');
})
