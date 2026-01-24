import type { GitHubRelease, ReleasesResponse } from './types'

export const fetchReleases = async (): Promise<ReleasesResponse> => {
  const url = 'https://api.github.com/repos/Predidit/Kazumi/releases'

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Kazumi-AltStore-Source',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch releases: ${response.status} ${response.statusText}`)
  }

  const releases = (await response.json()) as GitHubRelease[]
  return { releases }
}

export const fetchLatestRelease = async (): Promise<GitHubRelease> => {
  const url = 'https://api.github.com/repos/Predidit/Kazumi/releases/latest'

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Kazumi-AltStore-Source',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch latest release: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<GitHubRelease>
}
