import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist')
const STAGE = join(tmpdir(), 'bar-app-gh-pages')

const REMOTE = process.env.DEPLOY_REMOTE || 'https://github.com/bulvar2161/bar-app.git'
const BRANCH = process.env.DEPLOY_BRANCH || 'gh-pages'

const args = process.argv.slice(2)
const domainIndex = args.findIndex((a) => a === '--domain' || a.startsWith('--domain='))
const domain =
  domainIndex === -1
    ? null
    : args[domainIndex].includes('=')
      ? args[domainIndex].split('=')[1]
      : args[domainIndex + 1]

// С кастомным доменом сайт отдаётся из корня, без домена — из подпапки /bar-app/
const base = domain ? '/' : process.env.DEPLOY_BASE || '/bar-app/'

const run = (cmd, args, cwd, extraEnv) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: cmd === 'npm',
    env: extraEnv ? { ...process.env, ...extraEnv } : process.env
  })
}

if (domain) console.log(`▸ Кастомный домен: ${domain} (base = /)`)
else console.log(`▸ Деплой в подпапку (base = ${base})`)

console.log('▸ Сборка проекта…')
run('npm', ['run', 'build'], ROOT, { DEPLOY_BASE: base })

if (!existsSync(DIST)) {
  console.error('✗ Папка dist не найдена — сборка не удалась')
  process.exit(1)
}

console.log(`▸ Подготовка ветки ${BRANCH}…`)
rmSync(STAGE, { recursive: true, force: true })
mkdirSync(STAGE, { recursive: true })
cpSync(DIST, STAGE, { recursive: true })
writeFileSync(join(STAGE, '.nojekyll'), '')
if (domain) writeFileSync(join(STAGE, 'CNAME'), `${domain}\n`)

run('git', ['init', '-b', BRANCH, '-q'], STAGE)
run('git', ['config', 'user.name', 'bulvar2161'], STAGE)
run('git', ['config', 'user.email', 'bulvar2161@users.noreply.github.com'], STAGE)
run('git', ['config', 'credential.helper', 'manager'], STAGE)
run('git', ['add', '-A'], STAGE)
run('git', ['commit', '-q', '-m', 'Deploy: сборка сайта Бульвар 21'], STAGE)
run('git', ['remote', 'add', 'origin', REMOTE], STAGE)

console.log(`▸ Публикация на GitHub Pages (${BRANCH})…`)
run('git', ['push', '-f', 'origin', `${BRANCH}:${BRANCH}`], STAGE)

console.log(domain ? `✓ Готово. Домен: https://${domain}/` : '✓ Готово. Сайт: https://bulvar2161.github.io/bar-app/')
