import type { GitHubRelease, ReleasesResponse } from './types'

const GITHUB_API_BASE = 'https://api.github.com/repos/Predidit/Kazumi'
const HEADERS = {
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'Kazumi-AltStore-Source',
}

// 通用 GitHub API 请求函数
const fetchGitHub = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${GITHUB_API_BASE}/${endpoint}`, { headers: HEADERS })
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)
  return response.json() as Promise<T>
}

// 获取所有 releases（最多100个）
export const fetchReleases = async (): Promise<ReleasesResponse> => ({
  releases: await fetchGitHub<GitHubRelease[]>('releases?per_page=100'),
})

// 获取最新 release
export const fetchLatestRelease = async (): Promise<GitHubRelease> =>
  fetchGitHub<GitHubRelease>('releases/latest')
