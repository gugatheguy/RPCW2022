var mongoose = require('mongoose')

var FileSchema = new mongoose.Schema({
    date: String,
    name: String,
    mimetype: String,
    size: Number,
    desc: String
})

module.exports = mongoose.model('file',FileSchema)