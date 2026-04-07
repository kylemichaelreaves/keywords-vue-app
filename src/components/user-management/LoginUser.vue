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
import { devConsole } from '@utils/devConsole'

import { computed, ref, onMounted, type Component } from 'vue'
import type { loginFormKeys } from '@types'
import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '@stores/auth.ts'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElInput } from 'element-plus'
import { safeRedirectPath } from '@utils/safeRedirectPath'
import { extractApiErrorMessage } from '@api/extractApiErrorMessage'

const DEFAULT_AUTHENTICATED_ROUTE = '/budget-visualizer/transactions'

interface LoginFormField {
  component: Component
  label: string
  placeholder: string
  type: string
  showPassword?: boolean
}

const user = ref({
  email: '',
  password: '',
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const redirectTarget = computed(
  () => safeRedirectPath(route.query.redirect) ?? DEFAULT_AUTHENTICATED_ROUTE,
)

// the button should be disabled when isPending OR if both fields don't have values
const isDisabledCondition = computed(() => {
  return isPending.value || !user.value.email || !user.value.password
})

const errorDescription = computed(() => {
  if (!isError.value || !error.value) return ''
  return extractApiErrorMessage(error.value)
})

const { mutate, isPending, isError, error } = useMutation({
  mutationKey: ['login'],
  mutationFn: async ({ email, password }: { email: string; password: string }) => {
    return await authStore.login(email, password)
  },
  onSuccess: (data) => {
    devConsole('log', 'Login successful', data)
    ElMessage.success(`${data.message}! Wilkommen! Bienvenue! Welcome!`)
    const user = data.user
    const token = data.token
    authStore.setUser(user)
    authStore.setToken(token)
    authStore.setIsUserAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    router.push(redirectTarget.value)
  },
  onError: (error) => {
    ElMessage.error('Login failed! Please try again!')
    devConsole('error', 'Login failed', error)
  },
})

const submitForm = () => {
  mutate({ email: user.value.email, password: user.value.password })
}

const loginFormFields: Record<loginFormKeys, LoginFormField> = {
  email: {
    component: ElInput,
    label: 'Email',
    placeholder: 'Enter email',
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
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email' as const, message: 'Please enter a valid email', trigger: 'blur' },
  ],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
}

onMounted(() => {
  const localUser = localStorage.getItem('user')
  const localToken = localStorage.getItem('token')

  if (import.meta.env.DEV) {
    devConsole('log', 'Local user:', localUser)
    devConsole('log', 'Local token:', localToken)
  }

  if (localUser && localToken && localUser !== 'undefined' && localToken !== 'undefined') {
    const parsed = JSON.parse(localUser)
    authStore.setUser(parsed)
    authStore.setToken(localToken)
    authStore.setIsUserAuthenticated(true)
  }

  if (authStore.getIsUserAuthenticated && authStore.getUser.email) {
    router.push(redirectTarget.value)
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
