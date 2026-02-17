import type { PhotoData } from '~/types'
import cat1 from '~/assets/photos/cat1.webp'
import cat2 from '~/assets/photos/cat2.webp'
import cat3 from '~/assets/photos/cat3.webp'
import cat4 from '~/assets/photos/cat4.webp'
import cat5 from '~/assets/photos/cat5.webp'
import cat6 from '~/assets/photos/cat6.webp'
import dqh1 from '~/assets/photos/dqh1.webp'
import dqh2 from '~/assets/photos/dqh2.jpg'
import dqh3 from '~/assets/photos/dqh3.jpg'
import zs1 from '~/assets/photos/zs1.webp'
import zs2 from '~/assets/photos/zs2.webp'
import work from '~/assets/photos/work.jpg'
import park1 from '~/assets/photos/park1.jpg'
import cicada from '~/assets/photos/cicada.jpg'
import cicada2 from '~/assets/photos/cicada2.jpg'
import hlqs from '~/assets/photos/hlqs.jpg'
import playground from '~/assets/photos/playground.jpg'

export const PhotosList: PhotoData[] = [
  {
    title: 'Ningbo · Hanging Out with Friends',
    icon: {
      type: 'emoji',
      value: '🎡',
    },
    description: 'Visited our old school, played board games at a café, and had a great time catching up.',
    date: '2026-01-10',
    travel: '',
    photos: [
      {
        src: playground,
        alt: 'Hanging out with friends',
        width: playground.width,
        height: playground.height,
        variant: '4x5',
      },
      {
        src: hlqs,
        alt: '与同学游',
        width: hlqs.width,
        height: hlqs.height,
        variant: '4x5',
      },
      {
        src: cicada,
        alt: '与同学游',
        width: cicada.width,
        height: cicada.height,
        variant: '4x5',
      },
      {
        src: cicada2,
        alt: '与同学游',
        width: cicada2.width,
        height: cicada2.height,
        variant: '4x5',
      },
    ],
  },
  {
    title: 'Dazz App',
    icon: {
      type: 'emoji',
      value: '🌆',
    },
    description: 'Took some photos with the Dazz camera app, turned out pretty nice.',
    date: '2025-12-11',
    travel: '',
    photos: [
      {
        src: work,
        alt: 'Dazz App',
        width: work.width,
        height: work.height,
        variant: '4x3',
      },
      {
        src: park1,
        alt: 'Dazz App',
        width: park1.width,
        height: park1.height,
        variant: '4x3',
      },
    ],
  },
  {
    title: "Cute Cats at Friend's House",
    icon: {
      type: 'emoji',
      value: '🐈',
    },
    description: 'So kawaii (*^ω^*)! The cutest cats ever.',
    date: '2025-06-21',
    travel: '',
    photos: [
      {
        src: cat6,
        alt: "Cute cats at friend's house",
        width: cat6.width,
        height: cat6.height,
        variant: '4x3',
      },
      {
        src: cat5,
        alt: "Cute cats at friend's house",
        width: cat5.width,
        height: cat5.height,
        variant: '4x3',
      },
      {
        src: cat1,
        alt: "Cute cats at friend's house",
        width: cat1.width,
        height: cat1.height,
        variant: '4x3',
      },
      {
        src: cat2,
        alt: "Cute cats at friend's house",
        width: cat2.width,
        height: cat2.height,
        variant: '4x3',
      },
      {
        src: cat3,
        alt: "Cute cats at friend's house",
        width: cat3.width,
        height: cat3.height,
        variant: '4x3',
      },
      {
        src: cat4,
        alt: "Cute cats at friend's house",
        width: cat4.width,
        height: cat4.height,
        variant: '4x3',
      },
    ],
  },
  {
    title: 'Ningbo · Dongqian Lake',
    icon: {
      type: 'emoji',
      value: '🚴',
    },
    description: 'Cycling at Dongqian Lake. Got leg cramps a few times, but the scenery was beautiful.',
    date: '2025-03-01',
    travel: '',
    photos: [
      {
        src: dqh1,
        alt: 'Ningbo · Dongqian Lake',
        width: dqh1.width,
        height: dqh1.height,
        variant: '4x5',
      },
      {
        src: dqh2,
        alt: 'Ningbo · Dongqian Lake',
        width: dqh2.width,
        height: dqh2.height,
        variant: '1x1',
      },
      {
        src: dqh3,
        alt: 'Ningbo · Dongqian Lake',
        width: dqh3.width,
        height: dqh3.height,
        variant: '4x3',
      },
    ],
  },
  {
    title: 'Ningbo · Zhoushan',
    icon: {
      type: 'emoji',
      value: '🏞️',
    },
    description: '',
    date: '2024-09-07',
    travel: '',
    photos: [
      {
        src: zs1,
        alt: 'Ningbo · Zhoushan',
        width: zs1.width,
        height: zs1.height,
        variant: '4x3',
      },
      {
        src: zs2,
        alt: 'Ningbo · Zhoushan',
        width: zs2.width,
        height: zs2.height,
        variant: '4x3',
      },
    ],
  },
]
