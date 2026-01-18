import { ref, computed, watch } from 'vue'

const isDark = ref(false)

// Check for saved theme preference or default to light mode
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// Initialize theme
isDark.value = getInitialTheme()

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
  }

  const setDarkMode = (dark: boolean) => {
    isDark.value = dark
  }

  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  // Watch for changes and update localStorage + document class
  watch(
    isDark,
    (newValue) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newValue ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', newValue)
        document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light')
      }
    },
    { immediate: true },
  )

  // Listen to system theme changes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      // Only update if no saved preference exists
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
      }
    })
  }

  return {
    isDark,
    theme,
    toggleDarkMode,
    setDarkMode,
  }
}
