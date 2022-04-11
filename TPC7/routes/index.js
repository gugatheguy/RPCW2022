var express = require('express');
var router = express.Router();
var axios = require('axios')

key = "apikey=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGNiYTg0OWJhYmI2NjdjYmZkYzE2ZSIsImlhdCI6MTY0OTE5NTY1MiwiZXhwIjoxNjUxNzg3NjUyfQ.EuvH713Qr6IZ073-5FMF6j5p_3tb6Trv0TOOF5ZHWOPUlCBqKU1H9DTo_ueoCyWhPbEd6F8xzNvn-UkG3J8Ppq65xF8uukoElnSIsi3kldXI2E_EHMv5ETIq-2SGpiBmLyv1zu2broi-nXw18XwKM-WWpoumw5mZacg1qyj4kokGm--WzPIDD15Uibu2ObsDfeHpbDt81Npq-WgEVe56F5w0TdAvY_b-Xvm77hXI4MuaatL9bsOtYEyiepLuBelDyVWjAIoon3-7tB1lwrPnC0OJ_cxKUyCdqx8sZPkmciyTmBsV8fDTyvTP1ibiryAQsDRK5TrG83CcWmStZyDnoQ"
/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get("http://clav-api.di.uminho.pt/v2/classes?nivel=1" +"&"+key).then( resp => {
    res.render('index', { title: "CLAV", list: resp.data })
  }).catch( err => {
    res.render('error', { title: "erro", message: err })
  })
});

router.get('/classe/:id', function(req, res, next) {
  axios.get("http://clav-api.di.uminho.pt/v2/classes/c"+req.params.id +"?"+key).then( resp => {
    var pai = !(Object.keys(resp.data.pai).length === 0)
    var pr = {}
    if (resp.data.nivel == 3){
      pr['eCruzadoCom'] = []
      pr['eComplementarDe'] = []
      pr['eSuplementoDe'] = []
      pr['eSuplementoPara'] = []
      resp.data.processosRelacionados.forEach( p =>{
          switch (p.idRel) {
            case('eCruzadoCom'):
              pr['eCruzadoCom'].push(p)
              break;
            case('eComplementarDe'):
              pr['eComplementarDe'].push(p)
              break;
            case('eSuplementoDe'):
              pr['eSuplementoDe'].push(p)
              break;
            case('eSuplementoPara'):
              pr['eSuplementoPara'].push(p)
              break;
            default:
              break;
          }
      })
    }

    res.render('classe', { title: "CLAV", classe: resp.data, temPai: pai, pRel: pr})
  }).catch( err => {
    res.render('error', { title: "erro", message: err })
  })
});

module.exports = router;
