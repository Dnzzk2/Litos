import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import type { Photo } from '~/types'

interface Props {
  photos: Photo[]
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

const PhotoGalleryModal: React.FC<Props> = ({ photos, title, description, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [containerWidth, setContainerWidth] = useState(400)
  const [currentHeight, setCurrentHeight] = useState<number>(100)
  const x = useMotionValue(-initialIndex * containerWidth)
  const gap = 16 // gap-4 = 1rem = 16px
  const [canAnimate, setCanAnimate] = useState(false)

  // 动态获取容器宽度，适配响应式
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
  }, [isOpen])

  // 切换图片时，平滑动画到目标位置
  useEffect(() => {
    if (!isOpen) return
    if (canAnimate) {
      animate(x, -currentIndex * (containerWidth + gap), { type: 'tween', duration: 0.5, ease: 'easeOut' })
    } else {
      x.set(-currentIndex * (containerWidth + gap))
    }
  }, [currentIndex, containerWidth, x, isOpen, gap, canAnimate])

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      x.set(-initialIndex * (containerWidth + gap))
      setCanAnimate(false)
      setTimeout(() => setCanAnimate(true), 30)
    }
  }, [isOpen, initialIndex, x, containerWidth, gap])

  // 更新高度
  useEffect(() => {
    const updateHeight = () => {
      const el = imageRefs.current[currentIndex]
      if (el && el.offsetHeight > 0) {
        setCurrentHeight(el.offsetHeight)
      }
    }
    // 稍微延迟以确保渲染完成
    const timer = setTimeout(updateHeight, 10)
    return () => clearTimeout(timer)
  }, [currentIndex, containerWidth, isOpen])

  // 拖拽结束时吸附到最近图片，判定边界放宽到 7%
  const handleDragEnd = useCallback(
    (_: any, info: { offset: { x: number } }) => {
      const offset = info.offset.x
      const threshold = (containerWidth + gap) * 0.07
      let newIdx = currentIndex
      if (offset > threshold && currentIndex > 0) {
        newIdx = currentIndex - 1
      } else if (offset < -threshold && currentIndex < photos.length - 1) {
        newIdx = currentIndex + 1
      }
      setCurrentIndex(newIdx)
      animate(x, -newIdx * (containerWidth + gap), { type: 'tween', duration: 0.5, ease: 'easeOut' })
    },
    [containerWidth, gap, photos.length, x, currentIndex]
  )

  // 按钮切换
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }
  const goNext = () => {
    if (currentIndex < photos.length - 1) setCurrentIndex((i) => i + 1)
  }

  // 键盘切换
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, photos.length])

  if (photos.length === 0) return null

  const modalContent = (
    <AnimatePresence onExitComplete={() => setCurrentHeight(100)}>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {/* 遮罩层 */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          />

          {/* 弹窗卡片 */}
          <motion.div
            key="modal-content"
            className="relative bg-background shadow-2xl max-w-lg w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94], opacity: { duration: 0.25 } }}
          >
            {/* 头部标题区域 */}
            <div className="border-gray-100 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
                </div>
                <div className="w-5 h-7 flex items-center justify-center" onClick={onClose}>
                  <span className="w-5 h-5 icon-[mdi--close] text-muted-foreground hover:text-foreground cursor-pointer transition-colors"></span>
                </div>
              </div>
            </div>

            {/* 图片展示区域 */}
            <div className="relative bg-background" ref={containerRef}>
              <motion.div
                className="relative overflow-hidden"
                style={{ width: containerWidth }}
                initial={{ height: 100 }}
                animate={{ height: currentHeight }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <motion.div
                  className="flex gap-4 items-start"
                  style={{ x, width: photos.length * (containerWidth + gap) - gap }}
                  drag="x"
                  dragConstraints={{ left: -(photos.length - 1) * (containerWidth + gap), right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  transition={{ type: 'tween', duration: 0.5, ease: 'easeOut' }}
                >
                  {photos.map((photo, index) => {
                    const imgSrc = typeof photo.src === 'string' ? photo.src : photo.src.src
                    return (
                      <div
                        key={imgSrc}
                        ref={(el) => {
                          imageRefs.current[index] = el
                        }}
                        className="flex items-center justify-center shrink-0"
                        style={{ width: containerWidth }}
                      >
                        <img
                          draggable={false}
                          src={imgSrc}
                          alt={photo.alt}
                          className="max-w-full max-h-[70vh] object-contain select-none pointer-events-none"
                          onLoad={() => {
                            if (index === currentIndex && imageRefs.current[index]) {
                              setCurrentHeight(imageRefs.current[index]!.offsetHeight)
                            }
                          }}
                        />
                      </div>
                    )
                  })}
                </motion.div>
              </motion.div>

              {/* 左右导航按钮 */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className={`absolute w-8 h-8 -left-10 top-1/2 -translate-y-1/2 shadow-lg transition-all flex items-center justify-center ${
                      currentIndex === 0
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-background hover:bg-accent text-foreground hover:text-accent-foreground'
                    }`}
                    aria-label="上一张"
                  >
                    <div className="w-5 h-5 icon-[mdi--chevron-left]"></div>
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentIndex === photos.length - 1}
                    className={`absolute w-8 h-8 -right-10 top-1/2 -translate-y-1/2 shadow-lg transition-all flex items-center justify-center ${
                      currentIndex === photos.length - 1
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-background hover:bg-accent text-foreground hover:text-accent-foreground'
                    }`}
                    aria-label="下一张"
                  >
                    <div className="w-5 h-5 icon-[mdi--chevron-right]"></div>
                  </button>
                </>
              )}
            </div>

            {/* 计数器 */}
            <div className="mt-4 text-center text-sm text-muted-foreground font-medium">
              {currentIndex + 1} / {photos.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // 使用 Portal 将弹窗渲染到 body
  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}

export default PhotoGalleryModal
