import readingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

function remarkReadingTime() {
  // @ts-expect-error
  return (tree, file) => {
    const { frontmatter } = file.data.astro
    if (frontmatter.minutesRead || frontmatter.minutesRead === 0) return

    const textOnPage = toString(tree)
    const stats = readingTime(textOnPage)

    frontmatter.minutesRead = Math.max(1, Math.round(stats.minutes))
    frontmatter.wordCount = stats.words
  }
}

export default remarkReadingTime
