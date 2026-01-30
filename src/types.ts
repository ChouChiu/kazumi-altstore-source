export interface GitHubRelease {
  tag_name: string
  name: string
  body: string
  draft: boolean
  prerelease: boolean
  published_at: string
  assets: GitHubAsset[]
}

export interface GitHubAsset {
  name: string
  browser_download_url: string
  size: number
}

export interface ReleasesResponse {
  releases: GitHubRelease[]
}

export interface Source {
  name: string
  iconURL?: string
  website?: string
  tintColor?: string
  featuredApps?: string[] // 特色应用的 bundleIdentifier 列表
  apps: App[]
  news: never[] // 暂不支持新闻
}

export interface SourceVersion {
  version: string
  buildVersion: string // 由版本号计算得出，如 1.9.2 -> 10902
  date: string
  size: number
  downloadURL: string
  localizedDescription: string
  minOSVersion?: string // 最低支持的系统版本
}

export interface App {
  name: string
  bundleIdentifier: string
  developerName: string
  localizedDescription: string
  iconURL: string
  tintColor: string
  category?:
    | 'developer'
    | 'entertainment'
    | 'games'
    | 'lifestyle'
    | 'other'
    | 'photo-video'
    | 'social'
    | 'utilities'
  screenshots: Screenshots
  versions: SourceVersion[]
  appPermissions: AppPermissions
}

interface Screenshots {
  iphone: string[] // iPhone 截图 URL
  ipad: never[] // 暂无 iPad 截图
}

interface AppPermissions {
  entitlements: never[] // 暂不需要任何 entitlements
  privacy: Record<string, never> // 暂不需要隐私权限说明
}
