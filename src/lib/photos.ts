import type { PhotoData } from '~/types'
import cat1 from '~/assets/photos/cat1.webp'
import cat2 from '~/assets/photos/cat2.webp'
import cat3 from '~/assets/photos/cat3.webp'
import cat4 from '~/assets/photos/cat4.webp'
import dqh1 from '~/assets/photos/dqh1.webp'
import dqh2 from '~/assets/photos/dqh2.jpg'
import dqh3 from '~/assets/photos/dqh3.jpg'
import zs1 from '~/assets/photos/zs1.webp'
import zs2 from '~/assets/photos/zs2.webp'

export const PhotosList: PhotoData[] = [
  {
    title: "Cute Cats at Friend's House",
    icon: {
      type: 'emoji',
      value: '🐱',
    },
    description: 'So cute (*^ω^*)!',
    date: '2025-06-21',
    travel: '',
    photos: [
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
    description: 'Cycling at Dongqian Lake. Although I got leg cramps a few times, the scenery was beautiful.',
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
