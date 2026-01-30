import type { GitHubRelease, SourceVersion } from './types'

const DEFAULT_MIN_OS_VERSION = '13.0'

// 将 GitHub 的时间戳转换为 ISO 字符串
export const timestampToISO = (timestamp: string): string => new Date(timestamp).toISOString()

// 通过 HEAD 请求获取文件大小，失败则返回 null
export const getFileSizeFromHEAD = async (url: string): Promise<number | null> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (!response.ok) return null

    const contentLength = response.headers.get('content-length')
    if (!contentLength) return null

    const size = parseInt(contentLength, 10)
    return Number.isNaN(size) ? null : size
  } catch {
    return null
  }
}

// 根据语义化版本号计算构建版本号，例如 1.9.2 -> 10902
const calculateBuildVersion = (version: string): string => {
  const parts = version.split('.').map(Number)
  while (parts.length < 3) parts.push(0)

  const [major = 0, minor = 0, patch = 0] = parts
  return String(major * 10000 + minor * 100 + patch)
}

// 检查版本是否支持（要求 >= 1.2.0）
const isVersionSupported = (version: string): boolean => {
  const [major = 0, minor = 0] = version.split('.').map(Number)
  return major > 1 || (major === 1 && minor >= 2)
}

// 将 GitHub Release 转换为 AltStore 源版本
export const releaseToSourceVersion = async (
  release: GitHubRelease
): Promise<SourceVersion | null> => {
  // 跳过草稿和不支持的版本（1.2.0 以下）
  if (release.draft || !isVersionSupported(release.tag_name)) return null

  const versionNumber = release.tag_name
  const expectedName = `Kazumi_ios_${versionNumber}_no_sign.ipa`
  const ipaAsset = release.assets.find((a) => a.name.toLowerCase() === expectedName.toLowerCase())

  if (!ipaAsset) {
    console.warn(`[warn] ${versionNumber} 没有找到 IPA 文件`)
    return null
  }

  const fileSize = (await getFileSizeFromHEAD(ipaAsset.browser_download_url)) || ipaAsset.size

  return {
    version: versionNumber,
    buildVersion: calculateBuildVersion(versionNumber),
    date: timestampToISO(release.published_at),
    localizedDescription: release.body || `Kazumi ${versionNumber}`,
    downloadURL: ipaAsset.browser_download_url,
    size: fileSize,
    minOSVersion: DEFAULT_MIN_OS_VERSION,
  }
}
