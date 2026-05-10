const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

function findIndexHtml() {
  const candidates = [
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(process.cwd(), 'public', 'index.html'),
    path.join(process.cwd(), 'index.html'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log('Serving from:', p);
      return p;
    }
  }
  return null;
}

const INDEX_PATH = findIndexHtml();
if (!INDEX_PATH) {
  console.error('ERROR: index.html not found. Make sure the file is named index.html in the project root or /public.');
  process.exit(1);
}

const HTML_CONTENT = fs.readFileSync(INDEX_PATH);
console.log(`Loaded index.html: ${(HTML_CONTENT.length / 1024).toFixed(0)}KB`);

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  });
  res.end(HTML_CONTENT);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`JBA Property Solutions live at http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
