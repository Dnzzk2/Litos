import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'motion/react'
import { useStore } from '@nanostores/react'
import { themeStore } from '~/stores/theme'

const iconVariants = {
  visible: {
    rotate: 0,
    scale: 1,
    opacity: 1,
  },
  hidden: {
    scale: 0,
    opacity: 0,
    rotate: 180,
  },
}

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const theme = useStore(themeStore)
  const controlsSun = useAnimation()
  const controlsMoon = useAnimation()
  const controlsSystem = useAnimation()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system'
    themeStore.set(savedTheme || 'system')
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (theme === 'system') {
      controlsSun.start('hidden')
      controlsSystem.start('visible')
      controlsMoon.start('hidden')
    } else {
      controlsSun.start(theme === 'light' ? 'visible' : 'hidden')
      controlsMoon.start(theme === 'dark' ? 'visible' : 'hidden')
      controlsSystem.start('hidden')
    }

    localStorage.setItem('theme', theme)
    applyTheme(theme)
  }, [theme, mounted, controlsSun, controlsMoon, controlsSystem])

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement

    // 添加过渡类
    root.classList.add('disable-transition')

    const isDark = newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#09090b' : '#FFFFFF')
    }

    // 移除过渡类
    setTimeout(() => {
      root.classList.remove('disable-transition')
    }, 300)
  }

  const handleClick = () => {
    const themeMap = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    }
    themeStore.set(themeMap[theme] as 'light' | 'dark' | 'system')
  }

  return (
    <button onClick={handleClick} className="relative size-5 flex items-center justify-center cursor-pointer" aria-label="切换主题">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} className="relative size-5 flex items-center justify-center">
        <motion.div
          className="absolute inset-0"
          variants={iconVariants}
          initial="hidden"
          animate={controlsSun}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <span className="icon-[tabler--sun-filled] size-5"></span>
        </motion.div>
        <motion.div
          className="absolute inset-0"
          variants={iconVariants}
          initial="hidden"
          animate={controlsSystem}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <span className="icon-[tabler--device-desktop-question] size-5"></span>
        </motion.div>
        <motion.div
          className="absolute inset-0"
          variants={iconVariants}
          initial="hidden"
          animate={controlsMoon}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <span className="icon-[tabler--moon-filled] size-5"></span>
        </motion.div>
      </motion.div>
    </button>
  )
}

export default ThemeToggle
