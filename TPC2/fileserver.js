var http = require('http')
var fs = require('fs')

myserver = http.createServer(function (req,res){
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)

    fs.readFile('./archive'+req.url.split('.html')[0]+'.html', function(err,data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        if(err){
            res.write("<p>Erro na leitura do ficheiro</p>")

        }else{
            res.write(data)
        }
        res.end()
    })
})

myserver.listen(7777)
console.log('Servidor à escuta na porta 7777')
    