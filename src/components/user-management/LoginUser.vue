<template>
  <el-alert
    v-if="isError"
    :title="error?.message"
    :description="errorDescription"
    type="error"
    show-icon
    center
    style="margin-top: 20px"
    size="large"
  />
  <div class="container">
    <el-card class="login-el-card">
      <el-form :model="user" :rules="rules" label-width="120px">
        <el-form-item
          v-for="(field, key) in loginFormFields"
          :key="key"
          :label="field.label"
          :prop="key"
        >
          <component
            :is="field.component"
            v-model="user[key]"
            :placeholder="field.placeholder"
            :type="field.type"
            :show-password="field.showPassword"
            @keyup.enter="submitForm"
          />
        </el-form-item>
      </el-form>
      <div class="button-container">
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="isDisabledCondition"
          class="button"
        >
          Login
        </el-button>
        <!-- TODO Add a link to reset password    -->
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, type Component } from 'vue'
import type { loginFormKeys } from '@types'
import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '@stores/auth.ts'
import { useRouter } from 'vue-router'
import { ElMessage, ElInput } from 'element-plus'

interface LoginFormField {
  component: Component
  label: string
  placeholder: string
  type: string
  showPassword?: boolean
}

const user = ref({
  username: '',
  password: '',
})

const authStore = useAuthStore()
const router = useRouter()

// the button should be disabled when isPending OR if both fields don't have values
const isDisabledCondition = computed(() => {
  return isPending.value || !user.value.username || !user.value.password
})

const errorDescription = computed(() => {
  if (!isError.value || !error.value) return ''

  // Handle different error types
  if (error.value && typeof error.value === 'object' && 'response' in error.value) {
    const axiosError = error.value as Error & { response?: { data?: { message?: string } } }
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred'
  }

  return error.value instanceof Error ? error.value.message : 'An error occurred'
})

const { mutate, isPending, isError, error } = useMutation({
  mutationKey: ['login'],
  mutationFn: async ({ username, password }: { username: string; password: string }) => {
    return await authStore.login(username, password)
  },
  onSuccess: (data) => {
    console.log('Login successful', data)
    ElMessage.success(`${data.message}! Wilkommen! Bienvenue! Welcome!`)
    const user = data.user
    const token = data.token
    authStore.setUser(user)
    authStore.setToken(token)
    authStore.setIsUserAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    router.push('/budget-visualizer/transactions')
  },
  onError: (error) => {
    ElMessage.error('Login failed! Please try again!')
    console.error('Login failed', error)
  },
})

const submitForm = () => {
  mutate({ username: user.value.username, password: user.value.password })
}

const loginFormFields: Record<loginFormKeys, LoginFormField> = {
  username: {
    component: ElInput,
    label: 'Username',
    placeholder: 'Enter username',
    type: 'text',
  },
  password: {
    component: ElInput,
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    showPassword: true,
  },
}

const rules = {
  username: [{ required: true, message: 'Please enter username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
}

onMounted(() => {
  const isUserAuthenticated = authStore.getIsUserAuthenticated
  const isUserInStore = authStore.getUser

  const localUser = localStorage.getItem('user')
  const localToken = localStorage.getItem('token')

  console.log('Local user:', localUser)
  console.log('Local token:', localToken)

  if (localUser && localToken && localUser !== 'undefined' && localToken !== 'undefined') {
    const user = JSON.parse(localUser)
    authStore.setUser(user)
    authStore.setToken(localToken)
    authStore.setIsUserAuthenticated(true)
  }

  if (isUserInStore && isUserAuthenticated) {
    router.push('/budget-visualizer/transactions')
  }
})
</script>

<style scoped>
.login-el-card {
  margin: 20px;
  max-width: 480px;
  justify-content: left;
  display: flex;
  flex-direction: column;
  filter: drop-shadow(0 0 5px #409eff);
}

.container {
  display: flex;
  justify-content: center;
  align-items: start;
  height: 100vh;
}

.button {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 14px 45px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.button.is-disabled {
  background-color: var(--el-button-disabled-bg-color, #c0c4cc) !important;
  border-color: var(--el-button-disabled-border-color, #c0c4cc) !important;
  color: #fff !important;
  cursor: not-allowed;
}

.button-container {
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
