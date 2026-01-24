import { fetchReleases } from './api'
import type { App, Source, SourceVersion } from './types'
import { releaseToSourceVersion } from './utils'

const isBetaVersion = (version: string) =>
  version.includes('alpha') || version.includes('beta') || version.includes('beta')

const appTemplate = (baseName: string): Omit<App, 'versions'> => ({
  name: baseName,
  bundleIdentifier: 'com.example.kazumi',
  developerName: 'Predidit',
  localizedDescription:
    '使用 Flutter 开发的基于自定义规则的番剧采集与在线观看程序。使用最多五行基于 Xpath 语法的选择器构建自己的规则。支持规则导入与规则分享。支持基于 Anime4K 的实时超分辨率。绝赞开发中 (～￣▽￣)～',
  iconURL: 'https://github.com/Predidit/Kazumi/blob/main/assets/images/logo/logo_ios.png?raw=true',
  tintColor: '#6c5ce7',
  category: 'entertainment',
  screenshots: {
    iphone: [
      'https://github.com/Predidit/Kazumi/blob/main/static/screenshot/img_1.png?raw=true',
      'https://github.com/Predidit/Kazumi/blob/main/static/screenshot/img_2.png?raw=true',
      'https://github.com/Predidit/Kazumi/blob/main/static/screenshot/img_3.png?raw=true',
      'https://github.com/Predidit/Kazumi/blob/main/static/screenshot/img_4.png?raw=true',
      'https://github.com/Predidit/Kazumi/blob/main/static/screenshot/img_5.png?raw=true',
      'https://github.com/Predidit/Kazumi/blob/main/static/screenshot/img_6.png?raw=true',
    ],
    ipad: [],
  },
  appPermissions: {
    entitlements: [],
    privacy: {},
  },
})

export const generateSource = async (): Promise<Source> => {
  const { releases } = await fetchReleases()

  const allVersionResults = await Promise.all(releases.map(releaseToSourceVersion))

  const allVersions = allVersionResults.filter(
    (version): version is SourceVersion => version !== null
  )

  if (allVersionResults.length !== allVersions.length) {
    const filteredCount = allVersionResults.length - allVersions.length
    console.warn(`[warn] 过滤掉了 ${filteredCount} 个无效的版本`)
  }

  const stableVersions: SourceVersion[] = []
  const betaVersions: SourceVersion[] = []

  for (const version of allVersions) {
    if (isBetaVersion(version.version)) {
      betaVersions.push(version)
    } else {
      stableVersions.push(version)
    }
  }

  const stableApp: App = {
    ...appTemplate('Kazumi'),
    versions: stableVersions,
  }

  const betaApp: App = {
    ...appTemplate('Kazumi (Beta)'),
    versions: betaVersions,
    bundleIdentifier: 'com.predidit.Kazumi.beta',
  }

  const source: Source = {
    name: 'Kazumi',
    iconURL: 'https://raw.githubusercontent.com/Predidit/Kazumi/main/.github/icon.png',
    website: 'https://github.com/Predidit/Kazumi',
    tintColor: '#6c5ce7',
    featuredApps: [stableApp.bundleIdentifier],
    apps: [stableApp, betaApp],
    news: [],
  }

  return source
}
