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

const run = (cmd, args, cwd) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  const needsShell = cmd === 'npm'
  execFileSync(cmd, args, { cwd, stdio: 'inherit', shell: needsShell })
}

console.log('▸ Сборка проекта…')
run('npm', ['run', 'build'], ROOT)

if (!existsSync(DIST)) {
  console.error('✗ Папка dist не найдена — сборка не удалась')
  process.exit(1)
}

console.log(`▸ Подготовка ветки ${BRANCH}…`)
rmSync(STAGE, { recursive: true, force: true })
mkdirSync(STAGE, { recursive: true })
cpSync(DIST, STAGE, { recursive: true })
writeFileSync(join(STAGE, '.nojekyll'), '')

run('git', ['init', '-b', BRANCH, '-q'], STAGE)
run('git', ['config', 'user.name', 'bulvar2161'], STAGE)
run('git', ['config', 'user.email', 'bulvar2161@users.noreply.github.com'], STAGE)
run('git', ['config', 'credential.helper', 'manager'], STAGE)
run('git', ['add', '-A'], STAGE)
run('git', ['commit', '-q', '-m', 'Deploy: сборка сайта Бульвар 21'], STAGE)
run('git', ['remote', 'add', 'origin', REMOTE], STAGE)

console.log(`▸ Публикация на GitHub Pages (${BRANCH})…`)
run('git', ['push', '-f', 'origin', `${BRANCH}:${BRANCH}`], STAGE)

console.log('✓ Готово. Сайт: https://bulvar2161.github.io/bar-app/')
