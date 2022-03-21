var http = require('http')
var axios = require('axios')
var url = require('url')
var fs = require('fs')
var stt = require('./static.js')

var {parse} = require('querystring')

function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            callback(parse(body))
        })
    }
}


function geraToDoTasks(tasks){
    var page = `
            <h2 class="w3-text-teal">Tarefas por fazer</h2>
            <ul class="w3-ul w3-card-4">`
    tasks.forEach(t => {
        page +=`
                <li class="w3-bar">
                    <span class="w3-right">
                        <div class="w3-cell-row">
                            <div class="w3-cell">
                                <form action="/tasks/${t.id}/do" method="POST">
                                    <button class="w3-button w3-round-large w3-teal w3-hover-gray" type="submit">Done</button>
                                </form>
                            </div>
                            <div class="w3-cell">
                                <form action="/edit/${t.id}" method="GET">
                                    <button class="w3-button w3-round-large w3-teal w3-hover-gray" type="submit">Edit</button>
                                </form>
                            </div>
                            <div class="w3-cell">
                                <form action="/tasks/${t.id}/delete" method="POST">
                                    <button class="w3-button w3-round-large w3-teal w3-hover-red" type="submit">Delete</button>
                                </form>
                            </div>
                        </div>
                    </span>
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
function geraDoneTasks(tasks){
    var page = `
            <h2 class="w3-text-teal">Tarefas feitas</h2>
            <ul class="w3-ul w3-card-4">`
    tasks.forEach(t => {
        page +=`
                <li class="w3-bar">
                    <span class="w3-right">
                        <div class="w3-cell-row">
                            <div class="w3-cell">
                                <form action="/tasks/${t.id}/undo" method="POST">
                                    <button class="w3-button w3-round-large w3-teal w3-hover-gray" type="submit">Undo</button>
                                </form>
                            </div>
                            <div class="w3-cell">
                                <form action="/edit/${t.id}" method="GET">
                                    <button class="w3-button w3-round-large w3-teal w3-hover-gray" type="submit">Edit</button>
                                </form>
                            </div>
                            <div class="w3-cell">
                                <form action="/tasks/${t.id}/delete" method="POST">
                                    <button class="w3-button w3-round-large w3-teal w3-hover-red" type="submit">Delete</button>
                                </form>
                            </div>
                        </div>
                    </span>
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

function geraEditForm(t){
    return `
            <h2 class="w3-text-teal">Registar nova terafa</h2>
            <form class="w3-container" action="/tasks/${t.id}/edit" method="POST">
                <label class="w3-text-teal"><b>Nome</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="name" value="${t.name}"/>

                <label class="w3-text-teal"><b>Tarefa</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="task" value="${t.task}"/>

                <label class="w3-text-teal"><b>Tipo</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="type" value="${t.type}"/>

                <label class="w3-text-teal"><b>Data Limite</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="deadline" value="${t.deadline}"/>
                <br>

                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>
`
}

function geraPag(d,form,todo,done){
    return `<!DOCTYPE html>
<html>
    <head>
        <title>Lista de Tarefas</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-container w3-padding-8">
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
        </div>
    </body>
</html>
        `
}

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
                        .then(response2 => {
                            var done = geraDoneTasks(response2.data)
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
                }else if(/\/edit\/[0-9]+/.test(req.url)){
                    var id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/tasks?status=toDo")
                    .then(response => {
                        var toDo = geraToDoTasks(response.data)
                        axios.get("http://localhost:3000/tasks?status=done")
                        .then(response2 => {
                            var done = geraDoneTasks(response2.data)
                            axios.get("http://localhost:3000/tasks/"+id)
                            .then(response3 => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraPag(d,geraEditForm(response3.data),toDo,done))
                                res.end() 
                            })
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
            case "POST":
                if(req.url=='/tasks'){
                    recuperaInfo(req,resultado =>{
                        resultado['date'] = d.substring(0,10)
                        resultado['status'] = 'toDo'
                        axios.post('http://localhost:3000/tasks', resultado)
                        .then( resp =>{
                            res.writeHead(301, {'Location': '/'})
                            res.end()
                        })
                        .catch(err =>{
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no POST: " + err + "</p>")
                            res.end()  
                        })
                    })
                }
                if(/\/tasks\/[0-9]+\/do/.test(req.url)){
                    var id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/tasks/" + id).then(resp => {
                        var task = resp.data
                        task['status'] = 'done'
                        axios.put('http://localhost:3000/tasks/' + id, task).then(resp => {
                            res.writeHead(301, {'Location': '/'})
                            res.end()
                        }).catch(err => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no PUT: " + err + "</p>")
                            res.end()  
                        })
                    }).catch(err => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Erro no GET: " + err + "</p>")
                        res.end()  
                    })
                }
                if(/\/tasks\/[0-9]+\/undo/.test(req.url)){
                    var id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/tasks/" + id).then(resp => {
                        var task = resp.data
                        task['status'] = 'toDo'
                        axios.put('http://localhost:3000/tasks/' + id, task).then(resp => {
                            res.writeHead(301, {'Location': '/'})
                            res.end()
                        }).catch(err => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no PUT: " + err + "</p>")
                            res.end()  
                        })
                    }).catch(err => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Erro no GET: " + err + "</p>")
                        res.end()  
                    })
                }
                if(/\/tasks\/[0-9]+\/edit/.test(req.url)){
                    recuperaInfo(req,resultado =>{
                        var id = req.url.split('/')[2]
                        axios.get("http://localhost:3000/tasks/" + id).then(resp => {
                            resultado['date'] = resp.data['date']
                            resultado['status'] = resp.data['status']
                            resultado['id'] = resp.data['id']
                            axios.put('http://localhost:3000/tasks/'+id, resultado)
                            .then( resp =>{
                                res.writeHead(301, {'Location': '/'})
                                res.end()
                            })
                            .catch(err =>{
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Erro no PUT: " + err + "</p>")
                                res.end()  
                            })
                        })
                        .catch(err =>{
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Erro no GET: " + err + "</p>")
                            res.end()  
                        })
                    })
                }
                if(/\/tasks\/[0-9]+\/delete/.test(req.url)){
                    var id = req.url.split('/')[2]
                    axios.delete("http://localhost:3000/tasks/" + id).then(resp => {
                        res.writeHead(301, {'Location': '/'})
                        res.end()
                    })
                    .catch(err => {
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Erro no DELETE: " + err + "</p>")
                        res.end()  
                    })
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
}) 

toDoServer.listen(3015)
console.log('Servidor a escuta na porta 3015...') 