;(function () {
  const STORAGE_KEY = 'theme'
  const LIGHT_THEME_COLOR = '#FFFFFF'
  const DARK_THEME_COLOR = '#09090b'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  const isMobileViewport = window.matchMedia('(max-width: 767px)')
  const root = document.documentElement

  function getStoredTheme() {
    const theme = localStorage.getItem(STORAGE_KEY)
    return theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'system'
  }

  function resolveIsDark(theme) {
    return theme === 'dark' || (theme === 'system' && prefersDark.matches)
  }

  function setThemeColor(targetDocument, isDark) {
    const metaThemeColor = targetDocument.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR)
    }
  }

  function applyTheme(theme) {
    const isDark = resolveIsDark(theme)

    root.classList.toggle('dark', isDark)
    setThemeColor(document, isDark)
  }

  function applyThemeWithoutTransition(theme, options) {
    root.classList.add('disable-transition')
    localStorage.setItem(STORAGE_KEY, theme)
    applyTheme(theme, options)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('disable-transition')
      })
    })
  }

  function setTheme(theme, options) {
    const isDark = resolveIsDark(theme)
    const currentIsDark = root.classList.contains('dark')

    // 移动端跳过视图过渡，但仍保留 disable-transition 来屏蔽普通 CSS transition
    if (!document.startViewTransition || isMobileViewport.matches || options?.disableTransition) {
      applyThemeWithoutTransition(theme, options)
      return
    }

    if (isDark === currentIsDark) {
      localStorage.setItem(STORAGE_KEY, theme)
      applyTheme(theme, options)
      return
    }

    // 根据目标主题添加方向类
    const directionClass = isDark ? 'theme-to-dark' : 'theme-to-light'
    const useThemeAnimation = window.__themeAnimation !== false

    if (useThemeAnimation) {
      root.classList.add('theme-transitioning', directionClass)
    }
    root.classList.add('disable-transition')

    const transition = document.startViewTransition(() => {
      localStorage.setItem(STORAGE_KEY, theme)
      applyTheme(theme, options)
    })

    // 动画结束后的清理工作
    transition.finished.finally(() => {
      if (useThemeAnimation) {
        root.classList.remove('theme-transitioning', directionClass)
      }
      root.classList.remove('disable-transition')
    })
  }

  window.__theme = {
    applyTheme,
    getStoredTheme,
    setTheme,
  }

  applyTheme(getStoredTheme())

  prefersDark.addEventListener('change', () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system')
    }
  })

  document.addEventListener('astro:before-swap', (event) => {
    const theme = getStoredTheme()
    const isDark = resolveIsDark(theme)

    event.newDocument.documentElement.classList.toggle('dark', isDark)
    setThemeColor(event.newDocument, isDark)
  })

  document.addEventListener('astro:after-swap', () => {
    applyTheme(getStoredTheme())
  })

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      applyTheme(getStoredTheme())
    }
  })
})()
