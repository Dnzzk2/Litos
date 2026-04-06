import { useEffect } from 'react'
import { motion, useAnimation } from 'motion/react'
import { useStore } from '@nanostores/react'
import { themeStore, type Theme } from '~/stores/theme'

declare global {
  interface Window {
    __theme?: {
      applyTheme: (theme: Theme, options?: { disableTransition?: boolean }) => void
      getStoredTheme: () => Theme
      setTheme: (theme: Theme, options?: { disableTransition?: boolean }) => void
    }
  }
}

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
  const theme = useStore(themeStore)
  const controlsSun = useAnimation()
  const controlsMoon = useAnimation()
  const controlsSystem = useAnimation()

  useEffect(() => {
    if (theme === 'system') {
      controlsSun.start('hidden')
      controlsSystem.start('visible')
      controlsMoon.start('hidden')
      return
    }

    controlsSun.start(theme === 'light' ? 'visible' : 'hidden')
    controlsMoon.start(theme === 'dark' ? 'visible' : 'hidden')
    controlsSystem.start('hidden')
  }, [theme, controlsSun, controlsMoon, controlsSystem])

  const handleClick = () => {
    const themeMap: Record<Theme, Theme> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    }
    const nextTheme = themeMap[theme]

    themeStore.set(nextTheme)
    window.__theme?.setTheme(nextTheme)
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
