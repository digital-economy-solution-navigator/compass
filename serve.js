// Quick local server to avoid CORS when opening the demo.
// Run: node serve.js
// Then open http://localhost:3456

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const MIMES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url;
  file = path.join(__dirname, file.split('?')[0]);
  const ext = path.extname(file);
  const mime = MIMES[ext] || 'application/octet-stream';
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Demo running at http://localhost:' + PORT);
});
