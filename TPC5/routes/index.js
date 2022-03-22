var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/musicas', function(req, res, next) {
  axios.get("http://localhost:3000/musicas")
    .then(response => {
        var musl = response.data
        res.render('musicas', { musicas: musl });
    })
    .catch(function(erro){
      res.render('error', { error: erro });
    })
});

router.get('/musicas/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas/"+req.params.id)
    .then(response => {
        var musd = response.data
        console.log(musd)
        res.render('musica', { musica: musd });
    })
    .catch(function(erro){
      res.render('error', { error: erro });
    })
});

module.exports = router;
