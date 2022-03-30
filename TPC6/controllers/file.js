const mongoose = require('mongoose')
var File = require('../models/file')

module.exports.list = () => {
    return File
        .find()
        .exec()
}

module.exports.lookUp = id => {
    return File
        .findOne({_id: mongoose.Types.ObjectId(id)})
        .exec()
}

module.exports.delete = id => {
    return File
        .deleteOne({_id: mongoose.Types.ObjectId(id)})
        .exec()
}

module.exports.insert = file => {
    var newFile = new File(file)
    return newFile.save()
}
