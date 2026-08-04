/* servidor estático só para testar service worker e instalação, que exigem http */
const http = require('http'), fs = require('fs'), path = require('path');
const TIPOS = {'.html':'text/html;charset=utf-8', '.js':'text/javascript', '.png':'image/png',
  '.webmanifest':'application/manifest+json', '.json':'application/json', '.md':'text/plain;charset=utf-8'};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(__dirname, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end('nao encontrado'); }
    res.writeHead(200, {'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream',
                        'Cache-Control': 'no-cache'});
    res.end(d);
  });
}).listen(8099, () => console.log('servindo em http://localhost:8099'));
