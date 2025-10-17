import { SITE } from '~/config'
import { getAllPosts } from '../lib/data'
import type { CollectionEntry } from 'astro:content'
import sanitizeHtml from 'sanitize-html'
import { createMarkdownProcessor } from '@astrojs/markdown-remark'
import { remarkPlugins, rehypePlugins } from '../../plugins'
import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'

interface RSSConfig {
  siteUrl: string
  title: string
  description: string
  author: string
  lang: string
  posts: CollectionEntry<'posts'>[]
}

// 站点配置
const config: RSSConfig = {
  siteUrl: SITE.website,
  title: SITE.title,
  description: SITE.description,
  author: SITE.author,
  lang: SITE.lang,
  posts: await getAllPosts(),
}

// XML转义函数
export function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

// 去除 ANSI 颜色序列与非法 XML 控制字符
const ANSI_REGEX = /\u001B\[[0-?]*[ -/]*[@-~]/g
export function stripAnsi(text: string): string {
  return text.replace(ANSI_REGEX, '')
}
export function removeInvalidXmlChars(text: string): string {
  // 允许的 C0 控制符只有 \t \n \r，其他需要去掉
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
}

// 获取所有图片资源 - 修正类型
const imageModules = import.meta.glob<{ default: ImageMetadata }>('/src/content/posts/**/assets/*.{jpeg,jpg,png,gif,webp,svg}', {
  eager: true,
})

// 清理HTML内容，回归markdown本质
function cleanHtmlForRSS(htmlContent: string): string {
  let cleaned = htmlContent

  // 1. 去掉标题中的锚点链接（包含h1-h6字样的）
  cleaned = cleaned.replace(/<(h[1-6])([^>]*)>(.*?)<a[^>]*href="#[^"]*"[^>]*>[^<]*<\/a><\/\1>/gi, '<$1$2>$3</$1>')

  // 2. 处理增强语法的链接，转换为普通链接（去掉图标）
  // :link[文本]{id=url} -> <a href="url">文本</a>
  cleaned = cleaned.replace(/:link\[([^\]]+)\]\{id=([^}]+)\}/g, '<a href="$2">$1</a>')

  // 3. 去掉所有icon.horse的图标
  cleaned = cleaned.replace(/<img[^>]*src="[^"]*icon\.horse[^"]*"[^>]*>/gi, '')

  // 4. 清理链接中多余的图标和空白
  cleaned = cleaned.replace(/<a([^>]*)>\s*<img[^>]*>\s*([^<]+)\s*<\/a>/gi, '<a$1>$2</a>')

  // 5. 处理figure中的双图片，只保留img-light或第一张
  cleaned = cleaned.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (match, content) => {
    // 查找所有图片
    const imgMatches = content.match(/<img[^>]*>/g)
    if (imgMatches && imgMatches.length > 1) {
      // 优先选择img-light，否则选择第一张
      const lightImg = imgMatches.find((img: string) => img.includes('img-light'))
      const selectedImg = lightImg || imgMatches[0]

      // 提取figcaption
      const figcaptionMatch = content.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)
      const figcaption = figcaptionMatch ? figcaptionMatch[0] : ''

      return `<figure>${selectedImg}${figcaption}</figure>`
    }
    return match
  })

  return cleaned
}

// 处理图片路径，将相对路径转换为 Astro 优化后的路径
async function processImagePaths(htmlContent: string, siteUrl: string, postId: string): Promise<string> {
  const imgRegex = /<img([^>]+)src=['"]([^'"]+)['"]([^>]*)>/gi
  let processedContent = htmlContent

  const matches = Array.from(htmlContent.matchAll(imgRegex))

  for (const match of matches) {
    const [fullMatch, beforeSrc, src, afterSrc] = match

    // 跳过已经是绝对路径的图片
    if (src.startsWith('http') || src.startsWith('//') || src.startsWith('/_astro/')) {
      continue
    }

    // 处理相对路径图片
    if (src.startsWith('assets/')) {
      const imagePath = `/src/content/posts/${postId}/${src}`
      const imageModule = imageModules[imagePath]

      if (imageModule && imageModule.default) {
        try {
          // 使用 imageModule.default 获取 ImageMetadata
          const optimizedImage = await getImage({ src: imageModule.default })
          const absoluteUrl = new URL(optimizedImage.src, siteUrl).toString()

          const newImgTag = `<img${beforeSrc}src="${absoluteUrl}"${afterSrc}>`
          processedContent = processedContent.replace(fullMatch, newImgTag)
        } catch (error) {
          console.warn(`Failed to process image: ${imagePath}`, error)
          // 回退到基本的绝对路径
          const fallbackUrl = `${siteUrl}/src/content/posts/${postId}/${src}`
          const newImgTag = `<img${beforeSrc}src="${fallbackUrl}"${afterSrc}>`
          processedContent = processedContent.replace(fullMatch, newImgTag)
        }
      }
    }
  }

  return processedContent
}

// 添加封面图到文章开头
async function addCoverImage(post: CollectionEntry<'posts'>, siteUrl: string): Promise<string> {
  if (!post.data.cover) {
    return ''
  }

  try {
    if (post.data.cover && typeof post.data.cover === 'object' && post.data.cover.src) {
      const optimizedImage = await getImage({ src: post.data.cover })
      const absoluteUrl = new URL(optimizedImage.src, siteUrl).toString()
      const coverHtml = `<img src="${absoluteUrl}" alt="${post.data.title}" style="width: 100%; height: auto; margin-bottom: 1em;" />`
      return coverHtml
    }
    return ''
  } catch (error) {
    console.warn(`Failed to process cover image:`, error)
    return ''
  }
}

// 共享的文章处理逻辑
async function processPostsForFeed() {
  const { posts, siteUrl } = config

  // 创建与项目相同配置的 markdown 处理器
  const processor = await createMarkdownProcessor({
    remarkPlugins,
    rehypePlugins,
    syntaxHighlight: false, // 与 astro.config.ts 保持一致
  })

  // 处理所有文章
  const processedPosts = await Promise.all(
    posts.map(async (post) => {
      if (!post.body) {
        return { ...post, htmlContent: '' }
      }

      try {
        // 使用 Astro 的 markdown 处理器
        const result = await processor.render(post.body)

        // 净化 HTML 内容
        const rawHtml = removeInvalidXmlChars(stripAnsi(result.code))
        const sanitizedContent = sanitizeHtml(rawHtml, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            a: ['href', 'target', 'rel'], // 允许链接属性
            img: ['src', 'alt', 'width', 'height', 'class', 'style'], // 允许图片属性
            figure: ['class'],
            figcaption: ['class'],
          },
        })

        // 清理HTML，回归markdown本质
        const cleanedContent = cleanHtmlForRSS(sanitizedContent)

        // 处理图片路径
        const processedContent = await processImagePaths(cleanedContent, siteUrl, post.id)

        // 添加封面图
        const coverImage = await addCoverImage(post, siteUrl)

        const htmlContent = coverImage + '\n' + processedContent

        return { ...post, htmlContent }
      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error)
        return { ...post, htmlContent: '' }
      }
    })
  )

  return processedPosts
}

export async function generateRSS20(): Promise<string> {
  const { title, description, siteUrl, author, lang } = config
  const lastBuildDate = new Date().toISOString()

  const processedPosts = await processPostsForFeed()

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss/rss-styles.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${siteUrl}</link>
    <language>${lang}</language>
    <managingEditor>${escapeXml(author)}</managingEditor>
    <webMaster>${escapeXml(author)}</webMaster>
    <author>${escapeXml(author)}</author>
    <pubDate>${lastBuildDate}</pubDate>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Astro Litos Theme</generator>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${processedPosts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${siteUrl}/posts/${post.id}</link>
      <guid>${siteUrl}/posts/${post.id}</guid>
      <updated>${(post.data.updatedDate || post.data.pubDate).toISOString()}</updated>
      <pubDate>${post.data.pubDate.toISOString()}</pubDate>
      <description><![CDATA[${post.data.description || ''}]]></description>
      <content:encoded><![CDATA[${post.htmlContent}]]></content:encoded>
      <author>${escapeXml(post.data.author || author)}</author>
      ${post.data.tags ? post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('') : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`
}

export async function generateAtom10(): Promise<string> {
  const { title, description, siteUrl, author, lang } = config
  const lastBuildDate = new Date().toISOString()

  const processedPosts = await processPostsForFeed()

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss/atom-styles.xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <subtitle>${escapeXml(description)}</subtitle>
  <link href="${siteUrl}/atom.xml" rel="self" type="application/atom+xml"/>
  <link href="${siteUrl}" rel="alternate" type="text/html"/>
  <updated>${lastBuildDate}</updated>
  <language>${lang}</language>
  <id>${siteUrl}/</id>
  <author>
    <name>${escapeXml(author)}</name>
    <uri>${siteUrl}</uri>
  </author>
  <generator uri="https://github.com/Dnzzk2/Litos" version="5.0">Astro Litos Theme</generator>
  <rights>Copyright © ${new Date().getFullYear()} ${escapeXml(author)}</rights>
  ${processedPosts
    .map(
      (post) => `
  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${siteUrl}/posts/${post.id}" rel="alternate" type="text/html"/>
    <id>${siteUrl}/posts/${post.id}</id>
    <updated>${(post.data.updatedDate || post.data.pubDate).toISOString()}</updated>
    <published>${post.data.pubDate.toISOString()}</published>
    <author>
      <name>${escapeXml(post.data.author || author)}</name>
    </author>
    <summary type="text">${escapeXml(post.data.description || '')}</summary>
    <content type="html"><![CDATA[${post.htmlContent}]]></content>
    ${post.data.tags ? post.data.tags.map((tag) => `<category term="${escapeXml(tag)}" />`).join('\n    ') : ''}
  </entry>`
    )
    .join('')}
</feed>`
}
