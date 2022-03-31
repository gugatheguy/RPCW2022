var express = require('express');
var router = express.Router();
var fs = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads'})

var File = require('../controllers/file')

/* GET home page. */
router.get('/', function(req, res, next) {
  File.list()
    .then(data => res.render('index', {list: data}))
    .catch(error => res.render('error', {error: error}))
});

router.post('/files',upload.single('myFile'), (req,res) =>{
  let oldPath = __dirname + '/../' + req.file.path
  let newPath = __dirname + '/../fileStore/' + req.file.originalname

  fs.rename(oldPath,newPath, erro => {
    if(erro) throw erro
  })

  var d = new Date().toISOString().substring(0,16)

  var file = {
    date: d,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    desc: req.body.desc
  }

  File.insert(file)
    .then(data => res.redirect('/'))
    .catch(error => res.render('error', {error: error}))

})

router.get('/delete/:id', function(req, res, next) {
  File.delete(req.params.id)
    .then(data => res.redirect('/'))
    .catch(error => res.render('error', {error: error}))
});

router.get('/files/:id', function(req, res, next) {
  File.lookUp(req.params.id)
    .then(data => {
      fs.readFile(__dirname+"/../fileStore/"+data.name, (err, content) => {
        res.writeHead(200, {'Content-Type': data.mimetype})
        res.write(content)
        res.end()
      })
    })
    .catch(error => res.render('error', {error: error}))

});

module.exports = router;
