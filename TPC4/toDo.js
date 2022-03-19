var http = require('http')
var axios = require('axios')
var fs = require('fs')
var stt = require('./static.js')

var {parse} = require('querystring')

function geraToDoTasks(tasks){
    var page = `
            <h2 class="w3-text-teal">Tarefas por fazer</h2>
            <ul class="w3-ul w3-card-4">`
    tasks.forEach(t => {
        page +=`
                <li class="w3-bar">
                    <div class="w3-bar-item">
                      <span class="w3-large">${t.name}</span><br>
                      <span>${t.task} - ${t.type}</span><br>
                      <span class="w3-small">até ${t.deadline}</span>
                    </div>
                </li>`
    });
    page +=`
            </ul>`
    return page
}
function geraDoneTasks(){
    var page = `
            <h2 class="w3-text-teal">Tarefas feitas</h2>
            <ul class="w3-ul w3-card-4">`
    tasks.forEach(t => {
        page +=`
                <li class="w3-bar">
                    <div class="w3-bar-item">
                      <span class="w3-large">${t.name}</span><br>
                      <span>${t.task} - ${t.type}</span><br>
                      <span class="w3-small">até ${t.deadline}</span>
                    </div>
                </li>`
    });
    page +=`
            </ul>`
    return page
}

function geraForm(){
    return `
            <h2 class="w3-text-teal">Registar nova terafa</h2>
            <form class="w3-container" action="/tasks" method="POST">
                <label class="w3-text-teal"><b>Nome</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="name"/>

                <label class="w3-text-teal"><b>Tarefa</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="task"/>

                <label class="w3-text-teal"><b>Tipo</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="type"/>

                <label class="w3-text-teal"><b>Data Limite</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="deadline"/>
                <br>

                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>
`
}

function geraPag(d,form,todo,done){
    return `<html>
    <head>
        <title>Lista de Tarefas</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-container w3-teal w3-center">
            <h1>Tarefas</h1>
        </div>
        <div class="w3-container w3-border w3-hover-border-gray w3-border-teal">`+
        form+
        `</div>
        <div class = "w3-cell-row">
            <div class = "w3-container w3-border w3-hover-border-gray w3-border-teal w3-cell"  style="width:50%">`+
            todo+
            `</div>
            <div class = "w3-container w3-border w3-hover-border-gray w3-border-teal w3-cell" style="width:50%">`+
            done+
            `</div>
        </div>
    </body>
</html>
        `

}
/*var counter = 0
axios.get("http://localhost:3000/tasks")
                    .then(response => {
                        var tasks = response.data
                        tasks.forEach( t => {
                            if (t.id >= counter)
                                counter = t.id+1 
                        });
                    })
                    .catch(function(erro){
                    })
    console.log("Id counter: "+counter)*/
var toDoServer = http.createServer(function (req, res) {
    
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    if (stt.recursoEstatico(req)){
        stt.sirvoRecursoEstatico(req,res)
    }else{
        switch(req.method){
            case "GET": 
                if((req.url == "/")){
                    axios.get("http://localhost:3000/tasks?status=toDo")
                    .then(response => {
                        var toDo = geraToDoTasks(response.data)
                        axios.get("http://localhost:3000/tasks?status=done")
                        .then(response => {
                            var done = geraToDoTasks(response.data)
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPag(d,geraForm(),toDo,done))
                            res.end() 
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p> Erro ao contactar a base de dados.</p>")
                            res.end()
                        })
                    })
                    .catch(function(erro){
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p> Erro ao contactar a base de dados.</p>")
                        res.end()
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " Não suportado neste servidor.</p>")
                    res.end()
                }
                break
            /*case "POST":
                //res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                //Replace this code with a POST request to the API server
                //res.write('<p>Recebi um POST dum aluno</p>')
                //res.write('<p><a href="/">Voltar</a></p>')
                //res.end()
                if(req.url=='/alunos'){
                    recuperaInfo(req,resultado =>{
                        //resultado[id] = resultado[Id]
                        axios.post('http://localhost:3000/alunos', resultado)
                        .then( resp =>{
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPostConfirm(resp.data,d))
                            res.end() 
                        })
                        .catch(err =>{
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no POST: " + err + "</p>")
                            res.write("<p><a href=\"/\">Voltar</a></p>")
                            res.end()  
                        })
                    })
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " nÃ£o suportado neste serviÃ§o.</p>")
                res.end()*/
        }
    }
}) 

toDoServer.listen(3015)
console.log('Servidor a escuta na porta 3015...') 