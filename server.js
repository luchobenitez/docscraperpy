// @source: https://github.com/luchobenitez/docscraperpy
/* 
Copyright (C) Lucho Benitez  Developer

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.
*/

const async = require("async"),
      fs = require('fs'),
      request = require('request'),
      cheerio = require('cheerio'),
      config = require('./config.js');

var successCI = [],
    failureCI = [];

var crawlCI = function (CI, callback){
  console.log ('crawlCI :'+CI);
  config.ci = CI;
  var options = {
    headers: config.headerReq,
    url: config.urlReq,
    body: config.bodyHead+config.ci+config.bodyTrailer
  };
  request.post(
    options,
    function (error, response, body){
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
            }
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
        if (json.ci !== ''){
          fs.appendFileSync(config.outputFile,JSON.stringify(json, null, 4) + '\n');
          successCI[0]=CI;
        } else {
          failureCI[0]=CI;
        }
        callback(null,CI);
      } else {
        console.error(error);
        callback();
      }
    }
  );
};

var crawlingQueue = async.queue(crawlCI, config.queue);

crawlingQueue.drain = function(){
    console.log('CI Asegurados :' + successCI);
    console.log('CI No Asegurados :' + failureCI);
    console.log('done');
};

for (var i = 1; i <= config.totalCI; i++){
  crawlingQueue.push(i);
}
