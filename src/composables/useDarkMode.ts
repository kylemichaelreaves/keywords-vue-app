import { ref, computed, watch } from 'vue'

const isDark = ref(false)
// Track whether the user explicitly chose a theme (vs inheriting system preference)
const hasExplicitPreference = ref(false)

const getInitialTheme = () => {
  if (typeof globalThis.window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      hasExplicitPreference.value = true
      return savedTheme === 'dark'
    }
    return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// Initialize theme
isDark.value = getInitialTheme()

// Listen to system theme changes — once at module scope (isDark is a singleton)
if (typeof globalThis.window !== 'undefined') {
  const mediaQuery = globalThis.window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (!hasExplicitPreference.value) {
      isDark.value = e.matches
    }
  }
  mediaQuery.addEventListener('change', handleSystemThemeChange)
  import.meta.hot?.dispose(() => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  })
}

// Apply theme class to document (always, regardless of source)
function applyTheme(dark: boolean) {
  if (typeof globalThis.window !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }
}

// Apply initial theme immediately
applyTheme(isDark.value)

export function useDarkMode() {
  const toggleDarkMode = () => {
    hasExplicitPreference.value = true
    isDark.value = !isDark.value
  }

  const setDarkMode = (dark: boolean) => {
    hasExplicitPreference.value = true
    isDark.value = dark
  }

  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  // Watch for changes and update document class + persist only explicit preferences
  watch(isDark, (newValue) => {
    applyTheme(newValue)
    if (hasExplicitPreference.value && typeof globalThis.window !== 'undefined') {
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
    }
  })

  return {
    isDark,
    theme,
    toggleDarkMode,
    setDarkMode,
  }
}
