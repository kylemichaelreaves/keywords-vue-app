import { QueryClient, QueryCache } from '@tanstack/vue-query'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { extractApiErrorMessage } from '@api/extractApiErrorMessage'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error, query) {
      if (axios.isAxiosError(error) && error.response?.status === 401) return

      if (axios.isCancel(error)) return

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
