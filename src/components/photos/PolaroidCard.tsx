import React from 'react'
import { motion } from 'framer-motion'
import type { Photo, PolaroidVariant } from '~/types'
import { cn } from '~/lib/utils'

interface Props {
  photo: Photo
  index: number
  totalPhotos: number
  rotation: number
  variant: PolaroidVariant
  isVisible: boolean
  isClicked?: boolean
}

// Polaroid variant size mapping
const polaroidVariants: Record<PolaroidVariant, string> = {
  '1x1': 'w-20 h-20',
  '4x5': 'w-20 h-24',
  '4x3': 'w-20 h-16',
  '9x16': 'w-20 h-32',
}

const PolaroidCard: React.FC<Props> = ({ photo, index, totalPhotos, rotation, variant, isVisible, isClicked = false }) => {
  const baseZIndex = totalPhotos - index
  // 根据图片位置计算移动距离，后面的图片移动得更多
  const moveDistance = index === 0 ? 0 : 25 // 第一张20px，第二张40px，第三张60px...

  // 处理图片源：支持字符串路径和 Astro ImageMetadata 对象
  const imgSrc = typeof photo.src === 'string' ? photo.src : photo.src.src
  const imgWidth = typeof photo.src === 'string' ? photo.width : photo.src.width
  const imgHeight = typeof photo.src === 'string' ? photo.height : photo.src.height

  return (
    <motion.div
      className={cn(
        'inline-block relative bg-white border border-gray-200 shadow-lg cursor-pointer',
        'p-1 sm:p-1.5 transition-shadow duration-300 hover:shadow-xl',
        polaroidVariants[variant],
        '-ml-6 sm:-ml-4 -mt-3'
      )}
      style={{
        zIndex: isClicked ? -1 : baseZIndex,
        willChange: 'transform,opacity',
      }}
      initial={'hidden'}
      animate={isClicked ? 'clicked' : isVisible ? 'show' : 'hidden'}
      variants={{
        hidden: { scale: 0, rotate: 0, x: -60, zIndex: totalPhotos - index },
        show: { scale: 1, rotate: rotation, x: 0 },
        clicked: {
          scale: 1,
          rotate: rotation,
          x: 0,
          transition: { duration: 0.1 }, // 快速归位
        },
      }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 360,
        damping: 20,
        delay: index * 0.05, // 错开动画
        duration: 0.8,
      }}
      whileHover={
        isClicked
          ? {}
          : {
              // 点击时禁用 hover 效果
              x: moveDistance, // 根据位置动态移动距离
              scale: 1.2,
              rotate: 0, // hover时取消倾斜，回到水平
              transition: {
                type: 'tween',
                stiffness: 1360,
                damping: 20,
                duration: 0.1,
              },
            }
      }
    >
      <div className="w-full h-full bg-gray-100 overflow-hidden">
        <img src={imgSrc} width={imgWidth} height={imgHeight} className="w-full h-full object-cover" loading="lazy" alt={photo.alt} />
      </div>
    </motion.div>
  )
}

export default PolaroidCard
