import { router } from '@router'
import { useRoute } from 'vue-router'
import type { RouterQueryParams } from '@types'

const route = useRoute()

// Function to update URL query params
export default function updateUrlParams(params: RouterQueryParams) {
  // Create a copy of the current query params
  const queryParams = { ...route.query }

  Object.keys(params).forEach((key) => {
    const value = params[key]
    if (typeof value === 'string') {
      // Directly assign if it's a string
      queryParams[key] = value
    } else if (Array.isArray(value)) {
      // Filter out non-string values from the array
      queryParams[key] = value.filter((item) => typeof item === 'string')
    } else if (value === null || value === undefined) {
      // Optionally handle null or undefined values, e.g., by omitting them or setting a default
      // For example, omit the parameter or set a default value if necessary
      // queryParams[key] = 'default'; // Uncomment and adjust as necessary
    }
  })

  // Update the URL with the new query params
  router.replace({ query: queryParams }).then((r) => r)
}
