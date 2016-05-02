const http = require('http');
const fs = require('fs');



const server = http.createServer(function(req, res){
    res.writeHead('Content-type', 'json/application');

    fs.readFile('a/text.txt', 'utf8', function(err, data){
        if(err) throw err;
        res.end(data);
    });
});

server.listen(8000);