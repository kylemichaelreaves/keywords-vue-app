import { QueryClient, QueryCache } from '@tanstack/vue-query'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { extractApiErrorMessage } from '@api/extractApiErrorMessage'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error, query) {
      // 401s are handled globally by the httpClient interceptor — no toast needed.
      if (axios.isAxiosError(error) && error.response?.status === 401) return

      // Cancelled requests (e.g. component unmount) should not surface to the user.
      if (axios.isCancel(error)) return

      // Individual queries can opt out by setting meta.skipGlobalError.
      if (query.meta?.skipGlobalError) return

      ElMessage.error(extractApiErrorMessage(error))
    },
  }),
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 1,
    },
  },
})
