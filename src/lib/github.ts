const CACHE_DURATION = 3600 * 1000 // 1 hour

interface CacheEntry<T> {
  data: T
  timestamp: number
}

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>, fallbackValue?: T): Promise<T | undefined> {
  const cacheKey = `github_stats_${key}`

  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const entry: CacheEntry<T> = JSON.parse(cached)
      if (Date.now() - entry.timestamp < CACHE_DURATION) {
        return entry.data
      }
      if (!fallbackValue) fallbackValue = entry.data
    }
  } catch (e) {
    console.warn('Error reading from localStorage', e)
  }

  try {
    const data = await fetcher()
    localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }))
    return data
  } catch (error) {
    console.warn(`Failed to fetch GitHub data for ${key}:`, error)
    return fallbackValue
  }
}

export async function getGithubFollowers(username: string): Promise<number | undefined> {
  return fetchWithCache(`followers_${username}`, async () => {
    const res = await fetch(`https://api.github.com/users/${username}`)
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()
    return data.followers
  })
}

export async function getGithubRepoStats(owner: string, repo: string): Promise<{ stars: number; forks: number } | undefined> {
  return fetchWithCache(`repo_${owner}_${repo}`, async () => {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()
    return { stars: data.stargazers_count, forks: data.forks_count }
  })
}
