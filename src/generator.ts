import { fetchReleases } from './api'
import type { App, Source, SourceVersion } from './types'
import { releaseToSourceVersion } from './utils'

// 应用模板，除 versions 外其他字段固定
const APP_TEMPLATE: Omit<App, 'versions'> = {
  name: 'Kazumi',
  bundleIdentifier: 'com.example.kazumi',
  developerName: 'Predidit',
  localizedDescription:
    '使用 Flutter 开发的基于自定义规则的番剧采集与在线观看程序。使用最多五行基于 Xpath 语法的选择器构建自己的规则。支持规则导入与规则分享。支持基于 Anime4K 的实时超分辨率。绝赞开发中 (～￣▽￣)～',
  iconURL: 'https://github.com/Predidit/Kazumi/blob/main/assets/images/logo/logo_ios.png?raw=true',
  tintColor: '#57cd67',
  category: 'entertainment',
  screenshots: {
    iphone: Array.from(
      { length: 6 },
      (_, i) =>
        `https://github.com/Predidit/Kazumi/blob/main/static/screenshot/img_${i + 1}.png?raw=true`
    ),
    ipad: [], // 暂无 iPad 截图
  },
  appPermissions: { entitlements: [], privacy: {} },
}

// 生成 AltStore 源数据
export const generateSource = async (): Promise<Source> => {
  const { releases } = await fetchReleases()
  const versions = (await Promise.all(releases.map(releaseToSourceVersion))).filter(
    (v): v is SourceVersion => v !== null
  )

  // 提示过滤了多少个版本
  if (versions.length < releases.length) {
    console.warn(`过滤了 ${releases.length - versions.length} 个不支持 iOS 的版本`)
  }

  const app: App = { ...APP_TEMPLATE, versions }

  return {
    name: 'Kazumi',
    iconURL: APP_TEMPLATE.iconURL,
    website: 'https://kazumi.app',
    tintColor: APP_TEMPLATE.tintColor,
    featuredApps: [app.bundleIdentifier], // 将本应用设为特色应用
    apps: [app],
    news: [],
  }
}
