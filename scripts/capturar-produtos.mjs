// Captura interfaces locais originais. Todas as APIs são substituídas por fixtures.
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const base = 'C:/Users/Armando/Documents/revion-feegow';
const worktree = resolve('_antigo/captura-atual');
if (!existsSync(worktree + '/revision.txt')) throw new Error('Execute scripts/preparar-capturas.mjs antes de capturar.');
const { chromium } = await import(pathToFileURL(process.argv[2]).href);
const ts = require(base + '/.claude/worktrees/atendimento-etapa1/node_modules/typescript');
const fixturesModule = { exports: {} };
new Function('exports', ts.transpileModule(readFileSync(worktree + '/apps/atendimento-web/src/test/fixtures.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(fixturesModule.exports);
const f = fixturesModule.exports;
const assistant = {};
new Function('exports', ts.transpileModule(readFileSync(worktree + '/apps/atendimento-web/src/features/assistant/test-fixtures.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(assistant);
const spec = readFileSync(base + '/apps/dashboard/tests/tv-gerencia.render.test.js', 'utf8');
const dashboard = new Function(spec.slice(spec.indexOf('function payload('), spec.indexOf('function julho(')) + ';return payload();')();
dashboard.support.push({ id: 'ocupacaoAgenda', value: 61, target: 55, status: 'ok' }, { id: 'taxaRecebimento', value: 68, target: 55, status: 'ok' });
dashboard.hero.push({ id: 'metas', value: 28, target: 50, pct: 56, status: 'near' });
const now = new Date().toISOString();
const patient = { id: 9001, nome: 'Marina Exemplo', name: 'Marina Exemplo', cpf: '', email: '', telefone: '', data_nascimento: '1990-01-01', sexo: 'F' };
const conversations = ['Marina Exemplo', 'Clara Exemplo', 'Ana Exemplo', 'Laura Exemplo', 'Sofia Exemplo'].map((name, i) => f.listItem({ id: 'demo-' + i, contact: { id: 'p-' + i, name, photoUrl: null, phone: '' }, lastMessageAt: now, waitingSince: now, windowExpiresAt: new Date(Date.now() + 86400000).toISOString() }));
const messages = ['Olá! Gostaria de agendar uma avaliação.', 'Olá, Marina! Sou a assistente virtual da Revion. Posso ajudar com os horários.', 'Quinta-feira à tarde seria ótimo.', 'Vou consultar a disponibilidade para quinta. Você prefere no início ou no fim da tarde?', 'No fim da tarde, por favor.'].map((body, i) => f.message({ body, direction: i % 2 ? 'OUTBOUND' : 'INBOUND', authorType: i % 2 ? 'AI' : 'CONTACT', occurredAt: new Date(Date.now() - (5 - i) * 60000).toISOString() }));
const tipo = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.otf': 'font/otf', '.svg': 'image/svg+xml' };
mkdirSync('img/projetos', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
async function adaptar(page) {
  await page.addStyleTag({ content: readFileSync('scripts/tema-capturas.css', 'utf8') });
  await page.evaluate(() => {
    document.querySelectorAll('img[src*="logo"]').forEach(img => { const s=document.createElement('span');s.className='portfolio-wordmark';s.textContent=location.pathname.includes('tv-')?'OPERAÇÃO':'DOCUMENTOS';img.replaceWith(s); });
    document.querySelectorAll('.font-marca').forEach(el=>el.textContent='◫');
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const n of nodes){if(['SCRIPT','STYLE'].includes(n.parentElement?.tagName))continue;n.textContent=n.textContent.replace(/REVION INTERNATIONAL CLINIC/gi,'WORKSPACE CLÍNICO').replace(/REVION CLINIC/gi,'RECEPÇÃO').replace(/Revion/g,'Clínica').replace(/REVION/g,'CLÍNICA').replace(/BEAUTY/g,'CUIDADO').replace(/BEYOND/g,'EM CADA').replace(/BORDERS/g,'ETAPA');}
  });
  await page.evaluate(()=>document.fonts.ready);
}
try {
  for (const app of ['recepcao', 'medico', 'atendimento', 'tv-gerencia']) {
    if(process.env.CAPTURE_APP && process.env.CAPTURE_APP!==app)continue;
    const doc = ['recepcao', 'medico'].includes(app);
    const root = doc ? worktree + '/apps/docshield/public' : app === 'atendimento' ? worktree + '/apps/atendimento-web/dist' : base + '/apps/dashboard/public';
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
    page.on('pageerror', error => console.log(app, 'ERROR', error.message));
    await page.addInitScript(() => {
      localStorage.setItem('revion_token', 'portfolio-demo');
      localStorage.setItem('revion_user', JSON.stringify({ name: 'Equipe demonstração', role: 'admin', id: 'demo' }));
      localStorage.setItem('revion_theme', 'light');
      sessionStorage.setItem('revion_pendencias_popup_visto', '1');
    });
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname !== 'portfolio-demo.local') return route.abort();
      const p = url.pathname;
      if(p==='/portfolio-font.woff2'||p==='/portfolio-title.woff2')return route.fulfill({body:readFileSync(p.includes('title')?'fonts/archivo-latin.woff2':'fonts/geist-latin.woff2'),contentType:'font/woff2'});
      if (p.startsWith('/api/')) {
        let data = {};
        if (p === '/api/me') data = { ...f.VIVIANE, user: { ...f.VIVIANE.user, name: 'Equipe demo' } };
        else if (p === '/api/assistant') data = { mode: 'ON', changedBy: 'Equipe demo', changedAt: null };
        else if (p === '/api/conversations') data = f.listResponse(conversations);
        else if (/\/conversations\/[^/]+$/.test(p)) data = { conversation: f.detail({ ...conversations[0], channel: f.REVION.channels[0], handlingMode: 'AI', canReply: true }) };
        else if (p.endsWith('/messages')) data = { messages, nextCursor: null };
        else if (p === '/api/scripts') data = f.revionScripts(false);
        else if (p === '/api/script-variables') data = f.revionVariables(false);
        else if (p.includes('/scripts')) data = f.conversationScripts();
        else if (p === '/api/assistant/instructions') data = assistant.instructionsResponse();
        else if (p === '/api/assistant/versions') data = { versions: [] };
        else if (p === '/api/assistant/evaluations/atual') data = { evaluation: null };
        else if (p === '/api/assistant/suggestions') data = { suggestions: [] };
        else if (p === '/api/dashboard/tv') data = dashboard;
        else if (p.includes('/patients/search')) data = { patients: [patient] };
        else if (p.includes('/patients/')) data = patient;
        else if (p.includes('/appointments/today')) data = { count: 12, appointments: [], date: now.slice(0, 10) };
        else if (p.includes('/signatures/')) data = { pending: [{ patient, docs: [{ name: 'Consentimento e Orientações', isDualSign: true, signed: false, liberado: true, d4uuid: 'demo-documento' }] }], signed: [], entries: [], signatures: [] };
        else if (p.includes('/medico/me')) data = { medico: { id: 1, nome: 'Dra. Exemplo', name: 'Dra. Exemplo', crm: 'Demonstração' } };
        else if (p.includes('/templates')) data = { templates: [] };
        return route.fulfill({ json: data, headers: { 'X-Dashboard-Role': 'gerente' } });
      }
      let relative = p.slice(1);
      if (app === 'atendimento' && (!extname(relative) || relative === '')) relative = 'index.html';
      if (doc && !extname(relative)) relative = app + '.html';
      const file = resolve(root, relative);
      if (!file.startsWith(resolve(root)) || !existsSync(file)) return route.fulfill({ status: 404, body: '' });
      return route.fulfill({ body: readFileSync(file), contentType: tipo[extname(file)] || 'application/octet-stream' });
    });
    const path = app === 'atendimento' ? '/?conversa=demo-0' : '/' + app + '.html';
    await page.goto('http://portfolio-demo.local' + path);
    await page.waitForTimeout(3000);
    await adaptar(page);
    if (doc) {
      if (app === 'recepcao') await page.screenshot({ path: 'img/projetos/recepcao-busca.png' });
      await page.evaluate(p => { if (typeof selectPatient === 'function') selectPatient(p); }, patient);
      await page.waitForTimeout(1800);
      await adaptar(page);
    }
    console.log(app, (await page.locator('body').innerText()).slice(0, 500));
    await page.screenshot({ path: 'img/projetos/' + app + '.png' });
    if (app === 'atendimento') {
      console.log('links', await page.locator('a').evaluateAll(els => els.map(a => [a.textContent, a.getAttribute('href')])));
      await page.goto('http://portfolio-demo.local/assistente');
      await page.waitForTimeout(1800);
      await adaptar(page);
      console.log('assistente', (await page.locator('body').innerText()).slice(0, 800));
      await page.screenshot({ path: 'img/projetos/atendimento-assistente.png' });
    }
    await page.close();
  }
} finally { await browser.close(); }
