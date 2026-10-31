// Exporta apenas o frontend atual para um diretório de captura, sem mudar o checkout dos apps.
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, symlinkSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const repo = 'C:/Users/Armando/Documents/revion-feegow';
const deps = repo + '/.claude/worktrees/atendimento-etapa1/node_modules';
const root = resolve('_antigo/captura-atual');
const reference = process.argv[2] || 'origin/main';
mkdirSync(root, { recursive: true });
const revision = execFileSync('rtk', ['proxy', 'git', '-C', repo, 'rev-parse', reference], { encoding: 'utf8' }).trim();
execFileSync('rtk', ['proxy', 'git', '-C', repo, 'archive', '--format=tar', '--output=' + root + '/frontend.tar', revision, 'package.json', 'tsconfig.atendimento.json', 'apps/atendimento-web', 'packages/atendimento-shared', 'apps/docshield/public']);
execFileSync('rtk', ['proxy', 'tar', '-xf', root + '/frontend.tar', '-C', root]);
if (!existsSync(root + '/node_modules')) symlinkSync(deps, root + '/node_modules', 'junction');
if (!existsSync(root + '/apps/atendimento-web/node_modules')) symlinkSync(repo + '/.claude/worktrees/atendimento-etapa1/apps/atendimento-web/node_modules', root + '/apps/atendimento-web/node_modules', 'junction');
const config = root + '/apps/atendimento-web/vite.config.ts';
writeFileSync(config, readFileSync(config, 'utf8').replace('alias: {', 'alias: { "@revion/atendimento-shared": fileURLToPath(new URL("../../packages/atendimento-shared/src/index.ts", import.meta.url)), '));
execFileSync('rtk', ['proxy', 'node', deps + '/vite/bin/vite.js', 'build', '--configLoader', 'runner'], { cwd: root + '/apps/atendimento-web', stdio: 'inherit' });
writeFileSync(root + '/revision.txt', revision + '\n');
console.log('Frontend preparado:', revision);
