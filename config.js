var config = {}

config.urlReq = 'http://servicios.ips.gov.py/consulta_asegurado/comprobacion_de_derecho_externo.php';

config.headerReq = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Referer': 'http://servicios.ips.gov.py/consulta_asegurado/comprobacion_de_derecho_externo.php',
  'Connection': 'keep-alive',
  'Accept-Encoding' : 'gzip, deflate',
  'Cache-Control': 'max-age=0',
  'agentClass': 'Agent',
  'agentOptions': {
    'socksHost': 'localhost',
    'socksPort': '9050'
  },
  'pool': {
    'maxSockets': 10
  },
  'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
}

config.bodyHead = 'nro_cic=';
config.ci = '0';
config.bodyTrailer = '&recuperar=Recuperar&envio=ok';

config.outputFile = 'ips.txt';

config.totalCI = 7000000;
config.queue = 30;

module.exports = config;
