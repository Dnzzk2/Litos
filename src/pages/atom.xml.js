import { generateAtom10 } from '~/lib/feed'

export async function GET() {
  const atomContent = await generateAtom10()
  return new Response(atomContent, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  })
}
