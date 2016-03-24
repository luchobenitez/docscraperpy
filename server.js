const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const config = require('./config.js')

function responseCheck(error, response, body){
  if(!error && response.statusCode == 200){
    var $ = cheerio.load(body);
    json = {
      ci : "",
      nombres : "",
      apellidos : "",
      fechaNacimiento : "",
      sexo : "",
      tipoAsegurado : "",
      beneficiariosActivos : "",
      numeroPatronal : "",
      empleador : "",
      estado : "",
      mesesAporte : "",
      vencimiento : "",
      ultimoPeriodoAbonado : ""
    };
    $('table tr').each(
      function (i){
        var children = $(this).children();
        if (i==3) {
          json.ci = $(children[1]).text().trim();
          json.nombres = $(children[2]).text().trim();
          json.apellidos = $(children[3]).text().trim();
          json.fechaNacimiento = $(children[4]).text().trim();
          json.sexo = $(children[5]).text().trim();
          json.tipoAsegurado = $(children[6]).text().trim();
          json.beneficiariosActivos = $(children[7]).text().trim();
        };
        if (i==5) {
          json.numeroPatronal = $(children[0]).text().trim();
          json.empleador = $(children[1]).text().trim();
          json.estado = $(children[2]).text().trim();
          json.mesesAporte = $(children[3]).text().trim();
          json.vencimiento = $(children[4]).text().trim();
          json.ultimoPeriodoAbonado = $(children[5]).text().trim();
        }
      }
    );
    if (json.ci != ''){
      fs.appendFileSync(config.outputFile,JSON.stringify(json, null, 4) + '\n');
      console.log(json.ci);
    }
  } else {
    console.log('Page Error');
  }
}
function getRequest(p) {
  config.ci = p.toString();
  var options = {
    headers: config.headerReq,
    url: config.urlReq,
    body: config.bodyHead+config.ci+config.bodyTrailer
  };
  request.post(options, responseCheck);
}
/*
Is not working yet.
Future works will include managing diferent workers for huge amount of requests
function getNextCI(){
  var ciToFetch = config.currentCI++;
  if (current >= config.totalCI){
    console.log("no hay mas nada en este worker");
    return;
  }
  http.get (options, function(res){
    var pageData = "";

    res.resume();
    res.on('data', function(chunk){
      if(res.statusCode == 200){
        pageData +=chunk;
      }
    });
    res.on('end', function(){
      console.log('get CI: '+options.pageId);
      // hacemos algo con el html
      getNextCI();
    });
  })-on('error', function(e){
    console.log('Error: '+options.host +'\n'+e.message);
    getNextCI();
  })
}
*/

for (var p=703400; p<=713699; p++) {
  setInterval (
    getRequest(p),
    config.interval * 40,
    p
  );
};
console.log('Scraping IPS');
