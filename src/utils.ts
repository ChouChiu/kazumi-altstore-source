import type { GitHubRelease, SourceVersion } from './types'

const DEFAULT_BUILD_VERSION = '10000'
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

export const releaseToSourceVersion = async (
  release: GitHubRelease
): Promise<SourceVersion | null> => {
  // Skip drafts
  if (release.draft) {
    return null
  }

  // Find IPA file in assets
  const ipaAsset = release.assets.find(
    (asset) =>
      asset.name.toLowerCase().endsWith('.ipa') ||
      asset.content_type === 'application/octet-stream' ||
      asset.name.toLowerCase().includes('kazumi')
  )

  if (!ipaAsset) {
    console.warn(`[warn] ${release.tag_name} 没有找到 IPA 文件`)
    return null
  }

  // Try to get actual file size from HEAD request
  const fileSize = (await getFileSizeFromHEAD(ipaAsset.browser_download_url)) || ipaAsset.size

  return {
    version: release.tag_name.replace(/^v/, ''), // Remove 'v' prefix if present
    date: timestampToISO(release.published_at),
    localizedDescription: release.body || `Kazumi ${release.tag_name}`,
    downloadURL: ipaAsset.browser_download_url,
    size: fileSize,
    buildVersion: DEFAULT_BUILD_VERSION,
    minOSVersion: DEFAULT_MIN_OS_VERSION,
  }
}
