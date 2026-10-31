// Use: node scripts/check-mobile.mjs <caminho para playwright/index.mjs>
import assert from 'node:assert/strict';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
const { chromium } = await import(pathToFileURL(process.argv[2]).href);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const output = new URL('../_antigo/qa-mobile/', import.meta.url);
mkdirSync(output, { recursive: true });
try {
  for (const [width, height, reduce] of [[390, 844, false], [360, 640, false], [844, 390, false], [390, 844, true], [1440, 900, false]]) {
    if (process.env.TEST_WIDTH && width !== Number(process.env.TEST_WIDTH)) continue;
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 900, hasTouch: width < 900, reducedMotion: reduce ? 'reduce' : 'no-preference' });
    const page = await context.newPage();
    if (process.env.TEST_CPU) {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.TEST_CPU) });
    }
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:4411', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2400);
    assert.ok(await page.locator('.hero-nome .fit').evaluateAll((es) => es.every((e) => e.offsetWidth <= document.documentElement.clientWidth)), 'nome completo na abertura');
    const pins = await page.evaluate(() => ScrollTrigger.getAll().filter((s) => s.pin).length);
    assert.equal(pins, reduce ? 0 : width < 900 ? 3 : 9, 'cenas presas à tela');
    const move = async (selector, fraction = 0) => {
      await page.evaluate(({ selector, fraction }) => {
        const st = ScrollTrigger.getAll().find((s) => s.pin && s.trigger.matches(selector));
        const el = document.querySelector(selector);
        const y = st ? st.start + (st.end - st.start) * fraction : el.getBoundingClientRect().top + scrollY;
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y);
        ScrollTrigger.update();
      }, { selector, fraction });
      await page.waitForTimeout(800);
      await page.waitForFunction((selector) => {
        const st = ScrollTrigger.getAll().find((s) => s.pin && s.trigger.matches(selector));
        return !st || !st.animation || Math.abs(st.animation.totalProgress() - st.progress) < 0.005;
      }, selector);
    };
    await page.screenshot({ path: fileURLToPath(new URL(`hero-${width}-${height}-${reduce}.png`, output)) });
    if (!reduce && width < 900) {
      await move('.hero', 0.96);
      assert.ok(await page.locator('.manif').evaluate((e) => +getComputedStyle(e).opacity) > 0.95);
      await page.screenshot({ path: fileURLToPath(new URL(`manifesto-${width}-${height}.png`, output)) });
    }
    for (const section of ['.intro', '.sis', '.caso', '.tunel', '.sobre', '.contato']) {
      await move(section);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow em ${section}`);
      if (width === 390 && !reduce) await page.screenshot({ path: fileURLToPath(new URL(`${section.slice(1)}.png`, output)) });
    }
    if (!reduce) {
      await move('.tunel', 0.15);
      const inicio = await page.locator('.tunel-cena').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m43);
      await move('.tunel', 0.55);
      const meio = await page.locator('.tunel-cena').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m43);
      assert.ok(meio > inicio + 500, `câmera atravessa as fotos em profundidade: ${inicio} / ${meio}`);
      await page.screenshot({ path: fileURLToPath(new URL(`tunel-meio-${width}-${height}.png`, output)) });
      await move('.tunel', 0.98);
      assert.ok(await page.locator('.tunel-txt').evaluate((e) => +getComputedStyle(e).opacity) > 0.9, 'texto legível no fim da travessia');
      await page.screenshot({ path: fileURLToPath(new URL(`tunel-fim-${width}-${height}.png`, output)) });
      await move('.tunel', 0.15);
      const retorno = await page.locator('.tunel-cena').evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m43);
      assert.ok(Math.abs(retorno - inicio) < 30, 'câmera retorna ao mesmo ponto');
    } else {
      assert.equal(await page.locator('.tunel-cena').evaluate((e) => getComputedStyle(e).display), 'grid');
    }
    await move('.cid', 0.35);
    if (!reduce) {
      await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
      await page.waitForTimeout(600);
      const first = await page.locator('video').evaluate((e) => e.currentTime);
      await move('.cid', 0.8);
      const second = await page.locator('video').evaluate((e) => e.currentTime);
      assert.ok(second > first + 0.2, `vídeo avança: ${first} / ${second}`);
      await move('.cid', 0.3);
      assert.ok(await page.locator('video').evaluate((e) => e.currentTime) < second, 'vídeo reverte');
      await page.screenshot({ path: fileURLToPath(new URL(`cidade-${width}-${height}.png`, output)) });
    } else {
      assert.equal(await page.locator('video').evaluate((e) => e.getAttribute('src')), null);
    }
    assert.deepEqual(errors, []);
    if (width === 1440) {
      await move('.tunel', 0.6);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(1000);
      assert.equal(await page.locator('.tunel-pin').evaluate((e) => getComputedStyle(e).perspective), '650px', 'perspectiva mobile ao trocar breakpoint');
      assert.equal(await page.evaluate(() => ScrollTrigger.getAll().filter((s) => s.pin).length), 3);
    }
    console.log(`PASS ${width}x${height} reduced=${reduce}: pins, overflow, vídeo, console`);
    await context.close();
  }
} finally { await browser.close(); }
