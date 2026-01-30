import { mkdir, writeFile } from 'node:fs/promises'
import { generateSource } from './generator'

const OUTPUT_PATH = 'generated/apps.json'

console.log('正在生成 Kazumi AltStore source...')
await mkdir('generated', { recursive: true })

const source = await generateSource()
await writeFile(OUTPUT_PATH, JSON.stringify(source, null, 2), 'utf8')

console.log('成功生成 apps.json')
console.log(`包含 ${source.apps[0].versions.length} 个版本`)

const latestVersion = source.apps[0].versions[0]
if (latestVersion) {
  console.log(`\n最新版本: ${latestVersion.version}`)
  console.log(`发布时间: ${latestVersion.date}`)
}
