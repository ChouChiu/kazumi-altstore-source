import type { GitHubRelease, SourceVersion } from './types'

const DEFAULT_MIN_OS_VERSION = '14.0'

export const timestampToISO = (timestamp: string) => {
  return new Date(timestamp).toISOString()
}

export const getFileSizeFromHEAD = async (url: string): Promise<number | null> => {
  try {
    const response = await fetch(url, { method: 'HEAD' })

    if (!response.ok) {
      console.warn(`[warn] Failed to get file size for ${url}: ${response.status}`)
      return null
    }

    const contentLength = response.headers.get('content-length')
    if (!contentLength) {
      console.warn(`[warn] No content-length header for ${url}`)
      return null
    }

    const size = parseInt(contentLength, 10)
    if (Number.isNaN(size)) {
      console.warn(`[warn] Invalid content-length for ${url}: ${contentLength}`)
      return null
    }

    return size
  } catch (error) {
    console.warn(`[warn] Error getting file size for ${url}:`, error)
    return null
  }
}

// 根据版本号计算构建版本号
// 规则: 1.9.2 -> 10902, 1.9.3 -> 10903, 1.9.4 -> 10904
const calculateBuildVersion = (version: string): string => {
  // 移除可能的前缀，如 "v"
  const cleanVersion = version.replace(/^v/, '')

  // 分割版本号
  const parts = cleanVersion.split('.')

  if (parts.length < 3) {
    console.warn(`[warn] 版本号格式不正确: ${version}`)
    return '10000' // 默认值
  }

  try {
    const major = parseInt(parts[0], 10)
    const minor = parseInt(parts[1], 10)
    const patch = parseInt(parts[2], 10)

    // 按照规则计算构建版本号
    const buildVersion = major * 10000 + minor * 100 + patch

    return buildVersion.toString()
  } catch (error) {
    console.warn(`[warn] 解析版本号失败: ${version}`, error)
    return '10000' // 默认值
  }
}

export const releaseToSourceVersion = async (
  release: GitHubRelease
): Promise<SourceVersion | null> => {
  // Skip drafts
  if (release.draft) {
    return null
  }

  // 构建预期的IPA文件名
  const versionNumber = release.tag_name.replace(/^v/, '') // 移除 'v' 前缀
  const expectedName = `Kazumi_ios_${versionNumber}_no_sign.ipa`

  // 查找匹配的IPA文件
  const ipaAsset = release.assets.find(
    (asset) => asset.name.toLowerCase() === expectedName.toLowerCase()
  )

  if (!ipaAsset) {
    console.warn(`[warn] ${release.tag_name} 没有找到 IPA 文件`)
    console.warn(`[warn] 预期的文件名: ${expectedName}`)
    return null
  }

  // 获取文件大小
  const fileSize = (await getFileSizeFromHEAD(ipaAsset.browser_download_url)) || ipaAsset.size

  // 根据版本号计算构建版本号
  const buildVersion = calculateBuildVersion(release.tag_name)

  return {
    version: versionNumber,
    date: timestampToISO(release.published_at),
    localizedDescription: release.body || `Kazumi ${release.tag_name}`,
    downloadURL: ipaAsset.browser_download_url,
    size: fileSize,
    buildVersion: buildVersion, // 动态计算的构建版本号
    minOSVersion: DEFAULT_MIN_OS_VERSION,
  }
}
