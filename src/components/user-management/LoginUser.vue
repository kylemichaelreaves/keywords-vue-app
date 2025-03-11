<template>
  <el-alert
    v-if="isError"
    :title="error?.message"
    :description="errorDescription"
    type="error"
    show-icon
    center
    style="margin-top: 20px;"
    size="large"
  />
  <div class="container">
    <el-card class="login-el-card">
      <el-form
        :model="user"
        :rules="rules"
        label-width="120px"
      >
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
import { computed, ref, onMounted } from 'vue'
import type { LoginFormFields, loginFormKeys } from '@types'
import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '@stores/auth.ts'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const user = ref({
  username: '',
  password: ''
})

const authStore = useAuthStore()
const router = useRouter()

// the button should be disabled when isPending OR if both fields don't have values
const isDisabledCondition = computed(() => {
  return isPending.value || !user.value.username || !user.value.password
})

const errorDescription = computed(() => {
  return isError.value ? error?.response?.data?.message || 'An error occurred' : ''
})

const { mutate, isPending, isError, error } = useMutation({
  mutationKey: ['login'],
  mutationFn: async ({ username, password }: { username: string, password: string }) => {
    return await authStore.login(username, password)
  },
  onSuccess: (data) => {
    ElMessage.success('Login successful! Wilkommen! Bienvenue! Welcome!')
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
  }
})


const submitForm = () => {
  mutate({ username: user.value.username, password: user.value.password })
}


const loginFormFields: Record<loginFormKeys, LoginFormFields> = {
  username: {
    component: 'el-input',
    label: 'Username',
    placeholder: 'Enter username',
    type: 'text'
  },
  password: {
    component: 'el-input',
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    showPassword: true
  }
}


const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' }
  ]
}

onMounted(() => {
  const userAndTokenInStore = authStore.user && authStore.token
  const neitherUserNorTokenInStore = !authStore.user && !authStore.token
  const userAndTokenInSession = localStorage.getItem('user') && localStorage.getItem('token')
  const neitherUserNorTokenInSession = !localStorage.getItem('user') && !localStorage.getItem('token')

  // check if the user and their token is in session storage but not in the store
  const inSessionButNotInStore = userAndTokenInSession && neitherUserNorTokenInStore
  const inStoreButNotInSession = neitherUserNorTokenInSession && userAndTokenInStore

  if (inSessionButNotInStore) {
    const user = JSON.parse(localStorage.getItem('user') || '')
    authStore.setToken(localStorage.getItem('token') || '')
    authStore.setUser(user)
    authStore.setIsUserAuthenticated(true)
  } else if (inStoreButNotInSession) {
    localStorage.setItem('user', JSON.stringify(authStore.user))
    localStorage.setItem('token', authStore.token)
  }

  // check if the user is already in the store
  if (authStore.user && authStore.isUserAuthenticated) {
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
  filter: drop-shadow(0 0 5px #409EFF);
}

.container {
  display: flex;
  justify-content: center;
  align-items: start;
  height: 100vh;
}

.button {
  background-color: #409EFF;
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
