import fs from 'node:fs/promises'
import { generateSource } from './generator'

console.log('正在生成 Kazumi AltStore source...')

const outputPath = 'generated/apps.json'
await fs.mkdir('generated', { recursive: true })

const source = await generateSource()
const json = JSON.stringify(source, null, 2)

await fs.writeFile(outputPath, json, 'utf8')

console.log(`成功生成 apps.json`)
console.log(`文件已保存到: ${outputPath}`)
console.log(`包含 ${source.apps[0].versions.length} 个版本`)

if (source.apps[0].versions.length > 0) {
  const latestVersion = source.apps[0].versions[0]
  console.log(`\n最新版本: ${latestVersion.version}`)
  console.log(`发布时间: ${latestVersion.date}`)
  console.log(`下载链接: ${latestVersion.downloadURL}`)
}
