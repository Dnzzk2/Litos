import type {
  CommentConfig,
  GithubConfig,
  Link,
  PhotoData,
  PhotosConfig,
  PostConfig,
  ProjectConfig,
  Site,
  SkillsShowcaseConfig,
  SocialLink,
  TagsConfig,
} from '~/types'

//--- Readme Page Config ---
export const SITE: Site = {
  title: 'Litos',
  description:
    'Litos is a modern blogging theme built on Astro.js, designed for developers. It supports multiple post layouts, photo displays, project displays, and more, providing an elegant user experience and powerful customization capabilities.',
  website: 'https://litos.vercel.app/',
  lang: 'en',
  base: '/',
  author: 'Dnzzk2',
  ogImage: '/og-image.webp',
}

export const HEADER_LINKS: Link[] = [
  {
    name: 'Posts',
    url: '/posts',
  },
  {
    name: 'Projects',
    url: '/projects',
  },
  {
    name: 'Photos',
    url: '/photos',
  },
]

export const FOOTER_LINKS: Link[] = [
  {
    name: 'Readme',
    url: '/',
  },
  {
    name: 'Posts',
    url: '/posts',
  },
  {
    name: 'Projects',
    url: '/projects',
  },
  {
    name: 'Tags',
    url: '/tags',
  },
  {
    name: 'Photos',
    url: '/photos',
  },
]

// get icon https://icon-sets.iconify.design/
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'github',
    url: 'https://github.com/yourname',
    icon: 'icon-[ri--github-fill]',
    count: 11,
  },
  {
    name: 'twitter',
    url: 'https://x.com/yourname',
    icon: 'icon-[ri--twitter-x-fill]',
  },
  {
    name: 'bilibili',
    url: 'https://space.bilibili.com/yourSpaceId',
    icon: 'icon-[ri--bilibili-fill]',
  },
]

/**
 * SkillsShowcase 配置接口 / SkillsShowcase configuration type
 * @property {boolean} SKILLS_ENABLED  - 是否启用SkillsShowcase功能 / Whether to enable SkillsShowcase features
 * @property {Object} SKILLS_DATA - 技能展示数据 / Skills showcase data
 * @property {string} SKILLS_DATA.direction - 技能展示方向 / Skills showcase direction
 * @property {Object} SKILLS_DATA.skills - 技能展示数据 / Skills showcase data
 * @property {string} SKILLS_DATA.skills.icon - 技能图标 / Skills icon
 * @property {string} SKILLS_DATA.skills.name - 技能名称 / Skills name
 * get icon https://icon-sets.iconify.design/
 */
export const SKILLSSHOWCASE_CONFIG: SkillsShowcaseConfig = {
  SKILLS_ENABLED: true,
  SKILLS_DATA: [
    {
      direction: 'left',
      skills: [
        {
          name: 'JavaScript',
          icon: 'icon-[mdi--language-javascript]',
        },
        {
          name: 'CSS',
          icon: 'icon-[mdi--language-css3]',
        },
        {
          name: 'HTML',
          icon: 'icon-[mdi--language-html5]',
        },
        {
          name: 'TypeScript',
          icon: 'icon-[mdi--language-typescript]',
        },
      ],
    },
    {
      direction: 'right',
      skills: [
        {
          name: 'Astro',
          icon: 'icon-[lineicons--astro]',
        },
        {
          name: 'Node.js',
          icon: 'icon-[mdi--nodejs]',
        },
        {
          name: 'React',
          icon: 'icon-[mdi--react]',
        },
        {
          name: 'Next.js',
          icon: 'icon-[devicon--nextjs]',
        },
        {
          name: 'Tailwind CSS',
          icon: 'icon-[mdi--tailwind]',
        },
        {
          name: 'Iconify',
          icon: 'icon-[line-md--iconify2-static]',
        },
      ],
    },
    {
      direction: 'left',
      skills: [
        {
          name: 'Ubuntu',
          icon: 'icon-[mdi--ubuntu]',
        },
        {
          name: 'Git',
          icon: 'icon-[mdi--git]',
        },
        {
          name: 'MongoDB',
          icon: 'icon-[lineicons--mongodb]',
        },
        {
          name: 'Vercel',
          icon: 'icon-[lineicons--vercel]',
        },
      ],
    },
  ],
}

/**
 * GitHub配置 / GitHub configuration
 *
 * @property {boolean} ENABLED - 是否启用GitHub功能 / Whether to enable GitHub features
 * @property {string} GITHUB_USERNAME - GITHUB用户名 / GitHub username
 * @property {boolean} TOOLTIP_ENABLED - 是否开启Tooltip功能 / Whether to enable Github Tooltip features
 */

export const GITHUB_CONFIG: GithubConfig = {
  ENABLED: true,
  GITHUB_USERNAME: 'Dnzzk2',
  TOOLTIP_ENABLED: true,
}

//--- Posts Page Config ---
export const POSTS_CONFIG: PostConfig = {
  title: 'Posts',
  description: 'Posts by Dnzzk2',
  introduce: 'Here, I will share the usage instructions for this theme to help you quickly use it.',
  author: 'Dnzzk2',
  homePageConfig: {
    size: 5,
    type: 'compact',
  },
  postPageConfig: {
    size: 10,
    type: 'image',
    coverLayout: 'right',
  },
  tagsPageConfig: {
    size: 10,
    type: 'time-line',
  },
  ogImageUseCover: false,
  postType: 'metaOnly',
  imageDarkenInDark: true,
  readMoreText: 'Read more',
  prevPageText: 'Previous',
  nextPageText: 'Next',
  tocText: 'On this page',
  backToPostsText: 'Back to Posts',
  nextPostText: 'Next Post',
  prevPostText: 'Previous Post',
  recommendText: 'REC',
}

export const COMMENT_CONFIG: CommentConfig = {
  enabled: true,
  system: 'gitalk',
  gitalk: {
    clientID: import.meta.env.PUBLIC_GITHUB_CLIENT_ID,
    clientSecret: import.meta.env.PUBLIC_GITHUB_CLIENT_SECRET,
    repo: 'gitalk-comment',
    owner: 'Dnzzk2',
    admin: ['Dnzzk2'],
    language: 'en-US',
    perPage: 5,
    pagerDirection: 'last',
    createIssueManually: false,
    distractionFreeMode: false,
    enableHotKey: true,
  },
}

export const TAGS_CONFIG: TagsConfig = {
  title: 'Tags',
  description: 'All tags of Posts',
  introduce: 'All the tags for posts are here, you can click to filter them.',
}

export const PROJECTS_CONFIG: ProjectConfig = {
  title: 'Projects',
  description: 'The examples of my projects.',
  introduce: 'The examples of my projects.',
}

export const PHOTOS_CONFIG: PhotosConfig = {
  title: 'Photos',
  description: 'Here I will record some photos taken in daily life.',
  introduce: 'Here I will record some photos taken in daily life.',
}

export const PhotosList: PhotoData[] = [
  {
    title: "Friend's Adorable Cat",
    icon: {
      type: 'emoji',
      value: '🌠',
    },
    description: 'So kawaii (*^ω^*)',
    date: '2025-06-21',
    travel: '',
    photos: [
      {
        src: '/photos/cat1.webp',
        alt: "Friend's Adorable Cat",
        width: 1080,
        height: 810,
        variant: '4x3',
      },
      {
        src: '/photos/cat2.webp',
        alt: "Friend's Adorable Cat",
        width: 1080,
        height: 810,
        variant: '4x3',
      },
      {
        src: '/photos/cat3.webp',
        alt: "Friend's Adorable Cat",
        width: 1080,
        height: 810,
        variant: '4x3',
      },
      {
        src: '/photos/cat4.webp',
        alt: "Friend's Adorable Cat",
        width: 1080,
        height: 810,
        variant: '4x3',
      },
    ],
  },
  {
    title: 'Ningbo · Dongqian Lake',
    icon: {
      type: 'emoji',
      value: '🌅',
    },
    description: 'Cycling around Dongqian Lake. Although I got leg cramps a few times, the scenery was beautiful.',
    date: '2025-03-01',
    travel: '',
    photos: [
      {
        src: '/photos/dqh1.webp',
        alt: 'Ningbo · Dongqian Lake',
        width: 1080,
        height: 1358,
        variant: '4x5',
      },
      {
        src: '/photos/dqh2.jpg',
        alt: 'Ningbo · Dongqian Lake',
        width: 1080,
        height: 1080,
        variant: '1x1',
      },
      {
        src: '/photos/dqh3.jpg',
        alt: 'Ningbo · Dongqian Lake',
        width: 1440,
        height: 1080,
        variant: '4x3',
      },
    ],
  },
  {
    title: 'Ningbo · Zhoushan',
    icon: {
      type: 'emoji',
      value: '🌉',
    },
    description: '',
    date: '2024-09-07',
    travel: '',
    photos: [
      {
        src: '/photos/zs1.webp',
        alt: 'Ningbo · Zhoushan',
        width: 1210,
        height: 908,
        variant: '4x3',
      },
      {
        src: '/photos/zs2.webp',
        alt: 'Ningbo · Zhoushan',
        width: 1080,
        height: 810,
        variant: '4x3',
      },
    ],
  },
]
