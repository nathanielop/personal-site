import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, watch, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const publicDir = path.join(root, 'public');
const reloadFile = path.join(root, '.livereload');
const port = Number(process.env.PORT) || 8080;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const liveReloadSnippet = `
<script>
  (() => {
    const source = new EventSource('/__livereload');
    source.onmessage = () => location.reload();
    source.onerror = () => source.close();
  })();
</script>
`;

const clients = new Set();

const notify = () => {
  for (const client of clients) client.write('data: reload\n\n');
};

const resolveFile = async urlPath => {
  const cleaned = decodeURIComponent(urlPath.split('?')[0]);
  let target = path.join(publicDir, cleaned);
  try {
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    return target;
  } catch {
    return path.join(target, 'index.html');
  }
};

const server = createServer(async (req, res) => {
  if (req.url === '/__livereload') {
    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive'
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  const file = await resolveFile(req.url || '/');
  const type = contentTypes[path.extname(file)] || 'application/octet-stream';
  try {
    if (type.startsWith('text/html')) {
      let html = await readFile(file, 'utf8');
      html = html.includes('</body>')
        ? html.replace('</body>', `${liveReloadSnippet}</body>`)
        : html + liveReloadSnippet;
      res.writeHead(200, { 'content-type': type });
      res.end(html);
    } else {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': type });
      res.end(body);
    }
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  }
});

if (!existsSync(reloadFile)) writeFileSync(reloadFile, '0');

let debounce;
watch(reloadFile, () => {
  clearTimeout(debounce);
  debounce = setTimeout(notify, 50);
});

setInterval(() => {
  for (const client of clients) client.write(': ping\n\n');
}, 30000);

server.listen(port, () => {
  console.log(`Serving ./public at http://localhost:${port}`);
});
