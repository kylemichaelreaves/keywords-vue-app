import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(true) // Default to dark mode since your current CSS is dark

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDarkMode.value = prefersDark
    }
    applyTheme()
  }

  // Apply theme to document
  const applyTheme = () => {
    const html = document.documentElement
    if (isDarkMode.value) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  // Watch for theme changes and persist to localStorage
  watch(isDarkMode, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
    applyTheme()
  })

  return {
    isDarkMode,
    initializeTheme,
    toggleTheme,
    applyTheme
  }
})
