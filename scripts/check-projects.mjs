import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
const { chromium } = await import(pathToFileURL(process.argv[2]).href);
const browser = await chromium.launch({ channel: 'chrome' });
const output = new URL('../_antigo/qa-projects/', import.meta.url);
mkdirSync(output, { recursive: true });
const originals = Object.fromEntries(['index.html', 'css/site.css', 'js/site.js'].map(path => [path, execFileSync('rtk', ['proxy', 'git', 'show', 'main:' + path], { encoding: 'utf8' })]));
try {
  for (const width of [390, 1440]) {
    const heights = [];
    for (const baseline of [true, false]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 900, hasTouch: width < 900 });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      if (baseline) await page.route('**/*', route => {
        const path = new URL(route.request().url()).pathname.slice(1) || 'index.html';
        return originals[path] ? route.fulfill({ body: originals[path], contentType: path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : 'text/html' }) : route.continue();
      });
      await page.goto('http://127.0.0.1:4412', { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      heights.push(await page.evaluate(() => document.documentElement.scrollHeight));
      if (!baseline) {
        assert.equal(await page.locator('.caso').count(), 3);
        assert.equal(await page.locator('.modulo').count(), 2);
        for (const id of ['c1', 'c3', 'c5']) {
          await page.evaluate(id => {
            const el = document.querySelector('.projeto-' + id);
            const st = ScrollTrigger.getAll().find(s => s.pin && s.trigger === el);
            const y = st ? st.start + (st.end - st.start) * 0.65 : el.querySelector('.produto').getBoundingClientRect().top + scrollY - 100;
            window.__lenis.scrollTo(y, { immediate: true }); ScrollTrigger.update();
          }, id);
          await page.waitForTimeout(1400);
          await page.screenshot({ path: fileURLToPath(new URL(`${id}-${width}.png`, output)) });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'sem overflow');
        }
        assert.equal(await page.locator('details').count(), 0, 'conteúdo visível, sem acordeões');
        await page.locator('.projeto-c5 .ampliar-tela').click();
        assert.equal(await page.locator('dialog').getAttribute('open'), '');
        await page.keyboard.press('Escape');
        await page.goto('http://127.0.0.1:4412/projetos.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1200);
        await page.screenshot({ path: fileURLToPath(new URL(`projetos-${width}.png`, output)) });
        assert.equal(await page.locator('.implementacao').count(), 3);
        assert.equal(await page.locator('.captura').count(), 7);
        assert.equal(await page.locator('details').count(), 0);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'página de projetos sem overflow');
        for (const slug of ['atendimento', 'docshield', 'dashboard', 'atlas']) {
          await page.locator('#' + slug).scrollIntoViewIfNeeded();
          await page.waitForTimeout(600);
          assert.ok(await page.locator('#' + slug + ' h2').isVisible());
          const shot = page.locator('#' + slug + ' .captura').first();
          await shot.scrollIntoViewIfNeeded();
          await page.waitForTimeout(700);
          await page.screenshot({ path: fileURLToPath(new URL(`${slug}-pagina-${width}.png`, output)) });
        }
        assert.ok(await page.locator('.captura img').evaluateAll(imgs=>imgs.every(i=>i.complete && i.naturalWidth>0)), 'capturas carregadas');
        assert.deepEqual(errors, []);
      }
      await context.close();
    }
    console.log(JSON.stringify({ width, before: heights[0], after: heights[1], reduction: Math.round((1 - heights[1] / heights[0]) * 100) + '%' }));
  }
} finally { await browser.close(); }
