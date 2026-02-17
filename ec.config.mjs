import { defineEcConfig } from 'astro-expressive-code'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

export default defineEcConfig({
  defaultLocale: 'zh-CN',
  defaultProps: {
    wrap: false,
    collapseStyle: 'collapsible-auto',
    showLineNumbers: false,
    preserveIndent: true,
  },
  minSyntaxHighlightingColorContrast: 0,

  styleOverrides: {
    uiFontFamily: 'var(--font-sans)',
    uiFontSize: '1em',
    codeFontFamily: 'var(--font-mono)',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.4',
    borderRadius: '0',
    codePaddingBlock: '0.8571429em',
    codePaddingInline: '1.1428571em',
    borderColor: ({ theme }) => (theme.type === 'dark' ? '#24273a' : '#e6e9ef'),

    frames: {
      frameBoxShadowCssValue: false,
      inlineButtonBackgroundActiveOpacity: '0.2',
      inlineButtonBackgroundHoverOrFocusOpacity: '0.1',
    },
    textMarkers: {
      backgroundOpacity: '0.2',
      borderOpacity: '0.4',
    },
  },

  plugins: [
    pluginCollapsibleSections({
      defaultCollapsed: false,
    }),
    pluginLineNumbers(),
  ],

  themes: ['catppuccin-macchiato', 'catppuccin-latte'],
  themeCssSelector: (theme) => (theme.name === 'catppuccin-macchiato' ? '.dark' : ':root:not(.dark)'),
  useDarkModeMediaQuery: false,
  useStyleReset: false,
})
