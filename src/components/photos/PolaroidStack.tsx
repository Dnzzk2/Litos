import React from 'react'
import { motion, useInView } from 'framer-motion'
import type { Photo } from '~/types'
import { cn } from '~/lib/utils'
import PolaroidCard from './PolaroidCard'
import PhotoGalleryModal from './PhotoGalleryModal'

interface Props {
  photos: Photo[]
  title: string
  description?: string
  className?: string
}

// 生成随机旋转角度
const generateRotations = (count: number) => Array.from({ length: count }, () => Math.random() * 20 - 10) // -10 to +10 degrees

const PolaroidStack: React.FC<Props> = ({ photos, title, description, className }) => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState(0)
  const [clickedPhotoIndex, setClickedPhotoIndex] = React.useState<number | null>(null)

  // 为每张照片生成固定的旋转角度
  const photoRotations = React.useMemo(() => generateRotations(photos.length), [photos.length])

  const handlePhotoClick = (index: number) => {
    setClickedPhotoIndex(index) // 立即标记为点击状态
    setSelectedPhotoIndex(index)
    setTimeout(() => {
      setIsModalOpen(true)
    }, 50) // 等待模态框动画结束
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    // 模态框关闭后重置点击状态
    setTimeout(() => {
      setClickedPhotoIndex(null)
    }, 200) // 等待模态框动画结束
  }

  return (
    <>
      <motion.div ref={ref} className={cn('relative perspective-1000 ml-4 flex items-center ', className)}>
        {photos.map((photo, index) => (
          <div key={typeof photo.src === 'string' ? photo.src : photo.src.src} onClick={() => handlePhotoClick(index)}>
            <PolaroidCard
              photo={photo}
              index={index}
              totalPhotos={photos.length}
              rotation={photoRotations[index]}
              variant={photo.variant}
              isVisible={isInView}
              isClicked={clickedPhotoIndex === index}
            />
          </div>
        ))}
      </motion.div>

      <PhotoGalleryModal
        photos={photos}
        title={title}
        description={description}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        initialIndex={selectedPhotoIndex}
      />
    </>
  )
}

export default PolaroidStack
