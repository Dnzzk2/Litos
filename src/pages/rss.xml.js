import { generateRSS20 } from '~/lib/feed'

export async function GET() {
  const rssContent = await generateRSS20()
  return new Response(rssContent, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
