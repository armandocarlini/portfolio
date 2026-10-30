// Servidor local para conferir dist/ como a Vercel vai servir: mesmos cabeçalhos do vercel.json,
// página 404, compressão brotli dos textos e respostas parciais (Range), que o Safari exige para tocar vídeo.
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { pipeline } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync } from 'node:zlib';

// pipeline fecha o arquivo mesmo quando o navegador cancela o pedido no meio (comum com vídeo);
// com .pipe() o arquivo ficava aberto e travava o build no Windows
const enviar = (arquivo, res, faixa) => pipeline(createReadStream(arquivo, faixa), res, () => {});

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const pasta = join(raiz, process.argv[2] || 'dist');
const porta = Number(process.env.PORT || 4411);
const regras = JSON.parse(readFileSync(join(raiz, 'vercel.json'), 'utf8')).headers
  .map((r) => ({ padrao: new RegExp('^' + r.source + '$'), headers: r.headers }));

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4'
};

if (!existsSync(pasta)) { console.error(`Pasta ${pasta} não existe. Rode antes: node scripts/build.mjs`); process.exit(1); }

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let caminho = decodeURIComponent(url.pathname);
  for (const r of regras) if (r.padrao.test(caminho)) for (const h of r.headers) res.setHeader(h.key, h.value);
  if (caminho.endsWith('/')) caminho += 'index.html';
  const arquivo = normalize(join(pasta, caminho));
  let status = 200, alvo = arquivo;
  if (!arquivo.startsWith(pasta + sep) || !existsSync(arquivo) || !statSync(arquivo).isFile()) {
    status = 404; alvo = join(pasta, '404.html');
    res.setHeader('Cache-Control', 'no-store');
  }
  const tamanho = statSync(alvo).size;
  res.setHeader('Content-Type', TIPOS[extname(alvo)] || 'application/octet-stream');
  res.setHeader('Accept-Ranges', 'bytes');
  const faixa = status === 200 && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (faixa && (faixa[1] || faixa[2])) {
    const ini = faixa[1] ? Number(faixa[1]) : Math.max(0, tamanho - Number(faixa[2]));
    const fim = faixa[1] && faixa[2] ? Math.min(Number(faixa[2]), tamanho - 1) : tamanho - 1;
    if (ini > fim || ini >= tamanho) { res.writeHead(416, { 'Content-Range': `bytes */${tamanho}` }); return res.end(); }
    res.writeHead(206, { 'Content-Range': `bytes ${ini}-${fim}/${tamanho}`, 'Content-Length': fim - ini + 1 });
    return req.method === 'HEAD' ? res.end() : enviar(alvo, res, { start: ini, end: fim });
  }
  if (/^(text|application)\/|svg/.test(res.getHeader('Content-Type')) && /\bbr\b/.test(req.headers['accept-encoding'] || '')) {
    const corpo = brotliCompressSync(readFileSync(alvo));
    res.writeHead(status, { 'Content-Encoding': 'br', 'Content-Length': corpo.length, Vary: 'Accept-Encoding' });
    return res.end(req.method === 'HEAD' ? undefined : corpo);
  }
  res.writeHead(status, { 'Content-Length': tamanho });
  if (req.method === 'HEAD') return res.end();
  enviar(alvo, res);
}).listen(porta, () => console.log(`Servindo ${pasta} em http://localhost:${porta}`));
