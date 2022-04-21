const Para = require('../models/para')

module.exports.listar = function (){
    return Para
        .find()
        .exec()
}

module.exports.inserir = function(p){
    var d = new Date()
    p.data = d.toISOString().substring(0,16)
    var newPara = new Para(p)
    return newPara.save()
}

module.exports.editar = function(id,data) {
    var d = new Date().toISOString().substring(0,16)
    return Para.updateOne({_id:id},{data:d, para: data.para})
}

module.exports.remover= function(id) {
    return Para.deleteOne({_id:id})
}