// Monta dist/ para publicar: copia só o que o site usa, troca SITE_URL pelo domínio
// e acrescenta ?v=<hash> em cada arquivo referenciado, para o cache longo nunca servir versão velha.
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(raiz, 'dist');

const PUBLICAR = ['index.html', 'projetos.html', '404.html', 'css', 'js', 'fonts', 'img', 'video', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'site.webmanifest', 'robots.txt', 'sitemap.xml'];
const TEXTO = ['index.html', 'projetos.html', '404.html', 'css/site.css', 'css/projetos.css', 'site.webmanifest', 'robots.txt', 'sitemap.xml'];

// Na Vercel, VERCEL_PROJECT_PRODUCTION_URL traz o domínio de produção (o próprio, quando houver, ou o .vercel.app).
function dominio() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (process.env.VERCEL) throw new Error('Defina SITE_URL nas variáveis de ambiente do projeto na Vercel.');
  return 'http://localhost:' + (process.env.PORT || 4411);
}

const arquivos = (caminho) => (statSync(caminho).isDirectory() ? readdirSync(caminho).flatMap((n) => arquivos(join(caminho, n))) : [caminho]);

// Atualiza dist/ arquivo por arquivo, sem apagar a pasta: no Windows, um arquivo aberto pelo servidor local
// (o vídeo tocando, por exemplo) impede remover a pasta inteira. Arquivo igual não é copiado de novo.
const site = dominio();
const publicar = new Set(PUBLICAR.flatMap((item) => arquivos(join(raiz, item))).map((f) => relative(raiz, f)));
for (const rel of publicar) {
  const origem = join(raiz, rel), destino = join(dist, rel);
  if (existsSync(destino) && statSync(destino).size === statSync(origem).size && readFileSync(destino).equals(readFileSync(origem))) continue;
  mkdirSync(dirname(destino), { recursive: true });
  copyFileSync(origem, destino);
}
// o que saiu do site sai de dist/ também (se o servidor local estiver com o arquivo aberto, fica para a próxima)
for (const f of arquivos(dist)) {
  if (publicar.has(relative(dist, f))) continue;
  try { unlinkSync(f); } catch (e) { console.warn('não deu para apagar agora:', relative(raiz, f)); }
}

const hashes = new Map();
const versao = (caminho) => {
  if (!hashes.has(caminho)) {
    const arquivo = join(dist, caminho);
    hashes.set(caminho, existsSync(arquivo) ? createHash('sha256').update(readFileSync(arquivo)).digest('hex').slice(0, 10) : null);
  }
  return hashes.get(caminho);
};
const ASSET = /\b((?:css|js|fonts|img|video)\/[\w./-]+\.(?:css|js|woff2|webp|jpg|png|svg|mp4))(?!\?v=)/g;

const faltando = [];
for (const rel of TEXTO) {
  const arquivo = join(dist, rel);
  const original = readFileSync(arquivo, 'utf8');
  const texto = original.replaceAll('SITE_URL', site).replace(ASSET, (m, caminho) => {
    const v = versao(caminho);
    if (!v) { faltando.push(rel + ' → ' + caminho); return m; }
    return caminho + '?v=' + v;
  });
  writeFileSync(arquivo, texto);
}
if (faltando.length) throw new Error('Arquivos referenciados que não existem:\n  ' + faltando.join('\n  '));

// O script inline do <head> só roda se o hash dele estiver na Content-Security-Policy do vercel.json.
const csp = JSON.stringify(JSON.parse(readFileSync(join(raiz, 'vercel.json'), 'utf8')).headers);
for (const pagina of ['index.html', 'projetos.html', '404.html']) {
  const html = readFileSync(join(dist, pagina), 'utf8');
  for (const [, codigo] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    const hash = "'sha256-" + createHash('sha256').update(codigo).digest('base64') + "'";
    if (!csp.includes(hash)) throw new Error(`O script inline de ${pagina} mudou. Atualize a Content-Security-Policy do vercel.json com ${hash}`);
  }
}

console.log(`dist/ pronto para ${site} (${hashes.size} arquivos versionados)`);
