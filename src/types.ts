export interface GitHubRelease {
  id: number
  tag_name: string
  name: string
  body: string
  draft: boolean
  prerelease: boolean
  published_at: string
  assets: GitHubAsset[]
}

export interface GitHubAsset {
  id: number
  name: string
  size: number
  browser_download_url: string
  content_type: string
}

export interface ReleasesResponse {
  releases: GitHubRelease[]
}

export interface Source {
  name: string
  subtitle?: string
  description?: string
  iconURL?: string
  headerURL?: string
  website?: string
  patreonURL?: string
  tintColor?: string
  featuredApps?: string[]
  apps: App[]
  news: News[]
}

export interface SourceVersion {
  version: string
  buildVersion: string
  date: string
  size: number
  downloadURL: string
  localizedDescription: string
  minOSVersion?: string
  maxOSVersion?: string
}

export interface App {
  name: string
  bundleIdentifier: string
  marketplaceID?: string
  developerName: string
  subtitle?: string
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
  screenshots: Array<imageWithSize | string> | ScreenshotsClass
  versions: SourceVersion[]
  appPermissions: {
    entitlements: string[]
    privacy: Record<string, string>
  }
  patreon?: {
    pledge: number
    currency: string
    benefit: string
    tiers: string[]
  }
}

interface imageWithSize {
  imageURL: string
  width?: number
  height?: number
}

interface ScreenshotsClass {
  iphone: (imageWithSize | string)[]
  /**
   * All iPad screenshots must provide an explicit `width` and `height`
   *
   * https://faq.altstore.io/developers/make-a-source#width-number
   * https://faq.altstore.io/developers/make-a-source#height-number
   */
  ipad: Required<imageWithSize>[]
}

interface News {
  title: string
  identifier: string
  caption: string
  date: string
  tintColor: string
  imageURL: string
  notify: boolean
  url?: string
  appID?: string
}
