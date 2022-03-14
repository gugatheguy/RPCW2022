var http = require('http')
var url = require('url')
var axios = require('axios')

function generateMainPage(){
    page = `<!DOCTYPE html>
    <html>
        <head>
            <title>Escola de música</title>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
            <div class="w3-cell-row w3-padding-16">
                <div class="w3-container w3-cell w3-center w3-mobile" style="width:33%">
                    <a href="http://localhost:4000/alunos" class="w3-button w3-pale-blue w3-hover-gray w3-round-large"><h2>Lista de alunos</h2></a>
                </div>
                <div class="w3-container w3-cell w3-center w3-mobile" style="width:33%">
                    <a href="http://localhost:4000/cursos" class="w3-button w3-pale-blue w3-hover-gray w3-round-large"><h2>Lista de cursos</h2></a>
                </div>
                <div class="w3-container w3-cell w3-center w3-mobile" style="width:33%">
                    <a href="http://localhost:4000/instrumentos" class="w3-button w3-pale-blue w3-hover-gray w3-round-large"><h2>Lista de instrumentos</h2></a>
                </div>
            </div> 
        </body>
    </html>`
    return page
}

function generateTablePage(keys,data,title){
    page = `<!DOCTYPE html>
    <html>
        <head>
            <title>Escola de música</title>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        </head>
        <body>
            <div class="w3-container w3-pale-blue w3-center w3-mobile">
                <h2>Lista de ${title}</h2>
            </div>
            <div class="w3-container w3-center w3-mobile">
                <table class="w3-table w3-bordered w3-centered w3-striped w3-hoverable">
                    <tr class="w3-hover-pale-green">\n`
    keys.forEach(k => {
        page += "\t\t\t<th>"+k+"</th>\n"
    });
    data.forEach(a =>{
        page += `\t\t<tr class="w3-hover-pale-green">\n`
        for(var key in a){
            page += "\t\t\t<td >"+a[key]+"</td>\n"
        }
        page += "\t\t</tr>\n"
    })
    page+=`\t</table>
        </div>
        <div class="w3-container w3-center w3-mobile">
            <a href="http://localhost:4000" class="w3-button w3-pale-blue w3-hover-gray w3-round-large"><h3>Voltar</h3></a>
        </div>
        </body>
    </html>`
    return page
}

myserver = http.createServer(function (req,res){
    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)

    var parsed = url.parse(req.url, true)
    console.log("query"+parsed.path)
    switch(parsed.pathname){
        case("/"):
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(generateMainPage())
            res.end()
            break;
        case("/alunos"):
            axios.get('http://localhost:3000'+parsed.path)
            .then(function(resp) {
                var alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(generateTablePage(Object.keys(alunos[0]),alunos,"alunos"))
                res.end()
            })
            .catch(error =>{
                console.log(error);
            });
            break;
            case("/instrumentos"):
            axios.get('http://localhost:3000'+parsed.path)
            .then(function(resp) {
                var insts = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(generateTablePage(["id","nome"],insts,"instrumentos"))
                res.end()
            })
            .catch(error =>{
                console.log(error);
            });
            break;
            case("/cursos"):
            axios.get('http://localhost:3000'+parsed.path)
            .then(function(resp) {
                var cursos = resp.data;
                cursos.forEach(c=>{
                    c["id instrumento"] = c["instrumento"]["id"]
                    c["nome instrumento"] = c["instrumento"]["#text"]
                    delete c.instrumento
                })
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(generateTablePage(Object.keys(cursos[0]),cursos,"cursos"))
                res.end()
            })
            .catch(error =>{
                console.log(error);
            });
            break;
        default:
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end("<pre>Rota não suportada: "+ req.url + "</pre>")
            break;
    }
});

myserver.listen(4000)
console.log('Servidor à escuta na porta 4000')
