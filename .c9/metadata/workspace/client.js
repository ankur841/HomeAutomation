{"filter":false,"title":"client.js","tooltip":"/client.js","undoManager":{"mark":0,"position":0,"stack":[[{"start":{"row":0,"column":0},"end":{"row":23,"column":0},"action":"insert","lines":["  var socket = require('socket.io-client')('https://nodejs-ankurkushwaha.c9.io/');","  var readline = require('readline');","  ","  var rl = readline.createInterface({","  input: process.stdin,","  output: process.stdout","});","","  socket.on('connect', function(){","\t  socket.emit('chat message', \"desktop client connected\");","\t  console.log(\"connected\")","  });","  socket.on('chat message', function(data){","\t  console.log(data)","\t  ","  });","  socket.on('disconnect', function(){","\t  console.log(\"disconnected\")","  });","","rl.on(\"line\",function(answer) {","  socket.emit('chat message', answer);","});",""],"id":1}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":8,"column":34},"end":{"row":8,"column":34},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1435426285000,"hash":"32cda6e9f93445c9502556e7d9b3b6ccd8cf80b6"}