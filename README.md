# Portfólio de Armando Carlini

Home cinematográfica comandada pela rolagem, com três projetos em destaque, capturas reais dos apps,
um voo por São Paulo, túnel de fotos, ATLAS e contato. A página `projetos.html` reúne telas complementares,
fluxos e implementação. O conteúdo técnico fica visível, sem acordeões.

HTML, CSS e JavaScript sem framework. GSAP 3.13 (com ScrollTrigger) e Lenis 1.3.4 ficam em `js/vendor/`,
com a versão no nome do arquivo.

## Rodar localmente

Precisa de Node 20 ou mais novo. Não há dependências para instalar.

```bash
npm run preview
# monta dist/ e serve em http://localhost:4411
```

O servidor local (`scripts/servir.mjs`) aplica os mesmos cabeçalhos do `vercel.json`, comprime os textos
e responde a pedidos parciais de vídeo, então o que funciona nele funciona na Vercel.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | home e projetos em destaque |
| `projetos.html` | projetos, capturas e detalhes de implementação |
| `css/projetos.css` | composição das telas reais e página de projetos |
| `js/projetos.js` | ampliação acessível das capturas e movimento da página de projetos |
| `404.html` | página de erro |
| `css/site.css` | estilos, tokens da paleta "tinta" e as fontes |
| `js/site.js` | movimento, assinatura vetorial (`SIG`, `PONTOS`), vídeo, cursor e barra de rolagem |
| `js/vendor/` | GSAP, ScrollTrigger e Lenis |
| `fonts/` | Archivo, Geist e Geist Mono em woff2, só o subconjunto latino |
| `img/` | fotos, capturas do ATLAS, posters do voo, ícones e a imagem de compartilhamento (`og.jpg`) |
| `video/voo.mp4` | voo por São Paulo para desktop, 1440×810, comandado pela rolagem |
| `video/voo-vertical.mp4` | recorte vertical para celular, 504×896, avança e retrocede com a rolagem |
| `scripts/build.mjs` | monta `dist/` |
| `scripts/servir.mjs` | servidor local de conferência |

## Conferir movimento no celular

O mobile tem três cenas presas (abertura, cidade e túnel de fotos). No túnel, a câmera atravessa as fotos
em profundidade, com enquadramento próprio para celular e texto no final. Projetos, ilustrações e assinatura
acompanham a rolagem sem prender as demais seções. O vídeo vertical existente é carregado como blob perto da cidade;
as buscas de quadro são agrupadas para não sobrecarregar o decodificador. Movimento reduzido mantém o conteúdo legível sem essas animações.

Com a prévia rodando, `rtk proxy node scripts/check-mobile.mjs "caminho/para/playwright/index.mjs"`
testa Chrome em 360×640, 390×844, 844×390 e 1440×900, além de movimento reduzido e troca de breakpoint.
É necessário ter Playwright e Google Chrome instalados. `TEST_URL` troca o endereço da prévia;
`TEST_WIDTH` filtra uma largura e `TEST_CPU=4` simula uma CPU quatro vezes mais lenta.
As capturas ficam em `_antigo/qa-mobile/`, fora do deploy. Safari em um iPhone físico ainda deve ser conferido.

## Publicar na Vercel

As imagens de `img/projetos/` são demonstrações adaptadas do DocShield, Atendimento e TV Gerência.
Os layouts preservam a estrutura dos apps; marca, tipografia e cores são adaptadas ao portfólio por `scripts/tema-capturas.css`.
Antes de capturar, execute `rtk proxy node scripts/preparar-capturas.mjs`: ele exporta `origin/main` para `_antigo/captura-atual`, compila o frontend e registra a revisão usada. Não reutilize builds antigos dos worktrees.
`scripts/capturar-produtos.mjs` usa os assets originais e intercepta as APIs com fixtures de demonstração;
não acessa a produção nem utiliza dados de pacientes. O caminho do checkout de origem está no início do script.
Para reproduzir: `rtk proxy node scripts/capturar-produtos.mjs "caminho/para/playwright/index.mjs"`.
`scripts/check-projects.mjs` confere telas, ampliação, navegação, overflow e console em desktop e mobile
com a prévia na porta 4412. Também compara a altura da home com `main`.

1. Importe o repositório na Vercel. O `vercel.json` já define o build (`node scripts/build.mjs`) e a saída (`dist`).
2. O build troca o marcador `SITE_URL` (canonical, Open Graph, sitemap, robots) pelo domínio de produção
   que a Vercel informa. Para forçar outro, crie a variável de ambiente `SITE_URL`, por exemplo
   `https://armandocarlini.com`.
3. Cada arquivo de `css/`, `js/`, `fonts/`, `img/` e `video/` recebe `?v=<hash>` no build e vai com cache de um ano.
   Trocar uma foto mantendo o nome é seguro: o hash muda e o navegador baixa a nova.

## Cuidados ao editar

- **Script inline do `<head>`**: a Content-Security-Policy do `vercel.json` só libera esse script pelo hash.
  Se ele mudar, o build para e mostra o hash novo para colar no `vercel.json`.
- **Vídeo**: quadros-chave a cada 12 quadros deixam a busca na rolagem fluida. Para regerar a partir do original:

  ```bash
  ffmpeg -i original.mp4 -an -vf scale=1440:810:flags=lanczos -c:v libx264 -preset slower -crf 28 \
    -profile:v high -pix_fmt yuv420p -g 12 -keyint_min 12 -sc_threshold 0 -movflags +faststart video/voo.mp4
  ffmpeg -i original.mp4 -an -vf "crop=506:900:547:0,scale=504:896:flags=lanczos" -c:v libx264 -preset slower \
    -crf 26 -profile:v high -pix_fmt yuv420p -g 60 -movflags +faststart video/voo-vertical.mp4
  ```

  Os posters (`img/voo-poster*.webp`) são o primeiro quadro de cada versão.
- **Movimento reduzido**: com `prefers-reduced-motion`, não há abertura, rolagem suave, cursor nem vídeo;
  as seções presas viram layout comum.
