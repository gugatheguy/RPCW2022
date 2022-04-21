var express = require('express');
var router = express.Router();
var para = require('../controllers/para');
/* GET home page. */
router.get('/paras', function(req, res) {
  para.listar()
    .then(dados =>{
      res.status(200).jsonp(dados)
    })
    .catch(err =>{
      res.status(500).jsonp({erro: err})
    })
});

router.post('/paras', function(req, res) {
  console.log(req.body)
  para.inserir(req.body)
    .then(dados =>{
      res.status(201).jsonp(dados)
    })
    .catch(err =>{
      res.status(501).jsonp({erro: err})
    })
});

router.put('/paras/edit/:id', function(req, res) {
  para.editar(req.params.id,req.body)
    .then(dados =>{
      res.status(200).jsonp(dados)
    })
    .catch(err =>{
      res.status(502).jsonp({erro: err})
    })
});

router.delete('/paras/delete/:id', function(req, res) {
  para.remover(req.params.id)
    .then(dados =>{
      res.status(200).jsonp(dados)
    })
    .catch(err =>{
      res.status(503).jsonp({erro: err})
    })
});
module.exports = router;
