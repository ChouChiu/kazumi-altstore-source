import { fetchReleases } from './api'
import type { App, Source, SourceVersion } from './types'
import { releaseToSourceVersion } from './utils'

const appTemplate = (): Omit<App, 'versions'> => ({
  name: 'Kazumi',
  bundleIdentifier: 'com.example.kazumi',
  developerName: 'Predidit',
  localizedDescription:
    '使用 Flutter 开发的基于自定义规则的番剧采集与在线观看程序。使用最多五行基于 Xpath 语法的选择器构建自己的规则。支持规则导入与规则分享。支持基于 Anime4K 的实时超分辨率。绝赞开发中 (～￣▽￣)～',
  iconURL: 'https://github.com/Predidit/Kazumi/blob/main/assets/images/logo/logo_ios.png?raw=true',
  tintColor: '#57cd67',
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
    console.warn('过滤掉了不支持 iOS 的版本')
  }

  const app: App = {
    ...appTemplate(),
    versions: allVersions,
  }

  const source: Source = {
    name: 'Kazumi',
    iconURL:
      'https://github.com/Predidit/Kazumi/blob/main/assets/images/logo/logo_ios.png?raw=true',
    website: 'https://kazumi.app',
    tintColor: '#57cd67',
    featuredApps: [app.bundleIdentifier],
    apps: [app],
    news: [],
  }

  return source
}
